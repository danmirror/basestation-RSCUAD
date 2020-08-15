var express = require('express');
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var net = require('net');

var count1 = 0;
var count2 = 0;
var count3 = 0;
var count4 = 0;
var min_1 = 0;
var min_2 = 0;
var min_3 = 0;
var min_4 = 0;


var datarobot;
var robot1;
var robot2;
var robot3;
var robot4;

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
    var d = new Date();
    var sec = d.getSeconds();
    var min = d.getMinutes();
    
    
    if(data_last[0]=="10"){
      robot1=0; 
      count1=sec; 
      min_1=min;
    }
    else if(data_last[0]=="11"){
       robot1=1; 
       count1=sec; 
       min_1=min}
    else{
      //check loss robot
      let set_1 = sec-count1;
      if(set_1<0){
        set_1 = sec+(60-count1);
      }
      if(set_1 >= 10 || min!=min_1 ){
        robot1=0;
      }
    }

    if(data_last[0]=="20"){robot2 = 0;}
    else if(data_last[0]=="21"){robot2=1; }
    else{
      //check loss robot
      let set_2 = sec-count2;
      if(set_2<0){
        set_2 = sec+(60-count2);
      }
      if(set_2 >= 10 || min!=min_2 ){
        robot2=0;
      }

    }
    if(data_last[0]=="30"){robot3=0; }
    else if(data_last[0]=="31"){robot3=1;  }
    else{
      //check loss robot
      let set_3 = sec-count3;
      if(set_3<0){
        set_3 = sec+(60-count3);
      }
      if(set_3 >= 10 || min!=min_3 ){
        robot3=0;
      }

    }
    if(data_last[0]=="40"){ robot4=0;}
    else if(data_last[0]=="41"){ robot4=1;}
      
    else{
      //check loss robot
      let set_4 = sec-count4;
      if(set_4<0){
        set_4 = sec+(60-count4);
      }
      if(set_4 >= 10 || min!=min_4 ){
        robot4=0;
      }

    }
    if(robot1==1){ datarobot="satu"}
    else if(robot2==1){ datarobot="dua"}
    else if(robot3==1){ datarobot="tiga"}
    else if(robot4==1){ datarobot="empat"}
    else{
      datarobot="null"
    }

    // c.write(data_last.toString());
    c.write(datarobot);
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