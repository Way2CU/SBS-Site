# Caracal Site - Development Environment
#
# Copyright © 2014. Way2CU. All Rights Reserved.
# Author: Mladen Mijatov

Vagrant.configure('2') do |config|
	config.vm.box = 'hashicorp/precise32'

	# install web server and required components
	config.vm.provision :shell, :path => 'provision.sh', keep_color: true, run:'once'

	# make sure caracal is up to date
	config.vm.provision :shell, :inline => 'cd /var/www; git pull origin', keep_color: true, run:'always'

	# configure network
	config.vm.network :forwarded_port, host:8080, guest:80
	config.vm.network :forwarded_port, host:8085, guest:8080
end
