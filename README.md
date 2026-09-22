## Basestation-RSCUAD
> base for communication Robot RSCUAD soccer mode. <br>
> we decided to migrate to GO-lang for efficiency. if you still want to use nodejs please checkout V1.0.1


### Screenshot
![alt text](https://github.com/danmirror/basestation-RSCUAD/blob/master/assets/image/ss2.png)

### Required
- [x] GO-lang
- [x] Node.js + npm (hanya bila ingin mengubah tampilan / build ulang CSS)

### Download
```
 $ git clone https://github.com/danmirror/basestation-RSCUAD
```
### Install Linux
```
 $ sudo chmod 777 setup.bash && ./setup.bash
```
make sure the go version shows up. otherwise just run manually.

### Compile
- make

### Run 
- make run

### Make targets
| Command | Description |
| --- | --- |
| `make` | build to `bin/server` |
| `make run` | run `bin/server` |
| `make key` | generate a new `AES_KEY_GCM` into `.env` (`FORCE=1` to replace an existing one) |
| `make clean` | clear `bin/` |
| `make help` | list the targets above |

### Install and run Windows
- download go https://go.dev/dl/go1.13.windows-386.msi and install
- click run.bat

### UI (Tailwind CSS)
Tampilan dashboard dibangun dengan Tailwind CSS v4. File `assets/css/tailwind.css` adalah
hasil build dan sudah ikut di-commit, jadi menjalankan base station **tidak butuh Node.js**.
Node hanya diperlukan bila ingin mengubah tampilan:

```
 $ npm install
 $ npm run build:css     # build sekali (minified)
 $ npm run watch:css     # rebuild otomatis saat file diubah
```

| File | Keterangan |
| --- | --- |
| `assets/css/app.css` | sumber Tailwind (token warna, komponen, animasi) |
| `assets/css/tailwind.css` | hasil build — jangan diedit manual |
| `assets/js/ui.js` | logika dashboard: tab, meter, grafik paket, log, stream, websocket |
| `assets/client.js` | parser data robot (tidak diubah) |

### Package API
Paket robot terdiri dari 11 field dipisah koma, lalu dienkripsi AES-256-GCM dan
dikirim sebagai hex `iv(24) + tag(32) + ciphertext` ke UDP 8124.

```
id,tilt,pan,gyro,ball,count,limit,y,x,time,checksum
31,45,-120,87,1,23,0,320,610,12.480,1016023032178021-5413
```
| Field | Isi |
| --- | --- |
| `id` | `<nomor robot><status>`, mis. `31` = robot 3 sedang eksekusi, `30` = standby |
| `y`, `x` | posisi di lapangan dalam px (lapangan 900×600); server mengirim `900 - x` ke dashboard |
| `time` | detik.milidetik saat paket dibuat |
| `checksum` | `"1"` + kebalikan dari gabungan field 0..8 |

### Test / simulator
```
 $ pip install cryptography
 $ python3 test/main.py --robot all      # kirim telemetry 5 robot ke base station
 $ python3 test/referee.py --cycle       # kirim game state INIT->READY->SET->PLAY->FINISH
```
`test/main.py --help` dan `test/referee.py --help` untuk opsi lain (`--ip`, `--rate`, `--state`, dll).
### Environment Configuration

Generate the key with make (creates `.env` automatically):
```
 $ make key
```
It writes a random 32-character `AES_KEY_GCM` to `.env` and prints it, so it can be
copied to the robot side. Existing keys are never overwritten by accident:
```
 $ make key FORCE=1    # replace the key, old .env saved as .env.bak
```
Or do it manually: copy `.env.example` to `.env`, then set the `AES_KEY_GCM` value.

> **Note**
> - `AES_KEY_GCM` must be exactly **32 characters**.
> - Use the **same key** on both the robot and the base station.
> - Do not upload the `.env` file to GitHub.

### Author
> <a href="https://me-danuandrean.github.io/">Danu andrean</a>


### License
[MIT](https://github.com/danmirror/basestation-RSCUAD/blob/master/LICENSE)

