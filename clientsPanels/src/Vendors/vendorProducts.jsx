import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Space,
  Steps,
  Tabs,
  Tooltip,
  Image,
  Checkbox,
  Tag,
  Card,
  InputNumber,
} from "antd";

const { Step } = Steps;

import { NavLink } from "react-router-dom";
import { AdminUrl, fetchVariantProducts } from "../Admin/constant";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiTrash2,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ProductImage } from "./components/ProductImage";
import AuthCheck from "./components/AuthCheck";
import VariantsCrud from './VariantCrud'

const { TabPane } = Tabs;

const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000, // Adjust as needed
};

const VendorProducts = ({ vendorDatastate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [SelectedUniqueId, setSelectedUniqueId] = useState(null);
  const [products, setProducts] = useState([]);
  const [changeSubcatTabs, setchangeSubcatTabs] = useState("0"); // Separate state for the second set of tabs
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCategoryType, setSelectedCategoryType] = useState("Products");
  const [formValues, setFormValues] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [subcatNameBackend, setsubcatNameBackend] = useState(null);
  const [catSubcatDisable, setcatSubcatDisable] = useState(false);
  const [variantAddModal, setvariantAddModal] = useState(false);
  const [selectRowProduct, setselectRowProduct] = useState([]);
  const [UploadImages, setUploadImages] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [ProductVariantType, setProductVariantType] = useState("Simple");
  const [FilteredVariantData, setFilteredVariantData] = useState([]);
  const [variantData, setVariants] = useState([]);
  const [variantsValueArray, setVariantsValueArray] = useState([]);
  const [variantsFetchFinal, setvariantsFetchFinal] = useState([]);
  const [VariantModalShow, setVariantModalShow] = useState(false);
  const [RowVariants, setRowVariants] = useState([]);

  const id = vendorDatastate?.[0].id;

  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
    country: "",
  });

  const phoneBrands = [
    "Apple",
    "Asus",
    "BlackBerry",
    "Gionee",
    "Google (Pixel)",
    "HTC",
    "Huawei",
    "Infinix",
    "Itel",
    "Lenovo",
    "LG",
    "Meizu",
    "Motorola",
    "Nokia",
    "OnePlus",
    "Oppo",
    "QMobile",
    "Realme",
    "Samsung",
    "Sony",
    "Tecno",
    "Vivo",
    "Wiko",
    "Xiaomi",
    "ZTE",
    // Add more brands here...
    "Other Mobiles",
  ];

  const laptopComputerBrands = [
    "Acer",
    "Apple",
    "Asus",
    "Dell",
    "HP",
    "Lenovo",
    "Microsoft",
    "MSI",
    "Razer",
    "Samsung",
    "Toshiba",
    "Other Laptop Brands",
  ];

  const cameraPhotographyBrands = [
    "Canon",
    "Nikon",
    "Sony",
    "Fujifilm",
    "Panasonic",
    "Olympus",
    "Leica",
    "GoPro",
    "Pentax",
    "Hasselblad",
    "Sigma",
    "Ricoh",
    "Kodak",
    "DJI",
    "Hoya",
    "Tamron",
    "Zeiss",
    "Vivitar",
    "Lomography",
    "Yashica",
    "Minolta",
    "Mamiya",
    "Voigtländer",
    "Contax",
    "Hanimex",
    "Sankyo",
    "Zenit",
    "Agfa",
    "Bronica",
    "Casio",
    "Epson",
    "Holga",
    "Imacon",
    "JVC",
    "Konica",
    "Metz",
    "Nizo",
    "Opteka",
    "Quasar",
    "Rollei",
    "Samsung",
    "Tokina",
    "Vivitek",
    "Wollensak",
    "Xiaomi",
    "Yashima",
    "Zenobia",
    // Add more brands here...
    "Other Brands",
  ];

  const audioHeadphonesBrands = [
    "Sony",
    "Bose",
    "Sennheiser",
    "Beats",
    "JBL",
    "AKG",
    "Audio-Technica",
    "Skullcandy",
    "Bowers & Wilkins",
    "Bang & Olufsen",
    // Add more brands as needed
  ];

  const [specifications, setSpecifications] = useState([
    {
      label: "Brand",
      name: "brand",
      type: "select",
      options: laptopComputerBrands,
    },
    { label: "Model Name/Number", name: "modelname", type: "text" },
    {
      label: "Product Conidition",
      name: "condition",
      type: "select",
      options: ["New", "Used", "Refurbished"],
    },
    { label: "Processor/CPU", name: "processor", type: "text" },
    { label: "RAM", name: "ram", type: "text" },
    {
      label: "Storage Type (e.g., HDD, SSD)",
      name: "storagetype",
      type: "text",
    },
    { label: "Storage Capacity", name: "storagecapacity", type: "text" },
    { label: "Display Size", name: "displaysize", type: "text" },
    { label: "Screen Resolution", name: "screenresolution", type: "text" },
    { label: "Graphics Card", name: "graphicscard", type: "text" },
    { label: "Operating System", name: "operatingsystem", type: "text" },
    {
      label: "Connectivity Ports (e.g., USB, HDMI, Ethernet)",
      name: "connectivityports",
      type: "text",
    },
    {
      label: "Battery Life (for laptops)",
      name: "batterylife",
      type: "text",
    },
    { label: "Keyboard Type", name: "keyboardtype", type: "text" },
    { label: "Touchpad", name: "touchpad", type: "text" },
    { label: "Dimensions", name: "dimensions", type: "text" },
    { label: "Weight", name: "weight", type: "text" },
    {
      label: "Warranty Information",
      name: "warrantyinformation",
      type: "text",
    },
  ]);

  // import { RiShieldCrossFill } from 'react-icons/ri';
  const callVendorProducts = async (updatedImages) => {
    try {
      const response = await fetch(`${AdminUrl}/api/allVendorProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subcatNameBackend }),
      });

      if (response.ok) {
        // Handle successful response
        const data = await response.json();
        const sortedProducts = data.products.sort(
          (a, b) => a.product_me_id - b.product_me_id
        );
        const products = sortedProducts.filter((item) => item.vendorid == id);
        setProducts(products);
        if (updatedImages != undefined) setUploadImages(updatedImages);
      } else {
        // Handle error response
        console.error("Error fetching vendor products:", response.statusText);
        setProducts([]);
      }
    } catch (error) {
      // Handle error
      console.error("Error fetching vendor products:", error);
    }
  };

  useEffect(() => {
    callVendorProducts(UploadImages);
  }, [subcatNameBackend, UploadImages]);

  useEffect(() => {
    fetchVariantProducts()
      .then((variantProducts) => {
        setvariantsFetchFinal(variantProducts)
        // Filter the fetched variant products based on SelectedUniqueId
        const filteredData = variantProducts.filter(item => item.product_uniqueid === SelectedUniqueId);

        // Convert the filtered data to the desired format
        const formattedData = filteredData.map(item => {
          return {
            label: item.label,
            price: parseFloat(item.variant_mrp),
            sellingPrice: parseFloat(item.variant_sellingprice),
            sku: item.variant_skuid,
            quantity: item.variant_quantity,
            variantsValue: JSON.parse(item.variantsvalues)
          };
        });

        const variantsValueArray = formattedData.map(item => item.variantsValue);
        console.log(variantsValueArray);
        setVariantsValueArray(variantsValueArray)
        // Now, set the formatted data in the state variable setFilteredVariantData
        setFilteredVariantData(formattedData);
      })
      .catch((error) => {
        // Handle fetch errors here
        console.log(error);
      });
  }, [SelectedUniqueId]);


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
      setsubcatNameBackend(data[0].subcategory_name.replace(/[\s'"]/g, ""));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find(
      (category) => category.category_name === categoryId
    );

    setSelectedCategoryId(categoryId);
    setSelectedSubcategory(null);
    setSelectedCategory(
      selectedCategory
        ? selectedCategory.category_name.replace(/[\s'"]/g, "")
        : ""
    );
    setFilteredSubcategories([]);
    document.getElementById("subcategory").value = "";
  };

  const handleSubcategoryChange = (subcategoryId) => {
    // Find the selected subcategory object from the filteredSubcategories array
    const selectedSubcategorys = filteredSubcategories.find(
      (subcategory) => subcategory.subcategory_name === subcategoryId
    );
    // Set the subcategory name in state
    setSelectedSubcategory(
      selectedSubcategorys
        ? selectedSubcategorys.subcategory_name
          .replace(/[^\w\s]/g, "")
          .replace(/\s/g, "")
        : ""
    );
  };

  // Filter subcategories based on the selected category ID
  useEffect(() => {
    // Check if 'categories' and 'subcategories' are empty
    const categoriesEmpty = categories === null || categories.length === 0;
    const subcategoriesEmpty = subcategories.length === 0;

    // Fetch data only if both 'categories' and 'subcategories' are empty
    if (categoriesEmpty || subcategoriesEmpty) {
      callVendorProducts();
      categoryFunction();
      subcategoryFunction();
    }
  }, [categories, subcategories]);

  // useEffect to filter subcategories based on the selected category ID
  useEffect(() => {
    // Find the corresponding category ID from the categories array
    const selectedCategory = categories.find(
      (category) => category.category_name === selectedCategoryId
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

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();

      if (currentStep < steps.length - 1) {
        if (currentStep === 2) {
          if (selectedCurrency === "Select Currency") {
            // Show a currency error message
            showError("Currency Error", "Please select a valid currency!");
            return;
          }

          if (ProductVariantType === 'Variant' && FilteredVariantData.length === 0) {
            // Show a variants error message
            showError("Variants Error", "Please add at least one variant!");
            return;
          }
        }

        setCurrentStep(currentStep + 1);
        form.submit();
      }
    } catch (error) {
      // Handle validation errors if any
      console.error("Validation Error:", error);
    }
  };

  const showError = (title, text) => {
    Swal.fire({
      icon: "error",
      title,
      text,
    });
  };


  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRowSelect = (selectedId) => {
    if (selectedRowKeys.includes(selectedId)) {
      setSelectedRowKeys(selectedRowKeys.filter((id) => id !== selectedId));
    } else {
      setSelectedRowKeys([...selectedRowKeys, selectedId]);
    }
  };

  const handleSelectAllRows = () => {
    if (selectedRowKeys.length === products.length) {
      setSelectedRowKeys([]);
    } else {
      if (subcatNameBackend === "MobileElectronics") {
        setSelectedRowKeys(products.map((product) => product.product_me_id));
      } else if (subcatNameBackend === "Laptop&Computers") {
        setSelectedRowKeys(products.map((product) => product.product_lc_id));
      } else if (subcatNameBackend === "Camera&Photography") {
        setSelectedRowKeys(products.map((product) => product.product_cp_id));
      } else if (subcatNameBackend === "Audio&Headphones") {
        setSelectedRowKeys(products.map((product) => product.product_ah_id));
      }
    }
  };

  const statusMap = {
    0: "Pending",
    1: "Active",
    2: "Blocked",
    3: "Approved",
    4: "Rejected",
  };

  // All Columns
  const mobileElectronics = [
    {
      title: "",
      key: "select_all",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.product_me_id)}
          onChange={() => handleRowSelect(record.product_me_id)}
        />
      ),
    },
    {
      title: "Id",
      dataIndex: "uniquepid",
      key: "uniquepid",
      sorter: (a, b) => parseFloat(a.uniquepid) - parseFloat(b.uniquepid),
    },
    {
      title: "Product Name",
      dataIndex: "ad_title",
      key: "ad_title",
      render: (ad_title) => (
        <Tooltip title={ad_title}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ad_title}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <Tooltip title={description}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div>
          <Image.PreviewGroup>
            {images?.slice(0, 2).map((image, index) => (
              <Image
                key={index}
                src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                alt="Product Image"
                width={50}
                height={50}
                className="border rounded-full p-1 "
              />
            ))}
          </Image.PreviewGroup>
          {images?.length > 2 && (
            <Button
              className="text-sm border border-b-4"
              onClick={() => handleViewImages(images)}
            >
              View All {images?.length} Images
            </Button>
          )}
        </div>
      ),
      width: 100,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, record) => (
        <Tooltip title={`${record.currency_symbol} ${price}`}>
          <span className="font-bold">
            {record.currency_symbol} {price}
          </span>
        </Tooltip>
      ),
      filters: [
        { text: "Less than 50", value: "<50" },
        { text: "50 - 100", value: "50-100" },
        { text: "More than 100", value: ">100" },
      ],
      onFilter: (value, record) => {
        const price = parseFloat(record.price);
        if (value === "<50") return price < 50;
        if (value === "50-100") return price >= 50 && price <= 100;
        if (value === ">100") return price > 100;
      },
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
      width: 150,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      filters: phoneBrands.map((brand) => ({ text: brand, value: brand })),
      onFilter: (value, record) => record.brand === value,
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      render: (brand) => <Tooltip title={brand}>{brand}</Tooltip>,
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",

      onFilter: (value, record) => record.condition === value,
      sorter: (a, b) => a.condition.localeCompare(b.condition),
      render: (condition) => (
        <Tooltip title={condition} className="capitalize">
          {condition}
        </Tooltip>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (city) => (
        <Tooltip title={city}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {city}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (state) => (
        <Tooltip title={state}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {state}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => (
        <Tooltip title={country}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {country}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tooltip title={category}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {category}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let icon, color;
        switch (status) {
          case 0:
            icon = <FiClock className="text-orange-500" />;
            color = "text-orange-500";
            break;
          case 1:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 2:
            icon = <FiCheckCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          case 3:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 4:
            icon = <FiAlertCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          default:
            icon = <FiClock className="text-gray-500" />;
            color = "text-gray-500";
        }
        let content = (
          <span className={`flex items-center ${color}`}>
            {icon}
            <span className="ml-1">{statusMap[status]}</span>
          </span>
        );

        if (status === 4 && record.rejection_reason) {
          content = (
            <Tooltip title={`Reason: ${record.rejection_reason}`}>
              {content}
            </Tooltip>
          );
        }

        return content;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => {
        if (record.status === 4) {
          return <span className="text-red-500">Rejected</span>;
        }

        return (
          <Space size="middle" className="flex">
            <FiEdit3
              onClick={() => handleUpdate(record.product_me_id)}
              className="text-white w-8 h-8 p-2 rounded-full bg-green-500 border-none hover:bg-green-600 hover:text-white"
            />
            <FiTrash2
              onClick={() =>
                handleDelete(record.product_me_id, record.ad_title)
              }
              className="text-white w-8 h-8 p-2 rounded-full bg-red-500 border-none hover:bg-red-600 hover:text-white"
            />
          </Space>
        );
      },
    },
  ];

  const handleVariantShowModal = (id, variants) => {
    setRowVariants(variants);
    setVariantModalShow(true)
  }


  // Columns for LAPTOP & Computers category
  const laptopComputersColumns = [
    {
      title: "",
      key: "select_all",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.product_lc_id)}
          onChange={() => handleRowSelect(record.product_lc_id)}
        />
      ),
    },
    {
      title: "SKUID",
      dataIndex: "skuid",
      key: "skuid",
      render: (skuid, record) => {
        // Check if the product is a variant
        if (record.isvariant === "Variant") {
          // Filter variantsFetchFinal based on SelectedUniqueid
          const filteredVariants = variantsFetchFinal.filter(
            (variant) => variant.product_uniqueid === record.uniquepid
          );


          return (
            <>
              <p>
                {filteredVariants.length} Variants{" "}
                <Button type="link" onClick={() => handleVariantShowModal(record.uniquepid, filteredVariants)}>Show</Button>
              </p>

            </>
          );
        } else {
          return skuid; // Render the SKUID as it is for non-variant products
        }
      },
    },


    {
      title: "PRODUCT NAME",
      dataIndex: "ad_title",
      key: "ad_title",
      render: (ad_title) => (
        <Tooltip title={ad_title}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ad_title}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "additionaldescription",
      key: "additionaldescription",
      render: (additionaldescription, record) => (
        <Tooltip title={additionaldescription}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {additionaldescription}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "IMAGES",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div>
          <Image.PreviewGroup>
            {images?.slice(0, 2).map((image, index) => (
              <Image
                key={index}
                src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                alt="Product Image"
                width={50}
                height={50}
                className="border rounded-full p-1 "
              />
            ))}
          </Image.PreviewGroup>
          {images?.length > 2 && (
            <Button
              className="text-sm border border-b-4"
              onClick={() => handleViewImages(images)}
            >
              View All {images?.length} Images
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'PRICE',
      dataIndex: 'mrp',
      key: 'mrp',
      width: 200,
      render: (mrp, record) => {
        if (record.isvariant === 'Variant') {
          const filteredVariants = variantsFetchFinal
            .filter((variant) => variant.product_uniqueid === record.uniquepid)
            .sort((a, b) =>
              parseFloat(a.variant_sellingprice) - parseFloat(b.variant_sellingprice)
            );

          return (
            <Tooltip
              title={`${record.currency_symbol} ${filteredVariants[0].variant_sellingprice} -  ${record.currency_symbol} ${filteredVariants[filteredVariants.length - 1].variant_sellingprice}`}
            >
              <div className="w-[150px]">
                <span className="font-semibold text-[12px]">
                  {record.currency_symbol} {filteredVariants[0].variant_sellingprice}
                </span>
                <span>  - </span>
                <span className="font-medium">
                  {record.currency_symbol} {filteredVariants[filteredVariants.length - 1].variant_sellingprice}
                </span>
              </div>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip
              title={`${record.currency_symbol} MRP: ${mrp} - Selling Price: ${record.currency_symbol} ${record.sellingprice}`}
            >
              <div className="w-[150px]">
                <span className="font-medium">
                  SP: {record.currency_symbol} {record.sellingprice}
                </span>
              </div>
            </Tooltip>
          );
        }
      },
      sorter: (a, b) => parseFloat(a.mrp) - parseFloat(b.mrp),
    },

    {
      title: "BRAND",
      dataIndex: "brand",
      key: "brand",
      filters: laptopComputerBrands.map((brand) => ({
        text: brand,
        value: brand,
      })),
      onFilter: (value, record) => record.brand === value,
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      render: (brand) => <Tooltip title={brand}>{brand}</Tooltip>,
    },
    {
      title: "CONDITION",
      dataIndex: "condition",
      key: "condition",

      onFilter: (value, record) => record.condition === value,
      sorter: (a, b) => a.condition.localeCompare(b.condition),
      render: (condition) => <Tooltip title={condition}>{condition}</Tooltip>,
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      key: "country",
      render: (country) => (
        <Tooltip title={country}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {country}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tooltip title={category}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {category}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let icon, color;
        switch (status) {
          case 0:
            icon = <FiClock className="text-orange-500" />;
            color = "text-orange-500";
            break;
          case 1:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 2:
            icon = <FiCheckCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          case 3:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 4:
            icon = <FiAlertCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          default:
            icon = <FiClock className="text-gray-500" />;
            color = "text-gray-500";
        }
        let content = (
          <span className={`flex items-center ${color}`}>
            {icon}
            <span className="ml-1">{statusMap[status]}</span>
          </span>
        );

        if (status === 4 && record.rejection_reason) {
          content = (
            <Tooltip title={`Reason: ${record.rejection_reason}`}>
              {content}
            </Tooltip>
          );
        }

        return content;
      },
    },
    {
      title: "ACTIONS",
      key: "actions",
      render: (record) => {
        if (record.status === 4) {
          return <span className="text-red-500">Rejected</span>;
        }

        return (
          <Space size="middle" className="flex">
            <FiEdit3
              onClick={() => handleUpdate(record.product_lc_id, record.uniquepid)}
              className="text-white w-8 h-8 p-2 rounded-full bg-green-500 border-none hover:bg-green-600 hover:text-white"
            />
            <FiTrash2
              onClick={() =>
                handleDelete(record.product_lc_id, record.ad_title)
              }
              className="text-white w-8 h-8 p-2 rounded-full bg-red-500 border-none hover:bg-red-600 hover:text-white"
            />
          </Space>
        );
      },
    },
  ];

  // Columns for Camera & Photography category
  const cameraPhotographyColumns = [
    {
      title: "",
      key: "select_all",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.product_cp_id)}
          onChange={() => handleRowSelect(record.product_cp_id)}
        />
      ),
    },
    {
      title: "Id",
      dataIndex: "uniquepid",
      key: "uniquepid",
      sorter: (a, b) => parseFloat(a.uniquepid) - parseFloat(b.uniquepid),
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "ad_title",
      key: "ad_title",
      render: (ad_title) => (
        <Tooltip title={ad_title}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ad_title}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <Tooltip title={description}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "IMAGES",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div>
          <Image.PreviewGroup>
            {images?.slice(0, 2).map((image, index) => (
              <Image
                key={index}
                src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                alt="Product Image"
                width={50}
                height={50}
                className="border rounded-full p-1 "
              />
            ))}
          </Image.PreviewGroup>
          {images?.length > 2 && (
            <Button
              className="text-sm border border-b-4"
              onClick={() => handleViewImages(images)}
            >
              View All {images?.length} Images
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",

      render: (price, record) => (
        <Tooltip title={`${record.currency_symbol} ${price}`}>
          <span className="font-bold">
            {record.currency_symbol} {price}
          </span>
        </Tooltip>
      ),
      filters: [
        { text: "Less than 50", value: "<50" },
        { text: "50 - 100", value: "50-100" },
        { text: "More than 100", value: ">100" },
      ],
      onFilter: (value, record) => {
        const price = parseFloat(record.price);
        if (value === "<50") return price < 50;
        if (value === "50-100") return price >= 50 && price <= 100;
        if (value === ">100") return price > 100;
      },
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: "BRAND",
      dataIndex: "brand",
      key: "brand",
      filters: laptopComputerBrands.map((brand) => ({
        text: brand,
        value: brand,
      })),
      onFilter: (value, record) => record.brand === value,
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      render: (brand) => <Tooltip title={brand}>{brand}</Tooltip>,
    },
    {
      title: "CONDITION",
      dataIndex: "condition",
      key: "condition",

      onFilter: (value, record) => record.condition === value,
      sorter: (a, b) => a.condition.localeCompare(b.condition),
      render: (condition) => <Tooltip title={condition}>{condition}</Tooltip>,
    },
    {
      title: "CITY",
      dataIndex: "city",
      key: "city",
      render: (city) => (
        <Tooltip title={city}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {city}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (state) => (
        <Tooltip title={state}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {state}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => (
        <Tooltip title={country}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {country}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tooltip title={category}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {category}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let icon, color;
        switch (status) {
          case 0:
            icon = <FiClock className="text-orange-500" />;
            color = "text-orange-500";
            break;
          case 1:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 2:
            icon = <FiCheckCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          case 3:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 4:
            icon = <FiAlertCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          default:
            icon = <FiClock className="text-gray-500" />;
            color = "text-gray-500";
        }
        let content = (
          <span className={`flex items-center ${color}`}>
            {icon}
            <span className="ml-1">{statusMap[status]}</span>
          </span>
        );

        if (status === 4 && record.rejection_reason) {
          content = (
            <Tooltip title={`Reason: ${record.rejection_reason}`}>
              {content}
            </Tooltip>
          );
        }

        return content;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => {
        if (record.status === 4) {
          return <span className="text-red-500">Rejected</span>;
        }

        return (
          <Space size="middle" className="flex">
            <FiEdit3
              onClick={() => handleUpdate(record.product_cp_id)}
              className="text-white w-8 h-8 p-2 rounded-full bg-green-500 border-none hover:bg-green-600 hover:text-white"
            />
            <FiTrash2
              onClick={() =>
                handleDelete(record.product_cp_id, record.ad_title)
              }
              className="text-white w-8 h-8 p-2 rounded-full bg-red-500 border-none hover:bg-red-600 hover:text-white"
            />
          </Space>
        );
      },
    },
  ];

  // Columns for Audio & Headphones category
  const audioHeadphonesColumns = [
    {
      title: "",
      key: "select_all",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.product_ah_id)}
          onChange={() => handleRowSelect(record.product_ah_id)}
        />
      ),
    },
    {
      title: "Id",
      dataIndex: "uniquepid",
      key: "uniquepid",
      sorter: (a, b) => parseFloat(a.uniquepid) - parseFloat(b.uniquepid),
    },
    {
      title: "Product Name",
      dataIndex: "ad_title",
      key: "ad_title",
      render: (ad_title) => (
        <Tooltip title={ad_title}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ad_title}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <Tooltip title={description}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {description}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div>
          <Image.PreviewGroup>
            {images?.slice(0, 2).map((image, index) => (
              <Image
                key={index}
                src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                alt="Product Image"
                width={50}
                height={50}
                className="border rounded-full p-1 "
              />
            ))}
          </Image.PreviewGroup>
          {images?.length > 2 && (
            <Button
              className="text-sm border border-b-4"
              onClick={() => handleViewImages(images)}
            >
              View All {images?.length} Images
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",

      render: (price, record) => (
        <Tooltip title={`${record.currency_symbol} ${price}`}>
          <span className="font-bold">
            {record.currency_symbol} {price}
          </span>
        </Tooltip>
      ),
      filters: [
        { text: "Less than 50", value: "<50" },
        { text: "50 - 100", value: "50-100" },
        { text: "More than 100", value: ">100" },
      ],
      onFilter: (value, record) => {
        const price = parseFloat(record.price);
        if (value === "<50") return price < 50;
        if (value === "50-100") return price >= 50 && price <= 100;
        if (value === ">100") return price > 100;
      },
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      filters: laptopComputerBrands.map((brand) => ({
        text: brand,
        value: brand,
      })),
      onFilter: (value, record) => record.brand === value,
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      render: (brand) => <Tooltip title={brand}>{brand}</Tooltip>,
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
      onFilter: (value, record) => record.condition === value,
      sorter: (a, b) => a.condition.localeCompare(b.condition),
      render: (condition) => <Tooltip title={condition}>{condition}</Tooltip>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (city) => (
        <Tooltip title={city}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {city}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (state) => (
        <Tooltip title={state}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {state}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => (
        <Tooltip title={country}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {country}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tooltip title={category}>
          <div
            style={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {category}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let icon, color;
        switch (status) {
          case 0:
            icon = <FiClock className="text-orange-500" />;
            color = "text-orange-500";
            break;
          case 1:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 2:
            icon = <FiCheckCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          case 3:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 4:
            icon = <FiAlertCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          default:
            icon = <FiClock className="text-gray-500" />;
            color = "text-gray-500";
        }
        let content = (
          <span className={`flex items-center ${color}`}>
            {icon}
            <span className="ml-1">{statusMap[status]}</span>
          </span>
        );

        if (status === 4 && record.rejection_reason) {
          content = (
            <Tooltip title={`Reason: ${record.rejection_reason}`}>
              {content}
            </Tooltip>
          );
        }

        return content;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => {
        if (record.status === 4) {
          return <span className="text-red-500">Rejected</span>;
        }

        return (
          <Space size="middle" className="flex">
            <FiEdit3
              onClick={() => handleUpdate(record.product_ah_id)}
              className="text-white w-8 h-8 p-2 rounded-full bg-green-500 border-none hover:bg-green-600 hover:text-white"
            />
            <FiTrash2
              onClick={() =>
                handleDelete(record.product_ah_id, record.ad_title)
              }
              className="text-white w-8 h-8 p-2 rounded-full bg-red-500 border-none hover:bg-red-600 hover:text-white"
            />
          </Space>
        );
      },
    },
  ];

  const handleViewImages = (images) => {
    Modal.info({
      title: "All Images",
      width: 800,
      content: (
        <div className="grid grid-cols-2 gap-4">
          {images?.map((image) => (
            <div className="w-[350px] p-2 border">
              <Image
                key={image}
                src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                alt="Product Image"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      ),
      okText: "Close",
      okButtonProps: { style: { backgroundColor: "green" } },
    });
  };

  const handleTabChangeforTable = (key, subcatname) => {
    setIsLoading(true);
    setchangeSubcatTabs(key);
    setSelectedRowKeys([]);
    setsubcatNameBackend(subcatname?.replace(/[\s'"]/g, ""));
    setTimeout(() => {
      setIsLoading(false); // Hide loader after pre-loading is done
    }, 2000);
  };

  const [form] = Form.useForm();

  // Function to fetch user location and update state
  const getUserLocation = async () => {
    try {
      const response = await fetch("http://ip-api.com/json");
      const data = await response.json();

      if (data.status === "success") {
        const city = data.city || "";
        const state = data.regionName || "";
        const country = data.country || "";

        setLocationData({ city, state, country });
        form.setFieldsValue({ city, state, country, countryOfOrigin: country });
      } else {
        console.error("Location data not found.");
      }
    } catch (error) {
      console.error("Error getting user location:", error.message);
    }
  };

  useEffect(() => {
    // Call the function to get user location when the component mounts
    if (locationData?.city === "") getUserLocation();
  }, [locationData]);

  function handleCreate() {
    form.resetFields();
    getUserLocation();
    setCurrentStep(0);
    form.setFieldsValue({ locationData });
    form.setFieldsValue({ countryoforigin: locationData.country });

    setModalVisible(true);
    setcatSubcatDisable(false);
    setUploadImages([]);
    setSelectedKey(null);
    setSelectedCategoryId(null);
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedCurrency("USD");
    setProductVariantType("Simple")
    setSelectedUniqueId(null)
    setFilteredVariantData([])
    setVariants([])
    setVariantsValueArray([])
  }

  console.log(SelectedUniqueId);
  function handleUpdate(key, uid) {
    callVendorProducts();
    setSelectedKey(key);
    setSelectedUniqueId(uid)
    setCurrentStep(0);
    const selectedRow = products.find((item) => {
      if (subcatNameBackend === "MobileElectronics") {
        return item.product_me_id === key;
      } else if (subcatNameBackend === "Laptop&Computers") {
        return item.product_lc_id === key;
      } else if (subcatNameBackend === "Camera&Photography") {
        return item.product_cp_id === key;
      } else if (subcatNameBackend === "Audio&Headphones") {
        return item.product_ah_id === key;
      }
      // Add similar conditions for other subcategories if needed...
      return false;
    });
    console.log(selectedRow);
    setProductVariantType(selectedRow?.isvariant)
    setselectRowProduct(selectedRow);
    form.setFieldsValue(selectedRow);
    setSelectedCategoryId(selectedRow?.category);
    setSelectedCategory(selectedRow?.category);
    setSelectedSubcategory(
      selectedRow?.subcategory?.replace(/[^\w\s]/g, "").replace(/\s/g, "")
    );
    setSelectedCurrency(selectedRow?.currency_symbol);
    setUploadImages(selectedRow?.images);
    setcatSubcatDisable(true);
    setModalVisible(true);
  }

  function handleDelete(key, title) {
    const confirmModal = Modal.confirm({
      title: `Confirm Delete `,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete - ${title}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const response = await fetch(`${AdminUrl}/api/DeleteVendorProduct`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ subcatNameBackend, key }), // Send the subcatNameBackend in the request body
          });

          if (response.ok) {
            console.log("Item deleted successfully");
            const tableName = subcatNameBackend
              .toLowerCase()
              .replace(/[^\w\s]/g, "")
              .replace(/\s/g, "");
            if (tableName === "mobileelectronics") {
              setProducts(
                products.filter((item) => item.product_me_id !== key)
              );
            } else if (tableName === "laptopcomputers") {
              setProducts(
                products.filter((item) => item.product_lc_id !== key)
              );
            } else if (tableName === "cameraphotography") {
              setProducts(
                products.filter((item) => item.product_cp_id !== key)
              );
            } else if (tableName === "audioheadphones") {
              setProducts(
                products.filter((item) => item.product_ah_id !== key)
              );
            }
          } else {
            // Handle error response
            const errorData = await response.json();
            console.error("Error deleting item:", errorData.message);
          }
        } catch (error) {
          // Handle network or other errors
          console.error("Error deleting item:", error);
        }
      },
      onCancel() {
        // Do nothing if cancelled
        confirmModal.destroy();
      },
    });
  }

  const handleFormSubmit = async () => {
    try {
      // Validate the form fields before submitting
      await form.validateFields();

      // Submit the form
      form.submit();
    } catch (error) {
      // Handle form validation errors or any other submission errors
      console.error("Form submission failed:", error);
    }
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const currencyOptions = {
    USD: "$", // United States Dollar
    KES: "KSh", // Kenyan Shilling
    ETB: "Br", // Ethiopian Birr
    EUR: "€", // Euro
    AED: "د.إ", // United Arab Emirates Dirham
  };

  const currencyOptionsList = Object.keys(currencyOptions);

  const NumberInputWithPrefix = ({
    prefixOptions,
    currencyOptions,
    ...rest
  }) => {
    const handleCurrencyChange = (currency) => {
      setSelectedCurrency(currency);
    };
    return (
      <Input
        {...rest}
        addonBefore={
          <Select value={selectedCurrency} onChange={handleCurrencyChange}>
            {prefixOptions.map((currency) => (
              <Select.Option key={currency} value={currency}>
                {currency} - {currencyOptions[currency]}
              </Select.Option>
            ))}
          </Select>
        }
        type="number"
        step="0.01"
      />
    );
  };

  const onFinish = async (values) => {
    try {
      console.log(values);

      const vendorId = vendorDatastate[0].id;
      // Update the status value to 0
      values.status = 0;
      // Check if an object with the same name already exists
      const existingIndex = formValues.findIndex(
        (item) => item.name === values.name
      );

      // Create a copy of the existing state
      const updatedFormValues = [...formValues];

      if (existingIndex !== -1) {
        // Update the value if the object already exists
        updatedFormValues[existingIndex] = {
          ...updatedFormValues[existingIndex],
          ...values,
          selectedCurrency,
          vendorId,
          selectedKey,
          locationData,
          selectedCategoryType,
          SelectedUniqueId,
          FilteredVariantData
        };
      } else {
        // Add a new object to the array if it doesn't exist
        updatedFormValues.push({
          ...values,
          selectedCurrency,
          vendorId,
          selectedKey,
          locationData,
          selectedCategoryType,
          SelectedUniqueId,
          FilteredVariantData
        });
      }

      // Update the state with the modified copy
      setFormValues(updatedFormValues);
      // Check if selectedKey is not null
      if (currentStep === 3) {
        if (selectedKey == null) {
          // Send the data to the backend for updating
          try {
            const response = await fetch(`${AdminUrl}/api/addVendorProduct`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedFormValues),
            });

            // Handle the server response
            if (!response.ok) {
              // Handle the server response error
              throw new Error(
                `Server error: ${response.status} ${response.statusText}`
              );
            }

            // Assuming the backend response contains a success flag and the product data
            const responseData = await response.json();
            if (responseData.status === 200) {
              console.log(responseData);
              const productData = responseData.resp; // Assuming responseData.data contains the newly inserted product data
              let productMeId = null; // Assuming the ID is available as 'id' in the productData object
              if (responseData.data === "Mobile Electronics") {
                setProducts([
                  ...products,
                  {
                    product_me_id: products.length + 1,
                    ...values,
                  },
                ]);
                productMeId = productData.product_me_id; // Assuming the ID is available as 'id' in the productData object
              } else if (responseData.data === "Laptop & Computers") {
                setProducts([
                  ...products,
                  {
                    product_lc_id: products.length + 1,
                    ...values,
                  },
                ]);
                productMeId = productData.product_lc_id; // Assuming the ID is available as 'id' in the productData object
              } else if (responseData.data === "Camera & Photography") {
                setProducts([
                  ...products,
                  {
                    product_cp_id: products.length + 1,
                    ...values,
                  },
                ]);
                productMeId = productData.product_cp_id; // Assuming the ID is available as 'id' in the productData object
              } else if (responseData.data === "Audio & Headphones") {
                setProducts([
                  ...products,
                  {
                    product_ah_id: products.length + 1,
                    ...values,
                  },
                ]);
                productMeId = productData.product_ah_id; // Assuming the ID is available as 'id' in the productData object
              }
              // Update the selectedKey state with the product_me_id
              setSelectedKey(productMeId);
              // Set this value based on the backend response

              // Find the index of the subcategory in the subcategories array
              const activeTabIndex = subcategories.findIndex(
                (subcat) => subcat.subcategory_name === responseData.data
              );

              // Update the changeSubcatTabs state to make the desired tab active
              setchangeSubcatTabs(activeTabIndex.toString());
              handleTabChangeforTable(
                activeTabIndex.toString(),
                responseData.data
              );
            }
          } catch (error) {
            console.error("Error during form submission:", error);
          }
        } else {
          // Send the data to the backend for adding a new record
          const response = await fetch(`${AdminUrl}/api/updateVendorProduct`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormValues),
          });

          // Handle the server response
          if (!response.ok) {
            // Handle the server response error
            throw new Error(
              `Server error: ${response.status} ${response.statusText}`
            );
          }

          // Assuming the backend response contains a success flag
          const responseData = await response.json();
          if (responseData.status === 200) {
            // Handle successful response (e.g., show success message, update state, etc.)
            // ...
            setProducts(
              products.map((item) =>
                (subcatNameBackend
                  .replace(/[^\w\s]/g, "")
                  .replace(/\s/g, "") === "MobileElectronics" &&
                  item.product_me_id === selectedKey) ||
                  (subcatNameBackend
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s/g, "") === "LaptopComputers" &&
                    item.product_lc_id === selectedKey) ||
                  (subcatNameBackend
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s/g, "") === "CameraPhotography" &&
                    item.product_cp_id === selectedKey) ||
                  (subcatNameBackend
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s/g, "") === "AudioHeadphones" &&
                    item.product_ah_id === selectedKey)
                  ? { ...item, ...values }
                  : item
              )
            );
          } else {
            // Handle other responses (e.g., show error message, revert state, etc.)
            // ...
          }
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Handle error (e.g.,deleteProducts show error message, revert state, etc.)
      // ...
    }
  };

  const handleVariantChange = (value) => {
    setProductVariantType(value);
    value === "Variant" ? setvariantAddModal(true) : setvariantAddModal(false);
  };

  const categoryFormMap = {
    Electronics: {
      MobileElectronics: (
        <>
          <Form {...layout} onFinish={onFinish} form={form}>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Brand"
                name="brand"
                className="w-full"
                rules={[
                  { required: true, message: "Please select the phone brand!" },
                ]}
              >
                <Select placeholder="Select phone brand" className="w-full">
                  {phoneBrands.map((brand) => (
                    <Select.Option key={brand} value={brand}>
                      {brand}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Product Name"
                name="ad_title"
                rules={[
                  {
                    required: true,
                    message: "Please input the Product Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Condition"
                name="condition"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Please select the phone condition.",
                  },
                ]}
              >
                <Select placeholder="Select phone condition" className="w-full">
                  <Select.Option value={"New"}>New</Select.Option>
                  <Select.Option value={"Used"}>Used</Select.Option>
                  <Select.Option value={"Refurbished"}>
                    Refurbished
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please input the price!" }]}
              >
                <NumberInputWithPrefix
                  prefixOptions={currencyOptionsList}
                  currencyOptions={currencyOptions}
                  placeholder="Enter the price"
                />
              </Form.Item>
            </div>
          </Form>
          {/* Add other Form.Item components for Mobile details */}
        </>
      ),
      LaptopComputers: (
        <>
          {/* Add Form.Item components for Smartphone details here */}
          <Form
            {...layout}
            onFinish={onFinish}
            form={form}
            className="custom-form"
          >
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Product Name"
                name="ad_title"
                rules={[
                  {
                    required: true,
                    message: "Please input the Product Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="LOCAL DELIVERY CHARGE"
                name="localdeliverycharge"
                rules={[
                  {
                    required: true,
                    message: "Please input the Local Delivery Charge!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="ZONAL DELIVERY CHARGE"
                name="zonaldeliverycharge"
                rules={[
                  {
                    required: true,
                    message: "Please input the Zonal Delivery Charge!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="National Delivery Charge"
                name="nationaldeliverycharge"
                rules={[
                  {
                    required: true,
                    message: "Please input the National Delivery Charge!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Package Details">
                <Form.Item
                  name="weightkg"
                  label="Weight in Kg"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Weight in Kg!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="lengthcm"
                  label="Length in CM"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Length in CM!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="breadthcm"
                  label="Breadth in CM"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Breadth in CM!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="heightcm"
                  label="Height in CM"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Height in CM!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Manfucaturer Details">
                <Form.Item
                  name="countryoforigin"
                  label="Country of Origin"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Country of Origin!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="manufacturername"
                  label="Manufacturer Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Manufacturer Name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="packerdetails"
                  label="Packer Details"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Packer Details!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item label="Product Specification">
                {specifications.map((specification, index) => {
                  const isBrand = specification.label === "Brand";
                  const isCondition = specification.name === "condition";

                  return (
                    <Form.Item
                      key={index}
                      label={specification.label}
                      name={specification.name}
                    >
                      {isBrand ? (
                        <Select>
                          {laptopComputerBrands.map((item) => (
                            <Option key={item} value={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      ) : isCondition ? (
                        <Select>
                          {specification.options.map((item) => (
                            <Option key={item} value={item}>
                              {item}
                            </Option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          name={specification.name}
                          placeholder={`Enter ${specification.name
                            .toLowerCase()
                            .replace(/\s+/g, "")}`}
                        />
                      )}
                    </Form.Item>
                  );
                })}
              </Form.Item>

              <Form.Item
                label="Additional Description"
                name="additionaldescription"
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item label="Search Keywords" name="searchkeywords">
                <Input
                  placeholder="Separate by comma"
                // You can use a custom input component for tags
                // e.g., a component that captures comma-separated values
                />
              </Form.Item>

              <Form.Item label="Key features" name="keyfeatures">
                <Input
                  placeholder="Separate by comma"
                // You can use a custom input component for tags
                // e.g., a component that captures comma-separated values
                />
              </Form.Item>

              <Form.Item label="Video URL" name="videourl">
                <Input />
              </Form.Item>

              <Form.Item label="In the Box">
                <Form.Item
                  name="salespackage"
                  label="Sales Package"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Sales Package!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Product Type"
                name="productType"
                rules={[
                  {
                    required: true,
                    message: "Please select a Product Type!",
                  },
                ]}
                initialValue={ProductVariantType}
              >
                <Select
                  value={ProductVariantType}
                  onChange={handleVariantChange}
                  disabled={selectedKey !== null}
                >
                  <Select.Option value="Simple">Simple Product</Select.Option>
                  <Select.Option value="Variant">Variant Product</Select.Option>
                </Select>
              </Form.Item>


              {ProductVariantType === "Simple" ? (
                <>
                  {/* Input fields for Simple Product */}
                  <Form.Item
                    label="Price"
                    name="mrp"
                    className="col-span-1"
                    rules={[
                      {
                        required: true,
                        message: "Price is required",
                      },
                      {
                        type: "number",
                        min: 1,
                        message: "Price must be at least 1",
                      },
                      {
                        pattern: /^(?!0\d)\d+(\.\d{1,2})?$/,
                        message: "Invalid price format. Use up to 2 decimal places.",
                      },
                      // Add more validation rules as needed
                    ]}
                  >
                    <InputNumber name="price" />
                  </Form.Item>

                  <Form.Item
                    label="Selling Price"
                    name="sellingprice"
                    className="col-span-1"
                    rules={[
                      {
                        required: true,
                        message: "Selling Price is required",
                      },
                      {
                        type: "number",
                        min: 1,
                        message: "Selling Price must be at least 1",
                      },
                      {
                        pattern: /^(?!0\d)\d+(\.\d{1,2})?$/,
                        message: "Invalid selling price format. Use up to 2 decimal places.",
                      },
                      // Add more validation rules as needed
                    ]}
                  >
                    <InputNumber name="sellingPrice" />
                  </Form.Item>

                  <Form.Item
                    label="SKU"
                    name="skuid"
                    className="col-span-1"
                    rules={[
                      {
                        required: true,
                        message: "SKU is required",
                      },
                      {
                        pattern: /^[a-zA-Z0-9-_]*$/,
                        message: "Invalid SKU format. Only letters, numbers, hyphens, and underscores are allowed.",
                      },
                      // Add more validation rules as needed
                    ]}
                  >
                    <Input name="sku" />
                  </Form.Item>

                  <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[
                      {
                        required: true,
                        message: "Quantity is required",
                      },
                      {
                        type: "number",
                        min: 1,
                        message: "Quantity must be at least 1",
                      },
                    ]}
                  >
                    <InputNumber name="quantity" />
                  </Form.Item>

                </>
              ) :
                ProductVariantType === 'Variant' ? <Space size={16} wrap>
                  {FilteredVariantData?.map((item, index) => (
                    <Card
                      key={index}
                      title={item.label}
                      extra={
                        <Space>
                          <EditOutlined onClick={() => setvariantAddModal(true)} />
                          <DeleteOutlined />
                        </Space>
                      }
                      style={{ width: 300 }}
                    >
                      <p>Price: {item.price}</p>
                      <p>Selling Price: {item.sellingPrice}</p>
                      <p>SKU: {item.sku}</p>
                      <p>Quantity: {item.quantity}</p>
                      {/* You can display additional fields or values here */}
                    </Card>
                  ))}
                </Space> :
                  null}
            </div>


          </Form>
        </>
      ),
      CameraPhotography: (
        <>
          {/* Form items for Electronics -> Smartphone */}
          {/* Add Form.Item components for Smartphone details here */}
          <Form {...layout} onFinish={onFinish} form={form}>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Brand"
                name="brand"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Please select the Camera & Photography brand!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Camera & Photography brand"
                  className="w-full"
                >
                  {cameraPhotographyBrands.map((brand) => (
                    <Select.Option key={brand} value={brand}>
                      {brand}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Product Name"
                name="ad_title"
                rules={[
                  {
                    required: true,
                    message: "Please input the Product Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Condition"
                name="condition"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Please select condition.",
                  },
                ]}
              >
                <Select placeholder="Select condition" className="w-full">
                  <Select.Option value={"New"}>New</Select.Option>
                  <Select.Option value={"Used"}>Used</Select.Option>
                  <Select.Option value={"Refurbished"}>
                    Refurbished
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please input the price!" }]}
              >
                <NumberInputWithPrefix
                  prefixOptions={currencyOptionsList}
                  currencyOptions={currencyOptions}
                  placeholder="Enter the price"
                />
              </Form.Item>
            </div>
          </Form>
          {/* Add other Form.Item components for Smartphone details */}
        </>
      ),
      AudioHeadphones: (
        <>
          {/* Form items for Electronics -> Smartphone */}
          {/* Add Form.Item components for Smartphone details here */}
          <Form {...layout} onFinish={onFinish} form={form}>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Brand"
                name="brand"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Please select the Audio & Headphones brand!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Audio & Headphones brand"
                  className="w-full"
                >
                  {audioHeadphonesBrands.map((brand) => (
                    <Select.Option key={brand} value={brand}>
                      {brand}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Product Name"
                name="ad_title"
                rules={[
                  {
                    required: true,
                    message: "Please input the Product Name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Condition"
                name="condition"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Please select the condition.",
                  },
                ]}
              >
                <Select placeholder="Select condition" className="w-full">
                  <Select.Option value={"New"}>New</Select.Option>
                  <Select.Option value={"Used"}>Used</Select.Option>
                  <Select.Option value={"Refurbished"}>
                    Refurbished
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please input the price!" }]}
              >
                <NumberInputWithPrefix
                  prefixOptions={currencyOptionsList}
                  currencyOptions={currencyOptions}
                  placeholder="Enter the price"
                />
              </Form.Item>
            </div>
          </Form>
          {/* Add other Form.Item components for Smartphone details */}
        </>
      ),
      // Add other subcategories of Electronics here
    },
    // Add other categories here
  };

  const handleCategoryTypeSelection = (categoryType) => {
    setSelectedCategoryType(categoryType);
    setFilteredSubcategories([]);
  };

  const handleRemoveImage = async (image, key, index) => {
    try {
      const response = await fetch(`${AdminUrl}/api/removeImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subcategory: subcatNameBackend, // Send subcategory information
          productId: key, // Send the ID of the product
          imageIndex: index, // Send the index of the image to remove
        }),
      });

      if (!response.ok) {
        // Handle the server response error
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("Remove image response:", responseData);

      // Assuming the backend response contains updated images
      if (responseData.status === 200) {
        // Update the state with the new images
        setUploadImages(responseData.updatedImages);
        message.success("Image Deleted Successfully");
        callVendorProducts();
      } else {
        // Handle the error case
        console.error("Error removing image:", responseData.message);
      }
    } catch (error) {
      console.error("Remove image error:", error);
    }
  };

  const steps = [
    // {
    //   title: `Category Type `,
    //   content: (
    //     <div>
    //       <div className="flex justify-center flex-col h-96 items-center">
    //         <h1 className="text-3xl font-bold tracking-[2px] mb-8 text-center">
    //           Choose Category Type
    //         </h1>
    //         <div className="grid grid-cols-2 gap-4">
    //           <div
    //             className={`cursor-pointer rounded-lg p-4 ${selectedCategoryType === "Products"
    //               ? "bg-indigo-500 text-white"
    //               : "bg-gray-100"
    //               }`}
    //             onClick={() => handleCategoryTypeSelection("Products")}
    //           >
    //             <div className="flex items-center justify-center mb-4">
    //               <CheckCircleIcon
    //                 className={`h-8 w-8 ${selectedCategoryType === "Products"
    //                   ? "text-white"
    //                   : "text-indigo-500"
    //                   }`}
    //               />
    //             </div>
    //             <div className="text-center text-lg font-semibold">
    //               Products
    //             </div>
    //           </div>
    //           <div
    //             className={`cursor-pointer rounded-lg p-4 ${selectedCategoryType === "Services"
    //               ? "bg-indigo-500 text-white"
    //               : "bg-gray-100"
    //               }`}
    //             onClick={() => handleCategoryTypeSelection("Services")}
    //           >
    //             <div className="flex items-center justify-center mb-4">
    //               <CheckCircleIcon
    //                 className={`h-8 w-8 ${selectedCategoryType === "Services"
    //                   ? "text-white"
    //                   : "text-indigo-500"
    //                   }`}
    //               />
    //             </div>
    //             <div className="text-center text-lg font-semibold">
    //               Services
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ),
    // },

    {
      title: `Select Category`,
      content: (
        <Form onFinish={onFinish} form={form}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <label htmlFor="category" className="mr-4 mb-5">
                Category:
              </label>
              <Form.Item
                name="category"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Please select the product category!",
                  },
                ]}
              >
                <Select
                  id="category"
                  placeholder="Select category"
                  className="w-full"
                  onChange={(category) => handleCategoryChange(category)}
                  disabled={catSubcatDisable}
                >
                  {categories
                    .filter(
                      (category) =>
                        category.category_type === selectedCategoryType
                    )
                    .map((category) => (
                      <Select.Option
                        key={category.category_id}
                        value={category.category_name}
                        category={category}
                      >
                        {category.category_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex justify-between items-center">
              <label htmlFor="subcategory" className="mr-4 mb-5">
                Subcategory:
              </label>
              <Form.Item
                name="subcategory"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "Please select the product subcategory!",
                  },
                ]}
              >
                <Select
                  id="subcategory"
                  placeholder="Select subcategory"
                  className="w-full"
                  onChange={(subcategory) =>
                    handleSubcategoryChange(subcategory)
                  }
                  value={selectedSubcategory || undefined}
                  disabled={catSubcatDisable}
                  allowClear // Add this prop to enable clearing the selected value
                >
                  {filteredSubcategories.map((subcategory) => (
                    <Select.Option
                      key={subcategory.subcategory_id}
                      value={subcategory.subcategory_name}
                    >
                      {subcategory.subcategory_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      ),
    },

    {
      title: "Product Details",
      content: <>{categoryFormMap[selectedCategory]?.[selectedSubcategory]}</>,
    },

    {
      title: "Upload Your Photos",
      content: (
        <>
          <ProductImage
            formValues={formValues}
            selectRowProduct={selectRowProduct}
            callVendorProducts={callVendorProducts}
            handlNext={handleNext}
          />
        </>
      ),
    },
    {
      title: "Uploaded Images",
      content: (
        <>
          {
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Uploaded Images</h3>
              <div className="grid grid-cols-3 gap-12 mt-4">
                {UploadImages?.map((image, index) => (
                  <div
                    key={image}
                    className="relative group overflow-hidden rounded-lg bg-gray-100 p-3 border border-gray-300 shadow-md transition-transform transform hover:scale-105  flex items-center justify-center"
                  >
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                        alt="Product Image"
                        className="object-cover"
                      />
                    </div>
                    <button
                      className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition"
                      onClick={() =>
                        handleRemoveImage(image, selectedKey, index)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-4 w-4 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          }
        </>
      ),
    },
  ];

  let columnsToShow = [];
  switch (subcatNameBackend) {
    case "MobileElectronics":
      columnsToShow = mobileElectronics;
      break;
    case "Laptop&Computers":
      columnsToShow = laptopComputersColumns;
      break;
    case "Audio&Headphones":
      columnsToShow = audioHeadphonesColumns;
      break;
    case "Camera&Photography":
      columnsToShow = cameraPhotographyColumns;
      break;
    // Add cases for other subcategories if needed
    default:
      columnsToShow = [];
  }

  const handleDeleteSelected = async () => {
    try {
      // Prepare an array of selected product IDs
      const selectedProductIds = selectedRowKeys;

      // Implement your API call here to delete selected products
      const response = await fetch(`${AdminUrl}/api/deleteProducts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds: selectedProductIds,
          subcatNameBackend,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        console.error("Backend error:", responseData.error);
        message.error("Error deleting products. " + responseData.error);
        return;
      }

      // Successful deletion
      // Update the products list by filtering out the deleted products
      if (subcatNameBackend === "MobileElectronics") {
        setProducts(
          products.filter(
            (product) => !selectedProductIds.includes(product.product_me_id)
          )
        );
      } else if (subcatNameBackend === "Laptop&Computers") {
        setProducts(
          products.filter(
            (product) => !selectedProductIds.includes(product.product_lc_id)
          )
        );
      } else if (subcatNameBackend === "Camera&Photography") {
        setProducts(
          products.filter(
            (product) => !selectedProductIds.includes(product.product_cp_id)
          )
        );
      } else if (subcatNameBackend === "Audio&Headphones") {
        setProducts(
          products.filter(
            (product) => !selectedProductIds.includes(product.product_ah_id)
          )
        );
      }

      // Clear the selectedRowKeys array
      setSelectedRowKeys([]);

      message.success("Selected products deleted successfully.");
    } catch (error) {
      console.error("Error deleting products:", error);
      message.error("Error deleting products. Please try again later.");
    }
  };

  const removeDuplicatesAndKeepLast = (data) => {
    // Create an object to store the last inserted item for each unique key
    const uniqueItems = {};

    // Iterate over the data array and keep only the last inserted item for each key
    data.forEach((item) => {
      uniqueItems[item.label] = item;
    });

    // Convert the unique items object back to an array
    const uniqueData = Object.values(uniqueItems);

    return uniqueData;
  };

  const handleVariantsData = (data, variants) => {

    // Convert the "variants" data to the desired format
    const formattedVariants = variants.map((variant) =>
      Object.values(variant).join("/")
    );

    // Remove duplicates and keep the last inserted data based on the "label" key
    const uniqueData = removeDuplicatesAndKeepLast(data);

    // Filter the uniqueData array based on the formatted variants
    const filteredData = uniqueData.filter((item) =>
      formattedVariants.includes(item.label)
    );

    console.log(filteredData);

    setFilteredVariantData(filteredData)
    setVariants(variants)
    // Now, you have filteredData with duplicates removed and only the last inserted data for each label
    // console.log("Received data from VariantsCrud (filtered):", filteredData);

    // You can update your state with filteredData here if needed
  };

  const handleVariantCancel = () => {
    setvariantAddModal(false)
  }

  const handleVariantOk = () => {
    console.log(FilteredVariantData);
    setvariantAddModal(false)
  }


  return vendorDatastate && vendorDatastate.length > 0 ? (
    <>
      {!vendorDatastate?.[0].email_verification_status ||
        !vendorDatastate?.[0].mobile_verification_status ||
        vendorDatastate?.[0].status === 1 ? (
        <AuthCheck vendorDatastate={vendorDatastate} />
      ) : (
        <>
          <h1 className="fashionfont text-[20px] text-[#000] font-semibold mb-1 font-sans">
            All Products ({products?.length})
          </h1>
          <nav
            aria-label="Breadcrumbs"
            className="order-first flex text-sm font-semibold sm:space-x-2"
          >
            <NavLink to={`${AdminUrl}`}>
              <a
                href=""
                className="hover:text-slate-600 hidden text-slate-500 sm:block"
              >
                Home
              </a>
            </NavLink>

            <div
              aria-hidden="true"
              className="hidden select-none text-slate-400 sm:block"
            >
              /
            </div>
            <p className="text-slate-500 hover:text-slate-600">
              Manage All Products{" "}
            </p>
          </nav>

          {
            <>
              <button
                onClick={handleCreate}
                className="bg-[#003032] hover:bg-[#003032]/80 text-white rounded-full py-2 px-5 font-semibold absolute right-10 top-24"
              >
                Create Product's
              </button>

              <div className="table-responsive overflow-hidden overflow-x-auto mt-4">
                <Tabs
                  defaultActiveKey="0"
                  activeKey={changeSubcatTabs}
                  onChange={async (selectedTabKey) => {
                    const selectedSubcategory =
                      subcategories[selectedTabKey]?.subcategory_name;

                    try {
                      // After pre-load, update the active tab
                      handleTabChangeforTable(
                        selectedTabKey,
                        selectedSubcategory
                      );
                    } catch (error) {
                      console.error("Error during preloading:", error);
                    }
                  }}
                  centered={subcategories.length <= 4} // Center the tabs when there are 4 or fewer tabs
                  scrollable={subcategories.length > 4} // Enable scrolling when there are more than 4 tabs
                  style={{ overflowX: "auto" }} // Add custom style to enable horizontal scrolling if needed
                >
                  {subcategories.map((subcat, index) => {
                    return (
                      <TabPane tab={`${subcat.subcategory_name}`} key={index}>
                        <Table
                          columns={columnsToShow}
                          dataSource={products}
                          pagination={false}
                          rowClassName={(record) =>
                            selectedRowKeys.includes(record.id)
                              ? "selected-row"
                              : ""
                          }
                          title={() => (
                            <>
                              <div className="flex items-center">
                                <Checkbox
                                  checked={
                                    selectedRowKeys.length === products.length
                                  }
                                  indeterminate={
                                    selectedRowKeys.length > 0 &&
                                    selectedRowKeys.length < products.length
                                  }
                                  onChange={handleSelectAllRows}
                                >
                                  Select All
                                </Checkbox>
                                <Button
                                  className="bg-red-500 flex items-center flex-row hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md"
                                  onClick={handleDeleteSelected}
                                  disabled={selectedRowKeys.length === 0}
                                >
                                  Delete ({selectedRowKeys?.length})
                                </Button>
                              </div>
                            </>
                          )}
                          className="w-full mt-10"
                        />
                      </TabPane>
                    );
                  })}
                </Tabs>
                {isLoading && (
                  <div style={overlayStyles}>
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
              </div>

              <Modal
                title={
                  selectedKey === null ? "Create Product's" : "Update Product's"
                }
                visible={modalVisible}
                onOk={handleFormSubmit}
                onCancel={() => {
                  setModalVisible(false);
                }}
                footer={null}
                maskClosable={false}
                okButtonProps={{
                  style: {
                    backgroundColor: "#1677FF",
                    color: "#fff",
                  },
                }}
                width="80vw"
              // style={{
              //   top: 0,
              //   right: 0,
              //   margin: 0,
              //   padding: 0,
              //   borderRadius: 0,
              //   boxShadow: "0 0 0 rgba(0, 0, 0, 0)", // Remove shadow
              // }}
              // bodyStyle={{
              //   margin: 0,
              //   padding: 0,
              //   height: "calc(100vh - 108px)",
              //   borderRadius: 0,
              //   boxShadow: "0 0 0 rgba(0, 0, 0, 0)", // Remove shadow
              // }}
              // maskStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              // className="rounded-none absolute p-0"
              >
                <Steps current={currentStep}>
                  {steps.map((step) => (
                    <Step key={step.title} title={step.title} />
                  ))}
                </Steps>
                <div className="mt-10 ">
                  <Form
                    name="product_adding_form"
                    onFinish={onFinish}
                    form={form}
                  >
                    {steps[currentStep].content}
                    {/* Add a button for the previous step */}
                    <div className="flex justify-center mt-10">
                      {currentStep > 0 && (
                        <Form.Item className="animate__animated animate__fadeInLeft animate__faster">
                          <Button
                            onClick={handlePrev}
                            className="transition-all items-center flex duration-200 ease-in-out bg-gray-300 hover:bg-gray-400 hover:text-gray-900 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transform hover:scale-110 hover:rotate-3"
                            icon={<IoIosArrowBack />}
                            style={{ zIndex: 1 }} // Add z-index to prioritize this button
                          >
                            Previous
                          </Button>
                        </Form.Item>
                      )}
                      {currentStep < steps.length - 1 && (
                        <Form.Item className="animate__animated animate__fadeInRight animate__faster">
                          <Button
                            onClick={handleNext}
                            className="transition-all items-center flex duration-200 ease-in-out ml-5 bg-blue-500 hover:bg-blue-600 hover:text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transform hover:scale-110 hover:rotate-3 text-white"
                            icon={<IoIosArrowForward className="text-white" />}
                            style={{ zIndex: 2 }} // Add higher z-index to prioritize this button
                          >
                            Next
                          </Button>
                        </Form.Item>
                      )}
                    </div>
                  </Form>
                </div>
              </Modal>

              <Modal
                title={SelectedUniqueId ? 'Edit Variants' : 'Add Variants'}
                visible={variantAddModal}
                width={800}
                confirmLoading={isLoading} // Set isLoading to true when you want to show loading
                onOk={() => {
                  if (FilteredVariantData.length === 0 && variantData.length === 0) {
                    // Prevent action when both arrays are empty
                    return;
                  }

                  // Set isLoading to true when "OK" button is clicked
                  setIsLoading(true);

                  // Simulate an async action (you can replace this with your actual logic)
                  setTimeout(() => {
                    // After your async action is complete, set isLoading back to false
                    setIsLoading(false);

                    // Handle "OK" action here
                    handleVariantOk();
                  }, 2000); // Replace 2000 with your desired loading duration
                }}
                onCancel={handleVariantCancel}
                okButtonProps={{
                  disabled: FilteredVariantData.length !== variantData.length || (FilteredVariantData.length === 0 && variantData.length === 0),
                  style: {
                    backgroundColor: "#1890ff",
                    color: "#fff",
                  },
                }}
                cancelButtonProps={{
                  style: {
                    backgroundColor: "#ccc",
                    color: "#333",
                  },
                }}
              >
                <VariantsCrud
                  vendorDatastate={vendorDatastate}
                  onSave={handleVariantsData}
                  handleVariantOk={handleVariantOk}
                  variantsValueArray={variantsValueArray}
                  FilteredVariantData={FilteredVariantData}
                  SelectedUniqueId={SelectedUniqueId}
                />
              </Modal>

              <Modal
                title="View Variants"
                visible={VariantModalShow}
                onCancel={() => setVariantModalShow(false)}
                width={1000} // Adjust the width as needed
                footer={[
                  <Button key="close" onClick={() => setVariantModalShow(false)}>
                    Close
                  </Button>,
                ]}
              >
                <Table
                  dataSource={RowVariants}
                  rowKey="variant_id"
                  pagination={false}
                  columns={[
                    {
                      title: 'Variant ID',
                      dataIndex: 'variant_id',
                    },
                    {
                      title: 'Product Unique ID',
                      dataIndex: 'product_uniqueid',
                    },
                    {
                      title: 'MRP',
                      dataIndex: 'variant_mrp',
                    },
                    {
                      title: 'Selling Price',
                      dataIndex: 'variant_sellingprice',
                    },
                    {
                      title: 'SKUID',
                      dataIndex: 'variant_skuid',
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'variant_quantity',
                    },
                    {
                      title: 'Label',
                      dataIndex: 'label',
                    },
                    {
                      title: 'Vendor ID',
                      dataIndex: 'vendori_id',
                    },
                    {
                      title: 'Variants Values',
                      dataIndex: 'variantsvalues',
                      render: (variantsvalues) => {
                        const values = JSON.parse(variantsvalues);
                        return (
                          <ul>
                            {Object.entries(values).map(([key, value]) => (
                              <li key={key}>
                                <strong>{key}:</strong> {value}
                              </li>
                            ))}
                          </ul>
                        );
                      },
                    },
                  ]}
                />
              </Modal>
            </>
          }
        </>
      )}
    </>
  ) : (
    ""
  );
};

export default VendorProducts;