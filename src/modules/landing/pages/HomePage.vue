<template>
  <div class="flex justify-center items-start p-8 bg-gray-50">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full max-w-7xl">

      
      <router-link to="/chat" class="group flex flex-col items-center gap-3">
        <div class="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600
                    flex items-center justify-center shadow-lg
                    transform transition duration-300
                    group-hover:scale-110 group-hover:shadow-blue-300 group-hover:shadow-xl">
          <img src="@/assets/chat.png" alt="Chat"
            class="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md" />
          <span class="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></span>
        </div>
        <div class="text-center">
          <p class="font-semibold text-gray-700 text-sm group-hover:text-blue-600 transition">Chat</p>
          <p class="text-xs text-gray-400">Condominio</p>
        </div>
      </router-link>

      
      <router-link v-if="auth.esAdmin" to="/admin" class="group flex flex-col items-center gap-3">
        <div class="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600
                    flex items-center justify-center shadow-lg
                    transform transition duration-300
                    group-hover:scale-110 group-hover:shadow-orange-300 group-hover:shadow-xl">
          <svg class="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="text-center">
          <p class="font-semibold text-gray-700 text-sm group-hover:text-orange-600 transition">Administración</p>  
        </div>
      </router-link>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
</script>