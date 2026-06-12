<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const estado = ref('verificando')

onMounted(async () => {
  console.log('VerificarEmailPage montado')
  console.log('params:', route.params)
  console.log('query:', route.query)

  if (authStore.estaAutenticado) {
    authStore.logout()
  }

  try {
    await axios.get(
      `${import.meta.env.VITE_API_URL}/email/verify/${route.params.id}/${route.params.hash}`,
      {
        params: {
          expires:   route.query.expires,
          signature: route.query.signature,
        }
      }
    )
    estado.value = 'exito'
    setTimeout(() => router.push({ name: 'login' }), 4000)
  } catch (e) {
    console.log('Error:', e.response)
    estado.value = 'error'
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">

      
      <div v-if="estado === 'verificando'">
        <div class="w-12 h-12 border-2 border-orange-400 border-t-transparent
                    rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-sm">Verificando tu correo...</p>
      </div>

      
      <div v-if="estado === 'exito'">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center
                    justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h2 class="font-semibold text-gray-800 mb-2">¡Correo verificado!</h2>
        <p class="text-gray-500 text-sm">Redirigiendo al login...</p>
      </div>

      
      <div v-if="estado === 'error'">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center
                    justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h2 class="font-semibold text-gray-800 mb-2">Enlace inválido</h2>
        <p class="text-gray-500 text-sm mb-4">El enlace expiró o ya fue usado.</p>
        <button @click="router.push({ name: 'login' })"
          class="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition">
          Ir al login
        </button>
      </div>

    </div>
  </div>
</template>