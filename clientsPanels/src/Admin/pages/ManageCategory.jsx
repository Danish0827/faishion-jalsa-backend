import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Pagination,
  Select,
  Space,
  Switch,
  Image,
  Tabs,
  Typography,
  Tooltip,
} from "antd";
import { NavLink } from "react-router-dom";
import { AdminUrl, links } from "../constant";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { PlusOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const ManageCategory = ({ adminLoginData }) => {
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [DeleteSubcat, setDeleteSubcat] = useState([]);
  const [selectedsubcategories, setselectedSubcategories] = useState([]);

  // State to handle the visibility of the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [DeletemodalVisibleRole, setDeleteModalCategory] = useState(false);
  const [DeleteRow, setDeleteRow] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [DeleteSubcategoryModal, setDeleteSubcategoryModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [CatgeoryChangeTab, setCatgeoryChangeTab] = useState("1");
  const [Descp_modalVisible, setDescp_ModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  // State to store the roles to be displayed in the modal

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  useEffect(() => {
    fetchCategoriesAndSubcategories();
  }, []);

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
        setSubcategories(subcategoryData);
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

  // const productsCategory = category.filter(
  //   (data) => data.category_type == "Products"
  // );
  // const ServicesCatgeory = category.filter(
  //   (data) => data.category_type == "Services"
  // );

  const columns = [
    {
      title: "ID",
      dataIndex: "category_id", // Replace 'id' with 'category_id'
      key: "category_id", // Replace 'id' with 'category_id'
      sorter: (a, b) => a.category_id - b.category_id, // Replace 'id' with 'category_id'
    },
    {
      title: "Name",
      dataIndex: "category_name", // Replace 'name' with 'category_name'
      key: "category_name", // Replace 'name' with 'category_name'
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "category_description",
      key: "category_description",
      width: 200,
      render: (category_description) => (
        <Tooltip title={category_description}>
          <div
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {category_description.length > 10 ? (
              <>
                {category_description.slice(0, 10)}{" "}
                <Button
                  type="link"
                  onClick={() => handleDescriptionModal(category_description)}
                >
                  Read More
                </Button>
              </>
            ) : (
              category_description
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Image",
      dataIndex: "category_image_url",
      key: "category_image_url",
      width: 100,
      render: (imageUrl) => {
        if (imageUrl != "" || imageUrl != null) {
          return (
            <div className="overflow-hidden">
              <Image
                width={100}
                src={imageUrl}
                className="w-full h-full object-contain border-4 border-white shadow-xl"
              />
            </div>
          );
        } else {
          return <span>No Image</span>; // Show a placeholder text when category_image_url is not available
        }
      },
    },
    {
      title: "Status",
      dataIndex: "category_status",
      key: "category_status",
      render: (status) => (
        <span>
          <span>
            {status ? (
              <FaCheckCircle className={`text-green-600 cursor-pointer`} />
            ) : (
              <FaTimesCircle className="text-red-600 cursor-pointer" />
            )}
          </span>
        </span>
      ),
    },
    {
      title: "Subcategories",
      key: "subcategories",
      render: (record) => (
        <Table
          columns={[
            ...subCategoryColumns,
            {
              title: () => (
                <Button
                  type="button"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddNewSubcategory(record.category_id)}
                  className="bg-[#0391d1] flex items-center justify-center text-white"
                />
              ),
              key: "actions",
              dataIndex: "actions", // Give a unique dataIndex to avoid any warnings (it won't be used)
            },
          ]}
          dataSource={record.subcategories}
          pagination={false}
          rowKey="subcategory_id"
        />
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space size="middle" className="flex">
          {/* Edit Icon */}
          <FiEdit2
            onClick={() => handleUpdate(record.category_id)} // Replace 'id' with 'category_id'
            className="text-white w-8 h-8 p-2 rounded-full bg-green-600 border-none hover:bg-green-600 hover:text-white"
          />

          {/* Delete Icon */}
          <FiTrash2
            onClick={() => handleDelete(record.category_id)} // Replace 'id' with 'category_id'
            className="text-white w-8 h-8 p-2 rounded-full bg-red-600 border-none hover:bg-red-600 hover:text-white"
          />
        </Space>
      ),
    },
  ];

  const subCategoryColumns = [
    {
      title: "ID",
      dataIndex: "subcategory_id",
      key: "subcategory_id",
      sorter: (a, b) => a.subcategory_id - b.subcategory_id, // Replace 'id' with 'category_id'
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "subcategory_name",
      key: "subcategory_name",
      width: 100,
    },
    {
      title: "Image",
      dataIndex: "subcategory_image_url",
      key: "subcategory_image_url",
      render: (imageUrl) => {
        if (imageUrl) {
          return (
            <Image
              src={imageUrl}
              alt="Subcategory"
              style={{ maxWidth: 60, maxHeight: 60 }}
            />
          );
        } else {
          return <span>No Image</span>;
        }
      },
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space size="middle">
          {/* Edit Icon */}
          <Button onClick={() => handleEditSubcategory(record.subcategory_id)}>
            Edit
          </Button>

          {/* Delete Icon */}
          <Button
            onClick={() => handleSubcatModal(record.subcategory_id)}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
      width: 100,
    },
  ];

  const handleViewAllSubcategories = (categoryId) => {
    // Implement your logic here, such as opening a modal or navigating to a new page
    // to show all subcategories for the specified category.
    // You can use the categoryId to fetch the subcategories from your data source.
    // For example:

    // Open a modal with all subcategories
    showModalWithAllSubcategories(categoryId);

    // Or navigate to a new page with all subcategories
    navigateToAllSubcategoriesPage(categoryId);
  };

  const handleDescriptionModal = (description) => {
    setSelectedDescription(description);
    setDescp_ModalVisible(true);
  };

  const handleAddNewSubcategory = (catId) => {
    form.resetFields();
    form.setFieldsValue({
      category_type: "a",
      category_name: "a",
      category_description: "a",
      category_image_url: "a",
    });
    setSelectedKey(catId);
    setSelectedSubcategory(null);
    setEditModalVisible(true);
  };

  // Function to handle editing a subcategory
  const handleEditSubcategory = (key) => {
    const selectedRow = subcategories.find(
      (item) => item.subcategory_id === key
    );
    form.setFieldsValue(selectedRow);
    setSelectedSubcategory(key);
    setEditModalVisible(true);
  };

  const handleSubcatModal = (key) => {
    const DeleteSubcat = subcategories.find(
      (item) => item.subcategory_id === key
    );
    setDeleteSubcat(DeleteSubcat);
    setSelectedKey(key);
    setDeleteSubcategoryModal(true);
  };
  // Function to handle deleting a subcategory
  const handleDeleteSubcategoryLogic = async (subcategory_id) => {
    try {
      // Send a DELETE request to your backend API to delete the subcategory
      const response = await fetch(`${AdminUrl}/api/deleteSubcategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subcategory_id }), // Send the subcategory_id in the request body
      });

      if (response.ok) {
        // Subcategory deleted successfully
        // You may want to update the subcategories list after deletion, so you can fetch the updated list again
        fetchCategoriesAndSubcategories();
        setDeleteSubcategoryModal(false);
        Swal.fire({
          icon: "success",
          title: "SubCategory Deleted Successfully.",
          text: "The SubCategory has been successfully Deleted.",
        });
      } else {
        // Handle error response
        console.error("Error deleting subcategory:", response.statusText);
        Swal.fire({
          icon: "success",
          title: "Error deleting subcategory",
          text: `${response.statusText}`,
        });
      }
    } catch (error) {
      // Handle error
      console.error("Error deleting subcategory:", error);
      Swal.fire({
        icon: "success",
        title: "Error deleting subcategory",
        text: `${error}`,
      });
    }
  };

  const pageSize = 10;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function handleCreate() {
    form.resetFields();
    form.setFieldsValue({
      subcategory_name: "a",
      subcategory_description: "a",
      subcategory_image_url: "a",
    });
    setSelectedKey(null);
    setModalVisible(true);
  }

  function handleDelete(key) {
    setSelectedKey(key);
    const selectedRow = category.find((item) => item.category_id === key);
    setDeleteRow(selectedRow);
    setDeleteModalCategory(true);
  }

  function onCancel() {
    setSelectedKey(null);
    setDeleteModalCategory(false);
    setDeleteSubcategoryModal(false);
  }

  function handleUpdate(key) {
    fetchCategoriesAndSubcategories();
    const selectedRow = category.find((item) => item.category_id === key);
    form.setFieldsValue(selectedRow);
    const subcategoriesWithParents = subcategories.filter(
      (subcat) => subcat.parent_category_id === key
    );
    setselectedSubcategories(subcategoriesWithParents);
    setSelectedKey(key);
    setModalVisible(true);
  }

  const handleTabChangeforTable = (key) => {
    setCatgeoryChangeTab(key);
  };

  const handleSaveCategories = async () => {
    form.validateFields().then((values) => {
      if (selectedKey == null) {
        // Add category Details to Superadmin Table and set Positon as category
        const addCategory = async () => {
          try {
            const response = await fetch(`${AdminUrl}/api/addNewCategories`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ values }),
            });

            if (response.ok) {
              // Show success message using Swal.fire
              const data = await response.json();
              setCategory([
                ...category,
                {
                  category_id: data.category_id,
                  ...values,
                },
              ]);
              handleTabChangeforTable(data.category_type === 'Services' ? '3' : '2')
              Swal.fire({
                icon: "success",
                title: "Category Added",
                text: "The category has been successfully added.",
              });

              setModalVisible(false);
              // Perform any additional actions after successful category insertion
            } else {
              // Show error message using Swal.fire
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add the category. Please try again later.",
              });
            }
          } catch (error) {
            // Handle any other errors
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to add the category. Please try again later.",
            });
          }
        };

        addCategory();
      } else {
        setCategory(
          category.map((item) =>
            item.category_id === selectedKey ? { ...item, ...values } : item
          )
        );
        const updateCategory = async () => {
          try {
            const response = await fetch(`${AdminUrl}/api/updateCategory`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ selectedKey, values }),
            });

            if (response.ok) {
              // Show success message using Swal.fire
              Swal.fire({
                icon: "success",
                title: "Category Updated",
                text: "The category has been successfully updated.",
              });

              setModalVisible(false);

              // Perform any additional actions after successful category insertion
            } else {
              // Show error message using Swal.fire
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to updated the category. Please try again later.",
              });
            }
          } catch (error) {
            // Handle any other errors
            console.error(error);
          }
        };

        updateCategory();
      }
    });
  };

  const onDelete = async (selectedKey) => {
    try {
      // Send the request to the backend using fetch
      const response = await fetch(`${AdminUrl}/api/deleteCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedKey }),
      });

      if (!response.ok) {
        // Handle error response from the server if needed
        const errorText = await response.text();
        throw new Error(
          `Failed to update roles. Server responded with status ${response.status}: ${errorText}`
        );
      } else {
        if (response.ok) {
          // Show a success Swal popup
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The item has been deleted.",
          });
          setDeleteModalCategory(false);
          setCategory(
            category.filter((item) => item.category_id != selectedKey)
          );
        } else {
          // Show an error Swal popup if the response status is not ok
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Failed to delete the item.",
          });
        }
      }
    } catch (error) {
      // Show an error Swal popup if there's an error making the request
      console.error("Error during onDelete:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the item.",
      });
    }
  };

  const handleUpdateSubcategory = async () => {
    console.log(selectedKey);
    form.validateFields().then((values) => {
      if (selectedSubcategory == null) {
        const addSubcat = async () => {
          try {
            const response = await fetch(`${AdminUrl}/api/addNewSubCategories`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ selectedKey, values }),
            });

            if (response.ok) {
              // Show success message using Swal.fire
              Swal.fire({
                icon: "success",
                title: "Subcategory Added",
                text: "The Subcategory has been successfully added.",
              });

              setEditModalVisible(false);
              fetchCategoriesAndSubcategories();

              // Perform any additional actions after successful category insertion
            } else {
              // Show error message using Swal.fire
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add the category. Please try again later.",
              });
            }
          } catch (error) {
            // Handle any other errors
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to add the category. Please try again later.",
            });
          }
        };

        addSubcat();
      } else {
        const updateSubcat = async () => {
          try {
            // Get the updated values from the form
            const updatedValues = form.getFieldsValue();
            console.log(updatedValues);
            // Send a PUT request to your backend API to update the subcategory
            const response = await fetch(`${AdminUrl}/api/updateSubcategory`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                selectedSubcategory,
                ...updatedValues,
              }),
            });

            if (response.ok) {
              // Subcategory updated successfully
              setEditModalVisible(false); // Close the Edit modal
              fetchCategoriesAndSubcategories(); // Fetch updated categories and subcategories data
              Swal.fire({
                icon: "success",
                title: "Subcategory Updated",
                text: "The Subcategory has been successfully Updated.",
              });
              fetchCategoriesAndSubcategories();
            } else {
              // Handle error response
              console.error("Error updating subcategory:", response.statusText);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: `Error updating subcategory:', ${response.statusText}`,
              });
            }
          } catch (error) {
            // Handle error
            console.error("Error updating subcategory:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Error updating subcategory:', ${error}`,
            });
          }
        };

        updateSubcat();
      }
    });
  };

  return (
    <>
      {adminLoginData == null || adminLoginData?.length == 0 ? (
        ""
      ) : (
        <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="my-5">
              <h1 className="text-4xl text-gray-700 font-bold mb-2">
                Manage Category
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
                  Manage Category
                </p>
              </nav>
            </div>
            <div className="my-5">
              <button
                onClick={handleCreate}
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
                </svg> */}
                Add New Category
              </button>
            </div>
          </div>
          {Loading ? (
            "Table Loading"
          ) : (
            <>
              <div
                style={{ maxWidth: "100%", overflowX: "auto",}}
                className="mt-10"
              >
                <Tabs
                  defaultActiveKey="1"
                  activeKey={CatgeoryChangeTab}
                  onChange={handleTabChangeforTable}
                  centered
                >
                  <TabPane tab={`All (${category?.length})`} key="1">
                    <Table
                      columns={columns}
                      dataSource={category}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                  </TabPane>
                  {/* <TabPane
                    tab={`Products (${productsCategory?.length})`}
                    key="2"
                  >
                    <Table
                      columns={columns}
                      dataSource={productsCategory}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                  </TabPane>
                  <TabPane
                    tab={`Services (${ServicesCatgeory?.length})`}
                    key="3"
                  >
                    <Table
                      columns={columns}
                      dataSource={ServicesCatgeory}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                  </TabPane> */}
                </Tabs>
              </div>

              <div className="mt-4">
                <Pagination
                  current={currentPage}
                  onChange={handlePageChange}
                  pageSize={pageSize}
                  total={category?.length}
                />
              </div>

              <Modal
                title={
                  selectedKey === null ? "Create category" : "Update category"
                }
                visible={modalVisible}
                onOk={handleSaveCategories}
                onCancel={() => setModalVisible(false)}
                okText={selectedKey === null ? "Create" : "Update"}
                width={800}
                okButtonProps={{ style: { backgroundColor: "#081831" } }}
              >
                <Form {...formItemLayout} form={form}>
                  {/* Category Type Input */}
                  <Form.Item
                    label="Category Type"
                    name="category_type"
                    initialValue="Products"
                    rules={[
                      {
                        required: true,
                        message: "Please select the category type!",
                      },
                    ]}
                    style={{ visibility: 'hidden' }}
                  >
                    <Select placeholder="Select category type">
                      <Select.Option value="Products">Products</Select.Option>
                      <Select.Option value="Services">Services</Select.Option>
                    </Select>
                  </Form.Item>

                  {/* Category Name Input */}
                  <Form.Item
                    label="Category Name"
                    name="category_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the category name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  {/* Category Description Input */}
                  <Form.Item
                    label="Category Description"
                    name="category_description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the category description!",
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>

                  {/* Category Image URL Input */}
                  <Form.Item
                    label="Category Image URL"
                    name="category_image_url"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the category image URL!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  {/* Category Meta Title */}
                  <Form.Item
                    label="Category Meta Title"
                    name="category_meta_title"
                  >
                    <Input />
                  </Form.Item>

                  {/* Category Status Input */}
                  <Form.Item
                    label="Category Status"
                    name="category_status"
                    valuePropName="checked" // This allows handling the boolean value as a checkbox
                  >
                    <Switch
                      checked={form.getFieldValue("category_status") || true}
                    />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                title="Confirm Delete"
                visible={DeletemodalVisibleRole}
                onCancel={onCancel}
                footer={[
                  <Button key="cancel" onClick={onCancel}>
                    Cancel
                  </Button>,
                  <Button
                    key="delete"
                    type="primary"
                    danger
                    onClick={() => onDelete(selectedKey)}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <p>
                  Are you sure you want to delete this category{" "}
                  <b>({`${DeleteRow?.category_name}`}) </b>?
                </p>
              </Modal>

              <Modal
                title="Confirm Subcategory Delete"
                visible={DeleteSubcategoryModal}
                onCancel={onCancel}
                footer={[
                  <Button key="cancel" onClick={onCancel}>
                    Cancel
                  </Button>,
                  <Button
                    key="delete"
                    type="primary"
                    danger
                    onClick={() => handleDeleteSubcategoryLogic(selectedKey)}
                  >
                    Delete
                  </Button>,
                ]}
              >
                <p>
                  Are you sure you want to delete this category{" "}
                  <b>({`${DeleteSubcat?.subcategory_name}`}) </b>?
                </p>
              </Modal>

              <Modal
                title={selectedSubcategory ? "Update Subcategory" : "Create Subcategory"}
                visible={editModalVisible}
                onOk={handleUpdateSubcategory} // Implement the function to handle the update action
                onCancel={() => setEditModalVisible(false)}
                okText={selectedSubcategory ? "Update" : "Create"}
                width={800}
                okButtonProps={{ style: { backgroundColor: "#081831" } }}
              >
                <Form {...formItemLayout} form={form}>
                  {/* Subcategory Name Input */}
                  <Form.Item
                    label="Subcategory Name"
                    name="subcategory_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the subcategory name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  {/* Subcategory Description Input */}
                  <Form.Item
                    label="Subcategory Description"
                    name="subcategory_description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the subcategory description!",
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>

                  {/* Subcategory Image URL Input */}
                  <Form.Item
                    label="Subcategory Image URL"
                    name="subcategory_image_url"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the subcategory image URL!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  {/* Subcategory Meta Title */}
                  <Form.Item
                    label="Subcategory Meta Title"
                    name="subcategory_meta_title"
                  >
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>

              <Modal
                visible={Descp_modalVisible}
                onCancel={() => setDescp_ModalVisible(false)}
                footer={null}
                width={600}
                title="Description"
              >
                <Typography.Paragraph>
                  {selectedDescription}
                </Typography.Paragraph>
              </Modal>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ManageCategory;
