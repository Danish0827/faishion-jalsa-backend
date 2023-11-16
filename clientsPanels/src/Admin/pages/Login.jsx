import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { AdminUrl, adminData, links } from '../constant';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate()

    const [adminLoginData, setadminLoginData] = useState(null);
    const [filteredLinks, setfilteredLinks] = useState([]);
    const [error, seterror] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Send the email and password to the Node.js server
        try {
            const response = await fetch(`${AdminUrl}/api/superadminLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            if (data?.status == 200) {
                Cookies.set('adminData', data.data.loggedId);
                let timerInterval
                Swal.fire({
                    title: 'Logged Successfully',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                            window.location.href = filteredLinks.length > 0 ? filteredLinks[0] : '/Admin/404'
                        }, 1500)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            } else if (data?.error) {
                Swal.fire({
                    title: 'Internal Server Error..',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                })
            } else {
                let timerInterval
                Swal.fire({
                    title: 'Invalid Credentails',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        timerInterval = setInterval(() => {
                            // window.location.href = '/Admin'
                        }, 1000)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            }
        } catch (err) {
            console.log(err);
        }

    };

    useEffect(() => {
        const AdminData = async () => {
            try {
                const jsondata = await adminData();
                console.log(jsondata);
                setadminLoginData(jsondata);
                if (jsondata?.error) {
                    seterror(true)
                }

            } catch (err) {
                console.log(err);
                seterror(true)
            }
        }

        const filteredLinks =
            adminLoginData?.[0]?.role_id?.length > 0
                ? links[0].links?.flatMap((link) => {
                    if (adminLoginData[0].role_id.includes(link.id)) {
                        return link.to ? [link.to] : link.dropList?.map((drplist) => drplist.to);
                    }
                    return null;
                }).filter((toValue) => toValue !== null)
                : [];

        setfilteredLinks(filteredLinks)
        adminLoginData?.length == 0 || adminLoginData == null || adminLoginData == undefined
            ?
            AdminData()
            :
            error ?
                Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: 'Something went wrong on the server side.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                })
                : window.location.href = filteredLinks.length > 0 ? filteredLinks[0] : '/Admin/404'
    }, [adminLoginData])

    // console.log(adminLoginData);
    return (
        <>
            <head>
                <title>
                    Login
                </title>
            </head>
            {
                adminLoginData?.length == 0 && adminLoginData == undefined ? 'Loading' :
                    <section className="bg-[#081831] dark:bg-[#081831]">
                        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                            {/* <a href="/Admin" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                                <img className="w-32 h-32 mr-2" src="/logo.jpg" alt="logo" />
                            </a> */}
                            <div className="w-half bg-white rounded-md shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-8">
                                        Login to start your session
                                    </h1>
                                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                        <div>
                                            {/* <label
                                                htmlFor="email"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Your email
                                            </label> */}
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Email"
                                                required
                                                value={email}
                                                onChange={handleEmailChange}
                                            />
                                        </div>
                                        <div>
                                            {/* <label
                                                htmlFor="password"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Password
                                            </label> */}
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                placeholder="Password"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-slate-600 focus:border-slate-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required
                                                value={password}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 bg-gray-50 focus:ring-1 focus:ring-[#081831] dark:bg-[#081831] dark:border-[#081831] dark:focus:ring-[#081831] dark:ring-offset-[#081831] text-[#081831]" required="" />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label for="remember" className="text-gray-500 dark:text-gray-300">Remember Me</label>
                                                </div>
                                            </div>
                                            {/* <a href="#" className="text-sm font-medium text-slate-600 hover:underline dark:text-slate-500">Forgot password?</a> */}
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full block text-white bg-[#081831] focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
                                        >
                                            Login
                                        </button>
                                    </form>
                                    {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
                                        Don’t have an account yet? <a href="#" className="font-medium text-slate-600 hover:underline dark:text-slate-500">Sign up</a>
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    </section>
            }
        </>
    )
}

export default Login