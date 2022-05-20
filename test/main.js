// 
// Simple Test to easy understand
// 

var udp = require('dgram');

var buffer = require('buffer');

// creating a client socket
var client = udp.createSocket('udp4');

var data = Buffer.from('51,0,0,360,0,200,200,60,100200200630015');

function loop(){

    //sending msg
    client.send(data,8124,'localhost',function(error){
        if(error){
          client.close();
        }else{
          console.log('...');
        }
    });
    
    //receive msg
    client.on('message',function(msg,info){
        console.log('Data received from server : ' + msg.toString());
        console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
    });
    setTimeout(loop, 1000);
}    

loop();
