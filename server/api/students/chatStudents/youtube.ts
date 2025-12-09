// Helper para buscar videos en YouTube usando API key (axios)
import axios from 'axios'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

export async function buscarVideoYouTube(tema: string) {
  if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key no configurada')
  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: { part: 'snippet', maxResults: 1, q: `${tema} educativo explicación tutorial`, type: 'video', relevanceLanguage: 'es', key: YOUTUBE_API_KEY }
    })
    if (!response.data.items || response.data.items.length === 0) throw new Error('No se encontraron videos')
    const video = response.data.items[0]
    return { provider: 'youtube', videoId: video.id.videoId, title: video.snippet.title, description: video.snippet.description, thumbnailUrl: video.snippet.thumbnails.high.url }
  } catch (error) {
    console.error('Error al buscar videos en YouTube:', error)
    throw error
  }
}