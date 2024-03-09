topic = "sensor_data" # topic to listen on 

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with result code: " + str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
     print("Message received: " + msg.payload.decode())