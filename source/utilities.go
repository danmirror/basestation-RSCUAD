package manager

import (
	"net"  
	"unicode"
	"strings"
)

func CleanString(data string) string{
	data = strings.TrimFunc(data, func(r rune) bool {
		return !unicode.IsGraphic(r)
	})
	return data
}

func Split(data string)[]string{
	d := strings.Split(data, ",")
	return d
}

func Swap(data string)string{
	datas := []rune(data)
	
	pointer1 := 0
    pointer2 := len(datas)-1

    for pointer1 < pointer2 {
        datas[pointer1], datas[pointer2]  = datas[pointer2] , datas[pointer1] 
        pointer1 += 1 ;
        pointer2 -= 1 ;
    }
	datas[len(datas)-1] = 0
	return string(datas)
}

func GetID(data string)string{
	id := strings.Split(data, ",")
	return id[0]
}

func GetIP()string{
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