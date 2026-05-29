<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificacionStore } from '@/stores/notificacionStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const notificacionStore = useNotificacionStore()
const authStore = useAuthStore()

onMounted(async () => {
  await notificacionStore.cargarNotificaciones()
  notificacionStore.suscribirCanal(authStore.usuario?.id)
})

onUnmounted(() => {
  notificacionStore.desuscribirCanal(authStore.usuario?.id)
})

async function abrirNotificacion(notificacion) {
  await notificacionStore.marcarLeida(notificacion.id)
  if (notificacion.url) router.push(notificacion.url)
}

function iconoTipo(tipo) {
  const iconos = {
    mensaje:       '💬',
    multa:         '⚠️',
    asamblea:      '📋',
    pago_atrasado: '💰',
  }
  return iconos[tipo] || '🔔'
}

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="relative">

    
    <label for="notif-toggle"
      class="relative flex items-center justify-center w-10 h-10
             bg-white/20 rounded-full cursor-pointer
             hover:bg-white/30 transition-all duration-300">

      
      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      
      <span v-if="notificacionStore.tieneNoLeidas"
        class="absolute -top-1 -right-1 flex items-center justify-center
               w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full
               animate-bounce shadow-lg">
        {{ notificacionStore.noLeidas > 9 ? '9+' : notificacionStore.noLeidas }}
      </span>
    </label>

    
    <input type="checkbox" id="notif-toggle" class="peer sr-only" />

    
    <div class="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl
                border border-gray-100 z-50 overflow-hidden
                opacity-0 scale-95 pointer-events-none
                peer-checked:opacity-100 peer-checked:scale-100 peer-checked:pointer-events-auto
                transition-all duration-300 origin-top-right">

      
      <div class="flex items-center justify-between px-4 py-3
                  bg-orange-50 border-b border-orange-100">
        <div class="flex items-center gap-2">
          <span class="text-lg">🔔</span>
          <h3 class="font-semibold text-gray-800 text-sm">Notificaciones</h3>
          <span v-if="notificacionStore.tieneNoLeidas"
            class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {{ notificacionStore.noLeidas }} nuevas
          </span>
        </div>
        <button
          v-if="notificacionStore.tieneNoLeidas"
          @click="notificacionStore.marcarTodasLeidas()"
          class="text-xs text-orange-500 hover:text-orange-700 font-medium transition">
          Marcar todas
        </button>
      </div>

     
      <div class="max-h-96 overflow-y-auto divide-y divide-gray-50">

        <p v-if="notificacionStore.notificaciones.length === 0"
          class="text-center text-gray-400 text-sm py-8">
          No tienes notificaciones
        </p>

        <div
          v-for="n in notificacionStore.notificaciones"
          :key="n.id"
          @click="abrirNotificacion(n)"
          class="flex items-start gap-3 px-4 py-3 cursor-pointer
                 hover:bg-orange-50 transition-all duration-200 group"
          :class="!n.leida ? 'bg-blue-50/40' : 'bg-white'">

          
          <div class="w-9 h-9 rounded-xl flex items-center justify-center
                      text-lg flex-shrink-0 mt-0.5 bg-gray-100
                      group-hover:scale-110 transition-transform duration-200">
            {{ iconoTipo(n.tipo) }}
          </div>

          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-medium text-gray-800 truncate">
                {{ n.titulo }}
              </p>
              <span v-if="!n.leida"
                class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 animate-pulse">
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {{ n.descripcion }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ formatFecha(n.created_at) }}
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>