KEY_LEN := 32

.PHONY: all clean run key help

all:
	go build -o bin/server server.go

clean:
	rm -rf bin/*

run:
	./bin/server

# generate AES_KEY_GCM baru ke dalam .env
# key harus tepat 32 karakter dan sama dengan yang dipakai robot
key:
	@if [ -f .env ] && grep -q '^AES_KEY_GCM=..*' .env && [ "$(FORCE)" != "1" ]; then \
		echo "AES_KEY_GCM sudah ada di .env."; \
		echo "Menimpanya membuat robot dengan key lama tidak bisa terbaca."; \
		echo "Jalankan 'make key FORCE=1' bila memang ingin mengganti."; \
		exit 1; \
	fi
	@KEY=`LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c $(KEY_LEN)`; \
	if [ -f .env ]; then \
		cp .env .env.bak; \
		grep -v '^AES_KEY_GCM=' .env.bak > .env || true; \
		echo "backup .env lama -> .env.bak"; \
	elif [ -f .env.example ]; then \
		grep -v '^AES_KEY_GCM=' .env.example > .env || true; \
	fi; \
	echo "AES_KEY_GCM=$$KEY" >> .env; \
	echo "key baru ($(KEY_LEN) karakter) ditulis ke .env:"; \
	echo "  $$KEY"; \
	echo "gunakan key yang sama di sisi robot."

help:
	@echo "make        - build ke bin/server"
	@echo "make run    - jalankan bin/server"
	@echo "make key    - generate AES_KEY_GCM baru ke .env (FORCE=1 untuk menimpa)"
	@echo "make clean  - hapus isi bin/"
