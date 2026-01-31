import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(() => {
  return { mensaje: 'API OK' }
})
