package manager

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"net"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var videoImageR1 image.Image
var videoImageR2 image.Image
var videoImageR3 image.Image
var videoImageR4 image.Image
var videoImageR5 image.Image

var portR1 = 8131
var portR2 = 8132
var portR3 = 8133
var portR4 = 8134
var portR5 = 8135

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func VideoHandlerR1(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer conn.Close()

	for {
		jpegBuf := &bytes.Buffer{}

		if videoImageR1 != nil {
			jpeg.Encode(jpegBuf, videoImageR1, nil)
			err = conn.WriteMessage(websocket.BinaryMessage, jpegBuf.Bytes())
			if err != nil {
				fmt.Println(err)
				return
			}
			time.Sleep(100 * time.Millisecond)
		}
	}
}

func VideoHandlerR2(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer conn.Close()

	for {
		jpegBuf := &bytes.Buffer{}

		if videoImageR2 != nil {
			jpeg.Encode(jpegBuf, videoImageR2, nil)
			err = conn.WriteMessage(websocket.BinaryMessage, jpegBuf.Bytes())
			if err != nil {
				fmt.Println(err)
				return
			}
			time.Sleep(100 * time.Millisecond)
		}
	}
}

func VideoHandlerR3(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer conn.Close()

	for {
		jpegBuf := &bytes.Buffer{}

		if videoImageR3 != nil {
			jpeg.Encode(jpegBuf, videoImageR3, nil)
			err = conn.WriteMessage(websocket.BinaryMessage, jpegBuf.Bytes())
			if err != nil {
				fmt.Println(err)
				return
			}
			time.Sleep(100 * time.Millisecond)
		}
	}
}

func VideoHandlerR4(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer conn.Close()

	for {
		jpegBuf := &bytes.Buffer{}

		if videoImageR4 != nil {
			jpeg.Encode(jpegBuf, videoImageR4, nil)
			err = conn.WriteMessage(websocket.BinaryMessage, jpegBuf.Bytes())
			if err != nil {
				fmt.Println(err)
				return
			}
			time.Sleep(100 * time.Millisecond)
		}
	}
}

func VideoHandlerR5(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}

	defer conn.Close()

	for {
		jpegBuf := &bytes.Buffer{}

		if videoImageR5 != nil {
			jpeg.Encode(jpegBuf, videoImageR5, nil)
			err = conn.WriteMessage(websocket.BinaryMessage, jpegBuf.Bytes())
			if err != nil {
				fmt.Println(err)
				return
			}
			time.Sleep(100 * time.Millisecond)
		}
	}
}

func StreamHandlerR1() {
	// Listen for incoming video data on the specified address and port
	addr := net.UDPAddr{
		Port: portR1,
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
		videoImageR1, _, _ = image.Decode(bytes.NewReader(buf[:n]))
	}
}

func StreamHandlerR2() {
	// Listen for incoming video data on the specified address and port
	addr := net.UDPAddr{
		Port: portR2,
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
		videoImageR2, _, _ = image.Decode(bytes.NewReader(buf[:n]))
	}
}

func StreamHandlerR3() {
	// Listen for incoming video data on the specified address and port
	addr := net.UDPAddr{
		Port: portR3,
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
		videoImageR3, _, _ = image.Decode(bytes.NewReader(buf[:n]))
	}
}

func StreamHandlerR4() {
	// Listen for incoming video data on the specified address and port
	addr := net.UDPAddr{
		Port: portR4,
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
		videoImageR4, _, _ = image.Decode(bytes.NewReader(buf[:n]))
	}
}

func StreamHandlerR5() {
	// Listen for incoming video data on the specified address and port
	addr := net.UDPAddr{
		Port: portR5,
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
		videoImageR5, _, _ = image.Decode(bytes.NewReader(buf[:n]))
	}
}
