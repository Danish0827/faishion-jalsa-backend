const GoogleStrategy = require("passport-google-oauth20").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const express = require("express");
const app = express();
const passport = require("passport");
const pool = require("../config");
app.use(express.json());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});
const GOOGLE_CLIENT_ID =
  "216641462687-o228gdks8ucroh05mi1m76nrot0ivm80.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// INSTAGRAM_CLIENT_ID = "a69652bf64c40bb276d7";
// INSTAGRAM_CLIENT_SECRET = "eccb66be0e1bfc2940efd14ce867cb767a1ed7cb";

FACEBOOK_APP_ID = "1078529809977329";
FACEBOOK_APP_SECRET = "your id";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true, // This allows us to pass a 'req' parameter to the callback
      // Add the 'prompt' parameter to force account selection
      authorizationParams: {
        prompt: "select_account",
      },
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        // Check if the Google ID exists in the database
        const { rows } = await pool.query(
          "SELECT * FROM customers WHERE google_id = $1 OR email = $2",
          [profile.id, profile._json.email]
        );

        if (rows.length > 0) {
          // User exists, log them in
          done(null, rows[0]);
        } else {
          // User doesn't exist, insert a new record
          const insertQuery = `
              INSERT INTO customers (
                google_id, 
                given_name, 
                family_name, 
                email, 
                verified_with, 
                picture, 
                password, 
                phone_number, 
                address_line_1, 
                city, 
                state, 
                zip_code, 
                country, 
                updated_at, 
                created_at, 
                status
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, null, null, null, null, null, null, current_timestamp, current_timestamp, 1
              )
            `;

          const values = [
            profile.id,
            profile.name.givenName,
            profile.name.familyName,
            profile.emails && profile.emails[0] && profile.emails[0].value, // Check if email exists
            "{Google}", // You can customize this value
            profile.photos && profile.photos[0] && profile.photos[0].value, // Check if photo exists
            "", // You can customize the password logic
          ];

          await pool.query(insertQuery, values);

          // Retrieve the newly inserted user data and pass it to the callback
          const { rows: insertedUser } = await pool.query(
            "SELECT * FROM customers WHERE google_id = $1",
            [profile.id]
          );

          if (insertedUser.length === 1) {
            done(null, insertedUser[0]);
          } else {
            done(new Error("User registration failed"));
          }
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
