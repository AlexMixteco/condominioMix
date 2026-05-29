<template>
  <div class="flex flex-col min-h-screen">

    <header class="bg-orange-500 border-b border-gray-300 h-20 w-full flex items-center px-6">
      <div class="flex justify-between items-center w-full">

       
        <span class="text-white font-semibold text-lg">Condominios Mixteco</span>

        
        <div class="flex items-center gap-4">

         
          <Notificaciones />

          
          <button
            @click="cerrarSesion"
            class="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img
              alt="Cerrar sesión"
              class="object-contain cursor-pointer h-6 w-6"
              src="@/assets/cerrarSesion.png"
            />
            <span class="text-white text-sm font-medium">Cerrar Sesión</span>
          </button>

        </div>
      </div>
    </header>

    <main class="flex-1 bg-gray-50">
      <router-view />
    </main>

    <footer class="flex items-center h-16 px-4 border-t border-gray-300 bg-white">
      <p class="flex-1 text-sm text-gray-500 text-center">
        © {{ new Date().getFullYear() }} Condominios Mixteco, S.A. DE C.V.. Derechos reservados
      </p>
    </footer>

  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import Notificaciones from '@/components/Notificaciones.vue'

const auth = useAuthStore()

const cerrarSesion = () => {
  auth.logout()
}
</script>