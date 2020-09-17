const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register.js")
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js")
const image = require("./controllers/imageentry.js");

/* create database connection with knex */
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "testPassword",
    database: `smartbrain`,
  },
});

/* Set up Express server */
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Resolve CORS errors with cors middleware */
app.use(cors());

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

app.get("/", (req, res) => {
  db("users")
    .returning("*")
    .then((users) => res.json(users));
});

/* Post signin requests, check against login table, and return user if email/hash matches */
app.post("/signin", (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });

/* Hash user password, store info in user table/login table, return user, redirect */
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) });

/* return the requested profile by ID */
app.get("/profile/:id", (req, res) => { profile.handleProfile(req, res, db) });

/* increment the user's image entries count */
app.put("/image", (req, res) => { image.handleImageEntry(req, res, db) });

/* 
/ --> res = this is working
/signin --> POST (user data in JSON format) = success/fail
/register --> POST (user data in JSON format) =  user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
