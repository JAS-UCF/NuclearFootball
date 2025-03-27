export interface Message {
  message: string,
  topic: string
}

export interface DecodedMessage {
  Thermocouples: {
    tc1: number,
    tc2: number,
    tc3: number,
    tc4: number
  },
  Water: {
    pressure: number,
    temperature: number,
  },
  Oil: {
    pressure: number,
    temperature: number,
  },
  force: number

}