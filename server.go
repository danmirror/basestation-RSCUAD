package main

import (
	"fmt"
	"io/ioutil"

	manager "Basestation/source"
	"net/http"
)

func main() {
	go manager.RefereeBox()
	go manager.ClientHandler()
	manager.Init()

	styles := http.FileServer(http.Dir("./assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", styles))
	http.HandleFunc("/ws", manager.WSHandler)
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
