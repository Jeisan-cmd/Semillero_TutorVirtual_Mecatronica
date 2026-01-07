import { defineEventHandler, createError } from "h3"

export default defineEventHandler(async (event) => {
  const newsApiKey = process.env.NEWS_API_KEY
  if (!newsApiKey) {
    console.error("NEWS_API_KEY no está definida")
    throw createError({
      statusCode: 500,
      message: "Error de configuración del servidor: NEWS_API_KEY no está definida",
    })
  }

  try {
    // Cambiado pageSize de 12 a 3 para reducir las solicitudes
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=mecatrónica OR robótica OR automatización industrial OR sistemas embebidos OR ingeniería mecatrónica OR control automático&language=es&sortBy=publishedAt&pageSize=3&apiKey=${newsApiKey}`,
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error al obtener noticias:", error)
    throw createError({
      statusCode: 500,
      message: "Error al obtener noticias",
    })
  }
})