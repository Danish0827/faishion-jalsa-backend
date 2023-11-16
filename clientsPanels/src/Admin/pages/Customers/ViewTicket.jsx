import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import moment from "moment";
import { Avatar, Button, Form, Image, Input, Radio, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import { AdminUrl } from '../../constant';

const ViewTicket = ({ adminLoginData }) => {
    const location = useLocation()
    const [ticketData, setTicketData] = useState(location.state.ticket);
    const customerData = location.state.customers.find((customer) => customer.customer_id === ticketData.customer_id);

    console.log(ticketData)

    const [form] = Form.useForm();
    const [formInitialValues, setFormInitialValues] = useState({
        status: ticketData.status,
    });

    useEffect(() => {
        setFormInitialValues({
            status: ticketData.status,
        });
    }, [ticketData]);

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            if (values?.attachments && Array.isArray(values.attachments)) {
                values.attachments.forEach((image) => {
                    formData.append('attachments', image.originFileObj);
                });
            }

            formData.append('ticket_id', ticketData.ticket_id)
            formData.append('message', values.message)
            formData.append('status', values.status)

            const response = await fetch(`${AdminUrl}/api/addMessageToSupportTicket`, {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Add new message request failed");
            }

            form.resetFields();

            const { data } = await response.json();
            message.success("New message added successfully");

            const newMessage = {
                message_id: data.message_id,
                customer_id: data.customer_id,
                message: data.message,
                attachments: data.attachments,
                timestamp: data.timestamp
            }
            const ticketCopy = { ...ticketData }
            ticketCopy.messages.push(newMessage)
            ticketCopy.status = data.status

            setTicketData(ticketCopy)

        } catch (error) {
            message.error("This Ticket is already closed")
            form.resetFields();
            console.error("Error:", error);
            throw error;
        }
    }

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e?.fileList;
    };

    return (
        <>
            {
                adminLoginData == null || adminLoginData?.length == 0 ? '' :
                    <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                        <div className="min-h-screen py-8 px-4 sm:px-8 lg:px-16 space-y-5">
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <h1 className="text-lg">Ticket #{ticketData.ticket_id}</h1>
                                <h1 className='text-2xl font-semibold mb-4'>{ticketData.subject}</h1>
                                <div className='flex gap-5 items-center mb-10 text-gray-500'>
                                    <p>{customerData.given_name} {customerData.family_name}</p>
                                    <p>{moment(ticketData.timestamp).format("MMMM D, YYYY hh:mm:ss A")}</p>
                                    <span
                                        className={`text-sm font-medium mr-2 px-2.5 py-0.5 rounded ${ticketData.status === 'Open' ? 'bg-red-100 text-red-800' :
                                            ticketData.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                ticketData.status === 'Closed' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800' // Default style for unknown statuses
                                            } dark:bg-blue-900 dark:text-blue-300`}
                                    >
                                        {ticketData.status}
                                    </span>
                                </div>

                                <Form
                                    form={form}
                                    name="ticket_message"
                                    layout="vertical"
                                    onFinish={onFinish}
                                    initialValues={formInitialValues}
                                >
                                    <Form.Item
                                        name="message"
                                        label="Message"
                                        rules={[{ required: true, message: 'Please input your message!' }]}
                                    >
                                        <TextArea rows={4} placeholder='Message' className='rounded-lg' />
                                    </Form.Item>
                                    <Form.Item
                                        name="attachments"
                                        label="Choose files"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                        extra=""
                                    >
                                        <Upload name="attachments" listType="picture" multiple beforeUpload={() => false}>
                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item
                                        name="status"
                                        label="Status"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please pick an item!',
                                            },
                                        ]}
                                    >
                                        <Radio.Group>
                                            <Radio.Button value="Open">Open</Radio.Button>
                                            <Radio.Button value="In Progress">In Progress</Radio.Button>
                                            <Radio.Button value="Closed">Closed</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="bg-[#081831] login-form-button flex items-center gap-2 justify-between">
                                            <span>Send</span>
                                            <svg class="h-5 w-5 text-white" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="10" y1="14" x2="21" y2="3" />  <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" /></svg>                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>

                            {ticketData["messages"]
                                .slice()
                                .reverse()
                                .map((msg) => (
                                    <div className="bg-white rounded-lg shadow-lg p-8">
                                        <div className="flex items-start mb-5 gap-4">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                                                {msg.customer_id ? (
                                                    <Image
                                                        src={customerData.picture.includes('https://') ? `${customerData.picture}` : `${AdminUrl}/uploads/customerProfileImages/${customerData.picture}`}
                                                        alt={`${customerData.given_name} ${customerData.family_name}`}
                                                        className="w-full h-full object-cover"
                                                    />) : (
                                                    <Avatar size={48} style={{ backgroundColor: "#1890ff" }}>
                                                        A
                                                    </Avatar>
                                                )}
                                            </div>
                                            <div>
                                                <p className='font-semibold text-md'>{msg.customer_id ? `${customerData.given_name} ${customerData.family_name}` : "Admin"}</p>
                                                <p className='text-sm text-gray-500'>{moment(msg.timestamp).format("MMMM D, YYYY hh:mm:ss A")}</p>


                                                <p className='my-3'>{msg.message}</p>
                                                <div className="flex gap-2">
                                                    {msg["attachments"]?.map((attachment) => (
                                                        <div className='text-center w-10 h-10 overflow-hidden flex items-center justify-center hover:bg-[#00000080] shadow-xl'>
                                                            <Image
                                                                src={`${AdminUrl}\\${attachment}`}
                                                                className="object-cover border-white"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
            }
        </>
    )
}

export default ViewTicket