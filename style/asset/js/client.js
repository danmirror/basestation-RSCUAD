var robot1 = document.getElementById('r1');
var robot2 = document.getElementById('r2');
var robot3 = document.getElementById('r3');
var robot4 = document.getElementById('r4');

var count1 = 0;
var count2 = 0;
var count3 = 0;
var count4 = 0;
var min_1 = 0;
var min_2 = 0;
var min_3 = 0;
var min_4 = 0;

// var robot4 = document.getElementById('r4');



var socket = io.connect('http://localhost:8081');

// function kirim(){
//   socket.emit('my other event', { my: 'data' });
// }
socket.on('refree', data=>{
  let data_refree = JSON.parse("["+data+"]");
  let tag_name;
  if(data_refree == 0)
    tag_name = "INIT";
  if(data_refree == 1)
    tag_name = "READY";
  if(data_refree == 2)
    tag_name = "SET";
  if(data_refree == 3)
    tag_name = "PLAY";
  if(data_refree == 4)
    tag_name = "FINISH";
    
  document.getElementById("refree").innerHTML = tag_name;
  console.log(data_refree);
});

socket.on('hi', data=>{
  data_all = JSON.parse("["+data+"]"); 
  console.log(data_all[0]);

  var d = new Date();
  var sec = d.getSeconds();
  var min = d.getMinutes();
  var milli = d.getMilliseconds();
  var times = sec +"."+milli;
  console.log("time ",d);
  
  function val_robot1(){
    document.getElementById("tilt_1").value =data_all[1];
    document.getElementById("pan_1").value = data_all[2];
    document.getElementById("gyro_1").value = data_all[3];
    document.getElementById("ball_1").value = data_all[4];
    document.getElementById("count_1").value = data_all[5];
    document.getElementById("limit_1").value = data_all[6];
    document.getElementById("send_1").value = data_all[7];
    document.getElementById("recv_1").value = times;
   
 
  }
  function val_robot2(){
    document.getElementById("tilt_2").value =data_all[1];
    document.getElementById("pan_2").value = data_all[2];
    document.getElementById("gyro_2").value = data_all[3];
    document.getElementById("ball_2").value = data_all[4];
    document.getElementById("count_2").value = data_all[5];
    document.getElementById("limit_2").value = data_all[6];
    document.getElementById("send_2").value = data_all[7];
    document.getElementById("recv_2").value = times;
    

  }
  function val_robot3(){
    document.getElementById("tilt_3").value =data_all[1];
    document.getElementById("pan_3").value = data_all[2];
    document.getElementById("gyro_3").value = data_all[3];
    document.getElementById("ball_3").value = data_all[4];
    document.getElementById("count_3").value = data_all[5];
    document.getElementById("limit_3").value = data_all[6];
    document.getElementById("send_3").value = data_all[7];
    document.getElementById("recv_3").value = times;
   

  }
  function val_robot4(){
    document.getElementById("tilt_4").value =data_all[1];
    document.getElementById("pan_4").value = data_all[2];
    document.getElementById("gyro_4").value = data_all[3];
    document.getElementById("ball_4").value = data_all[4];
    document.getElementById("count_4").value = data_all[5];
    document.getElementById("limit_4").value = data_all[6];
    document.getElementById("send_4").value = data_all[7];
    document.getElementById("recv_4").value = times;

  }


 
  if(data_all[0]=="11"){
    min_1 = min
    count1 = sec;
    robot1.classList.remove("standby");
    robot1.classList.remove("loss");
    robot1.classList.add("run");
    robot2.classList.remove("run");
    robot3.classList.remove("run");
    robot4.classList.remove("run");
    document.getElementById('rr1').src='asset/robot-active.png';
    val_robot1();
  }
  else if(data_all[0]=="10"){
    min_1 = min;
    count1 = sec;
    robot1.classList.remove("loss");
    robot1.classList.remove("run");
    robot1.classList.add("standby");
    document.getElementById('rr1').src='asset/robot-standby.png';
    val_robot1();
  }
  else{
    let set_1 = sec-count1;

    if(set_1<0){
      set_1 = sec+(60-count1);
    }
    // console.log("-----3",sec-count3,"set--", set_1);
    if(set_1 >= 20 || min!=min_1 ){
      // console.log("1 losss",sec-count1 );
      document.getElementById('rr1').src='asset/robot-error.png';

      robot1.classList.add("loss");
      robot1.classList.remove("standby");
      robot1.classList.remove("run");
    }
  }

  
  if(data_all[0]=="21"){
    min_2 = min;
    count2 = sec;
    robot2.classList.remove("loss");
    robot2.classList.remove("standby");
    robot2.classList.add("run");
    robot1.classList.remove("run");
    robot3.classList.remove("run");
    robot4.classList.remove("run");
    document.getElementById('rr2').src='asset/robot-active.png';
    val_robot2();
  }
  else if(data_all[0]=="20"){
    min_2 = min;
    count2 = sec;
    robot2.classList.remove("loss");
    robot2.classList.remove("run");
    robot2.classList.add("standby");
    document.getElementById('rr2').src='asset/robot-standby.png';
    val_robot2();
  }
  else{
    let set_2 = sec-count2;

    if(set_2<0){
      set_2 = sec+(60-count2);
    }
    // console.log("-----2",sec-count2,"set--", set_2);
    if(set_2 >= 20 || min !=min_2 ){
      // console.log("2 losss",sec-count2);
      document.getElementById('rr2').src='asset/robot-error.png';
      robot2.classList.remove("standby");
      robot2.classList.remove("run");
      robot2.classList.add("loss");
    }
  }


  if(data_all[0]=="31"){
    min_3 = min;
    count3 = sec;
    robot3.classList.add("run");
    robot3.classList.remove("standby");
    robot3.classList.remove("loss");
   
    robot1.classList.remove("run");
    robot2.classList.remove("run");
    robot4.classList.remove("run");
    document.getElementById('rr3').src='asset/robot-active.png';
    val_robot3();
  }
  else if(data_all[0]=="30"){
    min_3 = min;
    count3 = sec;
    robot3.classList.remove("run");
    robot3.classList.remove("loss");
    robot3.classList.add("standby");
    document.getElementById('rr3').src='asset/robot-standby.png';
    val_robot3();
  }
  else{
    let set_3 = sec-count3;

    if(set_3<0){
      set_3 = sec+(60-count3);
    }
    console.log("-----3",sec-count3,"set--", set_3);
    if(set_3 >= 20 || min !=min_3 ){
      document.getElementById('rr3').src='asset/robot-error.png';
      console.log("masuk");
      robot3.classList.remove("standby");
      robot3.classList.remove("run");
      robot3.classList.add("loss");
    }
  }
  if(data_all[0]=="41"){
    min_4 = min;
    count4 = sec;
    robot4.classList.add("run");
    robot4.classList.remove("standby");
    robot4.classList.remove("loss");
   
    robot1.classList.remove("run");
    robot2.classList.remove("run");
    robot3.classList.remove("run");
    document.getElementById('rr4').src='asset/robot-active.png';
    val_robot4();
  }
  else if(data_all[0]=="40"){
    min_4 = min;
    count4 = sec;
    robot4.classList.remove("run");
    robot4.classList.remove("loss");
    robot4.classList.add("standby");
    document.getElementById('rr4').src='asset/robot-standby.png';
    val_robot4();
  }
  else{
    let set_4 = sec-count4;

    if(set_4<0){
      set_4 = sec+(60-count4);
    }
    // console.log("-----4",sec-count4,"set--", set_4);
    if(set_4 >= 20 || min!=min_4 ){
      // console.log("4 losss",sec-count4);
      document.getElementById('rr4').src='asset/robot-error.png';
      robot4.classList.add("loss");
      robot4.classList.remove("standby");
      robot4.classList.remove("run");
    }
  }




});

// socket.on('news', data=> {
//   console.log(data);
//   socket.emit('my other event', { my: 'data' });
// });

console.log("try")