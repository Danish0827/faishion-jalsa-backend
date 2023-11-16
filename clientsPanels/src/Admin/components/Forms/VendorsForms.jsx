import { Button, message, Steps, theme, Form, Input, Select } from 'antd';
import { useState, useEffect } from 'react';
import { MailOutlined } from '@ant-design/icons';
import InputMask from 'react-input-mask';
import { AdminUrl } from '../../constant'

const { Option } = Select;

const countryCodes = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  // Add more country codes as needed
];

const MobileNumberInput = ({ value, onChange, countryCode }) => {
  const getMask = (countryCode) => {
    // Define the mask based on the selected country code
    switch (countryCode) {
      case '+1':
        return '999 999 9999'; // Example mask for United States
      case '+44':
        return '9999 999999'; // Example mask for United Kingdom
      case '+91':
        return '99999 99999'; // Example mask for India
      default:
        return ''; // Default mask when country code is not specified
    }
  };

  const mask = getMask(countryCode);

  return (
    <InputMask mask={mask} value={value} onChange={onChange} >
      {(inputProps) => <Input {...inputProps} placeholder="Mobile Number" className='rounded-md h-8 border border-gray-300' />}
    </InputMask>
  );
};

const VendorsForms = ({ vendorData }) => {
  const [current, setCurrent] = useState(0);
  const Pinfo = () => {
    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const [mobileNumber, setMobileNumber] = useState('');
    const [countryCode, setCountryCode] = useState('');
    
    const handleMobileNumberChange = (e) => {
      setMobileNumber(e.target.value);
    };

    const handleCountryCodeChange = (value) => {
      setCountryCode(value);
    };

    // To disable submit button at the beginning.
    useEffect(() => {
      forceUpdate({});
    }, []);

    const onFinish = async (values) => {
      console.log('Finish:', values);
      try {
        // Make API call to send form data to the backend
        const response = await fetch(`${AdminUrl}/api/addVendorstoDb`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          // Handle successful response
          next(); // Move to the next step or perform any other action
          console.log('Form data sent successfully!');
        } else {
          // Handle error response
          console.error('Error sending form data:', response.statusText);
        }
      } catch (error) {
        // Handle error
        console.error('Error sending form data:', error);
      }
    };

    return <>
      <div className='mt-10 p-2'>
        <Form form={form} name="vertical_login" onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              {
                required: true,
                message: 'Please input your mobile number!',
              },
            ]}
          >
            <div className="flex">
              <Form.Item
                name="countryCode"
                rules={[
                  {
                    required: true,
                    message: 'Please select country code!',
                  },
                ]}
              >
                <Select placeholder={'Code'} onChange={handleCountryCodeChange}>
                  {countryCodes.map((country) => (
                    <Option key={country.code} value={country.code}>
                      {country.code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <MobileNumberInput value={mobileNumber} onChange={handleMobileNumberChange} countryCode={countryCode} />
            </div>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Please enter your email address!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>

          <Form.Item shouldUpdate wrapperCol={{ offset: 6, span: 18 }}>
            {() => (
              <Button
                type="submit"
                htmlType="submit"
                disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                className={`border mt-5 ${form.isFieldsTouched(true) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
              >
                Next
              </Button>
            )}
          </Form.Item>
        </Form>

      </div>
    </>
  }
  const steps = [
    {
      title: 'Verification',
      content: <Pinfo />,
    },
    {
      title: 'Brand Details',
      content: 'Second-content',
    },
    {
      title: 'Company Details',
      content: 'Last-content',
    },
    {
      title: 'Shipping Address',
      content: 'Last-content',
    },
    {
      title: 'Bank Details',
      content: 'Last-content',
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Steps current={current} items={items} className='mt-5 mb-5' />
      <div>{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current < steps.length - 1 && current != 0 &&
          <Button className='border border-2 border-gray-200' type='button'
            onClick={() => next()}>
            Next
          </Button>
        }

        {current === steps.length - 1 && (
          <Button type='button' onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
export default VendorsForms;