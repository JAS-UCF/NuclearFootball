# NuclearFootball

code suite to interface with mosquito (MQTT BROKER) and record information from the ESP32 Warhead project

## RPI

RPI will subscribe to topics relating to sensor information coming from the ESP32
RPI will record all relevant information coming from the MQTT topics
RPI will publish back to topics relatiing to safety and shutoff

### SETUP

run this in a terminal to set up the broker
  sudo apt update
  sudo apt install mosquitto mosquitto-clients -y
  sudo apt install python3-pip
  sudo apt install paho-mqtt

### TODO

Need to add some kind of UI to show the mqtt data coming in, either using pygame or some kind of drawable library
