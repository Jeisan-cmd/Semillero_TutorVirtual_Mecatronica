<template>
  <div class="min-h-screen flex bg-gray-100">

    <!-- 🟦 Imagen izquierda -->
    <div class="hidden lg:flex w-1/2 bg-blue-900 relative">
      <img
        src="/images/robot-login.jpg"
        alt="Robot"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-blue-900/50"></div>
    </div>

    <!-- ⬜ Card Login -->
    <div class="w-full lg:w-1/2 flex items-center justify-center">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img
            src="/images/logo-iudc.png"
            alt="Logo"
            class="h-14"
          />
        </div>

        <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">
          {{ isRegistering ? 'Registrarse' : 'Ingresar' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">

          <input v-model="email" type="email" placeholder="Correo electrónico" required class="input" />

          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            required
            class="input"
          />

          <!-- Registro -->
          <div v-if="isRegistering" class="space-y-4">
            <select v-model="role" class="input">
              <option value="DOCENTE">Docente</option>
<<<<<<< HEAD
              <option value="ESTUDIANTE">Estudiante</option>
=======
              <option value="ADMIN">Administrador</option>
>>>>>>> origin/Rama_Esteban
            </select>

            <input v-model="documentoIdentidad" placeholder="Documento" class="input" />
            <input v-model="nombre" placeholder="Nombre completo" class="input" />
            <input v-model="telefono" placeholder="Teléfono" class="input" />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg font-semibold transition"
          >
            {{ isRegistering ? 'Registrarse' : 'Iniciar Sesión' }}
          </button>
        </form>

        <p v-if="error" class="text-red-500 text-sm text-center mt-4">{{ error }}</p>
        <p v-if="successMessage" class="text-green-600 text-sm text-center mt-4">{{ successMessage }}</p>

        <div class="text-center mt-6">
          <button class="text-blue-700 hover:underline text-sm" @click="toggleRegisterLogin">
            {{ isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from '#app'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, register, user } = useAuth()

const email = ref('')
const password = ref('')
const role = ref<'ADMIN' | 'DOCENTE'>('DOCENTE')
const documentoIdentidad = ref('')
const nombre = ref('')
const telefono = ref('')
const showPassword = ref(false)

const isRegistering = ref(route.query.register === 'true')
const error = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  error.value = ''
  successMessage.value = ''

  try {
    if (isRegistering.value) {
      await register(
        email.value,
        password.value,
        role.value,
        documentoIdentidad.value,
        nombre.value,
        telefono.value
      )

      successMessage.value = 'Registro exitoso. Inicia sesión.'
      isRegistering.value = false
    } else {
      await login(email.value, password.value)
      if (user.value) {
        router.push(`/${user.value.role.toLowerCase()}`)
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Error de autenticación'
  }
}

const toggleRegisterLogin = () => {
  isRegistering.value = !isRegistering.value
  error.value = ''
  successMessage.value = ''
}
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-4 py-3
    focus:outline-none focus:ring-2 focus:ring-blue-700;
}
</style>
