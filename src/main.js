import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import axios from 'axios'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)


axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const { useAuthStore } = await import('@/stores/authStore')
      const auth = useAuthStore()
      if (auth.estaAutenticado) {
        auth.logout()
      }
    }
    return Promise.reject(error)
  }
)

app.mount('#app')