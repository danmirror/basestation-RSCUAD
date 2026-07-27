#!/usr/bin/env python3
"""
Simulator sisi robot untuk Base Station R-SCUAD.

Mengirim paket telemetry terenkripsi (AES-256-GCM) ke port UDP 8124,
persis seperti yang diharapkan source/manager.go, lalu menampilkan balasan
referee box dari base station.

Format paket (sebelum dienkripsi), 11 field dipisah koma:

    index  isi
    0      id        -> "<nomor robot><status>", contoh "31" = robot 3 sedang eksekusi,
                        "30" = robot 3 standby
    1      tilt
    2      pan
    3      gyro
    4      ball      -> 0/1 bola terlihat
    5      count
    6      limit     -> 0/1
    7      y         -> posisi Y di lapangan (px, 0..600)
    8      x         -> posisi X di lapangan (px, 0..900); server mengirim 900-x ke dashboard
    9      time      -> detik.milidetik saat paket dibuat
    10     checksum  -> "1" + kebalikan dari gabungan field 0..8

Paket dienkripsi AES-256-GCM memakai AES_KEY_GCM dari .env (32 karakter),
lalu dikirim sebagai teks hex: iv(24) + tag(32) + ciphertext.

Balasan base station berupa 10 byte:
    [0] versi  [1] robot yang dapat privilege  [2] state  [3] kickoff
    [4] second state  [5] second state team  [6] second state condition

Butuh paket python "cryptography":  pip install cryptography

Contoh:
    python3 test/main.py                        # robot 1 ke 127.0.0.1
    python3 test/main.py --robot all            # lima robot sekaligus
    python3 test/main.py --robot 3 --ip 192.168.1.10 --rate 10
"""

import argparse
import math
import os
import random
import socket
import sys
import time

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:
    sys.exit("paket 'cryptography' belum terpasang -> pip install cryptography")

FIELD_W, FIELD_H = 900, 600
GAME_STATE = {0: "INIT", 1: "READY", 2: "SET", 3: "PLAY", 4: "FINISH"}


def load_key(path):
    """Ambil AES_KEY_GCM dari file .env."""
    if not os.path.exists(path):
        sys.exit("%s tidak ditemukan — jalankan 'make key' dulu" % path)

    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if line.startswith("AES_KEY_GCM="):
            key = line.split("=", 1)[1].strip()
            if len(key) != 32:
                sys.exit("AES_KEY_GCM harus tepat 32 karakter (sekarang %d)" % len(key))
            return key.encode("utf-8")

    sys.exit("AES_KEY_GCM tidak ada di %s" % path)


def checksum(fields):
    """Checksum sesuai Swap() di source/utilities.go: '1' + kebalikan field 0..8."""
    return "1" + "".join(fields[:9])[::-1]


def build_packet(fields):
    """Susun 11 field menjadi satu baris plaintext."""
    return ",".join(fields + [checksum(fields)])


def encrypt(key, plaintext):
    """AES-256-GCM -> hex: iv(12B) + tag(16B) + ciphertext."""
    iv = os.urandom(12)
    sealed = AESGCM(key).encrypt(iv, plaintext.encode("utf-8"), None)
    ciphertext, tag = sealed[:-16], sealed[-16:]
    return (iv.hex() + tag.hex() + ciphertext.hex()).encode("ascii")


class Robot:
    """Menghasilkan data telemetry yang bergerak supaya enak dilihat di dashboard."""

    def __init__(self, number):
        self.number = number
        self.count = 0
        self.phase = random.random() * math.tau

    def sample(self, elapsed, executing):
        self.count += 1
        t = elapsed + self.phase

        x = int(FIELD_W / 2 + math.cos(t * 0.6) * (FIELD_W / 2 - 90))
        y = int(FIELD_H / 2 + math.sin(t * 0.9) * (FIELD_H / 2 - 70))

        now = time.localtime()
        stamp = "%d.%03d" % (now.tm_sec, int(time.time() * 1000) % 1000)

        return [
            "%d%d" % (self.number, 1 if executing else 0),   # 0  id + status
            str(int(45 + 40 * math.sin(t * 1.3))),           # 1  tilt
            str(int(180 * math.sin(t * 0.7))),               # 2  pan
            str(int((math.degrees(t) % 360) - 180)),         # 3  gyro
            "1" if math.sin(t * 2.1) > 0 else "0",           # 4  ball
            str(self.count),                                 # 5  count
            "1" if math.sin(t * 0.35) > 0.8 else "0",        # 6  limit
            str(y),                                          # 7  y
            str(x),                                          # 8  x
            stamp,                                           # 9  time
        ]


def parse_response(data):
    if len(data) < 7:
        return "balasan pendek (%d byte)" % len(data)

    # byte[1] berisi id robot pemegang eksekusi ("11" = robot 1 status 1), 0 bila kosong
    execute = "R%d" % (data[1] // 10) if data[1] >= 10 else "-"

    return "eksekusi=%s state=%s kickoff=%d second=%d/%d/%d" % (
        execute,
        GAME_STATE.get(data[2], data[2]),
        data[3], data[4], data[5], data[6],
    )


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--ip", default="127.0.0.1", help="alamat base station (default 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8124, help="port UDP base station (default 8124)")
    parser.add_argument("--robot", default="1", help="nomor robot: '3', '1,2,5', atau 'all' (default 1)")
    parser.add_argument("--rate", type=float, default=10.0, help="paket per detik tiap robot (default 10)")
    parser.add_argument("--env", default=os.path.join(root, ".env"), help="lokasi file .env")
    parser.add_argument("--verbose", action="store_true", help="tampilkan isi tiap paket")
    args = parser.parse_args()

    numbers = [1, 2, 3, 4, 5] if args.robot == "all" else [int(n) for n in args.robot.split(",")]
    for n in numbers:
        if n not in (1, 2, 3, 4, 5):
            sys.exit("nomor robot harus 1..5, dapat %d" % n)

    key = load_key(args.env)
    robots = [Robot(n) for n in numbers]

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(0.2)

    print("robot %s -> %s:%d @ %.1f Hz  (Ctrl+C untuk berhenti)"
          % (",".join(str(n) for n in numbers), args.ip, args.port, args.rate))

    start = time.time()
    period = 1.0 / args.rate
    sent = 0
    reply = "menunggu balasan..."

    try:
        while True:
            elapsed = time.time() - start
            # satu robot bergiliran memegang eksekusi tiap 5 detik
            executing = numbers[int(elapsed / 5) % len(numbers)]

            for robot in robots:
                fields = robot.sample(elapsed, robot.number == executing)
                plaintext = build_packet(fields)
                sock.sendto(encrypt(key, plaintext), (args.ip, args.port))
                sent += 1

                if args.verbose:
                    print("kirim R%d: %s" % (robot.number, plaintext))

                try:
                    reply = parse_response(sock.recv(64))
                except socket.timeout:
                    reply = "tidak ada balasan (base station mati?)"

            # tulis satu baris yang di-update terus bila di terminal,
            # tapi jangan spam \r kalau output di-redirect ke file
            if sys.stdout.isatty():
                print("\r%6d paket terkirim | %s   " % (sent, reply), end="", flush=True)
            elif sent % (len(robots) * 50) == 0:
                print("%6d paket terkirim | %s" % (sent, reply), flush=True)
            time.sleep(period)

    except KeyboardInterrupt:
        print("\nberhenti, total %d paket terkirim" % sent)
    finally:
        sock.close()


if __name__ == "__main__":
    main()
