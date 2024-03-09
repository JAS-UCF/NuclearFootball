# NuclearFootball

code base for handing connectivity to the test stand base station

## RPI

the rpi code will allow us to see live sensor readouts as the launch key is sending the information to us

### SETUP

run this in a terminal to set up the broker
  sudo apt update
  sudo apt install mosquitto mosquitto-clients -y
  sudo apt install python3-pip
  sudo apt install paho-mqtt
  