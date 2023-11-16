import React, { useState } from 'react';
import AuthCheck from './components/AuthCheck';
import { Card, Metric, Text, Icon, Flex, Grid } from "@tremor/react";
import { Form, Input, Button, Modal } from 'antd';
import { AdminUrl } from "../Admin/constant";
import Swal from "sweetalert2";

const Profile = ({ vendorDatastate }) => {
  // console.log(vendorDatastate);

  const { TextArea } = Input;

  const { average_rating, bank_account_name, bank_account_number, bank_branch, bank_name, bank_routing_number, bank_swift_code, brand_logo, brand_name, business_address, business_description, business_email, business_license_url, business_logo_url, business_model, business_phone, business_type, business_website, categories, company_city, company_country, company_name, company_state, company_zip_code, country_code, email, email_otp, email_verification_status, facebook_url, id, instagram_url, linkedin_url, mobile_number, mobile_otp, mobile_verification_status, password, payment_info, products, registration_date, registration_number, reset_otp, return_policy, shipping_address, shipping_info, shipping_policy, status, support_contact, support_contact_1, support_contact_2, tax_id_number, terms_and_conditions, total_products, total_sales, trademark_certificate, twitter_url, useridvendor, vendor_profile_picture_url, vendorname } = vendorDatastate[0]

  const [form] = Form.useForm();

  const categoriesdata = [
    {
      title: "Sales",
      metric: "$ 23,456,456",
      // icon: TicketIcon,
      color: "indigo",
    },
    {
      title: "Profit",
      metric: "$ 13,123",
      // icon: CashIcon,
      color: "fuchsia",
    },
    {
      title: "Customers",
      metric: "456",
      // icon: UserGroupIcon,
      color: "amber",
    },
  ];

  const [selectedKey, setSelectedKey] = useState(vendorDatastate[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    form.setFieldsValue(vendorDatastate[0]);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const updateProfile = async (values) => {
    //Updating
    try {
      // Make API call to send form data to the backend
      const response = await fetch(`${AdminUrl}/api/updateVendorDbByVendor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedKey, values }),
      });

      if (response.ok) {
        // Handle successful response
        Swal.fire({
          icon: "success",
          title: "Profile updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        console.log("Form data sent successfully!");
        setIsModalOpen(false);
      } else {
        // Handle error response
        console.error("Error sending form data:", response.statusText);
      }
    } catch (error) {
      // Handle error
      console.error("Error sending form data:", error);
    }
  }

  return (
    vendorDatastate && vendorDatastate.length > 0 ?
      !vendorDatastate?.[0].email_verification_status || !vendorDatastate?.[0].mobile_verification_status || vendorDatastate?.[0].status === 1 ?
        <AuthCheck vendorDatastate={vendorDatastate} /> :
        <div className="mt-5">
          <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
            {categoriesdata.map((item) => (
              <Card key={item.title} decoration="top" decorationColor={item.color}>
                <Flex justifyContent="start" className="space-x-4">
                  {/* <Icon icon={item.icon} variant="light" size="xl" color={item.color} /> */}
                  <div className="truncate">
                    <Text>{item.title}</Text>
                    <Metric className="truncate">{item.metric}</Metric>
                  </div>
                </Flex>
              </Card>
            ))}
          </Grid>

          <Button className="mt-5 h-12 bg-[#0391d1] text-white hover:bg-[#0391d1]/80 hover:text-white rounded-full font-semibold tracking-wider" onClick={showModal}>
            Edit Profile
          </Button>

          <div className='flex justify-around text-lg text-gray-700 mt-5'>
            <div className='lg:w-full border rounded-md bg-white p-5'>
              <div className='flex lg:flex-row flex-col justify-between mx-2 p-4 items-center'>
                <div className='text-2xl font-semibold mb-2'>
                  <img className='w-36 lg:w-32' src="/logo-black.png" alt="" />

                </div>
                <div className='text-lg flex flex-col gap-2'>
                  <h1><b>Name: </b>{`${vendorname}`}</h1>
                  <h1><b>Email:</b> {email}</h1>
                  <h1><b>Mobile:</b> {mobile_number}</h1>
                </div>
              </div>

              <div className='mt-10 px-5 space-y-2'>
                <h1 className='font-semibold uppercase text-[#081831]'>Brand Details</h1>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Brand Name:</h1>
                  <h1 className='flex-1'>{brand_name}</h1>
                </div>
                <div className='flex flex-1 gap-2 items-center'>
                  <h1 className='font-semibold'>Brand Logo:</h1>
                  <div className='flex-1'> <img className='h-14' src="/logo-black.png" alt="" /></div>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Business Model:</h1>
                  <h1 className='flex-1'>{business_model}</h1>
                </div>
              </div>
              <div className='mt-10 px-5 space-y-2'>
                <h1 className='font-semibold uppercase text-[#081831]'>Company Details</h1>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Company Name:</h1>
                  <h1 className='flex-1'>{company_name}</h1>
                </div>
                <div className='flex flex-1 gap-2 items-center'>
                  <h1 className='font-semibold'>Business Email:</h1>
                  <h1 className='flex-1'>{business_email}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Business Phone:</h1>
                  <h1 className='flex-1'>{business_phone}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Company Address:</h1>
                  <h1 className='flex-1'>{business_address}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Company City:</h1>
                  <h1 className='flex-1'>{company_city}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Company State:</h1>
                  <h1 className='flex-1'>{company_state}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Company Country:</h1>
                  <h1 className='flex-1'>{company_country}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Company Zip Code:</h1>
                  <h1 className='flex-1'>{company_zip_code}</h1>
                </div>
              </div>
              <div className='mt-10 px-5 space-y-2'>
                <h1 className='font-semibold uppercase text-[#081831]'>Supported Contacts</h1>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Support Contact 1:</h1>
                  <h1 className='flex-1'>{support_contact_1}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Support Contact 2:</h1>
                  <h1 className='flex-1'>{support_contact_2}</h1>
                </div>
              </div>
              <div className='mt-10 px-5 space-y-2'>
                <h1 className='font-semibold uppercase text-[#081831]'>Shipping Address</h1>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Shipping Address:</h1>
                  <h1 className='flex-1'>{shipping_address}</h1>
                </div>
              </div>
              <div className='mt-10 px-5 space-y-2'>
                <h1 className='font-semibold uppercase text-[#081831]'>Social Links</h1>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Website:</h1>
                  <h1 className='flex-1'>{business_website}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Linkedln:</h1>
                  <h1 className='flex-1'>{linkedin_url}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Twitter:</h1>
                  <h1 className='flex-1'>{twitter_url}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Instagram:</h1>
                  <h1 className='flex-1'>{instagram_url}</h1>
                </div>
                <div className='flex flex-1 gap-2'>
                  <h1 className='font-semibold'>Facebook:</h1>
                  <h1 className='flex-1'>{facebook_url}</h1>
                </div>
              </div>
              <div className='mt-10 px-5 space-y-2'>
                <div className=''>
                  <h1 className='flex-1 py-1 font-semibold uppercase text-[#081831]'>Return Policy</h1>
                  <p>{return_policy}</p>
                </div>
                <div className=''>
                  <h1 className='flex-1 py-1 font-semibold uppercase text-[#081831]'>Shipping Policy</h1>
                  <p>{shipping_policy}</p>
                </div>
                <div className=''>
                  <h1 className='flex-1 py-1 font-semibold uppercase text-[#081831]'>Terms & Condition</h1>
                  <p>{terms_and_conditions}</p>
                </div>
              </div>
            </div>
          </div>

          <Modal className='' title="Edit Profile" open={isModalOpen}
            footer={[
              <Form form={form} onFinish={updateProfile}>
                <Form.Item
                  name="vendorname"
                  label="Vendor Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your Full Name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {/* <div className='flex items-center'>
          <h1>Profile Picture</h1>
          <input type="file" className='border'/>
        </div> */}
                <Form.Item
                  name="brand_name"
                  label="Brand Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input the Brand name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {/* <div className='flex items-center'>
          <h1>Brand Logo</h1>
          <input type="file" className='border'/>
        </div> */}
                <Form.Item
                  label="Company Name"
                  name="company_name"
                  rules={[{ required: true, message: "Please enter company name" }]}
                >
                  <Input />
                </Form.Item>
                <div>
                  <h1 className='font-semibold'>Company Address</h1>
                  <Form.Item
                    label="Street Address"
                    name="business_address"
                    rules={[{ required: true, message: 'Please input your Address!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Town / City"
                    name="company_city"
                    rules={[{ required: true, message: 'Please input your City!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="State / County"
                    name="company_state"
                    rules={[{ required: true, message: 'Please input your State!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Postcode / ZIP"
                    name="company_zip_code"
                    rules={[{ required: true, message: 'Please input your Company Zip Code!' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div>
                  <h1 className='font-semibold'>Shipping Address</h1>
                  <Form.Item
                    label="Street Address"
                    name="shipping_address"
                    rules={[{ required: true, message: 'Please input your Shipping Address!' }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div>
                  <h1 className='font-semibold'>Social Links</h1>
                  <Form.Item
                    label="Business Url"
                    name="business_website"
                    rules={[{ required: true, message: 'Please input your Website URL!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="LinkedIn : "
                    name="linkedin_url"
                    rules={[{ required: true, message: 'Please input your LinkedIn URL!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Twitter"
                    name="twitter_url"
                    rules={[{ required: true, message: 'Please input your Twitter URL!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Instagram"
                    name="instagram_url"
                    rules={[{ required: true, message: 'Please input your Instagram URL!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Facebook"
                    name="facebook_url"
                    rules={[{ required: true, message: 'Please input your Facebook URL!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Return Policy"
                    name="return_policy"
                    rules={[{ required: true, message: 'Please enter return policy!' }]}
                  >
                    <TextArea />
                  </Form.Item>
                  <Form.Item
                    label="Shipping Policy"
                    name="shipping_policy"
                    rules={[{ required: true, message: 'Please enter shipping policy!' }]}
                  >
                    <TextArea />
                  </Form.Item>
                  <Form.Item
                    label="Terms & Condition"
                    name="terms_and_conditions"
                    rules={[{ required: true, message: 'Please enter terms & conditions!' }]}
                  >
                    <TextArea />
                  </Form.Item>
                </div>
                <div className='flex justify-items-end items-center gap-2'>
                  <Button type="button" className='border border-gray-700' onClick={handleCancel}>Cancel</Button>
                  <Form.Item shouldUpdate>
                    {() => (
                      <Button
                        type="submit"
                        htmlType="submit"
                        // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                        className={`border mt-4 bg-[#081831] text-white`}
                      >
                        Update
                      </Button>
                    )}
                  </Form.Item>
                </div>
              </Form>
            ]}>
          </Modal>
        </div>
      : ''
  );
};

export default Profile;
