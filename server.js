var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

var tankList = [];

app.use(express.static(path.resolve(__dirname, 'app')));

io.on('connection', function (socket) {
    socket.join('tanks');
    tankList = socket.namespace.manager.rooms['/tanks'];

    socket.emit('room', tankList); 
    socket.emit('youare', socket.id);

    socket.on('tankupdate', function(data) {
        console.log(data);
        socket.broadcast.emit('tankmove',data);
    });

    socket.on('disconnect', function() {

    });
});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Game server listening at", addr.address + ":" + addr.port);
});
