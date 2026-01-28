<template>
  <div class="login-page">
    <div class="login-card">

      <!-- BRAND -->
      <div class="brand">
        <img src="../public/logos/light.png" alt="Brand" />
      </div>

      <!-- TITULO -->
      <h1 class="title">{{ currentTitle }}</h1>
      <p class="subtitle">{{ currentSubtitle }}</p>

      <!-- ===== LOGIN / REGISTER ===== -->
      <form v-if="view === 'login' || view === 'register'" @submit.prevent="handleSubmit">

        <input type="email" placeholder="Correo electrónico" v-model="email" required />

        <input v-if="view === 'register'" type="text" placeholder="Documento de identidad" v-model="documentoIdentidad" required />
        <input v-if="view === 'register'" type="text" placeholder="Nombre" v-model="nombre" required />
        <input v-if="view === 'register'" type="tel" placeholder="Teléfono" v-model="telefono" />

        <select v-if="view === 'register'" v-model="role">
          <option value="ADMIN">Administrador</option>
          <option value="DOCENTE">Docente</option>
        </select>

        <div class="password-field">
          <input :type="showPassword ? 'text' : 'password'" placeholder="Contraseña" v-model="password" required />
          <button type="button" @click="showPassword = !showPassword">👁</button>
        </div>

        <a v-if="view === 'login'" class="forgot" @click="view = 'forgot'">
          ¿Olvidaste tu contraseña?
        </a>

        <button class="submit">
          {{ view === 'register' ? 'Crear cuenta' : 'Ingresar' }}
        </button>

        <p class="toggle">
          <a @click="toggleLoginRegister">
            {{ view === 'register'
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Crear cuenta' }}
          </a>
        </p>
      </form>

      <!-- ===== FORGOT PASSWORD ===== -->
      <form v-if="view === 'forgot'" @submit.prevent="sendCode">
        <input type="email" placeholder="Correo electrónico" v-model="email" required />
        <button class="submit">Enviar Código</button>

        <p class="toggle">
          <a @click="view = 'login'">← Volver al inicio de sesión</a>
        </p>
      </form>

      <!-- ===== CODE SENT ===== -->
      <div v-if="view === 'sent'" class="center">
        <div class="success-icon">✉️</div>
        <h2>¡Código Enviado!</h2>
        <p>Hemos enviado un código a <strong>{{ email }}</strong></p>
        <p class="small">Redirigiendo...</p>
      </div>

      <!-- ===== RESET PASSWORD ===== -->
      <form v-if="view === 'reset'" @submit.prevent="resetPassword">

        <div class="code-inputs">
          <input v-for="i in 6" :key="i" maxlength="1" />
        </div>

        <div class="password-field">
          <input :type="showPassword ? 'text' : 'password'" placeholder="Nueva contraseña" required />
          <button type="button" @click="showPassword = !showPassword">👁</button>
        </div>

        <div class="password-field">
          <input :type="showPassword ? 'text' : 'password'" placeholder="Confirmar contraseña" required />
        </div>

        <button class="submit">Cambiar Contraseña</button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const view = ref('login')

const email = ref('')
const password = ref('')
const role = ref('DOCENTE')
const documentoIdentidad = ref('')
const nombre = ref('')
const telefono = ref('')
const showPassword = ref(false)

const currentTitle = computed(() => ({
  login: 'Ingresar',
  register: 'Registrarse',
  forgot: 'Restablecer Contraseña',
  sent: 'Código Enviado',
  reset: 'Nueva Contraseña'
}[view.value]))

const currentSubtitle = computed(() => ({
  login: 'Bienvenido de vuelta al tutor virtual de mecatrónica',
  register: 'Crea tu cuenta para continuar',
  forgot: 'Ingresa tu correo para recibir el código',
  sent: 'Revisa tu correo',
  reset: 'Ingresa tu nueva contraseña'
}[view.value]))

const toggleLoginRegister = () => {
  view.value = view.value === 'login' ? 'register' : 'login'
}

const handleSubmit = () => {
  if (view.value === 'register') view.value = 'login'
}

const sendCode = () => {
  view.value = 'sent'
  setTimeout(() => view.value = 'reset', 2000)
}

const resetPassword = () => {
  view.value = 'login'
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: url('/images/g11.jpg') center/cover no-repeat;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 12%;
}

.login-card {
  width: 480px;
  background: white;
  padding: 2.8rem;
  border-radius: 22px;
  box-shadow: 0 30px 60px rgba(0,0,0,.25);
}

.brand {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
}
.brand img { height: 50px; }

.title {
  text-align: center;
  font-size: 2.5rem;
  color: #062A7D;
  margin-bottom: 1rem;
}
.subtitle {
  text-align: center;
  color: #8a8a8a;
  margin-bottom: 1.5rem;
}

input, select {
  width: 100%;
  padding: .75rem;
  border-radius: 8px;
  border: none;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  margin-bottom: 1.3rem;
  background-color: white;
  color: #061b93;
}
input:focus { outline: none; }

.password-field { position: relative; }
.password-field button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.submit {
  width: 100%;
  background: #2563eb;
  color: white;
  padding: .8rem;
  border-radius: 10px;
  border: none;
  margin-top: 1rem;
}

.forgot {
  display: block;
  text-align: right;
  font-size: .9rem;
  color: #2563eb;
  cursor: pointer;
}

.toggle {
  text-align: center;
  margin-top: 1rem;
}
.toggle a { color: #2563eb; cursor: pointer; }

.center { text-align: center; }
.success-icon {
  font-size: 3rem;
  margin: 1rem 0;
}

.code-inputs {
  display: flex;
  gap: .5rem;
  justify-content: center;
}
.code-inputs input {
  width: 45px;
  text-align: center;
  font-size: 1.2rem;
}
</style>
