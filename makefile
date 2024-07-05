all:
	go build -o bin/server server.go

clean:
	rm -rf bin/*

run:
	./bin/server