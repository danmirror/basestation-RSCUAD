## basestation-RSCUAD
> base for communication Robot RSCUAD soccer mode. <br>
> we decided to migrate to GO-lang for efficiency. if you still decide you want to use nodejs please checkout V1.0.1


### screenshot
![alt text](https://github.com/danmirror/basestation-RSCUAD/blob/master/assets/image/screen.png)

### required
- [x] GO-lang

### install linux
- $git clone https://github.com/danmirror/basestation-RSCUAD
- $sudo chmod 777 setup.bash && ./setup.bash
	
		make sure the go version shows up. otherwise just run manually.

### install windows
- download go https://go.dev/dl/go1.13.windows-386.msi
- donwload mingw https://sourceforge.net/projects/mingw-w64/files/latest/download
- add bin to env

### compile
- make [for linux]
- mingw32-make [for windows]

### run 
- make run [for linux]
- mingw32-make run [for windows]


### package API
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
