import { ref } from 'vue'

interface User {
  id: number
  email: string
  role: string
}

export const useAuth = () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      const res = await $fetch<{
        token: string
        user: User
      }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      token.value = res.token
      user.value = res.user

      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
    } catch (err: any) {
      console.error('LOGIN ERROR RAW:', err)

      if (err?.response?._data?.statusMessage) {
        throw new Error(err.response._data.statusMessage)
      }

      if (err?.message) {
        throw new Error(err.message)
      }

      throw new Error('Credenciales incorrectas o servidor no disponible')
    }
  }

  const register = async (
    email: string,
    password: string,
    role: string,
    documentoIdentidad: string,
    nombre: string,
    telefono: string
  ) => {
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          email,
          password,
          role,
          documentoIdentidad,
          nombre,
          telefono
        }
      })
    } catch (err: any) {
      console.error('REGISTER ERROR RAW:', err)

      if (err?.response?._data?.statusMessage) {
        throw new Error(err.response._data.statusMessage)
      }

      if (err?.message) {
        throw new Error(err.message)
      }

      throw new Error('Error al registrar usuario')
    }
  }

  // 🔥 Restaurar sesión al recargar
  if (process.client) {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
    }
  }

  return {
    user,
    token,
    login,
    register
  }
}
