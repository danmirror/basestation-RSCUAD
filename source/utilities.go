package manager

import (
	"crypto/aes"
    "crypto/cipher"
    "encoding/hex"
    "strconv"
    "strings"
    "unicode"
	"net"
	"fmt"
)

func CleanString(data string) string {
	data = strings.TrimFunc(data, func(r rune) bool {
		return !unicode.IsGraphic(r)
	})
	return data
}

func ParseLoc(data string) string {
	s := Split(data)
	locY, _ := strconv.Atoi(s[8])

	width := 900

	var result string

	for i := 0; i < 11; i++ {

		if i == 8 {
			y := width - locY
			s[i] = strconv.Itoa(y)
		}
		result += s[i]
		if i != 10 {
			result += ","
		}
	}
	return result
}

func Split(data string) []string {
	d := strings.Split(data, ",")
	return d
}

func Swap(data string) string {
	datas := []rune(data)

	pointer1 := 0
	pointer2 := len(datas) - 1

	for pointer1 < pointer2 {
		datas[pointer1], datas[pointer2] = datas[pointer2], datas[pointer1]
		pointer1 += 1
		pointer2 -= 1
	}
	datas[len(datas)-1] = 0
	return string(datas)
}

func GetID(data string) string {
	id := strings.Split(data, ",")
	return id[0]
}

func GetIP() string {
	ifaces, _ := net.Interfaces()
	// handle err
	var ip net.IP
	for _, i := range ifaces {
		addrs, _ := i.Addrs()
		// handle err
		for _, addr := range addrs {
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}
		}
	}
	return string(ip)
}
func DecryptAESGCM(ivHex, tagHex, cipherHex string) (string, error) {

    key := []byte("R5C9u@D!A7xP#LQ2mZ8F$wKJH4S1ErT0")


    // Convert HEX → BYTES
    iv, err := hex.DecodeString(ivHex)
    if err != nil {
        return "", fmt.Errorf("[ERR] hex iv decode: %v", err)
    }
    tag, err := hex.DecodeString(tagHex)
    if err != nil {
        return "", fmt.Errorf("[ERR] hex tag decode: %v", err)
    }
    ciphertext, err := hex.DecodeString(cipherHex)
    if err != nil {
        return "", fmt.Errorf("[ERR] hex cipher decode: %v", err)
    }

    // Validate decoded sizes (bytes)
    if len(iv) != 12 {
        return "", fmt.Errorf("[ERR] IV must be 12 bytes, got: %s", strconv.Itoa(len(iv)))
    }
    if len(tag) != 16 {
        return "", fmt.Errorf("[ERR] Tag must be 16 bytes, got: %s", strconv.Itoa(len(tag)))
    }

    // Append tag to ciphertext (GCM expects ciphertext|tag passed to Open)
    ciphertext = append(ciphertext, tag...)

    block, err := aes.NewCipher(key)
    if err != nil {
        return "", fmt.Errorf("[ERR] new cipher: %v", err)
    }

    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", fmt.Errorf("[ERR] new GCM: %v", err)
    }

    plain, err := gcm.Open(nil, iv, ciphertext, nil)
    if err != nil {
        return "", fmt.Errorf("[ERR] gcm open: %v", err)
    }

    return string(plain), nil
}
