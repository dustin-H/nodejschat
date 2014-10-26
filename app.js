// Loading Dependencies
var express = require('express');
var sio = require('socket.io');

// Create Express Application
var app = express();

// Host folder /public as WebServer
app.use(express.static(__dirname + '/public')); 

// Make 'socket.io.js' file available for client
app.get('/socket.io.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js');
});

// Create Socket.IO and Express Server
var io = sio.listen(app.listen(8080));

// Listening for a new Socket.IO connection
io.sockets.on('connection', function (socket) {
    console.log('User Connected ' + socket.id);
    
    // Set username to socket.io session
    socket.username = socket.request._query.username;
    
    // Broadcast new user
    io.sockets.emit('msg', {
        username: "SERVER",
        msg: socket.username+ " logged in!"
    });
    
    // receive messages from socket (listening to 'msg' event)
    socket.on('msg', function (data) {
        // Broadcast user message
        io.sockets.emit('msg', {
            username: socket.username,
            msg: data
        });
    });
    
    // Listen and Log user disconnect
    socket.on('disconnect', function () {
        console.log('Disconnected ' + socket.id);
    });
});