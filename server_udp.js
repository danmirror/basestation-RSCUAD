var express = require('express');
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var net = require('net');

var dgram = require('dgram');
var server_udp = dgram.createSocket('udp4');


server_udp.on('error', (err) => {
  console.log('server_udp error:\n${err.stack}');
  server_udp.close();
});

server_udp.on('message', (msg, rinfo) => {
  // console.log('server_udp got: ${msg} from ${rinfo.address}:${rinfo.port}');
  console.log('Receivedd: ' + msg);
  data_last = msg;
    
  data_last = JSON.parse("["+data_last+"]");    // convert string to array
    
  io.sockets.emit('hi', data_last.toString());
  console.log('data terakhir',data_last);
});

server_udp.on('listening', () => {
  const address = server_udp.address();
  // console.log('server_udp listening ${address.address}:${address.port}');
});

server_udp.bind(8124);

// var data_last = 0;
// ====================send to net========================
// var netServer = net.createServer(function(c) {
//   console.log('client connected');
//     // receive
//   c. on('data', function(data) {
//     console.log('Receivedd: ' + data);
   

//     // c.write(data_last.toString());
//     c.write("datarobot");
//     c.pipe(c);
//   });

//   c.on('end', function() {
//     console.log('client disconnected');
//   });
  
// });
// // main service listing to any service connection on port 8124
// netServer.listen(8124);


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