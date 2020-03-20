# configure headless gpu acceleration 

- prereqs:
    - install nvidia drivers
    - install the [python-api from ai2-thor](https://github.com/NextCenturyCorporation/MCS/tree/481fb967a3e3d259e9594d3e0cdce7bb09a68e34/python_api)

- get  the  gpu busid

```
nvidia-xconfig --query-gpu-info
```

`
GPU #0:
  Name      : Tesla M60
  ...
  PCI BusID : PCI:136:0:0
`

- create an xorg.conf file for headless operation

```
sudo nvidia-xconfig -a --allow-empty-initial-configuration --use-display-device=None \
--virtual=1920x1200 --busid {busid}
```

- edit `/etc/X11/xorg.conf` and delete the sections ServerLayout and Screen

```
sudo nano /etc/X11/xorg.conf
```

- install lightdm as a display manager (this  will start the Xserver)

```
sudo apt install lightdm
```

- install a windows manager (to start a session)

```
sudo apt install xfce4
```

- open `/etc/lightdm/lightdm.conf` and make xfce the user-session by adding the following lines:

```
[SeatDefaults]
greeter-session=unity-greeter
user-session=xfce
```

- start the lightdm service

```
sudo dpkg-reconfigure lightdm
sudo service lightdm restart
```

At this point querying `nvidia-smi` should  show an Xorg process using a GPU. This is an X server on display :0 if the server is headless

```
+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0     13299      G   /usr/lib/xorg/Xorg                           141MiB |
+-----------------------------------------------------------------------------+
```

- recommended to resize the display to adjust to a smaller screen

```
xrandr -display :0 -s 1440x900
```

- install a vncserver to connect to the server

```
sudo  apt install x11vnc
```

- start the vnc server:

```
export SOME_PASSWD="<change this>"
sudo x11vnc -display :0 -passwd $SOME_PASSWD -ncache 10 -auth /var/run/lightdm/root/:0
```

it will connect to  the running  X server in display :0 will cache pixels to increase performance and it set's up the authentication cookie.

- on  the local machine, forward x11vnc port (default 5900) from the server via ssh:

```
ssh -L 5900:127.0.0.1:5900 -C -N -l <USERNAME>  <SERVER_IP>
```

- on the local machine start a any  vnc viewer, in mac [vnc viewer](https://www.realvnc.com/en/connect/download/viewer/macos/) works

open vnc viewer and connect to `localhost:5900` then type the specified password and you will see an unbuntu session.

- test the ai2thor installation by running an example, specify the directory of the unity build

````
MCS_UNITY="/home/aldopareja/MCS/MCS-AI2-THOR-Unity-App-v0.0.1.x86_64"
python -m machine_common_sense.run_mcs_environment $MCS_UNITY scenes/playroom.json
````

