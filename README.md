# basestation-RSCUAD
> base for communication Robot RSCUAD using checksum

## required
- [x] Npm ^6.14.4
- [x] nodejs ^v12.18.0
- [x] express
- [x] socket.io
- [x] bootstrap 4
- [x] css


## include
- [x] sass

## install 
- git clone
- npm install

## run
- node server_udp.js


## package
- code 
        robot+","+tilt.str()
				+","+pan.str()+","+gyro.str()
				+","+ball.str()+","+count.str()
				+","+limit.str()+","+times.str()
				+","+result_checksum;

> example
        "31,0,0,360,0,200,200,60,100200200630013"


# author
> <a href="https://me-danuandrean.github.io/">Danu andrean</a>, Yenny Rahmawati
