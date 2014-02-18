//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);


router.use(express.static(path.resolve(__dirname, 'app')));
router.use('/bower_components', express.static(__dirname + '/bower_components'));

io.on('connection', function (socket) {
    // console.log(socket.id);
    socket.emit('youare', socket.id);
    socket.on('tankangle', function (data) {

    });

    socket.on('tankupdate', function(data) {
//        console.log('tu', data);
        socket.broadcast.emit('tankmove',data);
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Game server listening at", addr.address + ":" + addr.port);
});
