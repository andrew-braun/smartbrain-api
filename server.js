const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/imageentry.js");
const imageurl = require("./controllers/imageentry.js");

/* create database connection with knex */
const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});

/* Set up Express server */
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.get("/", (req, res) => {
//   db("users")
//     .returning("*")
//     .then((users) => res.json(users));
// });

app.get("/", (req, res) => { res.send("It's working!") })
/* Post signin requests, check against login table, and return user if email/hash matches */

app.post("/signin", (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

/* Hash user password, store info in user table/login table, return user, redirect */
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

/* return the requested profile by ID */
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

/* increment the user's image entries count */
app.post("/imageurl", (req, res) => {
  imageurl.handleApiCall(req, res);
});

/* increment the user's image entries count */
app.put("/image", (req, res) => {
  image.handleImageEntry(req, res, db);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});

