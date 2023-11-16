import {
  BadgeDelta,
  Card,
  DonutChart,
  Select,
  SelectItem,
  Flex,
  Legend,
  List,
  ListItem,
  Title,
  Text,
} from "@tremor/react";
import React, { useEffect, useState } from "react";
import { AdminUrl, formatCurrency } from "../../Admin/constant";

export default function CategorySales({
  vendorDatastate,
  conversionRates,
  isCurrencyloading,
  userCurrency,
}) {
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Electronics");
  const vendorId = vendorDatastate?.[0].id;
  const subcategoriesForSelectedCategory =
    category
      .find((cat) => cat.category_name === selectedCategory)
      ?.subcategories.map((item) => item.subcategory_name) || [];

  const callSalesByCategory = async () => {
    try {
      const response = await fetch(`${AdminUrl}/api/salesByCategory/${vendorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Handle successful response
        const data = await response.json();
        // Process the data as needed, such as setting it to state
        const convertedData = data.map((item) => {
          const { currency_symbol, total_sales_amount } = item;
          const conversionRate = conversionRates[currency_symbol];

          if (conversionRate) {
            // If a conversion rate is available, convert the amount to USD
            const totalSalesUSD =
              parseFloat(total_sales_amount) * conversionRate;
            return {
              ...item,
              currency_symbol: userCurrency, // Set the currency to USD
              total_sales_amount: totalSalesUSD.toFixed(2), // Round to 2 decimal places
            };
          }
          // If no conversion rate is available, keep the data as is
          return item;
        });

        // Group the converted data by category and subcategory
        const groupedData = convertedData.reduce((result, item) => {
          const key = `${item.category}-${item.subcategory}`;
          if (!result[key]) {
            result[key] = {
              category: item.category,
              subcategory: item.subcategory,
              currency_symbol: userCurrency,
              sales_count: 0,
              total_sales_amount: 0,
            };
          }
          result[key].sales_count += parseInt(item.sales_count, 10);
          result[key].total_sales_amount += parseFloat(item.total_sales_amount);
          return result;
        }, {});

        // Convert grouped data back to an array
        const finalData = Object.values(groupedData);
        console.log(finalData);
        setFilteredData(finalData);
      } else {
        // Handle error response
        console.error(
          "Error fetching customer orders by month:",
          response.statusText
        );
      }
    } catch (error) {
      // Handle error
      console.error("Error fetching customer orders by month:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndSubcategories();
    callSalesByCategory();
  }, [selectedCategory, isCurrencyloading]);

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const categoryResponse = await fetch(`${AdminUrl}/api/getAllProductCatgeory`);
      const subcategoryResponse = await fetch(
        `${AdminUrl}/api/getAllSubcategories`
      );

      if (categoryResponse.ok && subcategoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        const subcategoryData = await subcategoryResponse.json();

        // Map each category to add a 'subcategories' array containing its associated subcategories
        const categoriesWithSubcategories = categoryData.map((cat) => ({
          ...cat,
          subcategories: subcategoryData.filter(
            (subcat) => subcat.parent_category_id === cat.category_id
          ),
        }));

        // Sort the categories by their 'category_id' before updating the state
        const sortedCategories = categoriesWithSubcategories.sort(
          (a, b) => a.category_id - b.category_id
        );
        setCategory(sortedCategories);
      } else {
        // Handle error responses
        console.error(
          "Error fetching categories:",
          categoryResponse.statusText
        );
        console.error(
          "Error fetching subcategories:",
          subcategoryResponse.statusText
        );
      }
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
    }
  };

  return (
    !isCurrencyloading && (
      <Card className="max-w-2xl">
        <Flex className="flex md:flex-row justify-center flex-col md:space-x-8 max-sm:space-y-2">
          <Title>Category</Title>
          <Select
            onValueChange={setSelectedCategory}
            placeholder="Category Selection"
            defaultValue={selectedCategory}
          >
            {category.map((cat) => (
              <SelectItem key={cat.category_id} value={cat.category_name}>
                {cat.category_name}
              </SelectItem>
            ))}
          </Select>
        </Flex>
        <Legend
          categories={subcategoriesForSelectedCategory}
          className="mt-6"
        />

        <DonutChart
          data={filteredData.filter(
            (item) => item.category === selectedCategory
          )}
          category="total_sales_amount"
          index="subcategory"
          valueFormatter={(number) =>
            `${Intl.NumberFormat("us").format(number).toString()}`
          }
          className="mt-6"
        />

        <List className="mt-6">
          {category
            .filter(
              (cat) => cat.category_name.trim() === selectedCategory.trim()
            )
            .map((cat) => {
              // Create an array to hold subcategories with sales counts
              const subcategoriesWithCounts = cat.subcategories.map(
                (subcat) => {
                  const matchingSales = filteredData.filter(
                    (sales) =>
                      sales.category.trim() === selectedCategory.trim() &&
                      sales.subcategory.trim() ===
                        subcat.subcategory_name.trim()
                  );

                  // Calculate total sales count for the subcategory
                  const totalSalesCount = matchingSales.reduce(
                    (sum, sales) => sum + parseInt(sales.sales_count),
                    0
                  );
                  const totalSalesAmount = matchingSales.reduce(
                    (sum, sales) => sum + parseInt(sales.total_sales_amount),
                    0
                  );

                  // Return subcategory data with total sales count
                  return {
                    subcategory: subcat.subcategory_name,
                    salesCount: totalSalesCount,
                    totalSalesAmount: totalSalesAmount,
                    hasSales: matchingSales.length > 0,
                  };
                }
              );

              // Sort subcategories by sales count in descending order
              subcategoriesWithCounts.sort(
                (a, b) => b.salesCount - a.salesCount
              );

              // Render sorted subcategories
              return (
                <React.Fragment key={cat.category_name}>
                  {subcategoriesWithCounts.map((subcatData) => (
                    <ListItem key={subcatData.subcategory}>
                      {subcatData.subcategory}
                      {subcatData.hasSales ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Text className="mr-4">
                            {formatCurrency(
                              subcatData.totalSalesAmount,
                              userCurrency
                            )}
                          </Text>
                          <BadgeDelta
                            deltaType="increase" // You can set the deltaType as needed
                            size="xs"
                            style={{ marginRight: "8px" }}
                          >
                            {subcatData.salesCount}
                          </BadgeDelta>
                        </div>
                      ) : (
                        <BadgeDelta deltaType="unchanged" size="xs">
                          0
                        </BadgeDelta>
                      )}
                    </ListItem>
                  ))}
                </React.Fragment>
              );
            })}
        </List>
      </Card>
    )
  );
}
