const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const { Client } = require("pg");

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/imageentry.js");
const imageurl = require("./controllers/imageentry.js");

// /* Create Heroku client database connection */
// const client = new Client({
//   connectionString: process.env.DATABUSE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

/* create database connection with knex */
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  },
});

/* Set up Express server */
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Resolve CORS errors with cors middleware */
app.use(cors());

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

