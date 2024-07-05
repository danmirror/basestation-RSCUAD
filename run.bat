@echo off 

set FILE_EXE=bin\server.exe
set IP=0.0.0.0

if exist %FILE_EXE% (
    echo Remove %FILE_EXE%
    del %FILE_EXE%
)

echo build code ..
go build -o bin/server.exe server.go

IF ERRORLEVEL 1 (
    echo Build failed
    exit /b 1
)

set ip_address_string="IPv4 Address"
for /f "usebackq tokens=2 delims=:" %%f in (`ipconfig ^| findstr /c:%ip_address_string%`) do (
    set IP=%%f
)

echo running at : %IP%:8081
bin\server.exe