import React, { useState, useEffect } from 'react'
import AuthCheck from "./components/AuthCheck";
import { AdminUrl } from '../Admin/constant';
import { NavLink } from 'react-router-dom';
import { Form, Steps, Select, Button, Modal, Input, InputNumber, Switch, Space, ColorPicker, Upload, Checkbox, Row, Col, Tooltip, Tabs, Table, message } from 'antd';
import { CheckCircleIcon } from "@heroicons/react/20/solid";
const { Step } = Steps;
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import "./components/Vendors.css";
import Swal from 'sweetalert2';
const { TabPane } = Tabs;
import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiEdit3,
    FiTrash2,
} from "react-icons/fi";

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

const VendorP = ({ vendorDatastate }) => {
    // vendor id
    const id = vendorDatastate?.[0].id;

    // for loading in tables
    const [isLoading, setIsLoading] = useState(false);

    // products
    const [products, setProducts] = useState([]);

    // tabs for subcategory
    const [changeSubcatTabs, setchangeSubcatTabs] = useState("0");

    // selected row keys
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // selected row product
    const [selectRowProduct, setselectRowProduct] = useState([]);

    // handle row select
    const handleRowSelect = (selectedId) => {
        if (selectedRowKeys.includes(selectedId)) {
            setSelectedRowKeys(selectedRowKeys.filter((id) => id !== selectedId));
        } else {
            setSelectedRowKeys([...selectedRowKeys, selectedId]);
        }
    };

    // select all row
    const handleSelectAllRows = () => {
        if (selectedRowKeys.length === products.length) {
            setSelectedRowKeys([]);
        } else {
            setSelectedRowKeys(products.map((product) => product.product_id));
        }
    };

    // delete selected products
    const handleDeleteSelected = async () => {
        try {
            // Prepare an array of selected product IDs
            const selectedProductIds = selectedRowKeys;

            // Implement your API call here to delete selected products
            const response = await fetch(`${AdminUrl}/api/deleteProductsByVendor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productIds: selectedProductIds,
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
            setProducts(
                products.filter(
                    (product) => !selectedProductIds.includes(product.product_id)
                )
            );

            // Clear the selectedRowKeys array
            setSelectedRowKeys([]);

            message.success("Selected products deleted successfully.");
        } catch (error) {
            console.error("Error deleting products:", error);
            message.error("Error deleting products. Please try again later.");
        }
    };

    // status map
    const statusMap = {
        0: "Pending",
        1: "Active",
        2: "Blocked",
        3: "Approved",
        4: "Rejected",
    };

    // handle update
    function handleUpdate(key, uid) {
        callVendorProducts();
        setSelectedKey(key);
        setSelectedUniqueId(uid)
        setCurrentStep(0);
        const selectedRow = products.find((item) => {
            return item.product_id === key;
        });
        // Format and replace `selectedRow.shipping_fee`
        selectedRow.shipping_fee = Object.keys(selectedRow.shipping_fee).map((key) => {
            return { [key]: selectedRow.shipping_fee[key] };
        });
        // console.log(selectedRow);
        setSelectedProductType(selectedRow?.product_type);
        setselectRowProduct(selectedRow);
        form.setFieldsValue(selectedRow);
        setSelectedCategoryId(selectedRow?.category_id);
        setSelectedSubcategoryId(selectedRow?.subcategory_id);
        // setSelectedCategory(selectedRow?.category);
        // setSelectedSubcategory(
        //   selectedRow?.subcategory?.replace(/[^\w\s]/g, "").replace(/\s/g, "")
        // );
        setSelectedCurrency(selectedRow?.currency_symbol);
        // setUploadImages(selectedRow?.images);
        setcatSubcatDisable(true);
        setModalVisible(true);
    }

    function handleDelete(product_id, title) {
        const confirmModal = Modal.confirm({
            title: `Confirm Delete `,
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete - ${title}?`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            async onOk() {
                try {
                    const response = await fetch(`${AdminUrl}/api/deleteProductByVendor`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ product_id }), // Send the subcatNameBackend in the request body
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: response.message || "Product deleted successfully",
                        });

                        setProducts(
                            products.filter((item) => item.product_id !== product_id)
                        );
                    } else {
                        // Handle error response
                        const errorData = await response.json();
                        // console.error("Error deleting product:", errorData.message);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: errorData.message || "Error deleting product",
                        });
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

    // columns to show in table
    let columnsToShow = [
        {
            title: "",
            key: "select_all",
            render: (_, record) => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.product_id)}
                    onChange={() => handleRowSelect(record.product_id)}
                />
            )
        },
        {
            title: "Id",
            dataIndex: "product_id",
            key: "product_id",
            sorter: (a, b) => parseFloat(a.product_id) - parseFloat(b.product_id),
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            render: (product_name) => (
                <Tooltip title={product_name}>
                    <div
                        style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {product_name}
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
            sorter: (a, b) => a.brand.localeCompare(b.brand),
            render: (brand) => <Tooltip title={brand}>{brand}</Tooltip>,
        },
        {
            title: "Category",
            dataIndex: "category_id",
            key: "category_id",
            render: (category_id) => {
                const category = categories.find((cat) => cat.category_id === category_id);
                const categoryName = category ? category.category_name : 'Unknown Category';
                return (
                    <Tooltip title={categoryName}>
                        <div
                            style={{
                                maxWidth: "150px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {categoryName}
                        </div>
                    </Tooltip>
                );
            },
            // render: (category_id) => (
            //     <Tooltip title={category_id}>
            //         <div
            //             style={{
            //                 maxWidth: "150px",
            //                 overflow: "hidden",
            //                 textOverflow: "ellipsis",
            //                 whiteSpace: "nowrap",
            //             }}
            //         >
            //             {category_id}
            //         </div>
            //     </Tooltip>
            // ),
        },
        {
            title: "Status",
            dataIndex: "product_status",
            key: "product_status",
            render: (product_status, record) => {
                let icon, color;
                switch (product_status) {
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
                        <span className="ml-1">{statusMap[product_status]}</span>
                    </span>
                );

                if (product_status === 4 && record.rejection_reason) {
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
                if (record.product_status === 4) {
                    return <span className="text-red-500">Rejected</span>;
                }

                return (
                    <Space size="middle" className="flex">
                        <FiEdit3
                            onClick={() => handleUpdate(record.product_id)}
                            className="text-white w-8 h-8 p-2 rounded-full bg-green-500 border-none hover:bg-green-600 hover:text-white"
                        />
                        <FiTrash2
                            onClick={() =>
                                handleDelete(record.product_id, record.product_name)
                            }
                            className="text-white w-8 h-8 p-2 rounded-full bg-red-500 border-none hover:bg-red-600 hover:text-white"
                        />
                    </Space>
                );
            },
        },
    ];

    const handleTabChangeforTable = (key, subcatname, subcatid) => {
        setIsLoading(true);
        setchangeSubcatTabs(key);
        setSelectedRowKeys([]);
        setsubcatNameBackend(subcatname?.replace(/[\s'"]/g, ""));
        setSubcategory(subcatid)
        setTimeout(() => {
            setIsLoading(false); // Hide loader after pre-loading is done
        }, 2000);
    };

    // form
    const [form] = Form.useForm();

    // location
    const [locationData, setLocationData] = useState({
        city: "",
        state: "",
        country: "",
    });

    // current step of form
    const [currentStep, setCurrentStep] = useState(0);

    // create product form modal visibility
    const [modalVisible, setModalVisible] = useState(false);

    // current product id or key
    const [selectedKey, setSelectedKey] = useState(null);

    // selected uniqueid
    const [SelectedUniqueId, setSelectedUniqueId] = useState(null);

    // product type
    const [selectedProductType, setSelectedProductType] = useState("simple");

    // categories
    const [categories, setCategories] = useState([]);

    // subcategories
    const [subcategories, setSubcategories] = useState([]);

    // selected category id 
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // selected category id 
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

    // filtered subcategories
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);

    // selected subcategory 
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    // for disabling the category and subcategory <Select></Select>
    const [catSubcatDisable, setcatSubcatDisable] = useState(false);

    // currency
    const [selectedCurrency, setSelectedCurrency] = useState("USD");

    const [subcatNameBackend, setsubcatNameBackend] = useState(null);
    const [subcategory, setSubcategory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    // featured product
    const [isFeatured, setIsFeatured] = useState(false)

    // form values
    const [formValues, setFormValues] = useState([]);

    // currency options
    const currencyOptions = {
        USD: "$", // United States Dollar
        KES: "KSh", // Kenyan Shilling
        ETB: "Br", // Ethiopian Birr
        EUR: "€", // Euro
        AED: "د.إ", // United Arab Emirates Dirham
    };

    const currencyOptionsList = Object.keys(currencyOptions);

    // input for price with currency as prefix
    const NumberInputWithPrefix = ({
        prefixOptions,
        currencyOptions,
        ...rest
    }) => {
        const handleCurrencyChange = (currency) => {
            setSelectedCurrency(currency);
        };
        return (
            <InputNumber
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
                name='currency_symbol'
                min={0}
            />
        );
    };

    // get all vendor products
    const callVendorProducts = async () => {
        try {
            const response = await fetch(`${AdminUrl}/api/getProductsBySubcategory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subcategory }),
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                const sortedProducts = data.products.sort(
                    (a, b) => a.product_id - b.product_id
                );
                const products = sortedProducts.filter((item) => item.vendor_id == id);
                console.log(products)
                setProducts(products);
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
        callVendorProducts();
    }, [subcatNameBackend, subcategory]);

    // admin generated tags for category and subcategory
    const [tags, setTags] = useState([]);

    // get all admin tags
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${AdminUrl}/api/GetAdminTags`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Assuming the backend responds with JSON data containing attributes
                const responseData = await response.json();
                const transformedData = responseData.tags.map((tag) => ({
                    tag_id: tag.tag_id,
                    tag_name: tag.tag_name,
                    tag_values: tag.tag_values,
                    category_id: tag.category_id,
                    subcategory_id: tag.subcategory_id
                }));

                // Transform the data and set it in your component's state
                setTags(transformedData);
            } catch (error) {
                console.error("Error:", error)
            }
        }
        fetchData()
    }, [])

    // handle product type change
    const handleProductTypeSelection = (productType) => {
        setSelectedProductType(productType);
    }

    // function for getting all categories
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

    // function for getting all subcategories
    const subcategoryFunction = async () => {
        try {
            // Your API call to fetch subcategories data
            const response = await fetch(`${AdminUrl}/api/getAllSubcategories`);
            const data = await response.json();
            setSubcategories(data);
            setsubcatNameBackend(data[0].subcategory_name.replace(/[\s'"]/g, ""));
            setSubcategory(data[0].subcategory_id);
        } catch (err) {
            console.log(err);
        }
    };

    // handle category change
    const handleCategoryChange = (categoryId) => {
        const selectedCategory = categories.find(
            (category) => category.category_id === categoryId
        );

        setSelectedCategoryId(categoryId);
        setSelectedSubcategory(null);
        setSelectedCategory(
            selectedCategory
                ? selectedCategory.category_name.replace(/[\s'"]/g, "")
                : ""
        );
        setFilteredSubcategories([]);
        document.getElementById("subcategory_id").value = "";
    };

    // handle subcategory change
    const handleSubcategoryChange = (subcategoryId) => {
        // Find the selected subcategory object from the filteredSubcategories array
        const selectedSubcategorys = filteredSubcategories.find(
            (subcategory) => subcategory.subcategory_id === subcategoryId
        );
        setSelectedSubcategoryId(subcategoryId)
        // Set the subcategory name in state
        setSelectedSubcategory(
            selectedSubcategorys
                ? selectedSubcategorys.subcategory_name
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s/g, "")
                : ""
        );
    };

    // console.log(selectedCategoryId)
    // console.log(selectedSubcategoryId)
    // console.log(tags)

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
        // }, [categories, subcategories]);
    }, [])

    // useEffect to filter subcategories based on the selected category ID
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
    }, [selectedCategoryId]);

    // layout for form fields
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 12,
        },
    };

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    // onFinish
    const onFinish = async (values) => {
        try {
            // console.log('before formatting', values)
            const vendor_id = vendorDatastate[0].id;

            // Update the status value to 0
            values.product_status = 0;

            const initialData = values?.shipping_fee;
            if (Array.isArray(initialData)) {
                values.shipping_fee = {}; // Initialize it as an empty object
                initialData.forEach((item) => {
                    const key = Object.keys(item)[0];
                    const value = item[key];
                    values.shipping_fee[key] = value;
                });
            }
            // console.log('after formatting', values)

            // Check if an object with the same name already exists
            const existingIndex = formValues.findIndex(
                (item) => item.name === values.name
            );

            // console.log(existingIndex)
            const updatedFormValues = [...formValues]

            if (existingIndex !== -1) {
                // Update the value if the object already exists
                updatedFormValues[existingIndex] = {
                    ...updatedFormValues[existingIndex],
                    ...values,
                    currency_symbol: selectedCurrency,
                    vendor_id,
                    // product_id: selectedKey,
                    // locationData,
                    product_type: selectedProductType,
                    // SelectedUniqueId,
                    //   FilteredVariantData
                };
            } else {
                // Add a new object to the array if it doesn't exist
                updatedFormValues.push({
                    ...values,
                    currency_symbol: selectedCurrency,
                    vendor_id,
                    // product_id: selectedKey,
                    // locationData,
                    product_type: selectedProductType,
                    // SelectedUniqueId,
                    //   FilteredVariantData
                });
            }

            setFormValues(updatedFormValues)
            console.log(updatedFormValues)
            const formData = {
                productData: updatedFormValues[0],
            };

            if (currentStep === 3) {
                if (selectedKey == null) {
                    // Send the data to the backend for updating
                    try {
                        const response = await fetch(`${AdminUrl}/api/addProductByVendor`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(formData),
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
                            console.log(`product added`, responseData);
                            const productData = responseData.data
                            setProducts([...products, { product_id: products.length + 1, ...values }])
                            setSelectedKey(productData.product_id)

                            // Find the index of the subcategory in the subcategories array
                            const activeTabIndex = subcategories.findIndex(
                                (subcat) => subcat.subcategory_id === productData.subcategory_id
                            );

                            // find the subcategory_name
                            const subcategoryName = subcategories.find((subcat) => subcat.subcategory_id === productData.subcategory_id)

                            // Update the changeSubcatTabs state to make the desired tab active
                            setchangeSubcatTabs(activeTabIndex.toString());
                            handleTabChangeforTable(
                                activeTabIndex.toString(),
                                subcategoryName.subcategory_name,
                                productData.subcategory_id
                            );

                            // Show a success alert using sweetalert2
                            Swal.fire({
                                icon: "success",
                                title: "Success",
                                text: responseData.message || "Product added successfully",
                            });
                        }
                    } catch (error) {
                        console.error("Error during form submission:", error);
                        Swal.fire({
                            icon: "error",
                            title: "error",
                            text: error,
                        });
                    }
                }
                else {
                    // Send the data to the backend for adding a new record
                    const response = await fetch(`${AdminUrl}/api/updateProductByVendor`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ productData: updatedFormValues[0], productId: selectedKey }),
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
                        console.log(`Product updated`, responseData.data)
                        setProducts(products.map((item) =>
                            (subcategory === responseData.data.subcategory_id &&
                                item.product_id === selectedKey) ? { ...item, ...values } : item))

                        setModalVisible(false);
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message || "Product updated successfully",
                        });
                    } else {
                        // Handle other responses (e.g., show error message, revert state, etc.)
                        // ...
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error)
        }
    };

    const suffixSelector = (
        <Form.Item name="weight_unit" noStyle initialValue="g">
            <Select
                style={{
                    width: 70,
                }}
                value="g"
            >
                <Option value="g">g</Option>
                <Option value="kg">kg</Option>
            </Select>
        </Form.Item>
    );

    // steps for form
    const steps = [
        {
            title: `Product Type`,
            content: (
                <div>
                    <div className="flex justify-center flex-col h-96 items-center">
                        <h1 className="text-3xl font-bold tracking-[2px] mb-8 text-center">
                            Choose Product Type
                        </h1>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`cursor-pointer rounded-lg p-4 ${selectedProductType === "simple"
                                    ? "bg-indigo-500 text-white"
                                    : "bg-gray-100"
                                    }`}
                                onClick={() => handleProductTypeSelection("simple")}
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <CheckCircleIcon
                                        className={`h-8 w-8 ${selectedProductType === "simple"
                                            ? "text-white"
                                            : "text-indigo-500"
                                            }`}
                                    />
                                </div>
                                <div className="text-center text-lg font-semibold">
                                    Simple
                                </div>
                            </div>
                            <div
                                className={`cursor-pointer rounded-lg p-4 ${selectedProductType === "variant"
                                    ? "bg-indigo-500 text-white"
                                    : "bg-gray-100"
                                    }`}
                                onClick={() => handleProductTypeSelection("variant")}
                            >
                                <div className="flex items-center justify-center mb-4">
                                    <CheckCircleIcon
                                        className={`h-8 w-8 ${selectedProductType === "variant"
                                            ? "text-white"
                                            : "text-indigo-500"
                                            }`}
                                    />
                                </div>
                                <div className="text-center text-lg font-semibold">
                                    Variant
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: `Select Category & Subcategory`,
            content: (
                <Form
                    onFinish={onFinish}
                    form={form}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center">
                            <label htmlFor="category" className="mr-4 mb-5">
                                Category:
                            </label>
                            <Form.Item
                                name="category_id"
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
                                                category.category_type === "Products"
                                        )
                                        .map((category) => (
                                            <Select.Option
                                                key={category.category_id}
                                                value={category.category_id}
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
                                name="subcategory_id"
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
                                            value={subcategory.subcategory_id}
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
            content: (
                <Form {...layout} onFinish={onFinish} form={form}>
                    <div className="grid grid-cols-1 gap-4">
                        <Form.Item label="Brand" name="brand" className='w-full'
                            rules={[
                                { required: true, message: "Please enter the brand name" }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Product Name" name="product_name" className='w-full'
                            rules={[
                                { required: true, message: "Please enter the product name" }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Product Description" name="description" className='w-full'
                            rules={[
                                { required: true, message: "Please enter the product description" }
                            ]}>
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
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the discount!",
                                },
                            ]}
                        >
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the quantity!",
                                },
                            ]}
                        >
                            <InputNumber min={0} />
                        </Form.Item>
                        <Form.Item
                            label="Weight"
                            name="weight"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the weight!",
                                },
                            ]}>
                            <InputNumber min={0} addonAfter={suffixSelector} />
                        </Form.Item>

                        <Form.List name="shipping_fee"
                            initialValue={[{}, {}, {}]}
                            rules={[
                                {
                                    validator: async (_, names) => {
                                        if (!names || names.length < 3) {
                                            return Promise.reject(new Error('At least 3'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                // marginBottom: 5,
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, key === 0 ? 'zonal' : key === 1 ? "regional" : key === 2 ? "international" : '']}
                                                label={key === 0 ? `Zonal Shipping Fee` : key === 1 ? `Regional Shipping Fee` : key === 2 ? `International Shipping Fee` : `Shipping Fee`}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: key === 0 ? `Zonal Shipping Fee is required!` : key === 1 ? `Regional Shipping Fee is required!` : key === 2 ? `International Shipping Fee is required!` : `Shipping Fee is required!`
                                                    },
                                                ]}
                                            >
                                                <InputNumber placeholder={key === 0 ? 'Zonal Shipping Fee' : key === 1 ? 'Regional Shipping Fee' : key === 2 ? 'International Shipping Fee' : 'Shipping Fee'} />
                                            </Form.Item>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>

                        <Form.Item label="Featured Product" name="featured">
                            <Switch
                                checked={isFeatured}
                                onChange={(value) => {
                                    // Update the state when the Switch is changed
                                    setIsFeatured(value);
                                }}
                                className='bg-gray-500'
                            />
                        </Form.Item>
                    </div>
                </Form>
            )
        },
        {
            title: "Other Details",
            content: (
                <Form onFinish={onFinish} form={form} style={{ maxWidth: '100%' }}>
                    <div className="grid grid-cols-1 gap-4 justify-items-center">
                        {selectedProductType === "variant" ? (
                            <>
                                <h1 className='text-md uppercase font-bold'>Variant Product</h1>
                                <Form.List name="product_images"
                                    initialValue={[{}]}
                                    rules={[
                                        {
                                            validator: async (_, names) => {
                                                if (!names || names.length < 1) {
                                                    return Promise.reject(new Error('At least 1 variant'));
                                                }
                                            },
                                        },
                                    ]}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space
                                                    key={key}
                                                    style={{
                                                        display: 'flex',
                                                        // marginBottom: 5,
                                                    }}
                                                    align="baseline"
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'color']}
                                                        label={`Color ${key + 1}`}
                                                        getValueFromEvent={(e) => e.toHexString()}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Color is required!',
                                                            },
                                                        ]}
                                                    >
                                                        <ColorPicker />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'price']}
                                                        label={`Price ${key + 1}`}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Missing price',
                                                            },
                                                        ]}
                                                    >
                                                        <InputNumber placeholder="Price" />
                                                    </Form.Item>
                                                    <Form.Item name={[name, 'images']} label={`Images ${key + 1}`} {...restField}
                                                    // rules={[
                                                    //     {
                                                    //         required: true,
                                                    //         message: 'Image(s) required',
                                                    //     },
                                                    // ]}
                                                    >
                                                        <Form.Item valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                                                            <Upload.Dragger name="files" multiple>
                                                                <p className="ant-upload-drag-icon">
                                                                    <InboxOutlined />
                                                                </p>
                                                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                                            </Upload.Dragger>
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item name={[name, 'sizes']} {...restField} label={`Sizes ${key + 1}`}>
                                                        <Checkbox.Group>
                                                            <Row>
                                                                <Col span={8}>
                                                                    <Checkbox
                                                                        value="XS"
                                                                        style={{
                                                                            lineHeight: '32px',
                                                                        }}
                                                                    >
                                                                        XS
                                                                    </Checkbox>
                                                                </Col>

                                                                <Col span={8}>
                                                                    <Checkbox
                                                                        value="S"
                                                                        style={{
                                                                            lineHeight: '32px',
                                                                        }}
                                                                    >
                                                                        S
                                                                    </Checkbox>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <Checkbox
                                                                        value="M"
                                                                        style={{
                                                                            lineHeight: '32px',
                                                                        }}
                                                                    >
                                                                        M
                                                                    </Checkbox>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <Checkbox
                                                                        value="L"
                                                                        style={{
                                                                            lineHeight: '32px',
                                                                        }}
                                                                    >
                                                                        L
                                                                    </Checkbox>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <Checkbox
                                                                        value="XL"
                                                                        style={{
                                                                            lineHeight: '32px',
                                                                        }}
                                                                    >
                                                                        XL
                                                                    </Checkbox>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <Checkbox
                                                                        value="XXL"
                                                                        style={{
                                                                            lineHeight: '32px',
                                                                        }}
                                                                    >
                                                                        XXL
                                                                    </Checkbox>
                                                                </Col>
                                                            </Row>
                                                        </Checkbox.Group>
                                                    </Form.Item>

                                                    {fields.length > 1 && ( // Render only if there's more than one field
                                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                                    )}
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Add Variant Color
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                                {/* <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item> */}
                            </>
                        ) : (<>
                            <h1 className='text-md uppercase font-bold'>Simple Product</h1>
                            <Form.List name="product_images"
                                initialValue={[{}]}
                                rules={[
                                    {
                                        validator: async (_, names) => {
                                            if (!names || names.length < 1) {
                                                return Promise.reject(new Error('At least 1 variant'));
                                            }
                                        },
                                    },
                                ]}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    // marginBottom: 5,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'color']}
                                                    label={`color ${key + 1}`}
                                                    getValueFromEvent={(e) => e.toHexString()}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Color is required!',
                                                        },
                                                    ]}
                                                >
                                                    <ColorPicker />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    label={`Price ${key + 1}`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Missing price',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber placeholder="Price" />
                                                </Form.Item>
                                                <Form.Item name={[name, 'images']} label={`Images ${key + 1}`} {...restField}
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: 'Image(s) required',
                                                //     },
                                                // ]}
                                                >
                                                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                                                        <Upload.Dragger name="files" multiple>
                                                            <p className="ant-upload-drag-icon">
                                                                <InboxOutlined />
                                                            </p>
                                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                            <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                                        </Upload.Dragger>
                                                    </Form.Item>
                                                </Form.Item>
                                                <Form.Item name={[name, 'sizes']} {...restField} label={`Sizes ${key + 1}`}>
                                                    <Checkbox.Group>
                                                        <Row>
                                                            <Col span={8}>
                                                                <Checkbox
                                                                    value="XS"
                                                                    style={{
                                                                        lineHeight: '32px',
                                                                    }}
                                                                >
                                                                    XS
                                                                </Checkbox>
                                                            </Col>

                                                            <Col span={8}>
                                                                <Checkbox
                                                                    value="S"
                                                                    style={{
                                                                        lineHeight: '32px',
                                                                    }}
                                                                >
                                                                    S
                                                                </Checkbox>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Checkbox
                                                                    value="M"
                                                                    style={{
                                                                        lineHeight: '32px',
                                                                    }}
                                                                >
                                                                    M
                                                                </Checkbox>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Checkbox
                                                                    value="L"
                                                                    style={{
                                                                        lineHeight: '32px',
                                                                    }}
                                                                >
                                                                    L
                                                                </Checkbox>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Checkbox
                                                                    value="XL"
                                                                    style={{
                                                                        lineHeight: '32px',
                                                                    }}
                                                                >
                                                                    XL
                                                                </Checkbox>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Checkbox
                                                                    value="XXL"
                                                                    style={{
                                                                        lineHeight: '32px',
                                                                    }}
                                                                >
                                                                    XXL
                                                                </Checkbox>
                                                            </Col>
                                                        </Row>
                                                    </Checkbox.Group>
                                                </Form.Item>
                                                {fields.length > 1 && ( // Render only if there's more than one field
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                )}
                                            </Space>
                                        ))}
                                        {fields.length === 0 && (
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Add Variant Color
                                                </Button>
                                            </Form.Item>
                                        )}
                                    </>
                                )}
                            </Form.List>
                            {/* <Form.Item>
                                    <Button className="bg-black" type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item> */}
                        </>)}
                        <h1 className='text-md uppercase font-bold'>Add Ons</h1>
                        <Form.List name="add_ons"
                            initialValue={[{}]}
                        // rules={[
                        //     {
                        //         validator: async (_, names) => {
                        //             if (!names || names.length < 1) {
                        //                 return Promise.reject(new Error('At least 1 variant'));
                        //             }
                        //         },
                        //     },
                        // ]}
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                // marginBottom: 5,
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'title']}
                                                label={`Title ${key + 1}`}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Title is required!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder='Title' />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'price']}
                                                label={`Price ${key + 1}`}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Missing price',
                                                    },
                                                ]}
                                            >
                                                <InputNumber placeholder="Price" />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add New Add On
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <h1 className='text-md uppercase font-bold'>Product Care</h1>
                        <Form.List name="product_care" initialValue={[""]}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                // marginBottom: 5
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={name}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Product Care is required!',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder='Product Care' />
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add New Product Care
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>


                        <Form.Item name="size_chart" label="Size Chart">
                            <Form.Item valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                                <Upload.Dragger name="files" multiple>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Form.Item>

                        {tags.length > 0 ? (
                            <Form.Item
                                name="product_tags"
                                style={{ minWidth: '50%' }}
                                label="Select tags"
                                rules={[
                                    {
                                        // required: true,
                                        // message: 'Please select matching tags for product!',
                                        type: 'array',
                                    },
                                ]}
                            >
                                <Select mode="multiple" placeholder="Please select tags">
                                    {tags.map((tag) => {
                                        if (
                                            tag.category_id === selectedCategoryId &&
                                            tag.subcategory_id === selectedSubcategoryId
                                        ) {
                                            return tag.tag_values.map((value) => (
                                                <Option key={value} value={value}>
                                                    {`${tag.tag_name} / ${value}`}
                                                </Option>
                                            ));
                                        }
                                        return null;
                                    })}
                                </Select>
                            </Form.Item>
                        ) : (
                            <p>Loading tags...</p>
                        )}
                    </div>
                </Form>
            )
        },
    ];

    const showError = (title, text) => {
        Swal.fire({
            icon: "error",
            title,
            text,
        });
    };

    // handle previous button click to go to back to previous step
    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // handle next button click to go to next step and validate the foem fields
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
                }

                setCurrentStep(currentStep + 1);
                form.submit();
            }
            console.log(values)
        } catch (error) {
            // Handle validation errors if any
            console.error("Validation Error:", error);
        }
    };


    // handle form submit 
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

    // function to fetch user locatuon and update state
    const getUserLocation = async () => {
        try {
            const response = await fetch("http://ip-api.com/json");
            const data = await response.json()
            if (data.status === "success") {
                const city = data.city || "";
                const state = data.state || "";
                const country = data.country || "";

                setLocationData({ city, state, country })
                form.setFieldsValue({ city, state, country, countryOfOrigin: country })
            } else {
                console.log("Location data not found")
            }
        } catch (error) {
            console.error("Error getting user location:", error.message);
        }
    }

    // function to handle create product
    function handleCreate() {
        form.resetFields();
        getUserLocation();
        setCurrentStep(0);
        form.setFieldsValue({ locationData });
        form.setFieldsValue({ countryoforigin: locationData.country });
        setModalVisible(true);
        setcatSubcatDisable(false);
        setSelectedKey(null);
        setSelectedCategoryId(null);
        setSelectedCategory("");
        setSelectedSubcategory("");
        setSelectedCurrency("USD");
        setSelectedProductType("simple")
        setSelectedUniqueId(null)
    }

    return vendorDatastate ? (
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
                        className="order-first flex text-sm font-semibold sm:space-x-2 "
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

                    {/* Create button */}
                    <button
                        onClick={handleCreate}
                        className="bg-[#003032] hover:bg-[#003032]/80 text-white rounded-full py-2 px-5 font-semibold absolute right-10 top-24"
                    >
                        Create Product's
                    </button>

                    {/* Create or update modal */}
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
                                    {currentStep < steps.length - 1 ? (
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
                                    ) : (
                                        <Form.Item className="animate__animated animate__fadeInRight animate__faster">
                                            <Button
                                                onClick={handleNext}
                                                htmlType='submit'
                                                className="transition-all items-center flex duration-200 ease-in-out ml-5 bg-blue-500 hover:bg-blue-600 hover:text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transform hover:scale-110 hover:rotate-3 text-white"
                                                icon={<IoIosArrowForward className="text-white" />}
                                                style={{ zIndex: 2 }} // Add higher z-index to prioritize this button
                                            >
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    )
                                    }
                                </div>
                            </Form>
                        </div>
                    </Modal>

                    <div className="table-responsive overflow-hidden overflow-x-auto mt-4">
                        <Tabs
                            defaultActiveKey="0"
                            activeKey={changeSubcatTabs}
                            onChange={async (selectedTabKey) => {
                                const selectedSubcategory =
                                    subcategories[selectedTabKey]?.subcategory_name;
                                const selectedsubcatId = subcategories[selectedTabKey]?.subcategory_id;

                                try {
                                    // After pre-load, update the active tab
                                    handleTabChangeforTable(
                                        selectedTabKey,
                                        selectedSubcategory,
                                        selectedsubcatId
                                    );
                                } catch (error) {
                                    console.error("Error during preloading:", error);
                                }
                            }}
                            centered={subcategories.length <= 4} // Center the tabs when there are 4 or fewer tabs
                            scrollable={subcategories.length > 4} // Enable scrolling when there are more than 4 tabs
                            style={{ overflowX: "auto", }} // Add custom style to enable horizontal scrolling if needed
                        >
                            {subcategories.map((subcat, index) => {
                                return (
                                    <TabPane tab={`${subcat.subcategory_name}`} key={index} className='bg-white rounded-lg'>
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
                                                            className="bg-red-500 flex items-center flex-row hover:bg-red-600 hover:text-white text-white px-4 py-2 rounded-full shadow-md"
                                                            onClick={handleDeleteSelected}
                                                            disabled={selectedRowKeys.length === 0}
                                                        >
                                                            Delete ({selectedRowKeys?.length})
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                            className="w-full mt-10 overflow-x-scroll"
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
                </>
            )}
        </>
    ) : (<></>)
}

export default VendorP