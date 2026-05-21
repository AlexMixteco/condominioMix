<template>
  <div class="flex h-full antialiased text-gray-800">
    <div class="flex flex-row h-full w-full overflow-x-hidden">

      
      <div class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 border-r border-gray-100">

        
        <div class="flex flex-row items-center justify-center h-12 w-full">
          <div class="flex items-center justify-center rounded-2xl text-orange-600 bg-orange-100 h-10 w-10">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div class="ml-2 font-bold text-xl text-gray-800">Condominio</div>
        </div>

       
        <div class="flex flex-col items-center bg-orange-50 border border-orange-100 mt-4 w-full py-6 px-4 rounded-lg">
          <div class="h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center
                      text-white text-xl font-bold shadow-md">
            {{ iniciales(authStore.usuario?.name) }}
          </div>
          <div class="text-sm font-semibold mt-2 text-gray-800">{{ authStore.usuario?.name }}</div>
          <div class="text-xs text-gray-500">{{ authStore.usuario?.email }}</div>
          <div class="flex flex-row items-center mt-3">
            <div class="flex flex-col justify-center h-4 w-8 bg-green-500 rounded-full">
              <div class="h-3 w-3 bg-white rounded-full self-end mr-1"></div>
            </div>
            <div class="leading-none ml-1 text-xs text-gray-600">Activo</div>
          </div>
        </div>

       
      </div>

      
      <div class="flex flex-col flex-auto h-full p-6">
        <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">

          
          <div class="flex flex-col h-full overflow-x-auto mb-4">
            <div class="flex flex-col h-full">

              
              <div v-if="cargando" class="flex items-center justify-center h-full">
                <div class="flex flex-col items-center gap-2">
                  <div class="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  <p class="text-gray-400 text-sm">Cargando mensajes...</p>
                </div>
              </div>

              <div ref="contenedor" class="flex flex-col gap-1 overflow-y-auto h-full">
                <div v-for="msg in mensajes" :key="msg.id"
                  class="grid grid-cols-12 gap-y-2">

                  
                  <div v-if="!esMio(msg)" class="col-start-1 col-end-8 p-3 rounded-lg">
                    <div class="flex flex-row items-end gap-2">
                      <div class="flex items-center justify-center h-10 w-10 rounded-full
                                  bg-gray-400 text-white text-xs font-bold flex-shrink-0">
                        {{ iniciales(msg.user?.name) }}
                      </div>
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-400 mb-1 ml-1">{{ msg.user?.name }}</span>
                        <div class="relative text-sm bg-white py-2 px-4 shadow-sm rounded-xl rounded-bl-none">
                          {{ msg.contenido }}
                          <span class="text-xs text-gray-400 ml-2">{{ formatHora(msg.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div v-if="esMio(msg)" class="col-start-6 col-end-13 p-3 rounded-lg">
                    <div class="flex items-end justify-end gap-2">
                      <div class="flex flex-col items-end">
                        <div class="relative text-sm bg-orange-500 text-white py-2 px-4
                                    shadow-sm rounded-xl rounded-br-none">
                          {{ msg.contenido }}
                          <div class="flex items-center gap-1 mt-0.5 justify-end">
                            <span class="text-xs opacity-70">{{ formatHora(msg.created_at) }}</span>
                            <svg v-if="!msg.pendiente" class="w-3 h-3 opacity-70"
                              fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                            <svg v-if="msg.pendiente" class="w-3 h-3 opacity-50 animate-pulse"
                              fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center justify-center h-10 w-10 rounded-full
                                  bg-orange-500 text-white text-xs font-bold flex-shrink-0">
                        {{ iniciales(msg.user?.name) }}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

         
          <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 shadow-sm">

           >

            
            <div class="flex-grow ml-4">
              <input
                v-model="contenido"
                @keyup.enter="enviarMensaje"
                type="text"
                placeholder="Escribe un mensaje..."
                class="flex w-full border border-gray-200 rounded-xl focus:outline-none
                       focus:border-orange-300 pl-4 h-10 text-sm transition"
              />
            </div>

            
            <div class="ml-4">
              <button
                @click="enviarMensaje"
                :disabled="!contenido.trim()"
                class="flex items-center justify-center bg-orange-500 hover:bg-orange-600
                       rounded-xl text-white px-4 py-2 flex-shrink-0
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all hover:scale-105 active:scale-95">
                <span class="text-sm font-medium">Enviar</span>
                <span class="ml-2">
                  <svg class="w-4 h-4 transform rotate-45 -mt-px" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import echo from '@/echo.js'
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()

const mensajes   = ref([])
const contenido  = ref('')
const contenedor = ref(null)
const cargando   = ref(true)

onMounted(async () => {
  await cargarMensajes()
  conectarCanal()
  cargando.value = false
})

onUnmounted(() => {
  echo.leaveChannel('chat.condominio')
})

async function cargarMensajes() {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/mensajes`
  )
  mensajes.value = data
  scrollAbajo()
}

function conectarCanal() {
  echo
    .channel('chat.condominio')
    .listen('.mensaje.enviado', (evento) => {
      mensajes.value.push(evento)
      scrollAbajo()
    })
}

async function enviarMensaje() {
  const texto = contenido.value.trim()
  if (!texto) return

  const temporal = {
    id: Date.now(),
    contenido: texto,
    user: authStore.usuario,
    created_at: new Date().toISOString(),
    pendiente: true,
  }
  mensajes.value.push(temporal)
  contenido.value = ''
  scrollAbajo()

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/mensajes`,
      { contenido: texto }
    )
    temporal.pendiente = false
  } catch {
    mensajes.value = mensajes.value.filter(m => m.id !== temporal.id)
  }
}

async function scrollAbajo() {
  await nextTick()
  if (contenedor.value)
    contenedor.value.scrollTop = contenedor.value.scrollHeight
}

function formatHora(iso) {
  return new Date(iso).toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit'
  })
}

function esMio(msg) {
  return msg.user?.id === authStore.usuario?.id
}

function iniciales(nombre) {
  if (!nombre) return '?'
  return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

