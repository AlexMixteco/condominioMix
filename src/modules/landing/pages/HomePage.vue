<template>
  <div class="flex justify-center items-center  p-6 bg-gray-50">
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full max-w-7xl">

     
      <router-link
        to="/chat"
        class="group flex flex-col items-center gap-3"
      >
        
        <div class="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl  from-blue-400 to-blue-600
                    flex items-center justify-center shadow-lg
                    transform transition duration-300
                    group-hover:scale-110 group-hover:shadow-blue-300 group-hover:shadow-xl
                    group-hover:from-blue-500 group-hover:to-blue-700">

          
          <img
            src="@/assets/chat.png"
            alt="Chat"
            class="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-md"
          />

          
          <span class="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></span>
        </div>

       
        <div class="text-center">
          <p class="font-semibold text-gray-700 text-sm group-hover:text-blue-600 transition">
            Chat
          </p>
          
        </div>
      </router-link>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
</script>