var express = require('express');
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var net = require('net');

var dgram = require('dgram');
var server_udp = dgram.createSocket('udp4');
var server_referee = dgram.createSocket('udp4');


//variable====================================================
var referee = 0;

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
var address_ip=[];
/*
 *
 * swap function
 *  
 */
function swap(str){
    str = str.match(/.{1}/g)
    let pointer1 = 0;
    let pointer2 = str.length-1;

    while (pointer1 < pointer2){
        let temp = str[pointer1] ;
        str[pointer1] = str[pointer2] ;
        str[pointer2] = temp ;
        pointer1 += 1 ;
        pointer2 -= 1 ;
    }
    //make key '1' destroyed
    str[str.length-1]= null;
    // console.log(str);
    return str;
}

//================= metode receive/send=================
server.on('listening', () => {
    const address = server.address();
    address_ip.push(address.address);
    console.log(`server listening ${address.address}:${address.port}`);
});
server_udp.on('error', (err) => {
    console.log('server_udp error:\n${err.stack}');
    server_udp.close();
});

/*
 *
 * get message from robot
 *  
 */

server_udp.on('message', (msg, rinfo) => {

    var all_data_arr=[];
    var all_data;

    // console.log('server_udp got: ${msg} from ${rinfo.address}:${rinfo.port}');
    console.log('Receivedd: ' + msg+"\t ip"+rinfo.address);
    data_last = msg;

    data_last = JSON.parse("["+data_last+"]");    // convert string to array
    
    for(let i=0;i<7; i++){
        all_data_arr.push( Math.abs(data_last[i]));
    }
    all_data = all_data_arr.join("");
    console.log("all data ",all_data);

    /*
    *
    * Index 8 is checksum
    *  
    */
    //swap checksum received
    let result_swap  = swap(data_last[8].toString());

    //convert array to string
    let checksum = result_swap.join("");

    console.log('data terakhir',data_last);
    console.log('data chekcsum',checksum);

    if(all_data == checksum){ 
        io.sockets.emit('hi', data_last.toString());

        // algoritma=====================================================
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
            min_1=min
        } 
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

        if(data_last[0]=="20"){
            count2=sec; 
            min_2=min;
            robot2 = 0;
        } 
        else if(data_last[0]=="21"){
            count2=sec; 
            min_2=min;
            robot2=1; 
        }
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
        if(data_last[0]=="30"){
            count3=sec; 
            min_3=min;
            robot3=0; 
        }
        else if(data_last[0]=="31"){
            count3=sec; 
            min_3=min;
            robot3=1;  
        }
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
        if(data_last[0]=="40"){ 
            count4=sec; 
            min_4=min;
            robot4=0;
        }
        else if(data_last[0]=="41"){ 
            count4=sec; 
            min_4=min;
            robot4=1;
        }
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
        if(robot1==1 &&robot2==0&&robot3==0&&robot4==0)
            datarobot="11"
        else if(robot2==1)
            datarobot="21"
        else if(robot3==1)
            datarobot="31"
        else if(robot1==0 &&robot2==0&&robot3==0&&robot4==1)
            datarobot="41"
        else
            datarobot="00"
    }
    else{
        console.log("DATA CORUPT");
        datarobot="00";
    }

    datarobot += referee;
    
    server_udp.send(datarobot,rinfo.port,rinfo.address,function(error){
        if(error){
            client.close();
        }
    });
});
server_udp.bind(8124);


/*
 *
 * get message from refree box
 *  
 */

server_referee.on('message', (msg, rinfo) => {

    // console.log('server_udp got: ${msg} from ${rinfo.address}:${rinfo.port}');
    console.log('buff 9: ' +msg[9]+" -- buff 10:"+msg[10]+"\t ip"+rinfo.address);
    // console.log("referee" + referee);
    referee = msg[9] + msg[10];
    io.sockets.emit('refree', referee.toString());

});
server_referee.bind(3838);

// ==================== web ====================
app.get('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
});
// mengizinkan folder
app.use(express.static(__dirname + '/style/'));
server.listen(8081);