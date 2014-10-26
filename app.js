var express = require('express');
require('socket.io-client');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/socket.io.js', function (req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io-client/socket.io.js');
});

var io = require('socket.io').listen(app.listen(8080));

var counter = 0;

io.sockets.on('connection', function (socket) {
    console.log('User Connected ' + socket.id);
    
    socket.username = socket.request._query.username;
    io.sockets.emit('msg', {
        username: "SERVER",
        msg: socket.username+ " logged in!"
    });

    socket.on('msg', function (data) {
        console.log(socket.username+" => "+data);
        io.sockets.emit('msg', {
            username: socket.username,
            msg: data
        });
    });

    socket.on('disconnect', function () {
        console.log('Disconnected ' + socket.id);
    });
});