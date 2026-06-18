<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email    = ref('')
const enviando = ref(false)
const mensaje  = ref('')
const error    = ref('')

async function enviar() {
  if (!email.value) {
    error.value = 'Ingresa tu correo'
    return
  }

  enviando.value = true
  error.value = ''
  mensaje.value = ''

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/forgot-password`,
      { email: email.value }
    )
    mensaje.value = data.message
    email.value = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al enviar el correo'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">

      <div class="text-center mb-6">
        <div class="w-14 h-14 bg-orange-100 rounded-2xl flex items-center
                    justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-800">¿Olvidaste tu contraseña?</h1>
        <p class="text-sm text-gray-500 mt-1">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <!-- Éxito -->
      <div v-if="mensaje"
        class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
        ✅ {{ mensaje }}
      </div>

      <!-- Error -->
      <div v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
        ❌ {{ error }}
      </div>

      <div class="mb-4">
        <label class="text-sm font-medium text-gray-600 mb-1 block">Correo electrónico</label>
        <input v-model="email" type="email"
          placeholder="tu@correo.com"
          @keyup.enter="enviar"
          class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                 outline-none focus:border-orange-400 transition" />
      </div>

      <button @click="enviar" :disabled="enviando"
        class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
               text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed
               flex items-center justify-center gap-2">
        <svg v-if="enviando" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        {{ enviando ? 'Enviando...' : 'Enviar enlace' }}
      </button>

      <button @click="router.push({ name: 'login' })"
        class="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition">
        ← Volver al login
      </button>

    </div>
  </div>
</template>