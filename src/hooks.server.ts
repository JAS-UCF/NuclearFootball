import client from '$lib/mqtt/mqtt';
import type { Handle } from '@sveltejs/kit';
import * as fs from "fs";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  return response;
};
const logFile = "data_log_" + new Date().getTime() + ".csv"
client.on("message", (t, m) => {
  console.log("New Message : " + t);
  try {
    const data = JSON.parse(m.toString());

    const csvRow = [
      new Date().toISOString(), // Timestamp
      data.Thermocouples.tc1, data.Thermocouples.tc2, data.Thermocouples.tc3, data.Thermocouples.tc4,
      data.Relays.r1, data.Relays.r2, data.Relays.r3,
      data.Water.pressure, data.Oil.pressure,
      data.force
    ].join(',');

    console.log(csvRow);

    fs.appendFile(logFile, csvRow + '\n', (err) => {
      if (err) console.error('Error writing to file:', err);
    });
  } catch (e) {
    console.warn("Failed to parse message:", e);
  }
});
