import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs"; // Import the exceljs library
import { Table, Button, Upload, Typography, message, Alert, Modal, Select } from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { AdminUrl } from "../Admin/constant";
import Swal from "sweetalert2";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import DownloadSampleExcel from "./components/DownloadSampleExcel";
import AuthCheck from "./components/AuthCheck";
import "./components/Vendors.css";
const { Title } = Typography;
const BulkProductUpload = ({ vendorDatastate }) => {
  const [productData, setProductData] = useState(null);
  const vendorid = vendorDatastate?.[0]?.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [SelectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [FilteredSubcategories, setFilteredSubcategories] = useState(null);

  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
    country: "",
  });

  const getUserLocation = async () => {
    try {
      const response = await fetch("http://ip-api.com/json");
      const data = await response.json();

      if (data.status === "success") {
        const city = data.city || "";
        const state = data.regionName || "";
        const country = data.country || "";

        setLocationData({ city, state, country });
      } else {
        console.error("Location data not found.");
      }
    } catch (error) {
      console.error("Error getting user location:", error.message);
    }
  };

  function generateUniqueID() {
    const randomPart = Math.floor(Math.random() * 10000).toString(); // Generate a random 4-digit number
    const timestampPart = new Date().getTime().toString().substr(-6, 2); // Use last 2 digits of the current timestamp
    const uniqueID = `${randomPart}${timestampPart}`; // Combine the parts
    return uniqueID;
  }

  useEffect(() => {
    // Call the function to get user location when the component mounts
    if (locationData?.city === "") getUserLocation();
  }, [locationData]);

  const handleFileUpload = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer(); // Convert the file to ArrayBuffer
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer); // Load the workbook using the ArrayBuffer

      const worksheet = workbook.worksheets[0];
      const rows = worksheet.getSheetValues();

      // Starting from the 5th row (index 4) for JSON data
      const jsonRows = rows.slice(5);
      // Convert rows into JSON format as needed
      const sheetData = jsonRows.reduce((acc, row) => {
        const product_name = row[2];  // product name
        const description = row[3];  // desc
        const brand = row[4];  // brand
        const currency_symbol = row[5]?.toUpperCase();  // currency symbol
        const price = row[6];  // price 
        const discount = row[7];  // discount
        const quantity = row[8];  // quantity
        const weight = row[9];  // weight
        const weight_unit = row[10]?.toLowerCase(); // weight unit
        const product_type = row[11]?.toLowerCase();  // product type
        const featured = row[12];  // product featured
        const category_id = selectedCategory?.category_id;
        const subcategory_id = SelectedSubcategory?.subcategory_id;
        const product_status = 0;

        console.log(jsonRows);
        if (
          !product_name ||
          !description ||
          !brand ||
          !currency_symbol ||
          !price ||
          !discount ||
          !quantity ||
          !weight ||
          !weight_unit ||
          !product_type ||
          // !featured ||
          !category_id ||
          !subcategory_id
        ) {
          // Display an error message if any value is missing
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Some values are missing in the uploaded file.",
          });
          return acc; // Skip adding this row to the sheetData array
        }

        // const uniquepid = generateUniqueID(); // Generate a unique ID for each row

        const rowData = {
          product_name,
          description,
          brand,
          currency_symbol,
          price,
          discount,
          quantity,
          weight,
          weight_unit,
          product_type,
          featured,
          category_id,
          subcategory_id,
          product_status,
          // ...locationData,
          vendor_id: vendorid,
          // uniquepid, // Include the generated unique ID
        };

        return [...acc, rowData]; // Add the complete row to the sheetData array
      }, []);

      setProductData(sheetData);
    } catch (error) {
      console.error("Error reading the uploaded file:", error);
      message.error("Error reading the uploaded file.");
      setProductData(null);
    }
  };

  let columns = [];
  // const validElectronicsCategories = [
  //   "Mobile Electronics",
  //   "Laptop & Computers",
  //   "Camera & Photography",
  //   "Audio & Headphones",
  // ];

  if (productData) {
    // if (
    //   productData[0]?.key7 &&
    //   validElectronicsCategories.includes(productData[0]?.key7)
    // ) {
    columns = [
      {
        title: "Product Name",
        dataIndex: "product_name",
        key: "product_name",
        width: 250,
        ellipsis: true,
        render: (text) => (
          <span title={text} className="text-blue-600">
            {text}
          </span>
        ),
      },
      // {
      //   title: "Image",
      //   dataIndex: "key8",
      //   key: "key8",
      //   width: 100,
      //   ellipsis: true,
      //   render: (text) => <img src={text} width={80} height={80} />,
      // },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 250,
        ellipsis: true,
        render: (text) => (
          <span title={text}>
            {text?.length > 20 ? `${text?.substring(0, 20)}...` : text}
            {text?.length > 20 && (
              <button
                className="text-blue-600 underline ml-1"
                onClick={() => {
                  setSelectedDescription(text);
                  setModalVisible(true);
                }}
              >
                Read more
              </button>
            )}
          </span>
        ),
      },
      {
        title: "Brand",
        dataIndex: "brand",
        key: "brand",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Product Type",
        dataIndex: "product_type",
        key: "product_type",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Category",
        dataIndex: "category_id",
        key: "category_id",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Subcategory",
        dataIndex: "subcategory_id",
        key: "subcategory_id",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Currency Symbol",
        dataIndex: "currency_symbol",
        key: "currency_symbol",
        width: 80,
        ellipsis: true,
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
        width: 80,
        ellipsis: true,
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        width: 80,
        ellipsis: true,
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Weight",
        dataIndex: "weight",
        key: "weight",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Weight unit",
        dataIndex: "weight_unit",
        key: "weight_unit",
        width: 100,
        ellipsis: true,
      },
    ];
    // }
    // Add more condition checks for other subcategories
  }

  const handleUpload = async () => {
    try {
      // const subcategory = productData[0]?.key7;

      // if (!subcategory) {
      //   console.error("Subcategory data not available.");
      //   return;
      // }

      const dataToSend = {
        productData,
        // subcategory,
      };

      // Show loading message using Swal with a minimum timer of 3 seconds
      const loadingSwal = Swal.fire({
        title: "Uploading Data",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          setTimeout(() => {
            loadingSwal.close();
          }, 3000); // Minimum timer of 3 seconds
        },
      });

      const response = await fetch(`${AdminUrl}/api/uploadBulkProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const responseData = await response.json();
        console.error("Backend error:", responseData.error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error uploading data. " + responseData.error,
        });
        return;
      }

      const responseData = await response.json();
      console.log("Backend response:", responseData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data uploaded successfully.",
      });
      setProductData(null); // Clear productData after successful upload
    } catch (error) {
      console.error("Error uploading data to the backend:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error uploading data. Please try again later.",
      });
    }
  };

  const categoryFunction = async () => {
    try {
      // Your API call to fetch categories data
      const response = await fetch(`${AdminUrl}/api/getAllProductCatgeory`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const subcategoryFunction = async () => {
    try {
      // Your API call to fetch subcategories data
      const response = await fetch(`${AdminUrl}/api/getAllSubcategories`);
      const data = await response.json();
      setSubcategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Find the corresponding category ID from the categories array
    const selectedCategory = categories.find(
      (category) => category.category_id === selectedCategoryId
    );
    if (selectedCategory) {
      // Filter subcategories based on the selected category ID
      const filteredSubcategories = subcategories.filter(
        (subcategory) =>
          subcategory.parent_category_id === selectedCategory.category_id
      );
      setFilteredSubcategories(filteredSubcategories);
    }
  }, [selectedCategoryId, categories, subcategories]);

  useEffect(() => {
    // Check if 'categories' and 'subcategories' are empty
    const categoriesEmpty = categories === null || categories.length === 0;
    const subcategoriesEmpty = subcategories.length === 0;

    // Fetch data only if both 'categories' and 'subcategories' are empty
    if (categoriesEmpty || subcategoriesEmpty) {
      categoryFunction();
      subcategoryFunction();
    }
  }, [categories, subcategories]);

  const handleCategoryChange = (category) => {
    setSelectedCategoryId(category);
    setSelectedCategory(categories.find((cat) => cat.category_id == category));
    setSelectedSubcategory(null)
    setProductData(null);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategories.find((subcat) => subcat.subcategory_id === subcategory));
    setProductData(null);
  };

  return vendorDatastate && vendorDatastate.length > 0 ? (
    <>
      {!vendorDatastate?.[0].email_verification_status ||
        !vendorDatastate?.[0].mobile_verification_status ||
        vendorDatastate?.[0].status === 1 ? (
        <AuthCheck vendorDatastate={vendorDatastate} />
      ) : (
        <>
          <div className="bg-white rounded p-6">
            <div className="mb-4">
              <h1 className="fashionfont text-[18px] text-[#000] font-semibold mb-3 font-sans">
                Choose Category
              </h1>
              <Select
                value={selectedCategory?.category_id}
                onChange={(categoryId) => handleCategoryChange(categoryId)}
                placeholder="Choose Category"
                style={{ width: 200, marginRight: 16 }}
              >
                {categories.map((category) => (
                  <Select.Option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </Select.Option>
                ))}
              </Select>
              {FilteredSubcategories && (
                <>
                  <h1 className="fashionfont text-[18px] text-[#000] font-semibold my-3 font-sans">
                    Select SubCategory
                  </h1>
                  <Select
                    value={SelectedSubcategory?.subcategory_id}
                    onChange={(subcategoryId) => handleSubcategoryChange(subcategoryId)}
                    placeholder="Select SubCategory"
                    style={{ width: 200 }}
                  >
                    {FilteredSubcategories && FilteredSubcategories.map((subcategory) => (
                      <Select.Option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                        {subcategory.subcategory_name}
                      </Select.Option>
                    ))}
                  </Select>
                </>
              )}

              {/* <h1 className="font-bold text-2xl mb-5 text-gray-700">
                Choose Category
              </h1>
              <div className="flex flex-wrap">
                {categories.map((category) => (
                  <div
                    key={category.category_id}
                    onClick={() => handleCategoryChange(category)}
                    className={`py-2 px-3 cursor-pointer rounded ${selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                      } mr-2 mb-2 flex justify-center items-center`}
                  >
                    <img
                      src={category.category_image_url}
                      alt=""
                      width={40}
                      className={`${selectedCategory === category ? "invert" : ""
                        }`}
                    />
                    <p className="font-semibold ml-2">
                      {category.category_name}
                    </p>
                  </div>
                ))}
              </div> */}
            </div>

            {/* <div className="mb-4">
              {FilteredSubcategories && (
                <h1 className="font-bold text-2xl mb-5 text-gray-700">
                  Select SubCategory
                </h1>
              )}
              <div className="flex flex-wrap">
                {FilteredSubcategories &&
                  FilteredSubcategories.map((subcat) => (
                    <div
                      key={subcat.subcategory_id}
                      onClick={() => handleSubcategoryChange(subcat)}
                      className={`py-2 px-3 cursor-pointer rounded ${SelectedSubcategory === subcat
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                        } mr-2 mb-2 flex justify-center items-center`}
                    >
                      <img
                        src={subcat.subcategory_image_url}
                        alt=""
                        width={40}
                        className={`${SelectedSubcategory === subcat ? "invert" : ""
                          }`}
                      />
                      <p className="font-semibold ml-2">
                        {subcat.subcategory_name}
                      </p>
                    </div>
                  ))}
              </div>
            </div> */}

            {SelectedSubcategory && (
              <>
                {/* <Title
                  level={3}
                  className="fashionfont text-[18px] text-[#495057] font-semibold my-3 font-sans"
                >
                  Bulk Product Upload
                </Title> */}
                <h1 className="fashionfont text-[18px] text-[#000] font-semibold my-3 font-sans">Bulk Product Upload</h1>
                <div className="mb-4 w-full">
                  <Upload
                    accept=".xlsx"
                    className="w-full"
                    beforeUpload={() => false}
                    onChange={(info) => handleFileUpload(info.file)}
                  >
                    <Button
                      // style={{ width: "80vw" }} // Set the width to 100% to make the button full-width
                      className="h-24 text-lg"
                      icon={<UploadOutlined />}
                    >
                      Upload Excel File
                    </Button>
                  </Upload>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={!productData && productData?.length > 0}
                    className={`flex mt-4 items-center ml-2 transition-all duration-300 ${productData
                      ? "bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    <UploadOutlined className="mr-1" />
                    Upload
                  </Button>
                </div>
                <div className={productData ? "hidden" : ""}>
                  <DownloadSampleExcel
                    selectedSubcategory={SelectedSubcategory}
                  />
                </div>
                {productData && productData?.length > 0 && (
                  <div>
                    <div className="bg-white rounded shadow overflow-x-auto mb-4">
                      <Table
                        pagination={false}
                        columns={columns}
                        dataSource={productData}
                      />
                    </div>
                    <Alert
                      type="info"
                      message={
                        <div className="flex items-start">
                          <InfoCircleOutlined className="text-blue-500 mr-4 mt-1" />
                          <div>
                            <p className="mb-2">Review and Confirm Details</p>
                            <p className="text-gray-600 mb-4">
                              You have selected category "
                              <strong>{selectedCategory?.category_name}</strong>" and
                              subcategory "<strong>{SelectedSubcategory?.subcategory_name}</strong>
                              ". Before proceeding, please review and confirm
                              the details extracted from the Excel file below.
                              If any discrepancies are found, make the necessary
                              edits in the Excel file and then proceed.
                            </p>
                            <ul className="list-disc ml-8 mt-2">
                              <li>Product titles and descriptions</li>
                              <li>Brands, currencies, and prices</li>
                              <li>
                                Category, subcategory, city, state, and country
                                information
                              </li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                              Once you have reviewed and confirmed the details,
                              click the <strong>"Upload"</strong> button above
                              to proceed.
                            </p>
                          </div>
                        </div>
                      }
                      className="mb-4"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <Modal
            title="Description"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
          >
            <p>{selectedDescription}</p>
          </Modal>
        </>
      )}
    </>
  ) : (
    ""
  );
};

export default BulkProductUpload;
