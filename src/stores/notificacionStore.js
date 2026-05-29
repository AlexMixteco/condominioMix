import { defineStore } from 'pinia'
import axios from 'axios'
import echo from '@/echo.js'

export const useNotificacionStore = defineStore('notificaciones', {
  state: () => ({
    notificaciones: [],
    noLeidas: 0,
    cargando: false,
    enChat: false, 
  }),

  getters: {
    tieneNoLeidas: (state) => state.noLeidas > 0,
  },

  actions: {
    async cargarNotificaciones() {
      this.cargando = true
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/notificaciones`
        )
        this.notificaciones = data
        this.noLeidas = data.filter(n => !n.leida).length
      } catch (error) {
        console.error('Error cargando notificaciones:', error)
      } finally {
        this.cargando = false
      }
    },

    async marcarLeida(id) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/notificaciones/${id}/leer`
        )
        const notificacion = this.notificaciones.find(n => n.id === id)
        if (notificacion && !notificacion.leida) {
          notificacion.leida = true
          this.noLeidas = Math.max(0, this.noLeidas - 1)
        }
      } catch (error) {
        console.error('Error marcando notificación:', error)
      }
    },

    async marcarTodasLeidas() {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/notificaciones/leer-todas`
        )
        this.notificaciones.forEach(n => n.leida = true)
        this.noLeidas = 0
      } catch (error) {
        console.error('Error marcando todas:', error)
      }
    },

    suscribirCanal(userId) {
  echo
    .private(`notificaciones.${userId}`)
    .listen('.nueva.notificacion', (evento) => {
      
      if (evento.tipo === 'mensaje' && this.enChat) return

      this.notificaciones.unshift(evento)
      this.noLeidas++
    })
},

    desuscribirCanal(userId) {
      echo.leaveChannel(`private-notificaciones.${userId}`)
    },

    entrarAlChat() {
      this.enChat = true
    },

    salirDelChat() {
      this.enChat = false
    },
  }
})