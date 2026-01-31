import { ref } from 'vue'

interface User {
  id: number
  correo: string
  rol: string
}

export const useAuth = () => {
  const user = ref<User | null>(null)

  // 🍪 cookie reactiva de Nuxt
  const token = useCookie<string | null>('token')

  // ✅ LOGIN — retorna el usuario
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const res = await $fetch<{
        token: string
        user: User
      }>('/api/auth/login', {
        method: 'POST',
        body: {
          correo: email,
          contrasena: password
        }
      })

      // 🔥 GUARDAR EN COOKIE (CLAVE PARA EL MIDDLEWARE)
      token.value = res.token
      user.value = res.user

      // opcional: mantener usuario en localStorage
      if (process.client) {
        localStorage.setItem('user', JSON.stringify(res.user))
      }

      return res.user
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

  // ✅ REGISTER (no se toca)
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
          correo: email,
          contrasena: password,
          rol: role,
          documentoIdentidad,
          nombre
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

  // 🔄 Restaurar usuario (NO token, el token vive en cookie)
  if (process.client) {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    token,
    login,
    register
  }
}
