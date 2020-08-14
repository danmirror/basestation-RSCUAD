var express = require('express');
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var net = require('net');

var data_last = 0;
// ====================send to net========================
var netServer = net.createServer(function(c) {
  console.log('client connected');
    // receive
  c. on('data', function(data) {
    console.log('Receivedd: ' + data);
    data_last = data;
    
    data_last = JSON.parse("["+data_last+"]");    // convert string to array

    console.log('data terakhir',data_last);

    // send to web with net to client
    io.sockets.emit('hi', data_last.toString());
    // send to client
    c.write(data_last.toString());
    c.pipe(c);
  });

  c.on('end', function() {
    console.log('client disconnected');
  });
  
});
// main service listing to any service connection on port 8124
netServer.listen(8124);


// ====================send to web====================


app.get('/', function (req, res) {
  res.sendFile(__dirname+'/index.html');
});
// mengizinkan folder
// app.use(express.static(__dirname+'/static'));
app.use(express.static(__dirname + '/style/'));
// app.use(express.static(__dirname + '/asset/'));

// =====================send with another way=============
// io.on('connection', function (socket) {
//   socket.emit('news', { hello: data_last.toString() });

//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
server.listen(8081);