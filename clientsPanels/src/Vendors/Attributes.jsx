import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Modal } from "antd";
import { AdminUrl } from "../Admin/constant";
import Swal from "sweetalert2";
import "./components/Vendors.css";

const Attributes = ({ vendorDatastate }) => {
  const [attributeId, setAttributeId] = useState(null);
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [visible, setVisible] = useState(false);
  const [attributeValues, setAttributeValues] = useState([]);
  const [selectedAttributeIndex, setSelectedAttributeIndex] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [tableUpdate, setTableUpdate] = useState(0)

  const vendorId = vendorDatastate?.[0]?.id;
  const showModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${AdminUrl}/api/GetAttributesByVendor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendor_id: vendorId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Assuming the backend responds with JSON data containing attributes
        const responseData = await response.json();
        const transformedData = responseData.attributes.map((attribute) => ({
          attribute_id: attribute.attribute_id, // Add this line
          name: attribute.attribute_name,
          values: attribute.attribute_values,
        }));

        // Assuming responseData is the JSON response from your backend
        // Transform the data and set it in your component's state
        setAttributes(transformedData);
      } catch (error) {
        console.error("Error:", error);
        // Handle the error as needed, e.g., show an error message to the user
      }
    };

    // Fetch data when the component mounts
    fetchData();
  }, [vendorId, tableUpdate]);

  console.log(attributes);

  const handleOk = async () => {
    if (attributeName && attributeValues.length > 0) {
      if (selectedAttributeIndex !== null) {
        // Update the existing attribute at the selected index
        const updatedAttributes = [...attributes];
        updatedAttributes[selectedAttributeIndex] = {
          attribute_id: attributeId,
          name: attributeName,
          values: attributeValues,
        };
        setAttributes(updatedAttributes);

        try {
          const dataToSend = {
            attributeId: attributeId,
            attributeName: attributeName,
            attributeValues: attributeValues,
            vendor_id: vendorId,
            type: "update",
          };

          const response = await fetch(`${AdminUrl}/api/SetAttributesValues`, {
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
        const newAttribute = { name: attributeName, values: attributeValues };

        try {
          const dataToSend = {
            attributeName: attributeName,
            attributeValues: attributeValues,
            vendor_id: vendorId,
            type: "add",
          };

          const response = await fetch(`${AdminUrl}/api/SetAttributesValues`, {
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
          setAttributes([...attributes, newAttribute]);

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
      // Clear the input fields and close the modal
      setAttributeId(null)
      setAttributeName("");
      setAttributeValues([]);
      setSelectedAttributeIndex(null);
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
    setSelectedAttributeIndex(null);
    setAttributeId(null);
    setAttributeName("");
    setAttributeValues([]);
  };

  const addAttributeValue = () => {
    if (attributeValue) {
      setAttributeValues([...attributeValues, attributeValue]);
      setAttributeValue("");
    }
  };

  const removeAttributeValue = (index) => {
    // if (selectedAttributeIndex !== null) {
    //   const updatedAttributes = [...attributes];
    //   updatedAttributes[selectedAttributeIndex].values.splice(index, 1);
    //   setAttributes(updatedAttributes);
    //   // Check if the selected attribute is deleted
    //   // if (selectedAttributeIndex === index) {
    //   //   setSelectedAttributeIndex(null);
    //   // }
    // }
    const updatedAttributesValues = [...attributeValues]
    updatedAttributesValues.splice(index, 1)
    setAttributeValues(updatedAttributesValues)
  };

  const handleEditAttribute = (index) => {
    console.log(index);
    setSelectedAttributeIndex(index);
    setEditModalVisible(true);

    // Pre-fill edit modal fields with selected attribute's data
    const selectedAttribute = attributes[index];
    setAttributeId(selectedAttribute.attribute_id)
    setAttributeName(selectedAttribute.name);
    setAttributeValues(selectedAttribute.values);
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
      title: "Action",
      key: "action",
      render: (text, record, index) => (
        <Space size="middle">
          <Button type="default" onClick={() => handleEditAttribute(index)}>
            Edit
          </Button>
          <Button
            type="danger"
            onClick={() => handleDeleteAttribute(index, record.attribute_id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeleteAttribute = async (index, attribute_id) => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this attribute?"
    );

    if (isConfirmed) {
      const updatedAttributes = [...attributes];
      updatedAttributes.splice(index, 1);
      setAttributes(updatedAttributes);

      try {
        const dataToSend = {
          attribute_id: attribute_id,
        };

        const response = await fetch(`${AdminUrl}/api/DeleteAttribute`, {
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
    <div>

      <button
        onClick={showModal}
        className="z-20 bg-[#003032] hover:bg-[#003032]/80 text-white rounded-full py-2 px-5 font-semibold absolute right-10 top-24"
      >
        Add Attribute

      </button>

      <div className="mt-0">
        <Table
          dataSource={attributes}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => index.toString()}
          className="w-full"
        />
      </div>
      <Modal
        title={
          selectedAttributeIndex !== null ? "Edit Attribute" : "Add Attribute"
        }
        visible={visible || editModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: { background: "#4CAF50", borderColor: "#4CAF50" },
        }}
      >
        <Input
          type="hidden"
          value={attributeId}
          placeholder="Attribute Id"
          className="mb-2"
        />
        <Input
          value={attributeName}
          onChange={(e) => setAttributeName(e.target.value)}
          placeholder="Attribute Name"
          className="mb-2"
        />
        <Input
          value={attributeValue}
          onChange={(e) => setAttributeValue(e.target.value)}
          placeholder="Attribute Value"
          className="mb-2"
        />
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300`}
            onClick={addAttributeValue}
            disabled={attributeValue.length === 0}
          >
            Add Value
          </button>
        </div>

        <div className="mt-4">
          <strong>Attribute Values:</strong>
          <ul className="list-disc pl-4">
            {attributeValues.map((value, index) => (
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
  );
};

export default Attributes;
