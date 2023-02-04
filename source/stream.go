package manager

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"net"
	"net/http"

	"github.com/gorilla/websocket"
)

var videoImage image.Image
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func VideoHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer conn.Close()

	for {
		jpegBuf := &bytes.Buffer{}
		jpeg.Encode(jpegBuf, videoImage, nil)
		err = conn.WriteMessage(websocket.BinaryMessage, jpegBuf.Bytes())
		if err != nil {
			fmt.Println(err)
			return
		}
	}
}

func StreamHandler() {
	// Listen for incoming video data on the specified address and port
	addr := net.UDPAddr{
		Port: 8125,
		IP:   net.ParseIP(GetIP()),
	}
	conn, _ := net.ListenUDP("udp", &addr)
	defer conn.Close()

	// Create an image buffer to store the incoming video data
	buf := make([]byte, 65507)

	// Continuously receive and decode the video data
	for {
		// Read the incoming video data
		n, _, _ := conn.ReadFromUDP(buf)
		videoImage, _, _ = image.Decode(bytes.NewReader(buf[:n]))
	}
}
