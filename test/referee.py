#!/usr/bin/env python3
"""
Simulator referee box (GameController) untuk Base Station R-SCUAD.

Base station sendiri yang mendengarkan UDP 3838 (lihat RefereeBoxHandler di
source/manager.go), jadi script ini bertindak sebagai pengirim.

Byte yang dibaca base station dari paket:

    [9]  STATE                  -> 0 INIT, 1 READY, 2 SET, 3 PLAY, 4 FINISH
    [11] KICKOFF
    [12] SECOND_STATE
    [13] SECOND_STATE_TEAM
    [14] SECOND_STATE_CONDITION

Contoh:
    python3 test/referee.py --state play        # kirim PLAY terus menerus
    python3 test/referee.py --cycle             # putar INIT->READY->SET->PLAY->FINISH
    python3 test/referee.py --ip 192.168.1.10 --state 2
"""

import argparse
import socket
import sys
import time

STATES = {"init": 0, "ready": 1, "set": 2, "play": 3, "finish": 4}
STATE_NAME = {v: k.upper() for k, v in STATES.items()}

PACKET_LEN = 16
HEADER = b"RGme"      # header GameController
VERSION = 2


def build_packet(state, kickoff, second_state, second_team, second_condition):
    data = bytearray(PACKET_LEN)
    data[0:4] = HEADER
    data[4] = VERSION
    data[9] = state
    data[11] = kickoff
    data[12] = second_state
    data[13] = second_team
    data[14] = second_condition
    return bytes(data)


def parse_state(value):
    if value.lower() in STATES:
        return STATES[value.lower()]
    if value.isdigit() and int(value) in STATE_NAME:
        return int(value)
    sys.exit("state harus salah satu dari %s atau 0..4" % ", ".join(STATES))


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--ip", default="127.0.0.1", help="alamat base station (default 127.0.0.1)")
    parser.add_argument("--port", type=int, default=3838, help="port referee box (default 3838)")
    parser.add_argument("--state", default="play", help="init/ready/set/play/finish atau 0..4 (default play)")
    parser.add_argument("--cycle", action="store_true", help="putar semua state, ganti tiap --hold detik")
    parser.add_argument("--hold", type=float, default=5.0, help="lama tiap state saat --cycle (default 5 detik)")
    parser.add_argument("--rate", type=float, default=2.0, help="paket per detik (default 2)")
    parser.add_argument("--kickoff", type=int, default=0, help="nilai byte KICKOFF (default 0)")
    args = parser.parse_args()

    state = parse_state(args.state)
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    print("referee box -> %s:%d @ %.1f Hz  (Ctrl+C untuk berhenti)"
          % (args.ip, args.port, args.rate))

    start = time.time()
    period = 1.0 / args.rate

    try:
        while True:
            if args.cycle:
                state = int((time.time() - start) / args.hold) % len(STATES)

            sock.sendto(build_packet(state, args.kickoff, 0, 0, 0), (args.ip, args.port))

            line = "state = %-6s (%d)" % (STATE_NAME[state], state)
            if sys.stdout.isatty():
                print("\r%s   " % line, end="", flush=True)
            else:
                print(line, flush=True)

            time.sleep(period)

    except KeyboardInterrupt:
        print("\nberhenti")
    finally:
        sock.close()


if __name__ == "__main__":
    main()
