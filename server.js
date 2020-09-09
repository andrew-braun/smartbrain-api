const express = require("express");
const bcryptHash = require("./bcryptHash");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())

const database = {
    users: [
        {
            id: "1",
            name: "R2-D2",
            email: "r2@d2.net",
            password: "beepboop",
            entries: 0,
            joined: new Date()
        },
        {
            id: "2",
            name: "Sonny",
            email: "sonny@asimov.org",
            password: "human",
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: "987",
            hash: "",
            email: "r2@d2.net"
        }
    ]
}

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[0].email
        && req.body.password === database.users[0].password) {
        res.json(database.users[0])
    } else {
        res.status(400).json("error logging in");
    }
})

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;

    database.users.push(
        {
            id: Math.floor(Math.random() * 10000 * Math.random()),
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        }
    )
    res.json(database.users[database.users.length - 1]);
})

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } else {
            res.status(404).json('This user not found');
        }
    })
    if (!found) {
        res.status(400).json("Not found")
    }
})

app.put("/image", (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } else {
            res.status(404).json('This user not found');
        }
    })
    if (!found) {
        res.status(400).json("Not found")
    }
})

app.listen(3000, () => {
    console.log("App is running on port 3000");
})


/* 
/ --> res = this is working
/signin --> POST (user data in JSON format) = success/fail
/register --> POST (user data in JSON format) =  user
/profile/:userId --> GET = user
/image --> PUT --> user

*/