#!/bin/bash

PORT=4200

check_server() {
    if lsof -i :$PORT > /dev/null; then
        zenity --info --text="Server is running on port $PORT."
    else
        zenity --info --text="Server is not running on port $PORT."
    fi
}

start_server() {
    if ! lsof -i :$PORT > /dev/null; then
        zenity --info --text="Starting server on port $PORT..."
        # Here you should add the command to start your server, e.g., ng serve
        ng serve &
    else
        zenity --info --text="Server is already running on port $PORT."
    fi
}

stop_server() {
    if lsof -i :$PORT > /dev/null; then
        zenity --info --text="Stopping server on port $PORT..."
        kill $(lsof -t -i :$PORT)
    else
        zenity --info --text="Server is not running on port $PORT."
    fi
}

check_server

ACTION=$(zenity --list --title="Server Control" \
    --column="Action" "Start" "Stop")

case "$ACTION" in
    Start)
        start_server
        ;;
    Stop)
        stop_server
        ;;
    *)
        zenity --error --text="No valid action selected."
        exit 1
        ;;
esac
