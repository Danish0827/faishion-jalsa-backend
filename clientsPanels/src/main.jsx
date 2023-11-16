import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="216641462687-o228gdks8ucroh05mi1m76nrot0ivm80.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
