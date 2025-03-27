import client from '$lib/mqtt/mqtt';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  return response;
};


// everything in this file is run on compile time and run on the server side

client.on("message", (t, m) => {
  console.log("New Message : " + t);
})
