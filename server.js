const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register.js")
const signin = require("./controllers/signin.js")

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
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .returning("*")
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch((err) => res.status(400).json("User not found"));
});

/* increment the user's image entries count */
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("Unable to get count"));
});

/* 
/ --> res = this is working
/signin --> POST (user data in JSON format) = success/fail
/register --> POST (user data in JSON format) =  user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
