import paho.mqtt.client as mqtt
from onMsgCon import on_connect, on_message
hostname = "localhost" # likely going to be localhost
broker_port = 1883 # port that mosquito is listening on


client = mqtt.Client()
client.on_Connect = on_connect
client.on_message = on_message


client.connect(hostname, broker_port, 60)
client.loop_start()