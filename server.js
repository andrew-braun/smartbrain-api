const express = require("express");
const bcrypt = require('bcrypt');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const encrypt = (password) => {
    let hashedString = [];
    return bcrypt.hash(password, 2, function(err, hash) {
        hashedString.push(hash);
        console.log(hashedString)
    })
    return hashedString
}

console.log(encrypt("password"))

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

// const hashes= [];

// bcrypt.hash("password", 2, function(err, hash) {
//     hashes.push(hash)
//     console.log(hashes)
// })

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post("/signin", (req, res) => {
    if (req.body.email === database.users[0].email
        && req.body.password === database.users[0].password) {
        res.json("success")
    } else {
        res.status(400).json("error logging in");
    }
})

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    let hashedPassword = "";

    

    database.users.push(
        {
            id: Math.floor(Math.random() * 10000 * Math.random()),
            name: name,
            email: email,
            password: hashedPassword,
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

app.post("/image", (req, res) => {
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