# ROS WEB GUI
## Overview
The `roswebgui` package is a ROS node designed to open a `HTML` server to control ROS-based robot. This package allows users to monitor and control the robot's status via a web browser interface.

## Prerequisites
- rosbridge-server
```shell
$ sudo apt install ros-${ROS_DISRTO}-rosbridge-server
```
- image_compressed
```shell
$ cd ~/${YOUR_WORKSPACE}/src
$ git clone https://github.com/mjlee111/image_compressed.git
$ cd ..
$ catkin_make
```

## Clone & Build
```shell
$ cd ~/${YOUR_WORKSPACE}/src
$ git clone https://github.com/mjlee111/roswebgui.git
$ cd ..
$ catkin_make
```

## Usage 
- launch `roswebgui`
```shell
$ roslaunch roswebgui web_gui_start.launch
```

- Use your web browser to enter

`http://${IP}:8000`

- Connect to ros bridge

<div align=center>

![run](https://github.com/mjlee111/roswebgui/blob/master/docs/run.png)
</div>
