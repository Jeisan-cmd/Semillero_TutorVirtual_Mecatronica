import { createError } from 'h3'
import type { H3Event } from 'h3'

export default function requireRole(...roles: string[]) {
  return (event: H3Event) => {
    const user = event.context.user
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    if (!roles.includes(user.rol)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }
}
