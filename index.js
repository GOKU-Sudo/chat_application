// This js file will set up and manage the users connections


const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const bcrypt = require('bcrypt');
// const path = require("path");
const bodyParser = require('body-parser');
// const users = require('./public/js/data.js').userDB;
const io = require("socket.io")(httpServer, {
    cors: {
        origin: 'https://chatgoku.onrender.com/',
        // origin: '*',
        methods: ["GET", "POST"],
        //     methods: " ",
    }
});

const userDB = [];
//



app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/firstPage.html');
});




const port = process.env.port || 5000;

httpServer.listen(port, () => {
    console.log("server running boss!!");
});
const usersIo = {};

//login retrive

app.post('/register', async (req, res) => {
    try {
        let foundUser = userDB.find((data) => (req.body.email === data.email)||(req.body.username===data.username));
        if (!foundUser) {

            let hashPassword = await bcrypt.hash(req.body.password, 10);

            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            userDB.push(newUser);
            console.log('User list', userDB);

            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='/Login/login.html'>login</a></div><br><br><div align='center'><a href='/Login/registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email or Username already used</h2></div><br><br><div align='center'><a href='/Login/registration.html'>Register again</a></div>");
        }
    } catch {
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try {
        let foundUser = userDB.find((data) => (req.body.email === data.email));
        console.log(foundUser);
        if (foundUser) {

            let submittedPass = req.body.password;
            let storedPass = foundUser.password;

            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                // let path=__dirname+"/index.html";
                // res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href="index.html">logout</a></div>`);
                let logedInUsers = JSON.stringify(usersIo);
                console.log(`log in users list\n ${logedInUsers}`);
                res.sendFile(__dirname + "/index.html");
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='/Login/login.html'>login again</a></div>");
            }
        }
        else {

            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);

            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='/Login/login.html'>login again<a><div>");
        }
    } catch {
        res.send("Internal server error");
    }
});




// Allow requests from all origins/particular origins

io.on("connection", socket => {           // This is instance of socket.io. This listens the connection of different users that want's to connect,
    // ex- Goku wants to connect/send, Rohit, Arjun want's to conenct 


    socket.on("ReqDB", () => {
        console.log("Sending database");
        socket.emit("SendDB", userDB);
    });


    socket.on("new-user-joined", name3 => {  // user-joined is a event. socket.on handles what to do  with the particular user which is connected to socket.io server.
  
        console.log("NewUserJoined ", name3);

        usersIo[socket.id] = name3;

        let logedInUsers= JSON.stringify(usersIo);
        console.log(`logged in users list\n ${logedInUsers}`);

        socket.broadcast.emit("user-joined", name3);

    });
    socket.on("send", message => { // send is particular event if happens and message is the call back fucntion 
        socket.broadcast.emit('recieve', { message: message, name3: usersIo[socket.id] })
    });

    socket.on("disconnect", doThis => { // to inform all client when users lefts the chat
        socket.broadcast.emit("left", usersIo[socket.id]);
        if (usersIo[socket.id]!== undefined) { 
            console.log(`${usersIo[socket.id]} left`);
            delete usersIo[socket.id];
        }

    });

})
