#include "communication.h"


int                 Communication::s_sockfd;
struct sockaddr_in  Communication::s_servaddr;
pthread_mutex_t     Communication::s_lockMutex;

Communication::Communication()
{
    m_IP = "127.0.0.1";
}
Communication::~Communication()
{
    close(s_sockfd);
}
void *Communication::RuntimeRobot(void* i_data)
{
    int n;
    socklen_t len;
    char buffer[MAXLINE];
    char* dataFinal = (char *)i_data;
    //lock
    pthread_mutex_lock(&s_lockMutex);

    sendto(s_sockfd, (const char *)dataFinal, strlen(dataFinal),
            MSG_CONFIRM, (const struct sockaddr *) &s_servaddr,
                sizeof(s_servaddr));
    // set polling
    struct pollfd ufds[1];
    ufds[0].fd = s_sockfd;
    ufds[0].events = POLLIN;

    int  poll_ret = poll(ufds, 1, timeout_msecs);
    
    if (poll_ret > 0)
    {
        n = recvfrom(s_sockfd, (char *)buffer, MAXLINE,
                    MSG_WAITALL, (struct sockaddr *) &s_servaddr,
                    &len);
        buffer[n] = '\0';
        printf("Server : %s\n", buffer);
    }
    else{
        perror("bloked network");
    }

    //unlock
    pthread_mutex_unlock(&s_lockMutex);

}

void Communication::InitRobot()
{
    // Creating socket file descriptor
    if ( (s_sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0 ) {
        perror("socket creation failed");
        exit(EXIT_FAILURE);
    }
    
    memset(&s_servaddr, 0, sizeof(s_servaddr));
        
    // Filling server information
    s_servaddr.sin_family = AF_INET;
    s_servaddr.sin_port = htons(PORT);
    s_servaddr.sin_addr.s_addr = inet_addr(m_IP); 

}

void Communication::Robot()
{
    m_data ="31,0,0,360,0,200,200,60,100200200630013";

    //check thread
    if (pthread_mutex_init(&s_lockMutex, NULL) != 0) 
    {
        printf("\n mutex init has failed\n");
    }
    
    //create thread
    pthread_create(&m_threadRobot, NULL, &Communication::RuntimeRobot, m_data);
}

void Communication::Reset()
{
    //reset thread
    pthread_join(m_threadRobot, NULL);
    //reset mutex        
    pthread_mutex_destroy(&s_lockMutex);
}