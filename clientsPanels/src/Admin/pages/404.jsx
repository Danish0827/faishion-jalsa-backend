import { Link } from "react-router-dom";
import { adminData, links } from "../constant";
import { useEffect, useState } from "react";

export default function NotFound({adminLoginData}) {
  

    const filteredLinks =
        adminLoginData?.[0]?.role_id?.length > 0
            ? links[0].links?.flatMap((link) => {
                if (adminLoginData[0].role_id.includes(link.id)) {
                    return link.to ? [link.to] : link.dropList?.map((drplist) => drplist.to);
                }
                return null;
            }).filter((toValue) => toValue !== null)
            : [];

    console.log(filteredLinks);
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <p className="text-5xl font-bold text-indigo-600">404</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                <p className="mt-6 text-xl leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    {
                        <Link to={`${ filteredLinks?.length > 0 ? filteredLinks[0] : ''}`}>
                            <a className="rounded-md bg-indigo-600 px-4 py-3 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600">
                                Go back home
                            </a>
                        </Link>
                    }
                    <a href="#" className="text-xl font-semibold text-indigo-600">
                        Contact support <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
        </main>
    );
}
