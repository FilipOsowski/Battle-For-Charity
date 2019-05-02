if [[ $UID != 0 ]]; then
	echo "Please run this script with sudo:"
	echo "sudo $0 $*"
	exit 1
else
	sudo apt install nginx mysql-server
	wget -O miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
	sudo bash miniconda.sh -b
	sudo rm miniconda.sh
	git clone https://github.com/FilipOsowski/Battle-For-Charity
	conda env list
fi
