<template>
  <div class="flex flex-col min-h-screen">

    <header class="bg-orange-500 border-b border-gray-300 h-20 w-full flex items-center px-6">
      <div class="flex justify-between items-center w-full">

        <!-- Logo -->
        <span class="text-white font-semibold text-lg">Condominios Mixteco</span>

        <!-- Derecha -->
        <div class="flex items-center gap-4">

          <!-- Campana -->
          <Notificaciones />

          <!-- Usuario con dropdown -->
          <div class="relative">
            <button @click="dropdownAbierto = !dropdownAbierto"
              class="flex items-center gap-2 hover:opacity-80 transition">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center
                          justify-center text-white text-sm font-bold">
                {{ auth.usuario?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="text-white text-sm font-medium hidden sm:block">
                {{ auth.usuario?.name }}
              </span>
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div v-if="dropdownAbierto"
                class="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl
                       border border-gray-100 z-50 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-800">{{ auth.usuario?.name }}</p>
                  <p class="text-xs text-gray-500">{{ auth.usuario?.email }}</p>
                </div>
                <button @click="abrirCambiarPassword"
                  class="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700
                         hover:bg-gray-50 transition">
                  <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  Cambiar contraseña
                </button>
                <button @click="cerrarSesion"
                  class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600
                         hover:bg-red-50 transition">
                  <img alt="Cerrar sesión" class="h-4 w-4 object-contain" src="@/assets/cerrarSesion.png" />
                  Cerrar Sesión
                </button>
              </div>
            </Transition>

            <!-- Overlay para cerrar -->
            <div v-if="dropdownAbierto" @click="dropdownAbierto = false"
              class="fixed inset-0 z-40"></div>
          </div>

        </div>
      </div>
    </header>

    <!-- Modal cambiar contraseña -->
    <Transition name="modal">
      <div v-if="modalPasswordAbierto"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

          <h3 class="text-lg font-semibold text-gray-800 mb-4">Cambiar contraseña</h3>

          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Contraseña actual</label>
            <input v-model="formPassword.password_actual" type="password"
              placeholder="••••••••"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                     outline-none focus:border-orange-400" />
          </div>

          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nueva contraseña</label>
            <input v-model="formPassword.password_nuevo" type="password"
              placeholder="Mínimo 8 caracteres"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                     outline-none focus:border-orange-400" />
          </div>

          <div class="mb-6">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Confirmar contraseña</label>
            <input v-model="formPassword.password_nuevo_confirmation" type="password"
              placeholder="Repite la contraseña"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                     outline-none focus:border-orange-400" />
          </div>

          <p v-if="errorPassword" class="text-red-500 text-sm mb-4">{{ errorPassword }}</p>

          <div class="flex gap-3">
            <button @click="cerrarCambiarPassword"
              class="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl
                     text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button @click="cambiarPassword" :disabled="enviandoPassword"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                     text-sm font-medium transition disabled:opacity-40
                     flex items-center justify-center gap-2">
              <svg v-if="enviandoPassword" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              {{ enviandoPassword ? 'Guardando...' : 'Cambiar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

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
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import Notificaciones from '@/components/Notificaciones.vue'

const auth = useAuthStore()
const dropdownAbierto      = ref(false)
const modalPasswordAbierto = ref(false)
const enviandoPassword     = ref(false)
const errorPassword        = ref('')

const formPassword = ref({
  password_actual:              '',
  password_nuevo:               '',
  password_nuevo_confirmation:  '',
})

function cerrarSesion() {
  auth.logout()
}

function abrirCambiarPassword() {
  dropdownAbierto.value = false
  formPassword.value = {
    password_actual:             '',
    password_nuevo:              '',
    password_nuevo_confirmation: '',
  }
  errorPassword.value = ''
  modalPasswordAbierto.value = true
}

function cerrarCambiarPassword() {
  modalPasswordAbierto.value = false
}

async function cambiarPassword() {
  if (!formPassword.value.password_actual || !formPassword.value.password_nuevo) {
    errorPassword.value = 'Todos los campos son obligatorios'
    return
  }

  if (formPassword.value.password_nuevo !== formPassword.value.password_nuevo_confirmation) {
    errorPassword.value = 'Las contraseñas no coinciden'
    return
  }

  enviandoPassword.value = true
  errorPassword.value = ''

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/cambiar-password`,
      formPassword.value
    )
    cerrarCambiarPassword()
    auth.logout()
  } catch (e) {
    errorPassword.value = e.response?.data?.message || 'Error al cambiar la contraseña'
  } finally {
    enviandoPassword.value = false
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-8px); }

.modal-enter-active,
.modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; transform: scale(0.95); }
</style>