const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', function (req, res) {
    const options = {
        root: path.join(__dirname)
    };
    const filename = 'index.html';
    res.sendFile(filename, options);
});

let roomno = 1;

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.join("room-" + roomno);

    io.sockets.in("room-" + roomno).emit("RoomsConnected", 'Connected in room no ' + roomno);

    socket.on('sendMessage', function (message) {
        // Broadcast the message to all clients in the room
        io.sockets.in("room-" + roomno).emit('newMessage', message);
    });

    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });
});

server.listen(5000, function () {
    console.log("Server ready on port 5000");
});
