package manager

import (
	"fmt"
	"net"
	"net/http"
	"strconv"
	"time"
	"strings"

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
	privilege      int
}

var execute = Execute{}
var staging = dataRobot{}
var times = timeRobot{}
var gameController = GameController{}
var timeout int64 = 5

func Init() {
	gameController.VERSION = 1
	execute.robotExecute = "0"
	execute.privilege = 10 // higher is lower
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
		bytes := make([]byte, 1024)
		_, _, err := ser.ReadFromUDP(bytes)

		if err != nil {
			fmt.Printf("Some error  %v", err)
			continue
		}
		gameController.STATE = int(bytes[9])
		gameController.KICKOFF = int(bytes[11])
		gameController.SECOND_STATE = int(bytes[12])
		gameController.SECOND_STATE_TEAM = int(bytes[13])
		gameController.SECOND_STATE_CONDITION = int(bytes[14])
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

        bytes := make([]byte, 512)

        n, remoteaddr, err := ser.ReadFromUDP(bytes)
        if err != nil {
            fmt.Printf("[ERROR] ReadFromUDP: %v\n", err)
            continue
        }

        raw := strings.TrimSpace(string(bytes[:n]))
        if raw == "" {
            fmt.Println("[WARN] Received empty data")
            continue
        }

        parts := strings.Split(raw, "|")
        if len(parts) < 3 {
            fmt.Printf("[ERROR] Incomplete encrypted data: %s\n", raw)
            continue
        }	

		cipher := parts[0]
		tag := parts[1]
		iv := parts[2]
		plaintext, err := DecryptAESGCM(iv, tag, cipher)

        if err != nil {
            fmt.Printf("[ERROR] Decryption failed: %v\n", err)
            continue
        }

        fmt.Printf("[OK] Decrypted data: %s\n", plaintext)

        received := CleanString(plaintext)
        dataAfterParseLoc := ParseLoc(received)

        s := Split(received)
        swap := Swap(s[10])

        var container string
        for i := 0; i < 9; i++ {
            container = container + s[i]
        }

        container = CleanString(container)
        swap = CleanString(swap)

        if container == swap {

            id := GetID(dataAfterParseLoc)

            t := time.Now()

            switch id[0] {
            case '1':
                times.timeR1 = t.Unix()
                staging.R1 = dataAfterParseLoc
            case '2':
                times.timeR2 = t.Unix()
                staging.R2 = dataAfterParseLoc
            case '3':
                times.timeR3 = t.Unix()
                staging.R3 = dataAfterParseLoc
            case '4':
                times.timeR4 = t.Unix()
                staging.R4 = dataAfterParseLoc
            case '5':
                times.timeR5 = t.Unix()
                staging.R5 = dataAfterParseLoc
            }

            rvRobot := WhoIsExecute(id)
            go ClientResponse(ser, remoteaddr, rvRobot)
        }

    }
}

func ClientResponse(conn *net.UDPConn, addr *net.UDPAddr, rvRobot string) {

	// refereebox
	intRobot, _ := strconv.Atoi(rvRobot)
	data := make([]byte, 10)
	data[0] = byte(gameController.VERSION)
	data[1] = byte(intRobot)
	data[2] = byte(gameController.STATE)
	data[3] = byte(gameController.KICKOFF)
	data[4] = byte(gameController.SECOND_STATE)
	data[5] = byte(gameController.SECOND_STATE_TEAM)
	data[6] = byte(gameController.SECOND_STATE_CONDITION)

	_, err := conn.WriteToUDP(data, addr)
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
			dataResponse = dataResponse + strconv.Itoa(gameController.STATE)

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
 * selection robot who is execute
 */
func WhoIsExecute(data string) string {
	// [0,1] => robot see the ball

	if data[1] == '1' {

		privilege := GetPrivilegeRobot(data)

		if privilege < execute.privilege {
			execute.robotExecute = data
			execute.privilege = privilege
		}
	}

	t := time.Now()
	// update timeout
	if execute.robotExecute == data {
		execute.executeTimeout = t.Unix()
	}

	// remove when timeout
	if execute.executeTimeout+timeout < t.Unix() {
		execute.robotExecute = "0"
		execute.privilege = 10
	}

	return execute.robotExecute
}

func GetPrivilegeRobot(data string) int {
	if data[1] == '1' {
		return 1
	}
	if data[1] == '2' {
		return 2
	}
	if data[1] == '3' {
		return 3
	}
	if data[1] == '4' {
		return 4
	}
	if data[1] == '5' {
		return 5
	}
	return 10
}
