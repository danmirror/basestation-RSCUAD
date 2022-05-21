#include "communication.h"
#include <stdio.h>

int main()
{
    Communication Com;
    Com.InitRobot();

    for(;;)
    {
        Com.Robot(1,0,0,360,0,200,200);
        printf("data all %d\n", Communication::s_robot);

        Com.Reset();
    }
}