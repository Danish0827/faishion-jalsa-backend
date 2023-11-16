import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Select, Space } from 'antd';
import { AdminUrl } from '../constant';
import Swal from 'sweetalert2';
import { NavLink } from "react-router-dom";

const Attributes = ({ adminLoginData }) => {
    const [tagId, setTagId] = useState(null);
    const [tagName, setTagName] = useState("");
    const [tagValue, setTagValue] = useState("");
    const [tags, setTags] = useState([]);
    const [visible, setVisible] = useState(false);
    const [tagValues, setTagValues] = useState([]);
    const [selectedTagIndex, setSelectedTagIndex] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [subcatNameBackend, setsubcatNameBackend] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

    const [tableUpdate, setTableUpdate] = useState(0);

    // show tags create/update modal
    const showModal = () => {
        setVisible(true);
    };

    // get all categories
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

    // get all subcategories
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

    // when category changes
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
        document.getElementById("subcategory").value = "";
    };

    // when subcategory changes
    const handleSubcategoryChange = (subcategoryId) => {
        // Find the selected subcategory object from the filteredSubcategories array
        const selectedSubcategorys = filteredSubcategories.find(
            (subcategory) => subcategory.subcategory_id === subcategoryId
        );
        // Set the subcategory name in state
        setSelectedSubcategory(
            selectedSubcategorys
                ? selectedSubcategorys.subcategory_name
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s/g, "")
                : ""
        );
        setSelectedSubcategoryId(subcategoryId)
    };

    useEffect(() => {
        // Check if 'categories' and 'subcategories' are empty
        const categoriesEmpty = categories === null || categories.length === 0;
        const subcategoriesEmpty = subcategories.length === 0;

        // Fetch data only if both 'categories' and 'subcategories' are empty
        if (categoriesEmpty || subcategoriesEmpty) {
            //   callVendorProducts();
            categoryFunction();
            subcategoryFunction();
        }
    }, [])
    // }, [categories, subcategories]);

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${AdminUrl}/api/GetAdminTags`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Assuming the backend responds with JSON data containing tags
                const responseData = await response.json();
                const transformedData = responseData.tags.map((tag) => ({
                    tag_id: tag.tag_id,
                    name: tag.tag_name,
                    values: tag.tag_values,
                    category_id: tag.category_id,
                    subcategory_id: tag.subcategory_id
                }));

                // Transform the data and set it in your component's state
                setTags(transformedData);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        // Fetch data when the component mounts
        fetchData();
    }, [adminLoginData, tableUpdate]);

    console.log(tags);

    const handleOk = async () => {
        if (tagName && tagValues.length > 0) {
            if (selectedTagIndex !== null) {
                // Update the existing attribute at the selected index
                const updatedAttributes = [...tags];
                updatedAttributes[selectedTagIndex] = {
                    tag_id: tagId,
                    name: tagName,
                    values: tagValues,
                };
                setTags(updatedAttributes);

                try {
                    const dataToSend = {
                        tag_id: tagId,
                        tag_name: tagName,
                        tag_values: tagValues,
                        category_id: selectedCategoryId,
                        subcategory_id: selectedSubcategoryId,
                        type: "update",
                    };

                    const response = await fetch(`${AdminUrl}/api/SetTagsValues`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataToSend),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    // Assuming the backend responds with JSON data
                    const responseData = await response.json();

                    // Show a success alert using sweetalert2
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: responseData.message || "Operation completed successfully",
                    });
                } catch (error) {
                    console.error("Error:", error);

                    // Show an error alert using sweetalert2
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "An error occurred. Please try again later.",
                    });
                }
            } else {
                // Add a new attribute
                const newAttribute = { name: tagName, values: tagValues };

                try {
                    const dataToSend = {
                        tag_name: tagName,
                        tag_values: tagValues,
                        category_id: selectedCategoryId,
                        subcategory_id: selectedSubcategoryId,
                        type: "add",
                    };

                    const response = await fetch(`${AdminUrl}/api/SetTagsValues`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            // Add any additional headers if needed
                        },
                        body: JSON.stringify(dataToSend),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    // Assuming the backend responds with JSON data
                    const responseData = await response.json();
                    setTags([...tags, newAttribute]);

                    // Show a success alert using sweetalert2
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: responseData.message || "Operation completed successfully",
                    });
                } catch (error) {
                    console.error("Error:", error);

                    // Show an error alert using sweetalert2
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "An error occurred. Please try again later.",
                    });
                }
            }

            setTagId(null)
            setTagName("");
            setTagValues([]);
            setSelectedTagIndex(null);
            setSelectedCategoryId(null);
            setSelectedSubcategoryId(null);
            setTableUpdate(tableUpdate + 1);
            setVisible(false);
            setEditModalVisible(false);
        } else {
            // Show an error alert using sweetalert2
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please provide a value for the attribute. At least one attribute value is required.",
            });
            setTableUpdate(tableUpdate + 1);
        }
    };

    const handleCancel = () => {
        setVisible(false);
        setEditModalVisible(false);
        setSelectedTagIndex(null);
        setTagId(null)
        setTagName("");
        setSelectedCategoryId(null)
        setSelectedSubcategoryId(null)
        setTagValues([]);
    };

    const addAttributeValue = () => {
        if (tagValue) {
            setTagValues([...tagValues, tagValue]);
            setTagValue("");
        }
    };

    const removeAttributeValue = (index) => {
        // if (selectedTagIndex !== null) {
        //     const updatedAttributes = [...tags];
        //     updatedAttributes[selectedTagIndex].values.splice(index, 1);
        //     setTags(updatedAttributes);
        // } else {
        const updatedTagValues = [...tagValues];
        updatedTagValues.splice(index, 1)
        setTagValues(updatedTagValues);
        // }
    };

    const handleEditAttribute = (index) => {
        // console.log(index);
        setSelectedTagIndex(index);
        setEditModalVisible(true);

        // Pre-fill edit modal fields with selected attribute's data
        const selectedAttribute = tags[index];
        setTagId(selectedAttribute.tag_id)
        setTagName(selectedAttribute.name);
        setTagValues(selectedAttribute.values);
        setSelectedCategoryId(selectedAttribute.category_id);
        setSelectedSubcategoryId(selectedAttribute.subcategory_id);
    };

    const columns = [
        {
            title: "Attribute Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Attribute Values",
            dataIndex: "values",
            key: "values",
            render: (values, record, index) => (
                <ul className="list-disc pl-4">
                    {values?.map((value, valueIndex) => (
                        <li key={valueIndex}>{value}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Category",
            dataIndex: "category_id",
            key: "category_id",
            render: (category_id) => {
                const category = categories.find((c) => c.category_id === category_id);
                return category ? category.category_name : null;
            },
        },
        {
            title: "Subcategory",
            dataIndex: "subcategory_id",
            key: "subcategory_id",
            render: (subcategory_id) => {
                const subcategory = subcategories.find((s) => s.subcategory_id === subcategory_id);
                return subcategory ? subcategory.subcategory_name : null;
            },
        },
        {
            title: "Action",
            key: "action",
            render: (text, record, index) => (
                <Space size="middle">
                    <Button type="default" onClick={() => handleEditAttribute(index)}>
                        Edit
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => handleDeleteAttribute(index, record.tag_id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDeleteAttribute = async (index, tag_id) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this attribute?"
        );

        if (isConfirmed) {
            const updatedAttributes = [...tags];
            updatedAttributes.splice(index, 1);
            setTags(updatedAttributes);

            try {
                const dataToSend = {
                    tag_id: tag_id,
                };

                const response = await fetch(`${AdminUrl}/api/DeleteTag`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Add any additional headers if needed
                    },
                    body: JSON.stringify(dataToSend),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Assuming the backend responds with JSON data
                const responseData = await response.json();

                // Show a success alert using sweetalert2
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: responseData.message || "Attribute deleted successfully",
                });
            } catch (error) {
                console.error("Error:", error);

                // Show an error alert using sweetalert2
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An error occurred. Please try again later.",
                });
            }
        }
    };

    return (
        <>
            {
                adminLoginData == null || adminLoginData?.length == 0 ? "" :
                    <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="my-3">
                                <h1 className="text-4xl text-gray-700 font-bold mb-2">
                                    Attributes
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
                                        Attributes
                                    </p>
                                </nav>
                                <p className="mt-5 text-md text-gray-400">
                                    Manage Attributes for Category & Subcategory products
                                </p>
                            </div>
                            <div className="my-3">
                                <button
                                    onClick={showModal}
                                    className="bg-[#0391d1] hover:bg-[#0391d1]/80 text-white rounded-full p-3 px-5"
                                >
                                    {/* <svg
                                    className="w-10 h-10 "
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                    </svg>  */}
                                    Add New Attribute
                                </button>
                            </div>
                        </div>
                        <div className="mt-10">
                            <Table
                                dataSource={tags}
                                columns={columns}
                                pagination={false}
                                rowKey={(record, index) => index.toString()}
                                className="w-full"
                            />
                        </div>
                        <Modal
                            title={
                                selectedTagIndex !== null ? "Edit Attribute" : "Add Attribute"
                            }
                            visible={visible || editModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            okButtonProps={{
                                style: { background: "#4CAF50", borderColor: "#4CAF50" },
                            }}
                        >

                            <Select
                                id="category"
                                placeholder="Select category"
                                className="w-full mb-2"
                                onChange={(category) => handleCategoryChange(category)}
                                disabled={selectedTagIndex !== null}
                                value={selectedTagIndex !== null ? selectedCategoryId : undefined}
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
                                    ))
                                }
                            </Select>
                            <Select
                                id="subcategory"
                                placeholder="Select subcategory"
                                className="w-full mb-2"
                                onChange={(subcategory) =>
                                    handleSubcategoryChange(subcategory)
                                }
                                value={selectedTagIndex !== null ? selectedSubcategoryId : undefined}
                                disabled={selectedTagIndex !== null}
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
                            <Input
                                type="hidden"
                                value={tagId}
                                placeholder="Attribute Id"
                                className="mb-2"
                            />
                            <Input
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                placeholder="Attribute Name"
                                className="mb-2"
                            />
                            <Input
                                value={tagValue}
                                onChange={(e) => setTagValue(e.target.value)}
                                placeholder="Attribute Value"
                                className="mb-2"
                            />
                            <div className="flex justify-end">
                                <button
                                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300`}
                                    onClick={addAttributeValue}
                                    disabled={tagValue.length === 0}
                                >
                                    Add Value
                                </button>
                            </div>

                            <div className="mt-4">
                                <strong>Attribute Values:</strong>
                                <ul className="list-disc pl-4">
                                    {tagValues.map((value, index) => (
                                        <li key={index}>
                                            {value}
                                            <Button
                                                type="text"
                                                className="text-red-500 ml-2"
                                                onClick={() => removeAttributeValue(index)}
                                            >
                                                Remove
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Modal>
                    </div>
            }
        </>
    );
};

export default Attributes;
