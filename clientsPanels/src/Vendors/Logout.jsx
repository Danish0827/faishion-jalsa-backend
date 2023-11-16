import Cookies from 'js-cookie';
import React from 'react'
import Swal from 'sweetalert2';

const Logout = () => {
    const cookieRemoved = Cookies.remove('vendorData');

    if (cookieRemoved === undefined) {
        // Cookie was successfully removed
        let timerInterval
        Swal.fire({
            icon: 'success',
            title: 'Logged Out Successfully!',
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    window.location.href = '/Vendors/Login'
                }, 1500)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        });
        // Perform any additional logout logic here if needed
        // Redirect to the login page or perform any other actions after logout
        // For example, if you are using React Router for navigation:
        // history.push('/login');
    } else {
        // Error in removing the cookie
        Swal.fire({
            icon: 'error',
            title: 'Failed to Log Out',
            text: 'An error occurred while logging out. Please try again later.',
        });
    }
    return (
        <div>Logout</div>
    )
}

export default Logout