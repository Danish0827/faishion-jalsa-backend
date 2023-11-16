import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminUrl } from '../constant';
import { Table, Button, Input } from 'antd';
import { AiOutlineSearch } from "react-icons/ai";

const Inventory = ({ adminLoginData }) => {
    const [Loading, setLoading] = useState(false);
    const [allProducts, setProducts] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

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
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        // Check if 'categories' and 'subcategories' are empty
        const categoriesEmpty = categories === null || categories.length === 0;
        const subcategoriesEmpty = subcategories.length === 0;

        // Fetch data only if both 'categories' and 'subcategories' are empty
        if (categoriesEmpty || subcategoriesEmpty) {
            categoryFunction();
            subcategoryFunction();
        }
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${AdminUrl}/api/getVendorProducts`);
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }

                const { products } = await response.json()

                // console.log(products)

                // group products by vendor_id and create products array
                const productsByVendor = {}
                products.forEach((product) => {
                    const { vendor_id, ...productData } = product
                    if (!productsByVendor[vendor_id]) {
                        productsByVendor[vendor_id] = {
                            vendor_id,
                            vendorname: product.vendorname,
                            products: []
                        }
                    }
                    productsByVendor[vendor_id].products.push(productData)
                })

                const modifiedData = Object.values(productsByVendor)
                // console.log(modifiedData)
                setProducts(modifiedData)
                setExpandedRowKeys(products.map((product) => product.vendor_id))
            } catch (error) {
                console.error("Error fetching products:", error)
            }
            setLoading(false)
        }
        fetchProducts();
    }, [])

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Button
                    type="button"
                    onClick={() => handleSearch(selectedKeys, confirm)}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <AiOutlineSearch style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });


    const columns = [
        {
            title: "Vendor Name",
            dataIndex: "vendorname",
            key: "vendorname",
            render: (vendorname, record) => {
                return (
                    <p className='font-bold text-xl text-black'>
                        {vendorname} (VID: {record.vendor_id})
                    </p>
                )
            },
            ...getColumnSearchProps("vendorname"),
        },
        {
            title: "Product Id",
            dataIndex: "product_id",
            key: "product_id",
            sorter: (a, b) => a.product_id - b.product_id,
            render: (_, record) => {
                return <p>{record.product_id}</p>;
            },
            ...getColumnSearchProps("product_id"),
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name",
            ...getColumnSearchProps("product_name"),
            render: (_, record) => {
                let description = record.description;
                let words = description?.split(" ");

                if (description?.length <= 10) {
                    return (
                        <>
                            <p className="font-semibold text-justify">
                                {record.product_name}
                            </p>
                            {/* <p className="text-sm text-gray-400 text-justify">
                        {description}
                      </p>
                      <p className="text-lg font-bold mt-2 text-slate-900">
                        <span className="text-gray-500 mr-1">
                          {record.currency_symbol}
                        </span>
                        {record.price}
                      </p> */}
                        </>
                    );
                } else {
                    let shortDescription = words?.slice(0, 10)?.join(" ");
                    return (
                        <>
                            <p className="font-semibold text-justify">
                                {record.product_name}
                            </p>
                            {/* <p className="text-sm text-gray-400 text-justify">
                        {shortDescription}...{" "}
                        <span
                          className="text-[12px] cursor-pointer text-blue-500"
                          type
                          onClick={() => openModal(description)}
                        >
                          Read More
                        </span>
                      </p>
                      <p className="text-lg font-bold mt-2 text-slate-900">
                        <span className="text-gray-500 mr-1">
                          {record.currency_symbol}
                        </span>
                        {record.price}
                      </p> */}
                        </>
                    );
                }
            },
        },
        {
            title: "Category",
            dataIndex: "category_id",
            key: "category_id",
            render: (_, record) => {
                const category = categories.find(item => item.category_id === record.category_id);
                const categoryName = category ? category.category_name : 'N/A';

                return (
                    <p className="text-md">{categoryName}</p>
                );
            }
        },
        {
            title: "Subcategory",
            dataIndex: "subcategory_id",
            key: "subcategory_id",
            render: (_, record) => {
                const subcategory = subcategories.find(item => item.subcategory_id === record.subcategory_id);
                const subcategoryName = subcategory ? subcategory.subcategory_name : 'N/A';
                return (
                    <p className="text-md">{subcategoryName}</p>
                );
            }
        },
        {
            title: "Stock Count",
            dataIndex: "quantity",
            key: "quantity",
            sorter: (a, b) => a.quantity - b.quantity,
            ...getColumnSearchProps("quantity"),
            render: (_, record) => {
                return <p className='font-semibold'>{record.quantity}</p>;
            }
        }
    ]

    return (
        <>
            {adminLoginData == null || adminLoginData?.length == 0 ? (
                ""
            ) : (
                <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="my-3">
                            <h1 className="text-4xl text-gray-700 font-bold mb-2">
                                Inventory Management
                            </h1>
                            <nav
                                aria-label="Breadcrumbs"
                                className="order-first flex text-sm font-semibold sm:space-x-2"
                            >
                                <NavLink to={`${AdminUrl}`}>
                                    <a
                                        href=""
                                        className="hover:text-slate-600 text-slate-500 sm:block"
                                    >
                                        Home
                                    </a>
                                </NavLink>

                                <div
                                    aria-hidden="true"
                                    className="select-none text-slate-400 sm:block"
                                >
                                    /
                                </div>
                                <p className="text-slate-500 hover:text-slate-600">
                                    Inventory Management
                                </p>
                            </nav>
                        </div>
                    </div>

                    {Loading ? (
                        "Table Loading"
                    ) : (
                        <>
                            <div className="overflow-x-auto md:overscroll-none border-2">
                                <Table
                                    className="bg-white overflow-y-auto"
                                    columns={columns.slice(0, -5)}
                                    dataSource={allProducts}
                                    expandable={{
                                        expandedRowKeys: expandedRowKeys,
                                        onExpand: (expanded, record) => {
                                            if (expanded) {
                                                setExpandedRowKeys((prevKeys) => [...prevKeys, record.vendor_id]);
                                            } else {
                                                setExpandedRowKeys((prevKeys) =>
                                                    prevKeys.filter((key) => key !== record.vendor_id)
                                                );
                                            }
                                        },
                                        expandedRowRender: (record) => (
                                            <Table
                                                columns={columns.slice(1)} // Exclude the Vendor Name column
                                                dataSource={record.products}
                                                rowKey="productId"
                                                pagination={false}
                                            />
                                        ),
                                    }}
                                    rowKey="vendor_id"
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default Inventory