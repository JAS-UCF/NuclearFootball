import client from "$lib/mqtt/mqtt"
import type { Message } from "$lib/types"
import { produce } from 'sveltekit-sse'

export function POST() {
  return produce(async function start({ emit }) {
    client.on("message", (t, m) => {
      emit("message", JSON.stringify({ topic: t, message: m.toString() } satisfies Message))
    })
  })
}