#include "communication.h"
#include <stdio.h>

int main()
{
    Communication Com;
    Com.InitRobot();

    for(;;)
    {
        Com.Robot();

        Com.Reset();
    }
}