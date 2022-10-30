all:
	go build -o bin/server server.go

clean:
	rm -rf main

run:
	./bin/server