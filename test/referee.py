# 
#   Simple Test to easy understand
#   Server Side
# 


import socket

localIP     = "0.0.0.0"
localPort   = 3838

oldSendPort = 3838
newSendPort = 3939

bufferSize  = 1024

# Create a datagram socket
UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

# Bind to address and ip
UDPServerSocket.bind((localIP, localPort))
print("UDP server up and listening")

while(True):
    bytesAddressPair,peer = UDPServerSocket.recvfrom(bufferSize)

    # clientMsg = "Message from Client:{}".format(bytesAddressPair[9])
    
    print(bytesAddressPair)
    destination = peer[0], oldSendPort
    UDPServerSocket.sendto(b'RGrt\x02\x07\x01', destination)
