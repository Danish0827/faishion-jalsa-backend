const express = require("express");
const app = express();
const passport = require("passport");

const CLIENT_URL = "http://localhost:5173";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
  next();
});

app.get("/login/success", (req, res) => {
  if (req.user) {
    // Set the "googleLogin" cookie with a value of true
    res.cookie("googleLogin", true);

    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  }
});

app.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

app.get("/logout", (req, res) => {
  req.logout();

  // Clear all cookies for localhost
  const cookies = req.cookies;
  for (const cookieName in cookies) {
    if (cookies.hasOwnProperty(cookieName)) {
      res.clearCookie(cookieName, { domain: "localhost" });
    }
  }

  res.redirect(CLIENT_URL);
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

app.get(
  "/instagram",
  passport.authenticate("instagram", { scope: ["profile"] })
);

app.get(
  "/instagram/callback",
  passport.authenticate("instagram", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

app.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = app;
