package manager

import (
	"fmt"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

type msg struct {
	Num int
}
type dataRobot struct {
	R1 string
	R2 string
	R3 string
	R4 string
	R5 string
}
type timeRobot struct {
	timeR1 int64
	timeR2 int64
	timeR3 int64
	timeR4 int64
	timeR5 int64
}

type Execute struct {
	robotExecute   string
	executeTimeout int64
}

var execute = Execute{}
var staging = dataRobot{}
var times = timeRobot{}
var timeout int64 = 5
var ref *int

func Init() {
	memset := -1
	ref = &memset
}

func RefereeBoxHandler() {
	addr := net.UDPAddr{
		Port: 3838,
		IP:   net.ParseIP(GetIP()),
	}
	ser, err := net.ListenUDP("udp", &addr)
	if err != nil {
		fmt.Printf("Some error %v\n", err)
		return
	}

	for {
		bytes := make([]byte, 100)
		_, _, err := ser.ReadFromUDP(bytes)

		if err != nil {
			fmt.Printf("Some error  %v", err)
			continue
		}
		getRef := int(bytes[9])
		ref = &getRef

	}
}

func ClientHandler() {

	addr := net.UDPAddr{
		Port: 8124,
		IP:   net.ParseIP(GetIP()),
	}
	ser, err := net.ListenUDP("udp", &addr)
	if err != nil {
		fmt.Printf("Some error %v\n", err)
		return
	}

	for {
		bytes := make([]byte, 100)
		_, remoteaddr, err := ser.ReadFromUDP(bytes)

		if err != nil {
			fmt.Printf("Some error  %v", err)
			continue
		}

		received := CleanString(string(bytes))

		s := Split(received)
		swap := Swap(s[8])

		var container string
		for i := 0; i < 7; i++ {
			container = container + s[i]
		}
		container = CleanString(container)
		swap = CleanString(swap)

		if container == swap {
			id := GetID(received)

			t := time.Now()
			// insert to global for send to ws
			if id[0] == '1' {
				times.timeR1 = t.Unix()
				staging.R1 = received

			} else if id[0] == '2' {
				times.timeR2 = t.Unix()
				staging.R2 = received

			} else if id[0] == '3' {
				times.timeR3 = t.Unix()
				staging.R3 = received

			} else if id[0] == '4' {
				times.timeR4 = t.Unix()
				staging.R4 = received

			} else if id[0] == '5' {
				times.timeR5 = t.Unix()
				staging.R5 = received
			}

			rvRobot := WhoIsExecute(id)
			go ClientResponse(ser, remoteaddr, rvRobot)
		}

	}
}

func ClientResponse(conn *net.UDPConn, addr *net.UDPAddr, rvRobot string) {

	// refereebox
	strRef := strconv.Itoa(*ref)

	_, err := conn.WriteToUDP([]byte(rvRobot+strRef), addr)
	if err != nil {
		fmt.Printf("Couldn't send response %v", err)
	}
}

func WSHandler(w http.ResponseWriter, r *http.Request) {

	if r.Header.Get("Origin") != "http://"+r.Host {
		http.Error(w, "Origin not allowed", 403)
		return
	}
	conn, err := websocket.Upgrade(w, r, w.Header(), 1024, 1024)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
	}

	WSResponse(conn)
}

func WSResponse(conn *websocket.Conn) {
	for {
		m := msg{}

		err := conn.ReadJSON(&m)
		if err != nil {
			fmt.Println("Error reading json.", err)
			break
		}
		var dataResponse string

		t := time.Now()

		if m.Num == 0 {
			dataResponse = "00," //for referee
			dataResponse = dataResponse + strconv.Itoa(*ref)

		} else if m.Num == 1 {
			var status string

			if times.timeR1+timeout > t.Unix() {
				status = ",on"
			} else {
				status = ",off"
			}

			dataResponse = staging.R1
			dataResponse = dataResponse + status

		} else if m.Num == 2 {
			var status string

			if times.timeR2+timeout > t.Unix() {
				status = ",on"
			} else {
				status = ",off"
			}

			dataResponse = staging.R2
			dataResponse = dataResponse + status

		} else if m.Num == 3 {
			var status string

			if times.timeR3+timeout > t.Unix() {
				status = ",on"
			} else {
				status = ",off"
			}

			dataResponse = staging.R3
			dataResponse = dataResponse + status

		} else if m.Num == 4 {
			var status string

			if times.timeR4+timeout > t.Unix() {
				status = ",on"
			} else {
				status = ",off"
			}

			dataResponse = staging.R4
			dataResponse = dataResponse + status

		} else if m.Num == 5 {
			var status string

			if times.timeR5+timeout > t.Unix() {
				status = ",on"
			} else {
				status = ",off"
			}

			dataResponse = staging.R5
			dataResponse = dataResponse + status
		}

		if err = conn.WriteJSON(dataResponse); err != nil {
			fmt.Println(err)
		}
	}
}

/*
	selection robot who is execute
*/
func WhoIsExecute(data string) string {
	// [0,1] => robot see the ball

	if data[1] == '1' {
		execute.robotExecute = data
	}

	t := time.Now()
	// update timeout
	if execute.robotExecute == data {
		execute.executeTimeout = t.Unix()
	}

	// remove when timeout
	if execute.executeTimeout+timeout < t.Unix() {
		execute.robotExecute = "00"
	}

	return execute.robotExecute
}
