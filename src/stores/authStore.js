import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: null,
    token: localStorage.getItem('token') || null,
    cargando: false,
    error: null,
  }),

  getters: {
    estaAutenticado: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      this.cargando = true
      this.error = null

      try {
        const { data } = await axios.post(
  `${import.meta.env.VITE_API_URL}/login`,
  { email, password }
)

        this.usuario = data.user
        this.token   = data.token

        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.user))

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

      } catch (error) {
        this.error = error.response?.data?.message || 'Credenciales incorrectas'
      } finally {
        this.cargando = false
      }
    },

    cargarUsuario() {
      const token   = localStorage.getItem('token')
      const usuario = localStorage.getItem('usuario')

      if (token && usuario) {
        this.token   = token
        this.usuario = JSON.parse(usuario)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        this.logout()
      }
    },

    logout() {
      this.usuario = null
      this.token   = null
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      delete axios.defaults.headers.common['Authorization']
      router.push({ name: 'login' })
    }
  }
})