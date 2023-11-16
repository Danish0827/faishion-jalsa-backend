import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AdminUrl } from "../../Admin/constant";
import { Button } from "antd";

const Header = ({ user }) => {
  const logout = () => {
    window.open(`${AdminUrl}/auth/logout`, "_self");
  };

  const CookieUser = Cookies.get("customerLoginCookies");

  const logoutUser = () => {
    Cookies.remove("customerLoginCookies");
    window.location.href = "/Customers/Login";
  };
  return (
    <div>
      {user ? (
        <div className="user-profile-content">
          <div className="user-profile-picture">
            <img src={user?.picture} alt="User Profile" />
          </div>
          <div className="user-profile-details">
            <h2>
              {user?.given_name} {user?.family_name}
            </h2>
            <h2>{user?.email}</h2>
          </div>
          <Button type="default" onClick={CookieUser ? logoutUser : logout}>
            Logout
          </Button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Header;
