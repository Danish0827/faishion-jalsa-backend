import React, { useEffect, useRef, useState } from "react";
import { Input, InputNumber, Form, Select, Button } from "antd";
import { getAllVendorProductvariants } from "../Admin/constant";

const { Option } = Select;

const VariantsCrud = ({ vendorDatastate, onSave, variantsValueArray, FilteredVariantData }) => {
    const [attributeData, setAttributeData] = useState([]);
    const [variants, setVariants] = useState(variantsValueArray);
    const [formdata, setformdata] = useState(FilteredVariantData);
    const [formFields, setFormFields] = useState([
        { attributeName: "", attributeValues: [] },
    ]);
    const id = vendorDatastate?.[0].id;



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllVendorProductvariants(id);
                setAttributeData(response);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        id && fetchData();
    }, [id]);

    const handleAddAttribute = () => {
        // Filter out attribute names that have already been selected
        const availableAttributeNames = attributeData
            .map((attribute) => attribute.attribute_name)
            .filter(
                (name) => !formFields.some((field) => field.attributeName === name)
            );

        if (availableAttributeNames.length === 0) {
            // You can display a message or take some action if no names are available
            return;
        }

        // Create a new attribute object with an available name and empty values
        const newAttribute = {
            attributeName: availableAttributeNames[0],
            attributeValues: [],
        };

        // Clear the selected values in the form fields for attributeName and attributeValues
        formRef.current.setFieldsValue({
            [`attributeName${formFields.length}`]: "",
            [`attributeValues${formFields.length}`]: [],
        });

        setFormFields([...formFields, newAttribute]);
    };

    const handleRemoveAttribute = (index) => {
        const updatedFormFields = [...formFields];
        updatedFormFields[index].attributeName = "";
        updatedFormFields[index].attributeValues = [];
        updatedFormFields.splice(index, 1);
        setFormFields(updatedFormFields);
    };

    const formRef = useRef(null); // Create a ref for the form

    const handleAttributeChange = async (index, attributeName) => {
        const updatedFormFields = [...formFields];
        updatedFormFields[index].attributeName = attributeName;

        // Clear dependent attribute values and set an empty array for the attributeValues field
        updatedFormFields[index].attributeValues = [];
        setFormFields(updatedFormFields);

        // Clear the selected values in the form field for Attribute Values
        formRef.current.setFieldsValue({
            [`attributeValues${index}`]: [],
        });

        // Fetch dependent attribute values based on the selected attribute name
        if (attributeName) {
            const selectedAttributes = formFields.map((field) => field.attributeName);
            const attributeDataItem = attributeData.find(
                (attribute) => attribute.attribute_name === attributeName
            );

            if (attributeDataItem) {
                updatedFormFields[index].attributeValues =
                    attributeDataItem.attribute_values.filter(
                        (value) => !selectedAttributes.includes(value)
                    );
                setFormFields(updatedFormFields);
            }
        }
    };

    const generateVariants = (
        attributes,
        currentIndex = 0,
        currentVariant = {}
    ) => {
        if (currentIndex === attributes.length) {
            // If currentIndex equals the length of attributes, we've created a complete variant
            return [currentVariant];
        }

        const currentAttribute = attributes[currentIndex];
        const variants = [];

        for (const value of currentAttribute.values) {
            const updatedVariant = {
                ...currentVariant,
                [currentAttribute.name]: value,
            };
            const remainingVariants = generateVariants(
                attributes,
                currentIndex + 1,
                updatedVariant
            );
            variants.push(...remainingVariants);
        }

        return variants;
    };

    const onFinish = (values) => {
        const alignedData = {};

        formFields.forEach((field, index) => {
            const attributeName = values[`attributeName${index}`];
            const attributeValues = values[`attributeValues${index}`] || [];

            if (attributeName) {
                alignedData[attributeName] = attributeValues;
            }
        });

        const attributes = Object.entries(alignedData).map(([name, values]) => ({
            name,
            values,
        }));


        const variants = generateVariants(attributes);
        setVariants(variants);
    };

    const handleSaveForm = (formData, id) => {
        const variantsValue = variants[id];

        // Append the submitted form data and variantsValue to the formdata
        setformdata([...formdata, { ...formData, variantsValue }]);
        onSave([...formdata, { ...formData, variantsValue }], variants);
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                ref={(form) => (formRef.current = form)} // Assign the form ref
            >
                {formFields.map((field, index) => (
                    <div key={index} style={{ display: "flex", marginBottom: "8px" }}>
                        <Form.Item
                            style={{ flex: 1, marginRight: "8px" }}
                            label={`Attribute Name ${index + 1}`}
                            name={`attributeName${index}`}
                        >
                            <Select onChange={(value) => handleAttributeChange(index, value)}>
                                {attributeData
                                    .filter(
                                        (attribute) =>
                                            !formFields.some(
                                                (field, i) =>
                                                    i !== index &&
                                                    field.attributeName === attribute.attribute_name
                                            )
                                    )
                                    .map((attribute) => (
                                        <Option
                                            key={attribute.attribute_id}
                                            value={attribute.attribute_name}
                                        >
                                            {attribute.attribute_name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            style={{ flex: 1, marginRight: "8px" }}
                            label={`Attribute Value ${index + 1}`}
                            name={`attributeValues${index}`}
                        >
                            <Select mode="multiple">
                                {field.attributeValues.map((value) => (
                                    <Option key={value} value={value}>
                                        {value}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Button type="link" onClick={() => handleRemoveAttribute(index)}>
                            Remove
                        </Button>
                    </div>
                ))}

                <div className="flex">
                    {formFields.length < attributeData.length && (
                        <Button type="link" onClick={handleAddAttribute}>
                            Add New Attribute
                        </Button>
                    )}

                    <Form.Item>
                        <Button type="default" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </div>
            </Form>
            <hr />
            <div className="mt-3">
                {variants.length > 0 &&
                    variants
                        .filter(
                            (variant) => variant && Object.values(variant).some(Boolean)
                        )
                        .map((variant, index) => (
                            <VariantForm
                                key={index}
                                variant={variant}
                                data={index}
                                onSave={handleSaveForm}
                                FilteredVariantData={FilteredVariantData}
                                initialValues={FilteredVariantData[index]} // Pass the initial values as the corresponding FilteredVariantData
                            />
                        ))}
            </div>

        </>
    );
};

const VariantForm = ({ variant, onSave, data, initialValues, SelectedUniqueId }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false); // Initialize loading state as false
    const [isSuccess, setIsSuccess] = useState(false); // Track success state

    useEffect(() => {
        // Set initial form values based on the 'variant' prop
        form.setFieldsValue({
            price: initialValues?.price,
            sellingPrice: initialValues?.sellingPrice,
            sku: initialValues?.sku,
            quantity: initialValues?.quantity,
        });
    }, [initialValues]);

    // Create a label string by joining the attribute values
    const label = Object.values(variant).join("/");

    const onFinish = async (values) => {
        setIsLoading(true); // Set loading to true when the form is submitted

        try {
            // Simulate an async operation (you should replace this with your actual submission logic)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Once the async operation is complete, set loading back to false
            setIsLoading(false);
            setIsSuccess(true); // Set success state to true

            // Merge the form values with the label
            const formData = {
                label,
                ...values,
            };

            // Pass the form data to the parent component
            onSave(formData, data, variant);
        } catch (error) {
            // Handle any errors here, e.g., display an error message
            console.error("Error:", error);
            setIsLoading(false); // Set loading back to false in case of an error
        }
    };

    const buttonClass = isSuccess ? "bg-green-500 text-white" : "bg-blue-500 text-white";


    return (
        <div className="mb-5 p-4">
            <Form form={form} className="grid grid-cols-2 gap-4" onFinish={onFinish}>
                <h1 className="col-span-2 text-sm md:text-base">
                    <b>Variant</b>: <span className="text-blue-500">{label}</span>
                </h1>

                <Form.Item
                    label="Price"
                    name="price"
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
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const sellingPrice = getFieldValue("sellingPrice");
                                if (!sellingPrice || value >= sellingPrice) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    "Price must be greater than or equal to Selling Price"
                                );
                            },
                        }),
                    ]}
                >
                    <InputNumber name="price" />
                </Form.Item>

                <Form.Item
                    label="Selling Price"
                    name="sellingPrice"
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
                    ]}
                >
                    <InputNumber name="sellingPrice" />
                </Form.Item>

                <Form.Item
                    label="SKU"
                    name="sku"
                    className="col-span-1"
                    rules={[
                        {
                            required: true,
                            message: "SKU is required",
                        },
                    ]}
                >
                    <Input name="sku" disabled={SelectedUniqueId ? true : false} />
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

                <Form.Item className="w-full flex justify-end">
                    <Button
                        type="default"
                        htmlType="submit"
                        className={buttonClass} // Apply the button class based on success state
                        loading={isLoading}
                    >
                        {isSuccess ? "Saved" : "Save"} {/* Change button text based on success state */}

                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default VariantsCrud;