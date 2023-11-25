package main

import (
	"fmt"
	"io/ioutil"

	manager "Basestation/source"
	"net/http"
)

func main() {
	go manager.RefereeBoxHandler()
	go manager.ClientHandler()
	go manager.StreamHandlerR1()
	go manager.StreamHandlerR2()
	go manager.StreamHandlerR3()
	go manager.StreamHandlerR4()
	go manager.StreamHandlerR5()

	manager.Init()

	styles := http.FileServer(http.Dir("./assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", styles))
	http.HandleFunc("/ws", manager.WSHandler)
	http.HandleFunc("/video1", manager.VideoHandlerR1)
	http.HandleFunc("/video2", manager.VideoHandlerR2)
	http.HandleFunc("/video3", manager.VideoHandlerR3)
	http.HandleFunc("/video4", manager.VideoHandlerR4)
	http.HandleFunc("/video5", manager.VideoHandlerR5)

	http.HandleFunc("/", RootHandler)

	panic(http.ListenAndServe(":8081", nil))
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	content, err := ioutil.ReadFile("index.html")
	if err != nil {
		fmt.Println("Could not open file.", err)
	}
	fmt.Fprintf(w, "%s", content)
}
