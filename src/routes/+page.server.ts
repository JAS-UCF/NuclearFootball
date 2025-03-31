import client from "$lib/mqtt/mqtt";
import type { Actions } from "./$types";

export const actions: Actions = {
  relay1: async ({ request }) => {
    console.log("RELAY1");
    client.publish("/RELAY", "R1");
  },
  relay2: async ({ request }) => {
    console.log("RELAY1");
    client.publish("/RELAY", "R2");
  },
  relay3: async ({ request }) => {
    console.log("RELAY1");
    client.publish("/RELAY", "R3");
  }
};