# RosBridge

## Instructions

### Dependencies

- Make sure to install ROS on local system, for this case it is ROS Noetic
- Install
```bash
sudo apt-get install ros-<rosdistro>-rosbridge-suite
```

#### Steps
- Run following on terminal
- roscore
- roslaunch rosbridge_server rosbridge_websocket.launch

#### Launching webpage

- Clone the repo
- Right click on index.html
- Open with browser(Chrome is possible)
- You should be able to see web based joy stick.

#### To see velocity publishing
- Open a new terminal, echo /cmd_vel
- rostopic echo /cmd_vel
