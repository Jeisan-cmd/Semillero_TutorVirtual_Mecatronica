import jwt from 'jsonwebtoken'
import { getHeader } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader) return

    const token = authHeader.replace('Bearer ', '')

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      event.context.user = decoded
    } catch {
      // Token inválido, se ignora
    }
  })
})
