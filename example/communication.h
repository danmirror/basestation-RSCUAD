#ifndef COMMUNICATION_H
#define COMMUNICATION_H

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>

// Non Block
#include <sys/poll.h>

// Multithread
#include <pthread.h>
#include <unistd.h>


#define timeout_msecs 200
	
#define PORT	8124
#define MAXLINE 2048


class Communication
{
private:
    char*       m_data;
    pthread_t   m_threadRobot;
    char*       m_IP;
public:
static int                 s_sockfd;
static struct sockaddr_in  s_servaddr;
static pthread_mutex_t     s_lockMutex;

    Communication();
    ~Communication();
    void InitRobot();
    void Robot();
    void Reset();
    static void *RuntimeRobot(void* i_data);
};

#endif