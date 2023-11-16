import React from 'react';
import { DownloadOutlined } from '@ant-design/icons'; // Import the Excel icon from Ant Design

const DownloadSampleExcel = ({ selectedSubcategory }) => {
    const subcatname = selectedSubcategory?.subcategory_name;

    // Remove spaces from the middle, front, and end
    const cleanedSubcatname = subcatname.replace(/\s+/g, '').replace(/^\s+|\s+$/g, '');

    // Remove special characters like & and *
    const sanitizedSubcatname = cleanedSubcatname.replace(/[&*]/g, '');

    // Convert to lowercase
    const finalSubcatname = sanitizedSubcatname.toLowerCase();

    const handleDownload = () => {
        // // Generate the download link based on the selected subcategory
        // const downloadLink = `/SampleExcelSheet/${finalSubcatname}.xlsx`;
        const downloadLink = `/SampleExcelSheet/products.xlsx`;

        // Create a virtual anchor element to trigger the download
        const anchor = document.createElement('a');
        anchor.href = downloadLink;
        anchor.download = `Sample_${finalSubcatname}_Listing.xlsx`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    return (
        <button
            className='bg-green-50 hover:bg-green-100 text-green-800 py-2 px-4 rounded-full shadow-md cursor-pointer flex items-center'
            onClick={handleDownload}
        >
            <DownloadOutlined className='text-green-600 mr-2' /> {/* Add Excel icon */}
            Download Sample Excel
        </button>
    );
};

export default DownloadSampleExcel;
