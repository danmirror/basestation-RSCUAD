## basestation-RSCUAD
> base for communication Robot RSCUAD soccer mode. <br>
> we decided to migrate to GO-lang for efficiency. if you still decide you want to use nodejs please checkout V1.0.1


### screenshot
![alt text](https://github.com/danmirror/basestation-RSCUAD/blob/master/assets/image/screen.png)

### required
- [x] GO-lang

### include
- [x] sass

### install 
- git clone https://github.com/danmirror/basestation-RSCUAD
- make 

### run
- make run 


### package
- code 
        
            robot+","+tilt.str()
				+","+pan.str()+","+gyro.str()
				+","+ball.str()+","+count.str()
				+","+limit.str()+","+times.str()
				+","+result_checksum;

- example api
        
            "31,0,0,360,0,200,200,60,100200200630013"


### author
> <a href="https://me-danuandrean.github.io/">Danu andrean</a>
