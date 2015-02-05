  var express = require('express');
  var app = express();
  var http = require('http');
  var server = http.createServer(app);
  var io = require('socket.io').listen(server, {
      'log': false
  });

  server.listen(8001);
  console.log("Server started on 8001");

  app.use(express.static('public')); // document root

  io.sockets.on('connection', function (socket) {

      socket.on('disconnect', function () {
        io.sockets.emit('disconnect');
      });

      socket.on('move', function(data) {
        data.socketid = socket.id;
        io.sockets.emit('move', data);
      });

  });
