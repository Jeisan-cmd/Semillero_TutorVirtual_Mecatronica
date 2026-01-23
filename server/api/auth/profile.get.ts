export default defineEventHandler((event) => {
  return {
    usuario: event.context.auth
  }
})
