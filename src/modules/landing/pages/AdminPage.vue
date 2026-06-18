<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const departamentos = ref([])
const multas = ref([])
const cargando = ref(true)
const enviando = ref(false)
const vista = ref('multas')
const modalAbierto = ref(false)
const multaEditando = ref(null)
const alerta = ref(null)
const usuarios = ref([])
const usuarioEditando = ref(null)
const modalUsuarioAbierto = ref(false)

const form = ref({
  departamento_id: null,
  motivo: '',
  monto: '',
  estado: 'pendiente',
  fecha_limite: '',
})

const formNotificacion = ref({
  tipo: 'asamblea',
  titulo: '',
  descripcion: '',
  url: '',
  departamento_id: null,
  para_todos: false,
})

const formUsuario = ref({
  name: '',
  email: '',
  password: '',
  rol: 'residente',
  departamento_id: null,
})

onMounted(async () => {
  await Promise.all([cargarDepartamentos(), cargarMultas(), cargarUsuarios()])
  cargando.value = false
})

async function cargarDepartamentos() {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/departamentos`)
  departamentos.value = data
}

async function cargarMultas() {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/multas`)
  multas.value = data
}

async function cargarUsuarios() {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`)
  usuarios.value = data
}

function mostrarAlerta(tipo, mensaje) {
  alerta.value = { tipo, mensaje }
  setTimeout(() => alerta.value = null, 3500)
}


function abrirModal(multa = null) {
  if (multa) {
    multaEditando.value = multa
    form.value = {
      departamento_id: multa.departamento_id,
      motivo:          multa.motivo,
      monto:           multa.monto,
      estado:          multa.estado,
      fecha_limite:    multa.fecha_limite || '',
    }
  } else {
    multaEditando.value = null
    form.value = {
      departamento_id: null,
      motivo: '',
      monto: '',
      estado: 'pendiente',
      fecha_limite: '',
    }
  }
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  multaEditando.value = null
}

async function guardarMulta() {
  if (!form.value.departamento_id || !form.value.motivo || !form.value.monto) {
    mostrarAlerta('error', 'Departamento, motivo y monto son obligatorios')
    return
  }

  enviando.value = true

  try {
    if (multaEditando.value) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/multas/${multaEditando.value.id}`,
        form.value
      )
      mostrarAlerta('exito', 'Multa actualizada correctamente')
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/multas`, form.value)
      mostrarAlerta('exito', 'Multa creada y notificación enviada')
    }
    await cargarMultas()
    cerrarModal()
  } catch (e) {
    mostrarAlerta('error', 'Error guardando la multa')
  } finally {
    enviando.value = false
  }
}

async function eliminarMulta(multa) {
  if (!confirm(`¿Eliminar la multa del departamento ${multa.departamento?.depa}?`)) return
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/multas/${multa.id}`)
    await cargarMultas()
    mostrarAlerta('exito', 'Multa eliminada correctamente')
  } catch (e) {
    mostrarAlerta('error', 'Error eliminando la multa')
  }
}


async function enviarNotificacion() {
  if (!formNotificacion.value.titulo || !formNotificacion.value.descripcion) {
    mostrarAlerta('error', 'El título y descripción son obligatorios')
    return
  }

  if (!formNotificacion.value.para_todos && !formNotificacion.value.departamento_id) {
    mostrarAlerta('error', 'Selecciona un departamento o marca "Enviar a todos"')
    return
  }

  enviando.value = true

  try {
    if (formNotificacion.value.para_todos) {
      await axios.post(`${import.meta.env.VITE_API_URL}/notificar-todos`, {
        tipo:        formNotificacion.value.tipo,
        titulo:      formNotificacion.value.titulo,
        descripcion: formNotificacion.value.descripcion,
        url:         formNotificacion.value.url || null,
      })
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/departamentos/${formNotificacion.value.departamento_id}/notificar`,
        {
          tipo:        formNotificacion.value.tipo,
          titulo:      formNotificacion.value.titulo,
          descripcion: formNotificacion.value.descripcion,
          url:         formNotificacion.value.url || null,
        }
      )
    }

    mostrarAlerta('exito', 'Notificación enviada correctamente')
    formNotificacion.value = {
      tipo: 'asamblea',
      titulo: '',
      descripcion: '',
      url: '',
      departamento_id: null,
      para_todos: false,
    }
  } catch (e) {
    mostrarAlerta('error', 'Error enviando la notificación')
  } finally {
    enviando.value = false
  }
}


function abrirModalUsuario(usuario = null) {
  if (usuario) {
    usuarioEditando.value = usuario
    formUsuario.value = {
      name:            usuario.name,
      email:           usuario.email,
      password:        '',
      rol:             usuario.rol,
      departamento_id: usuario.departamento_id,
    }
  } else {
    usuarioEditando.value = null
    formUsuario.value = {
      name: '',
      email: '',
      password: '',
      rol: 'residente',
      departamento_id: null,
    }
  }
  modalUsuarioAbierto.value = true
}

const modalPasswordAbierto = ref(false)
const usuarioPassword = ref(null)
const formPassword = ref({
  password_nuevo: '',
  password_nuevo_confirmation: '',
})

function abrirModalPassword(usuario) {
  usuarioPassword.value = usuario
  formPassword.value = {
    password_nuevo: '',
    password_nuevo_confirmation: '',
  }
  modalPasswordAbierto.value = true
}

function cerrarModalPassword() {
  modalPasswordAbierto.value = false
  usuarioPassword.value = null
}

async function cambiarPassword() {
  if (!formPassword.value.password_nuevo) {
    mostrarAlerta('error', 'La contraseña es obligatoria')
    return
  }

  if (formPassword.value.password_nuevo !== formPassword.value.password_nuevo_confirmation) {
    mostrarAlerta('error', 'Las contraseñas no coinciden')
    return
  }

  enviando.value = true

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/usuarios/${usuarioPassword.value.id}`,
      { password: formPassword.value.password_nuevo }
    )
    mostrarAlerta('exito', 'Contraseña actualizada y sesiones cerradas')
    cerrarModalPassword()
  } catch (e) {
    mostrarAlerta('error', 'Error actualizando la contraseña')
  } finally {
    enviando.value = false
  }
}

function cerrarModalUsuario() {
  modalUsuarioAbierto.value = false
  usuarioEditando.value = null
}

async function guardarUsuario() {
  if (!formUsuario.value.name || !formUsuario.value.email) {
    mostrarAlerta('error', 'Nombre y correo son obligatorios')
    return
  }

  if (!usuarioEditando.value && !formUsuario.value.password) {
    mostrarAlerta('error', 'La contraseña es obligatoria al crear un usuario')
    return
  }

  enviando.value = true

  try {
    if (usuarioEditando.value) {
      const datos = { ...formUsuario.value }
      if (!datos.password) delete datos.password
      await axios.put(
        `${import.meta.env.VITE_API_URL}/usuarios/${usuarioEditando.value.id}`,
        datos
      )
      mostrarAlerta('exito', 'Usuario actualizado correctamente')
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, formUsuario.value)
      mostrarAlerta('exito', 'Usuario creado y correo de verificación enviado')
    }
    await cargarUsuarios()
    cerrarModalUsuario()
  } catch (e) {
    mostrarAlerta('error', e.response?.data?.message || 'Error guardando el usuario')
  } finally {
    enviando.value = false
  }
}

async function eliminarUsuario(usuario) {
  if (!confirm(`¿Eliminar al usuario ${usuario.name}?`)) return
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/usuarios/${usuario.id}`)
    await cargarUsuarios()
    mostrarAlerta('exito', 'Usuario eliminado correctamente')
  } catch (e) {
    mostrarAlerta('error', 'Error eliminando el usuario')
  }
}

function colorEstado(estado) {
  const colores = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    pagada:    'bg-green-100 text-green-700',
    cancelada: 'bg-gray-100 text-gray-600',
  }
  return colores[estado] || 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">

    <h1 class="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

    <!-- Alerta -->
    <Transition name="alerta">
      <div v-if="alerta"
        class="fixed top-6 right-6 z-50 w-auto inline-flex items-center p-1 pe-2
               text-sm rounded-full shadow-lg"
        :class="alerta.tipo === 'exito'
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-red-50 border border-red-200 text-red-700'">
        <span class="py-0.5 px-2 rounded-full text-xs font-semibold"
          :class="alerta.tipo === 'exito'
            ? 'bg-green-200 text-green-800'
            : 'bg-red-200 text-red-800'">
          {{ alerta.tipo === 'exito' ? 'Éxito' : 'Error' }}
        </span>
        <div class="ms-2 text-sm">{{ alerta.mensaje }}</div>
        <svg class="w-4 h-4 ms-1 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="2" d="m9 5 7 7-7 7"/>
        </svg>
      </div>
    </Transition>

    
    <div class="flex gap-2 mb-6">
      <button @click="vista = 'multas'"
        class="px-4 py-2 rounded-xl text-sm font-medium transition"
        :class="vista === 'multas'
          ? 'bg-orange-500 text-white'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'">
         Multas
      </button>
      <button @click="vista = 'notificaciones'"
        class="px-4 py-2 rounded-xl text-sm font-medium transition"
        :class="vista === 'notificaciones'
          ? 'bg-orange-500 text-white'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'">
        Notificaciones
      </button>
      <button @click="vista = 'usuarios'"
        class="px-4 py-2 rounded-xl text-sm font-medium transition"
        :class="vista === 'usuarios'
          ? 'bg-orange-500 text-white'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'">
        Usuarios
      </button>
    </div>

   
    <div v-if="vista === 'multas'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Multas</h2>
        <button @click="abrirModal()"
          class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2
                 rounded-xl text-sm font-medium transition">
          + Nueva multa
        </button>
      </div>

      <p v-if="cargando" class="text-gray-400 text-sm">Cargando...</p>

      <div v-else-if="multas.length === 0"
        class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
        No hay multas registradas
      </div>

      <TransitionGroup name="lista" tag="div" class="flex flex-col gap-3">
        <div v-for="multa in multas" :key="multa.id"
          class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm
                 flex items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-800 text-sm">
                Depa {{ multa.departamento?.depa }}
              </span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="colorEstado(multa.estado)">
                {{ multa.estado }}
              </span>
            </div>
            <p class="text-sm text-gray-600">{{ multa.motivo }}</p>
            <div class="flex items-center gap-4 mt-1">
              <span class="text-sm font-semibold text-orange-600">${{ multa.monto }}</span>
              <span v-if="multa.fecha_limite" class="text-xs text-gray-400">
                Límite: {{ multa.fecha_limite }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="abrirModal(multa)"
              class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
              Editar
            </button>
            <button @click="eliminarMulta(multa)"
              class="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
              Eliminar
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    
    <div v-if="vista === 'notificaciones'">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Enviar Notificación</h2>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Tipo</label>
          <select v-model="formNotificacion.tipo"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400">
            <option value="asamblea">📋 Asamblea</option>
            <option value="pago_atrasado">💰 Pago atrasado</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Título</label>
          <input v-model="formNotificacion.titulo" type="text"
            placeholder="Ej: Convocatoria asamblea ordinaria"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
        </div>
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Descripción</label>
          <textarea v-model="formNotificacion.descripcion" rows="3"
            placeholder="Describe el motivo..."
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 resize-none"></textarea>
        </div>
        <div class="mb-4">
          <label class="text-sm font-medium text-gray-600 mb-1 block">
            URL de destino <span class="text-gray-400">(opcional)</span>
          </label>
          <input v-model="formNotificacion.url" type="text"
            placeholder="Ej: /pagos"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
        </div>
        <div class="mb-4 flex items-center gap-2">
          <input v-model="formNotificacion.para_todos" type="checkbox" id="para_todos"
            class="w-4 h-4 accent-orange-500" />
          <label for="para_todos" class="text-sm text-gray-600 cursor-pointer">
            Enviar a todos los residentes
          </label>
        </div>
        <div v-if="!formNotificacion.para_todos" class="mb-6">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Departamento</label>
          <select v-model="formNotificacion.departamento_id"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400">
            <option :value="null" disabled>Selecciona un departamento</option>
            <option v-for="depa in departamentos" :key="depa.id" :value="depa.id">
              {{ depa.depa }} {{ depa.moroso ? '🔴 Moroso' : '' }}
            </option>
          </select>
        </div>
        <button @click="enviarNotificacion" :disabled="enviando"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2">
          <svg v-if="enviando" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ enviando ? 'Enviando...' : 'Enviar Notificación' }}
        </button>
      </div>
    </div>

    
    <div v-if="vista === 'usuarios'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Usuarios</h2>
        <button @click="abrirModalUsuario()"
          class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2
                 rounded-xl text-sm font-medium transition">
          + Nuevo usuario
        </button>
      </div>

      <div v-if="usuarios.length === 0"
        class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
        No hay usuarios registrados
      </div>

      <TransitionGroup name="lista" tag="div" class="flex flex-col gap-3">
        <div v-for="usuario in usuarios" :key="usuario.id"
          class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm
                 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-orange-500 flex items-center
                        justify-center text-white text-sm font-bold flex-shrink-0">
              {{ usuario.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-800 text-sm">{{ usuario.name }}</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="usuario.rol === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'">
                  {{ usuario.rol }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="usuario.email_verified_at
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'">
                  {{ usuario.email_verified_at ? '✓ Verificado' : '⏳ Pendiente' }}
                </span>
              </div>
              <p class="text-xs text-gray-500">{{ usuario.email }}</p>
              <p class="text-xs text-gray-400">
                {{ usuario.departamento ? 'Depa ' + usuario.departamento.depa : 'Sin departamento' }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="abrirModalUsuario(usuario)"
              class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition">
              Editar
            </button>
            <button @click="abrirModalPassword(usuario)"
              class="text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-1.5 rounded-lg transition">
              Contraseña
            </button>
            <button @click="eliminarUsuario(usuario)"
              class="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
              Eliminar
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>

    
    <Transition name="modal">
      <div v-if="modalAbierto"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            {{ multaEditando ? 'Editar multa' : 'Nueva multa' }}
          </h3>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Departamento</label>
            <select v-model="form.departamento_id"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400">
              <option :value="null" disabled>Selecciona un departamento</option>
              <option v-for="depa in departamentos" :key="depa.id" :value="depa.id">
                {{ depa.depa }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Motivo</label>
            <input v-model="form.motivo" type="text" placeholder="Ej: Ruido excesivo"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
          </div>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Monto ($)</label>
            <input v-model="form.monto" type="number" min="0" step="0.01" placeholder="0.00"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
          </div>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Estado</label>
            <select v-model="form.estado"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400">
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="text-sm font-medium text-gray-600 mb-1 block">
              Fecha límite <span class="text-gray-400">(opcional)</span>
            </label>
            <input v-model="form.fecha_limite" type="date"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
          </div>
          <div class="flex gap-3">
            <button @click="cerrarModal"
              class="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl
                     text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button @click="guardarMulta" :disabled="enviando"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                     text-sm font-medium transition disabled:opacity-40
                     flex items-center justify-center gap-2">
              <svg v-if="enviando" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              {{ enviando ? 'Guardando...' : multaEditando ? 'Actualizar' : 'Crear multa' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

   
    <Transition name="modal">
      <div v-if="modalUsuarioAbierto"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            {{ usuarioEditando ? 'Editar usuario' : 'Nuevo usuario' }}
          </h3>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Nombre</label>
            <input v-model="formUsuario.name" type="text" placeholder="Nombre completo"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
          </div>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Correo</label>
            <input v-model="formUsuario.email" type="email" placeholder="correo@ejemplo.com"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
          </div>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">
              Contraseña
              <span v-if="usuarioEditando" class="text-gray-400">(dejar vacío para no cambiar)</span>
            </label>
            <input v-model="formUsuario.password" type="password" placeholder="••••••••"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
          </div>
          <div class="mb-4">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Rol</label>
            <select v-model="formUsuario.rol"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400">
              <option value="residente">Residente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="text-sm font-medium text-gray-600 mb-1 block">Departamento</label>
            <select v-model="formUsuario.departamento_id"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400">
              <option :value="null">Sin departamento</option>
              <option v-for="depa in departamentos" :key="depa.id" :value="depa.id">
                {{ depa.depa }}
              </option>
            </select>
          </div>
          <div class="flex gap-3">
            <button @click="cerrarModalUsuario"
              class="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl
                     text-sm font-medium hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button @click="guardarUsuario" :disabled="enviando"
              class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                     text-sm font-medium transition disabled:opacity-40
                     flex items-center justify-center gap-2">
              <svg v-if="enviando" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              {{ enviando ? 'Guardando...' : usuarioEditando ? 'Actualizar' : 'Crear usuario' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

   
<Transition name="modal">
  <div v-if="modalPasswordAbierto"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

      <h3 class="text-lg font-semibold text-gray-800 mb-1">
        Cambiar contraseña
      </h3>
      <p class="text-sm text-gray-500 mb-4">
        {{ usuarioPassword?.name }} — {{ usuarioPassword?.email }}
      </p>

      <div class="mb-4">
        <label class="text-sm font-medium text-gray-600 mb-1 block">Nueva contraseña</label>
        <input v-model="formPassword.password_nuevo" type="password"
          placeholder="Mínimo 8 caracteres"
          class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
      </div>

      <div class="mb-6">
        <label class="text-sm font-medium text-gray-600 mb-1 block">Confirmar contraseña</label>
        <input v-model="formPassword.password_nuevo_confirmation" type="password"
          placeholder="Repite la contraseña"
          class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
      </div>

      <div class="flex gap-3">
        <button @click="cerrarModalPassword"
          class="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl
                 text-sm font-medium hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button @click="cambiarPassword" :disabled="enviando"
          class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                 text-sm font-medium transition disabled:opacity-40
                 flex items-center justify-center gap-2">
          <svg v-if="enviando" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {{ enviando ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>
      </div>
    </div>
  </div>
</Transition>

  </div>
</template>

<style scoped>
.alerta-enter-active,
.alerta-leave-active { transition: all 0.4s ease; }
.alerta-enter-from { opacity: 0; transform: translateY(-20px); }
.alerta-leave-to { opacity: 0; transform: translateY(-20px); }

.modal-enter-active,
.modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; transform: scale(0.95); }

.lista-enter-active,
.lista-leave-active { transition: all 0.3s ease; }
.lista-enter-from { opacity: 0; transform: translateX(-20px); }
.lista-leave-to { opacity: 0; transform: translateX(20px); }
</style>