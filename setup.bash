#install go 1.13
curl -OL https://golang.org/dl/go1.13.linux-amd64.tar.gz

# copy to usr/local
sha256sum go1.13.linux-amd64.tar.gz
sudo tar -C /usr/local -xvf go1.13.linux-amd64.tar.gz

# delete 
sudo rm -rf go1.13.linux-amd64.tar.gz

#add to path
echo "export PATH=\$PATH:/usr/local/go/bin:\$HOME/go/bin" >> ~/.bashrc && echo "export GOROOT=/usr/local/go" >> ~/.bashrc && echo "export PATH=\$PATH:/usr/local/go/bin:\$HOME/go/bin" >> ~/.bashrc && echo "export GOROOT=/usr/local/go" >> ~/.bashrc && source ~/.bashrc && source ~/.bashrc

# install dependency
go mod download

go version
