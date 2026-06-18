<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route  = useRoute()
const router = useRouter()

const form = ref({
  email:                 '',
  token:                 '',
  password:              '',
  password_confirmation: '',
})

const enviando = ref(false)
const mensaje  = ref('')
const error    = ref('')

onMounted(() => {
  form.value.token = route.query.token || ''
  form.value.email = route.query.email || ''
})

async function resetear() {
  if (!form.value.password || !form.value.password_confirmation) {
    error.value = 'Todos los campos son obligatorios'
    return
  }

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  enviando.value = true
  error.value = ''

  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/reset-password`,
      form.value
    )
    mensaje.value = data.message
    setTimeout(() => router.push({ name: 'login' }), 3000)
  } catch (e) {
    error.value = e.response?.data?.message || 'El enlace es inválido o ha expirado'
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-800">Nueva contraseña</h1>
        <p class="text-sm text-gray-500 mt-1">Ingresa tu nueva contraseña.</p>
      </div>

      <!-- Éxito -->
      <div v-if="mensaje"
        class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
        ✅ {{ mensaje }} Redirigiendo al login...
      </div>

      <!-- Error -->
      <div v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
        ❌ {{ error }}
      </div>

      <div v-if="!mensaje">
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Nueva contraseña</label>
          <input v-model="form.password" type="password"
            placeholder="Mínimo 8 caracteres"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                   outline-none focus:border-orange-400 transition" />
        </div>

        <div class="mb-6">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Confirmar contraseña</label>
          <input v-model="form.password_confirmation" type="password"
            placeholder="Repite la contraseña"
            @keyup.enter="resetear"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                   outline-none focus:border-orange-400 transition" />
        </div>

        <button @click="resetear" :disabled="enviando"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2">
          <svg v-if="enviando" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ enviando ? 'Guardando...' : 'Restablecer contraseña' }}
        </button>
      </div>

      <button @click="router.push({ name: 'login' })"
        class="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition">
        ← Volver al login
      </button>

    </div>
  </div>
</template>