# 
#   Simple Test to easy understand
# 

import socket
import sys
import time

send_data = "31,0,0,360,0,200,200,60,100200200630013"
ip        = "127.0.0.1"
port      = 8124

# Create socket for server
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, 0)
print("Do Ctrl+c to exit the program !! \n\n")

# Let's send data through UDP protocol
while True:
    # send data
    sock.sendto(send_data.encode('utf-8'), (ip, port))
    print("Sent : ", send_data)
    
    # receive data
    data, address = sock.recvfrom(4096)
    print("received : ", data.decode('utf-8'), "\n\n")
    time.sleep(1)
# close the socket
sock.close()