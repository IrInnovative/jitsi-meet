# Jitsi Meet quick install

This document describes the required steps for a quick Jitsi Meet installation on a Debian based GNU/Linux system. Debian 8 (Jessie) or later, and Ubuntu 14.04 or later are supported out-of-the-box.

Debian Wheezy and other older systems may require additional things to be done. Specifically for Wheezy, [libc needs to be updated](http://lists.jitsi.org/pipermail/users/2015-September/010064.html).

N.B.: All commands are supposed to be run by root. If you are logged in as a regular user with sudo rights, please prepend ___sudo___ to each of the commands.

## Basic Jitsi Meet install

### Add the repository
```sh
echo 'deb https://download.jitsi.org stable/' >> /etc/apt/sources.list.d/jitsi-stable.list
wget -qO -  https://download.jitsi.org/jitsi-key.gpg.key | apt-key add -
```

### Update the package lists

```sh
apt-get update
```

### Install Jitsi Meet

```sh
apt-get -y install jitsi-meet
```

During the installation, you will be asked to enter the hostname of the Jitsi Meet instance. If you have a FQDN hostname for the instance already set up in DNS, enter it there. If you don't have a resolvable hostname, you can enter the IP address of the machine (if it is static or doesn't change).

This hostname (or IP address) will be used for virtualhost configuration inside the Jitsi Meet and also, you and your correspondents will be using it to access the web conferences.

#### Advanced configuration
If installation is on a machine behind NAT further configuration of jitsi-videobridge is needed in order for it to be accessible.
Provided that all required ports are routed (forwarded) to the machine that it runs on. By default these ports are (TCP/443 or TCP/4443 and UDP 10000).
The following extra lines need to be added the file `/etc/jitsi/videobridge/sip-communicator.properties`:
```
org.ice4j.ice.harvest.NAT_HARVESTER_LOCAL_ADDRESS=<Local.IP.Address>
org.ice4j.ice.harvest.NAT_HARVESTER_PUBLIC_ADDRESS=<Public.IP.Address>
```
See [the documenation of ice4j](https://github.com/jitsi/ice4j/blob/master/doc/configuration.md)
for details.

### Open a conference

Launch a web browser (Chrome, Chromium or latest Opera) and enter in the URL bar the hostname (or IP address) you used in the previous step.

Confirm that you trust the self-signed certificate of the newly installed Jitsi Meet.

Enjoy!

## Adding sip-gateway to Jitsi Meet

### Install Jigasi

```sh
apt-get -y install jigasi
```
or

```sh
wget https://download.jitsi.org/unstable/jigasi_1.0-107_amd64.deb
dpkg -i jigasi_1.0-107_amd64.deb
```

During the installation, you will be asked to enter your SIP account and password. This account will be used to invite the other SIP participants.

### Reload Jitsi Meet

Launch again a browser with the Jitsi Meet URL and you'll see a telephone icon on the right end of the toolbar. Use it to invite SIP accounts to join the current conference.

Enjoy!

## Uninstall

```sh
apt-get purge jigasi jitsi-meet jitsi-meet-web-config jitsi-meet-web jicofo jitsi-videobridge
```

Sometimes the following packages will fail to uninstall properly:

- jigasi
- jitsi-videobridge

When this happens, just run the uninstall command a second time and it should be ok.

The reason for failure is that sometimes, the uninstall script is faster than the process that stops the daemons. The second run of the uninstall command fixes this, as by then the jigasi or jvb daemons are already stopped.
