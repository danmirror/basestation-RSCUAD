#include "swap.h"
#include "communication.h"

// using thread C
int                  g_sockfd;
struct sockaddr_in   g_servaddr;
pthread_mutex_t      g_lockMutex;

// C style
void *RoutineRobot(void* i_data)
{
    int n;
    socklen_t len;
    char buffer[MAXLINE];
    char* dataFinal = (char *)i_data;
    string buf;

    //lock
    pthread_mutex_lock(&g_lockMutex);

    // send packet
    sendto(g_sockfd, (const char *)dataFinal, strlen(dataFinal),
                        MSG_CONFIRM, (const struct sockaddr *) &g_servaddr,
                        sizeof(g_servaddr));
    // set polling
    struct pollfd ufds[1];
    ufds[0].fd = g_sockfd;
    ufds[0].events = POLLIN;

    int  poll_ret = poll(ufds, 1, timeout_msecs);
    
    if (poll_ret > 0)
    {
        // receive packet
        n = recvfrom(g_sockfd, (char *)buffer, MAXLINE,
                    MSG_WAITALL, (struct sockaddr *) &g_servaddr,
                    &len);
        buffer[n] = '\0';
        buf = buffer;
        // printf("Server : %s\n", buffer);
    }
    else{
        buf = "000";
    }

    string robotFinal;
    for(int i=0; i<2; i++)
    {
        char val = buf[i];
        robotFinal += val;
    }

    char refereeFinal = buf[2];
    Communication::s_referee = refereeFinal-'0';

	if (robotFinal == "31"||robotFinal == "00" || robotFinal == "")
	{
	    Communication::s_robot = false;
	}
	else 
	{
		Communication::s_robot = true;
	}

    //unlock
    pthread_mutex_unlock(&g_lockMutex);

}

// static declaration
bool    Communication::s_robot;
int     Communication::s_referee;

Communication::Communication(const char * ip)
{
    m_IP =  new char[50];
    memcpy(m_IP, ip, 50);

    Communication::s_robot      = false;
    Communication::s_referee    = false;
}

Communication::~Communication()
{
    close(g_sockfd);
}

void Communication::InitRobot()
{
    // Creating socket file descriptor
    if ( (g_sockfd = socket(AF_INET, SOCK_DGRAM, 0)) < 0 ) {
        perror("socket creation failed");
        exit(EXIT_FAILURE);
    }
    
    memset(&g_servaddr, 0, sizeof(g_servaddr));
        
    // Filling server information
    g_servaddr.sin_family = AF_INET;
    g_servaddr.sin_port = htons(PORT);
    g_servaddr.sin_addr.s_addr = inet_addr(m_IP); 

}

int Communication::Robot(int i_robot,int i_tilt, int i_pan, 
                        int i_gyro, int i_ball, int i_count,
                        int i_limit)
{

	string checksum;
	string robot; 
	string dataAll;
	string resultChecksum;

	ostringstream tilt,pan,gyro,ball,count,limit,times,tilt_check,pan_check;
	tilt_check  << abs(i_tilt);
	pan_check   << abs(i_pan);
	tilt        << i_tilt;
	pan         << i_pan;
	gyro        << i_gyro;
	ball        << i_ball;
	count       << i_count;
	limit       << i_limit;
    
	/*get milli*/
	timeval curTime;
	gettimeofday(&curTime, NULL);
	int milli = curTime.tv_usec / 1000;

	/* get seconds*/
	time_t rawtime = time(NULL);

	if (rawtime == -1) {
		
		puts("The time() function failed");
		return 1;
	}

	struct tm *ptm = localtime(&rawtime);

	if (ptm == NULL) {
		
		puts("The localtime() function failed");
		return 1;
	}
	times<<ptm->tm_sec<<"."<<milli;

    //bit pertama nomer robot bit kedua nilai
	if (i_robot == 1 ) 
        robot = "31";   //berarti robot tiga nilai 0
	else 
        robot = "30";

	checksum = robot+tilt_check.str()+pan_check.str()
				+gyro.str()+ball.str()
				+count.str()+limit.str();
    
	resultChecksum = Swap::str(checksum);

	//convert data semua ke data all
	dataAll = robot+","+tilt.str()
				+","+pan.str()+","+gyro.str()
				+","+ball.str()+","+count.str()
				+","+limit.str()+","+times.str()
				+","+resultChecksum;

    // new memory alocation
    m_data = new char[100];
    strcpy (m_data,&dataAll[0]);

    //create thread
    CreateThread(m_threadRobot, m_data, ROBOT);
    
}

void Communication::CreateThread(pthread_t thread, char *data, Mode mode)
{
    // check init thread
    if (pthread_mutex_init(&g_lockMutex, NULL) != 0) 
    {
        printf("\n mutex init has failed\n");
    }

    if(mode == ROBOT)
        pthread_create(&m_threadRobot, NULL, &RoutineRobot, data);
    
}


void Communication::Reset()
{
    //reset thread
    pthread_join(m_threadRobot, NULL);
    //reset mutex        
    pthread_mutex_destroy(&g_lockMutex);
    delete [] m_data;
}