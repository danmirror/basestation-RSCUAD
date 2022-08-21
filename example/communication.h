/*
	author	: Danu andrean
	year	: 2020
    update  : 2022

    title   : client side robot using multi thread 
*/

#ifndef COMMUNICATION_H
#define COMMUNICATION_H

#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>

#include <sys/time.h>   // time
#include <sys/poll.h>   // Non Block
#include <pthread.h>    // Multithread

#include <unistd.h>     // sleep

#include <sstream>      // parsing

#define PORT	        8124
#define MAXLINE         2048
#define timeout_msecs   200

class Communication
{
private:
    char*               m_data;
    pthread_t           m_threadRobot;
    char*               m_IP;
    typedef enum 
    {
        ROBOT,REFEREE
    }Mode;
    
public:
    static bool         s_robot;
    static int          s_referee;

    Communication(const char *ip);
    ~Communication();
    void InitRobot();
    int Robot(int tilt_kom,int int_tilt, int int_pan, 
                int int_gyro, int int_ball, int int_count,
                int int_limit);
    void CreateThread(pthread_t thread, char *data, Mode mode);
    void Reset();

};

#endif