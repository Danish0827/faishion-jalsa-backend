import React, { useEffect, useState } from 'react'
import { AdminUrl } from '../../constant'
import { FaRegCaretSquareLeft } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { Button, Image, Modal, Space, Table, Badge } from 'antd'
import { RiEyeLine } from 'react-icons/ri'

const AbandonCart = ({ adminLoginData }) => {
    const [Loading, setLoading] = useState(false)
    const [carts, setCarts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cartDetails, setCartDetails] = useState([]);

    const getAbandonCarts = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${AdminUrl}/api/carts/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data);
                setCarts(data);
            } else {
                console.error("Error getting carts data:", response.statusText)
            }
        } catch (error) {
            console.error("Error getting carts data:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getAbandonCarts()
    }, [])

    const viewCartDetails = (customer_id) => {
        setCartDetails(carts.find((cart) => cart.customer_id === customer_id))
        setModalVisible(true)
    }

    console.log(cartDetails)

    const handleCancel = () => {
        setModalVisible(false)
        setCartDetails([])
    }

    const columns = [
        {
            title: 'Customer ID',
            dataIndex: "customer_id",
            key: "customer_id",
            sorter: (a, b) => a.customer_id - b.customer_id
        },
        {
            title: 'Customer Name',
            dataIndex: "customer_name",
            key: "customer_name"
        },
        {
            title: "Customer Email",
            dataIndex: "customer_email",
            key: "customer_email"
        },
        {
            title: "Customer Phone",
            dataIndex: "customer_phone",
            key: "customer_phone"
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="middle" className="flex">
                    <Badge sixe="small" count={record.carts.length}>
                        <RiEyeLine
                            onClick={() => viewCartDetails(record.customer_id)}
                            className="text-white w-8 h-8 p-2 rounded-full bg-[#081831] border-none hover:bg-[#337ab7] hover:text-white"
                        />
                    </Badge>
                </Space>
            )
        }
    ]

    const cartcolumns = [
        {
            title: "Product ID",
            dataIndex: "product_id",
            key: "product_id",
            sorter: (a, b) => a.product_id - b.product_id
        },
        {
            title: "Product Name",
            dataIndex: "product_name",
            key: "product_name"
        },
        {
            title: "Brand",
            dataIndex: "brand",
            key: "brand"
        },
        {
            title: "Category",
            dataIndex: "category_name",
            key: "category_name"
        },
        {
            title: "Subcategory",
            dataIndex: "subcategory_name",
            key: "subcategory_name"
        },
        {
            title: "Product Images",
            dataIndex: "product_images",
            key: "product_images",
            width: '100%',
            render: (product_images, record) => (
                <div>
                    {
                        product_images ? (product_images
                            .filter((img) => img.color === record.product_color)
                            .map((img, index) => (
                                <div key={index} className='grid grid-cols-2 gap-2'>
                                    {img.images.map((image, imgIndex) => (
                                        <Image
                                            key={imgIndex}
                                            src={image}
                                            alt={`Image ${index}-${imgIndex}`}
                                            style={{ width: "50px", height: "50px", marginRight: "5px" }}
                                        />
                                    ))}
                                </div>
                            ))
                        ) : (
                            <span>No Images Available</span>
                        )
                    }
                </div>
            ),
        },
        {
            title: "Add-Ons",
            dataIndex: "add_ons",
            key: "add_ons",
            render: (add_ons) => (
                <ul style={{ listStyleType: "disc" }}>
                    {add_ons ? (add_ons.map((addon, index) => (
                        <li key={index}>{addon}</li>
                    ))) : (<span></span>)}
                </ul>
            ),
        },
        {
            title: "Size",
            dataIndex: "product_size",
            key: "product_size",
        },
        {
            title: "Color",
            dataIndex: "product_color",
            key: "product_color",
        },
        {
            title: "Product Price",
            dataIndex: "price",
            key: "price",
            render: (price, record) => {
                if (record.product_color) {
                    const matchingImage = record.product_images.find(
                        (img) => img.color === record.product_color
                    );
                    if (matchingImage) {
                        return matchingImage.price;
                    }
                }
                return "0"; // Handle the case when no matching color is found or no color is selected
            },
            sorter: (a, b) => {
                const aMatchingImage = a.product_images.find((img) => img.color === a.product_color);
                const bMatchingImage = b.product_images.find((img) => img.color === b.product_color);

                if (aMatchingImage && bMatchingImage) {
                    return aMatchingImage.price - bMatchingImage.price;
                } else {
                    return 0; // Handle the case when no matching color is found
                }
            },
        },
        {
            title: "AddOn Price",
            dataIndex: "add_ons",
            key: "add_ons",
            render: (add_ons, record) => {
                if (!add_ons || !Array.isArray(add_ons)) {
                    return "-";
                }

                let addOnPrice = 0;

                add_ons.forEach((addOn) => {
                    const matchingAddOn = record.product_add_ons.find((item) => item.title === addOn);
                    if (matchingAddOn) {
                        addOnPrice += matchingAddOn.price;
                    }
                });

                return addOnPrice > 0 ? addOnPrice : "-";
            },
            sorter: (a, b) => {
                // Calculate the total add-on prices for records a and b
                let addOnPriceA = 0;
                let addOnPriceB = 0;

                if (a.add_ons && Array.isArray(a.add_ons)) {
                    a.add_ons.forEach((addOn) => {
                        const matchingAddOn = a.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceA += matchingAddOn.price;
                        }
                    });
                }

                if (b.add_ons && Array.isArray(b.add_ons)) {
                    b.add_ons.forEach((addOn) => {
                        const matchingAddOn = b.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceB += matchingAddOn.price;
                        }
                    });
                }

                return addOnPriceA - addOnPriceB;
            },
        },
        {
            title: "Product Price + AddOn Price",
            dataIndex: "total_price",
            key: "total_price",
            render: (total_price, record) => {
                // Calculate the total price as the sum of product price and add-on price
                const productPrice = record.product_color
                    ? record.product_images.find((img) => img.color === record.product_color)?.price
                    : '-';

                if (!record.add_ons || !Array.isArray(record.add_ons)) {
                    return productPrice;
                }

                let addOnPrice = 0;

                record.add_ons.forEach((addOn) => {
                    const matchingAddOn = record.product_add_ons.find((item) => item.title === addOn);
                    if (matchingAddOn) {
                        addOnPrice += matchingAddOn.price;
                    }
                });

                return (productPrice + addOnPrice) || '-'; // Calculate the total price and handle cases when no match is found
            },
            sorter: (a, b) => {
                const productPriceA = a.product_color
                    ? a.product_images.find((img) => img.color === a.product_color)?.price
                    : 0;
                const productPriceB = b.product_color
                    ? b.product_images.find((img) => img.color === b.product_color)?.price
                    : 0;

                let addOnPriceA = 0;
                let addOnPriceB = 0;

                if (a.add_ons && Array.isArray(a.add_ons)) {
                    a.add_ons.forEach((addOn) => {
                        const matchingAddOn = a.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceA += matchingAddOn.price;
                        }
                    });
                }

                if (b.add_ons && Array.isArray(b.add_ons)) {
                    b.add_ons.forEach((addOn) => {
                        const matchingAddOn = b.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceB += matchingAddOn.price;
                        }
                    });
                }

                const totalPriceA = productPriceA + addOnPriceA;
                const totalPriceB = productPriceB + addOnPriceB;

                return totalPriceA - totalPriceB;
            },
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            sorter: (a, b) => a.quantity - b.quantity
        },
        {
            title: "(Product Price + AddOn Price) * Quantity",
            dataIndex: "total_price",
            key: "total_price",
            render: (_, record) => {
                // Calculate the total price as (addon price + product price) * quantity
                const productPrice = record.product_color
                    ? record.product_images.find((img) => img.color === record.product_color)?.price
                    : 0;

                if (!record.add_ons || !Array.isArray(record.add_ons)) {
                    return productPrice * record.quantity;
                }

                let addOnPrice = 0;

                record.add_ons.forEach((addOn) => {
                    const matchingAddOn = record.product_add_ons.find((item) => item.title === addOn);
                    if (matchingAddOn) {
                        addOnPrice += matchingAddOn.price;
                    }
                });

                const numericPrice = parseFloat(productPrice + addOnPrice); // Calculate product price + add-on price
                const numericQuantity = parseFloat(record.quantity); // Convert to a numeric type

                if (!isNaN(numericPrice) && !isNaN(numericQuantity)) {
                    const total = numericPrice * numericQuantity;
                    return <span>{total}</span>;
                } else {
                    return <span>-</span>; // Handle missing or invalid data
                }
            },
            sorter: (a, b) => {
                const productPriceA = a.product_color
                    ? a.product_images.find((img) => img.color === a.product_color)?.price
                    : 0;
                const productPriceB = b.product_color
                    ? b.product_images.find((img) => img.color === b.product_color)?.price
                    : 0;

                let addOnPriceA = 0;
                let addOnPriceB = 0;

                if (a.add_ons && Array.isArray(a.add_ons)) {
                    a.add_ons.forEach((addOn) => {
                        const matchingAddOn = a.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceA += matchingAddOn.price;
                        }
                    });
                }

                if (b.add_ons && Array.isArray(b.add_ons)) {
                    b.add_ons.forEach((addOn) => {
                        const matchingAddOn = b.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceB += matchingAddOn.price;
                        }
                    });
                }

                const numericPriceA = parseFloat(productPriceA + addOnPriceA);
                const numericPriceB = parseFloat(productPriceB + addOnPriceB);
                const numericQuantityA = parseFloat(a.quantity);
                const numericQuantityB = parseFloat(b.quantity);

                const totalA = numericPriceA * numericQuantityA;
                const totalB = numericPriceB * numericQuantityB;

                return totalA - totalB;
            },
        },
        {
            title: "Discount (%)",
            dataIndex: "discount",
            key: "discount",
            sorter: (a, b) => a.discount - b.discount
        },
        {
            title: "Subtotal",
            dataIndex: "subtotal",
            key: "subtotal",
            render: (_, record) => {
                // Calculate the subtotal as the sum of the product price and the discounted amount for add-ons
                const productPrice = record.product_color
                    ? record.product_images.find((img) => img.color === record.product_color)?.price
                    : 0;

                if (!record.add_ons || !Array.isArray(record.add_ons)) {
                    return productPrice;
                }

                let addOnPrice = 0;

                record.add_ons.forEach((addOn) => {
                    const matchingAddOn = record.product_add_ons.find((item) => item.title === addOn);
                    if (matchingAddOn) {
                        addOnPrice += matchingAddOn.price;
                    }
                });

                const numericPrice = parseFloat(productPrice + addOnPrice); // Calculate product price + add-on price
                const numericQuantity = parseFloat(record.quantity); // Convert to a numeric type
                const numericDiscount = parseFloat(record.discount); // Convert to a numeric type

                if (!isNaN(numericPrice) && !isNaN(numericQuantity) && !isNaN(numericDiscount)) {
                    const subtotal = (numericPrice * numericQuantity) - ((numericPrice * numericQuantity * numericDiscount) / 100);
                    return <span>{subtotal}</span>;
                } else {
                    return <span>-</span>; // Handle missing or invalid data
                }
            },
            sorter: (a, b) => {
                const productPriceA = a.product_color
                    ? a.product_images.find((img) => img.color === a.product_color)?.price
                    : 0;
                const productPriceB = b.product_color
                    ? b.product_images.find((img) => img.color === b.product_color)?.price
                    : 0;

                let addOnPriceA = 0;
                let addOnPriceB = 0;

                if (a.add_ons && Array.isArray(a.add_ons)) {
                    a.add_ons.forEach((addOn) => {
                        const matchingAddOn = a.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceA += matchingAddOn.price;
                        }
                    });
                }

                if (b.add_ons && Array.isArray(b.add_ons)) {
                    b.add_ons.forEach((addOn) => {
                        const matchingAddOn = b.product_add_ons.find((item) => item.title === addOn);
                        if (matchingAddOn) {
                            addOnPriceB += matchingAddOn.price;
                        }
                    });
                }

                const numericPriceA = parseFloat(productPriceA + addOnPriceA);
                const numericPriceB = parseFloat(productPriceB + addOnPriceB);
                const numericQuantityA = parseFloat(a.quantity);
                const numericQuantityB = parseFloat(b.quantity);
                const numericDiscountA = parseFloat(a.discount);
                const numericDiscountB = parseFloat(b.discount);

                const subtotalA =
                    (numericPriceA * numericQuantityA) - ((numericPriceA * numericQuantityA * numericDiscountA) / 100);
                const subtotalB =
                    (numericPriceB * numericQuantityB) - ((numericPriceB * numericQuantityB * numericDiscountB) / 100);

                return subtotalA - subtotalB;
            },
        },
    ]

    return (
        <>
            {adminLoginData == null || adminLoginData?.length == 0 ? (
                ""
            ) : (
                <>
                    <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="my-3">
                                <h1 className="text-4xl text-gray-700 font-bold mb-2">
                                    Abandon Cart ({carts?.length})
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
                                        Abandon Cart
                                    </p>
                                </nav>
                            </div>
                        </div>

                        {Loading ? (
                            "Table Loading"
                        ) : (
                            <>
                                <div className="table-responsive overflow-hidden overflow-x-auto mt-4 ">
                                    <Table
                                        columns={columns}
                                        dataSource={carts}
                                        pagination={true}
                                        className="w-full mt-10"
                                        rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                                    />
                                </div>
                                <Modal
                                    visible={modalVisible}
                                    title="Cart Details"
                                    onCancel={handleCancel}
                                    footer={[
                                        <Button key="ok" type="primary" onClick={handleCancel} className='bg-[#081831] hover:bg-[#337ab7]'>
                                            Close
                                        </Button>,
                                    ]}
                                    width={900}
                                >
                                    <div className="table-responsive overflow-hidden overflow-x-auto mt-4 ">
                                        <Table
                                            columns={cartcolumns}
                                            dataSource={cartDetails.carts}
                                            pagination={false}
                                            className="w-full mt-10"
                                            rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                                        />
                                    </div>
                                </Modal>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default AbandonCart