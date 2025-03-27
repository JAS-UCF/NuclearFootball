import * as mqtt from "mqtt"

const client = mqtt.connect("localhost", {
  port: 1883,
  protocol: "mqtt",
});

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe("#", (err) => {
    console.warn(err);
  })
});
client.on("disconnect", () => {
  console.log("Disconnecting, attempting Reconnect. . .");
  client.reconnect();
})

export default client;