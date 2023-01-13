//
// client for update data parameter
// author Danu andrean 
// update 2022
//

class Status {
	constructor(){
		this.robot1 = document.getElementById('r1');
		this.robot2 = document.getElementById('r2');
		this.robot3 = document.getElementById('r3');
		this.robot4 = document.getElementById('r4');
		this.robot5 = document.getElementById('r5');

		this.imageRobotActive 	= '/assets/image/robot-active.png';
		this.imageRobotStandby 	= '/assets/image/robot-standby.png';
		this.imageRobotError 	= '/assets/image/robot-error.png';
	}

	RobotActive1(){
		this.robot1.classList.remove("standby");
		this.robot1.classList.remove("loss");
		this.robot1.classList.add("run");
		this.robot2.classList.remove("run");
		this.robot3.classList.remove("run");
		this.robot4.classList.remove("run");
		this.robot5.classList.remove("run");
		document.getElementById('rr1').src=this.imageRobotActive;
	}

	RobotActive2(){
		this.robot2.classList.remove("loss");
		this.robot2.classList.remove("standby");
		this.robot2.classList.add("run");
		this.robot1.classList.remove("run");
		this.robot3.classList.remove("run");
		this.robot4.classList.remove("run");
		this.robot5.classList.remove("run");
		document.getElementById('rr2').src=this.imageRobotActive;
	}

	RobotActive3(){
		this.robot3.classList.add("run");
		this.robot3.classList.remove("standby");
		this.robot3.classList.remove("loss");

		this.robot1.classList.remove("run");
		this.robot2.classList.remove("run");
		this.robot4.classList.remove("run");
		this.robot5.classList.remove("run");
		document.getElementById('rr3').src=this.imageRobotActive;
	}

	RobotActive4(){
		this.robot4.classList.add("run");
		this.robot4.classList.remove("standby");
		this.robot4.classList.remove("loss");

		this.robot1.classList.remove("run");
		this.robot2.classList.remove("run");
		this.robot3.classList.remove("run");
		this.robot5.classList.remove("run");
		document.getElementById('rr4').src=this.imageRobotActive;
	}

	RobotActive5(){
		this.robot5.classList.add("run");
		this.robot5.classList.remove("standby");
		this.robot5.classList.remove("loss");

		this.robot1.classList.remove("run");
		this.robot2.classList.remove("run");
		this.robot3.classList.remove("run");
		this.robot4.classList.remove("run");
		document.getElementById('rr5').src=this.imageRobotActive;
	}

	RobotStandby1(){
		this.robot1.classList.remove("loss");
		this.robot1.classList.remove("run");
		this.robot1.classList.add("standby");
		document.getElementById('rr1').src=this.imageRobotStandby;
	}

	RobotStandby2(){
		this.robot2.classList.remove("loss");
		this.robot2.classList.remove("run");
		this.robot2.classList.add("standby");
		document.getElementById('rr2').src=this.imageRobotStandby;
	}

	RobotStandby3(){
		this.robot3.classList.remove("run");
		this.robot3.classList.remove("loss");
		this.robot3.classList.add("standby");
		document.getElementById('rr3').src=this.imageRobotStandby;
	}

	RobotStandby4(){
		this.robot4.classList.remove("run");
		this.robot4.classList.remove("loss");
		this.robot4.classList.add("standby");
		document.getElementById('rr4').src=this.imageRobotStandby;
	}

	RobotStandby5(){
		this.robot5.classList.remove("run");
		this.robot5.classList.remove("loss");
		this.robot5.classList.add("standby");
		document.getElementById('rr5').src=this.imageRobotStandby;
	}

	RobotLoss1(){
		document.getElementById('rr1').src=this.imageRobotError;

		this.robot1.classList.add("loss");
		this.robot1.classList.remove("standby");
		this.robot1.classList.remove("run");
	}

	RobotLoss2(){
		document.getElementById('rr2').src=this.imageRobotError;
		this.robot2.classList.remove("standby");
		this.robot2.classList.remove("run");
		this.robot2.classList.add("loss");
	}

	RobotLoss3(){
		document.getElementById('rr3').src=this.imageRobotError;
		this.robot3.classList.remove("standby");
		this.robot3.classList.remove("run");
		this.robot3.classList.add("loss");
	}

	RobotLoss4(){
		document.getElementById('rr4').src=this.imageRobotError;
		this.robot4.classList.add("loss");
		this.robot4.classList.remove("standby");
		this.robot4.classList.remove("run");
	}

	RobotLoss5(){
		document.getElementById('rr5').src=this.imageRobotError;
		this.robot5.classList.add("loss");
		this.robot5.classList.remove("standby");
		this.robot5.classList.remove("run");
	}
}

class Entry {
    constructor(data, idstatus, status) {
		this.status 		= status;
		this.data 			= data;
		this.statusActive 	= idstatus;
		this.date 			= new Date();
		this.sec 			= this.date.getSeconds();
		this.min 			= this.date.getMinutes();
		this.milli 			= this.date.getMilliseconds();
		this.times 			= this.sec +"."+this.milli;
		
    }

	ParamRobot1(){
		document.getElementById("tilt_1").value 	= this.data[1];
		document.getElementById("pan_1").value 		= this.data[2];
		document.getElementById("gyro_1").value 	= this.data[3];
		document.getElementById("ball_1").value 	= this.data[4];
		document.getElementById("count_1").value 	= this.data[5];
		document.getElementById("limit_1").value 	= this.data[6];
		document.getElementById("send_1").value 	= this.data[7];
		document.getElementById("recv_1").value 	= this.times;
	}

	ParamRobot2(){
		document.getElementById("tilt_2").value 	= this.data[1];
		document.getElementById("pan_2").value 		= this.data[2];
		document.getElementById("gyro_2").value 	= this.data[3];
		document.getElementById("ball_2").value 	= this.data[4];
		document.getElementById("count_2").value 	= this.data[5];
		document.getElementById("limit_2").value 	= this.data[6];
		document.getElementById("send_2").value 	= this.data[7];
		document.getElementById("recv_2").value 	= this.times;

	}

	ParamRobot3(){
		document.getElementById("tilt_3").value 	= this.data[1];
		document.getElementById("pan_3").value 		= this.data[2];
		document.getElementById("gyro_3").value 	= this.data[3];
		document.getElementById("ball_3").value 	= this.data[4];
		document.getElementById("count_3").value 	= this.data[5];
		document.getElementById("limit_3").value 	= this.data[6];
		document.getElementById("send_3").value 	= this.data[7];
		document.getElementById("recv_3").value 	= this.times;

	}

	ParamRobot4(){
		document.getElementById("tilt_4").value 	= this.data[1];
		document.getElementById("pan_4").value 		= this.data[2];
		document.getElementById("gyro_4").value 	= this.data[3];
		document.getElementById("ball_4").value 	= this.data[4];
		document.getElementById("count_4").value 	= this.data[5];
		document.getElementById("limit_4").value 	= this.data[6];
		document.getElementById("send_4").value 	= this.data[7];
		document.getElementById("recv_4").value 	= this.times;

	}
	
	ParamRobot5(){
		document.getElementById("tilt_5").value 	= this.data[1];
		document.getElementById("pan_5").value 		= this.data[2];
		document.getElementById("gyro_5").value 	= this.data[3];
		document.getElementById("ball_5").value 	= this.data[4];
		document.getElementById("count_5").value 	= this.data[5];
		document.getElementById("limit_5").value 	= this.data[6];
		document.getElementById("send_5").value 	= this.data[7];
		document.getElementById("recv_5").value 	= this.times;

	}

    Calculation() {
		if(this.data[0][0] == '0'){
			if(this.data[1] == '0'){
				document.getElementById("refree").innerHTML = "INIT"
			}
			if(this.data[1] == '1'){
				document.getElementById("refree").innerHTML = "READY"
			}
			else if(this.data[1] == '2'){
				document.getElementById("refree").innerHTML = "SET"
			}
			else if(this.data[1] == '3'){
				document.getElementById("refree").innerHTML = "PLAY"
			}
			else if(this.data[1] == '4'){
				document.getElementById("refree").innerHTML = "FINISH"
			}
		}
		if(this.data[0][0] == '1'){

			if(this.statusActive == "on"){
				this.ParamRobot1();
				
				if(this.data[0]=="11"){
					this.status.RobotActive1();
				}
				else if(this.data[0]=="10"){
					this.status.RobotStandby1();
				}
			}
			else{
				this.status.RobotLoss1();
			}
		}
		if(this.data[0][0] == '2'){

			if(this.statusActive == "on"){
				this.ParamRobot2();

				if(this.data[0]=="21"){
					this.status.RobotActive2();
				}
				else if(this.data[0]=="20"){
					this.status.RobotStandby2();
				}
			}
			else{
				this.status.RobotLoss2();
			}
		}
		if(this.data[0][0] == '3'){

			if(this.statusActive == "on"){
				this.ParamRobot3();

				if(this.data[0]=="31"){
					this.status.RobotActive3();
				}
				else if(this.data[0]=="30"){
					this.status.RobotStandby3();
				}
			}
			else{
				this.status.RobotLoss3();
			}
		}
		if(this.data[0][0] == '4'){

			if(this.statusActive == "on"){
				this.ParamRobot4();

				if(this.data[0]=="41"){
					this.status.RobotActive4();
				}
				else if(this.data[0]=="40"){
					this.status.RobotStandby4();
				}
			}
			else{
				this.status.RobotLoss4();
			}
		}
		if(this.data[0][0] == '5'){

			if(this.statusActive == "on"){
				this.ParamRobot5();

				if(this.data[0]=="51"){
					this.status.RobotActive5();
				}
				else if(this.data[0]=="50"){
					this.status.RobotStandby5();
				}
			}
			else{
				this.status.RobotLoss5();
			}
		}
	
	
	}
} 

