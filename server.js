const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "testPassword",
    database: `smartbrain`,
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "1",
      name: "R2-D2",
      email: "r2@d2.net",
      password: "beepboop",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "2",
      name: "Sonny",
      email: "sonny@asimov.org",
      password: "human",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "r2@d2.net",
    },
  ],
};

app.get("/", (req, res) => {
  db("users")
    .returning("*")
    .then((users) => res.json(users));
});

app.post("/signin", (req, res) => {
    
    db("users").where({email})
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return db("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
  .catch((err) =>
    res
      .status(400)
      .json(
        "Critical systems failure! Evacuate! Oh, wait, sorry--it was just a problem with your registration. Have you already joined?"
      )
  );
});

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

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

/* 
/ --> res = this is working
/signin --> POST (user data in JSON format) = success/fail
/register --> POST (user data in JSON format) =  user
/profile/:userId --> GET = user
/image --> PUT --> user

*/
