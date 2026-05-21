<template>
  <div class="login-container">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Bienvenido</h1>
      <p class="text-gray-600">Ingresa a tu cuenta para continuar</p>
    </div>

    <form @submit="enviarFormulario" class="space-y-6">
      <!-- Campo Correo -->
      <div class="form-group">
        <label for="correo" class="form-label">Correo electrónico</label>
        <div class="input-container">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
          <input
            type="email"
            id="correo"
            name="correo"
            v-model="correo"
            class="form-input"
            placeholder="example@correo.com"
            autocomplete="on"
            required
          />
        </div>
      </div>

      <!-- Campo Contraseña -->
      <div class="form-group">
        <div class="flex justify-between items-center mb-2">
          <label for="contrasenia" class="form-label">Contraseña</label>
        </div>
        <div class="input-container">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            :type="mostrarContrasenia ? 'text' : 'password'"
            id="contrasenia"
            name="contrasenia"
            v-model="contrasenia"
            class="form-input"
            placeholder="••••••••"
            autocomplete="off"
            required
          />
          <button
            type="button"
            @click="mostrarContrasenia = !mostrarContrasenia"
            class="password-toggle"
            :title="mostrarContrasenia ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          >
            <svg v-if="mostrarContrasenia" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Error -->
      <p v-if="auth.error" class="text-red-500 text-sm text-center">
        {{ auth.error }}
      </p>

      <!-- Botón de Ingreso -->
      <button
        type="submit"
        class="submit-button"
        :disabled="auth.cargando"
      >
        <span class="button-text">
          {{ auth.cargando ? 'Entrando...' : 'Ingresar' }}
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import router from '@/router/index.js'

const auth = useAuthStore()

const correo = ref('')
const contrasenia = ref('')
const mostrarContrasenia = ref(false)

const enviarFormulario = async (e) => {
  e.preventDefault()
  await auth.login(correo.value, contrasenia.value)

  if (auth.estaAutenticado) {
    correo.value = ''
    contrasenia.value = ''
    router.push({ name: 'home' })
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  height: 20px;
  width: 20px;
  color: #9CA3AF;
  z-index: 10;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0;
  height: 20px;
  width: 20px;
}

.password-toggle:hover {
  color: #6B7280;
}

.submit-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #1a202c;
  background: linear-gradient(to right, #d9f99d, #a3e635, #84cc16);
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  text-align: center;
}

.submit-button:hover {
  background: linear-gradient(to bottom right, #d9f99d, #a3e635, #84cc16);
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button:focus {
  outline: none;
}

.submit-button:active {
  transform: translateY(0);
}

.button-text {
  margin-right: 0.5rem;
}
</style>