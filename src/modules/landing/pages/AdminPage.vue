<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const departamentos = ref([])
const multas = ref([])
const cargando = ref(true)
const enviando = ref(false)
const mensaje = ref('')
const error = ref('')
const vista = ref('multas') 
const modalAbierto = ref(false)
const multaEditando = ref(null)

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

onMounted(async () => {
  await Promise.all([cargarDepartamentos(), cargarMultas()])
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
  error.value = ''
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  multaEditando.value = null
}

async function guardarMulta() {
  if (!form.value.departamento_id || !form.value.motivo || !form.value.monto) {
    error.value = 'Departamento, motivo y monto son obligatorios'
    return
  }

  enviando.value = true
  error.value = ''

  try {
    if (multaEditando.value) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/multas/${multaEditando.value.id}`,
        form.value
      )
      mensaje.value = 'Multa actualizada correctamente'
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/multas`, form.value)
      mensaje.value = 'Multa creada y notificación enviada'
    }

    await cargarMultas()
    cerrarModal()

    setTimeout(() => mensaje.value = '', 3000)
  } catch (e) {
    error.value = 'Error guardando la multa'
  } finally {
    enviando.value = false
  }
}

async function eliminarMulta(multa) {
  if (!confirm(`¿Eliminar la multa del departamento ${multa.departamento?.depa}?`)) return

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/multas/${multa.id}`)
    await cargarMultas()
    mensaje.value = 'Multa eliminada'
    setTimeout(() => mensaje.value = '', 3000)
  } catch (e) {
    error.value = 'Error eliminando la multa'
  }
}

async function enviarNotificacion() {
  if (!formNotificacion.value.titulo || !formNotificacion.value.descripcion) {
    error.value = 'El título y descripción son obligatorios'
    return
  }

  if (!formNotificacion.value.para_todos && !formNotificacion.value.departamento_id) {
    error.value = 'Selecciona un departamento o marca "Enviar a todos"'
    return
  }

  enviando.value = true
  error.value = ''

  try {
    if (formNotificacion.value.para_todos) {
      await axios.post(`${import.meta.env.VITE_API_URL}/notificar-todos`, {
        tipo:        formNotificacion.value.tipo,
        titulo:      formNotificacion.value.titulo,
        descripcion: formNotificacion.value.descripcion,
        url:         formNotificacion.value.url || null,
      })
      mensaje.value = 'Notificación enviada a todos los residentes'
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
      mensaje.value = 'Notificación enviada al departamento'
    }

    formNotificacion.value = {
      tipo: 'asamblea',
      titulo: '',
      descripcion: '',
      url: '',
      departamento_id: null,
      para_todos: false,
    }

    setTimeout(() => mensaje.value = '', 3000)
  } catch (e) {
    error.value = 'Error enviando la notificación'
  } finally {
    enviando.value = false
  }
}

function colorEstado(estado) {
  const colores = {
    pendiente:  'bg-yellow-100 text-yellow-700',
    pagada:     'bg-green-100 text-green-700',
    cancelada:  'bg-gray-100 text-gray-600',
  }
  return colores[estado] || 'bg-gray-100 text-gray-600'
}
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">

    <h1 class="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

    
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
    </div>

    
    <p v-if="mensaje" class="bg-green-50 text-green-600 border border-green-200
       rounded-xl px-4 py-2 text-sm mb-4">
    {{ mensaje }}
    </p>

    
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

      <div v-else class="flex flex-col gap-3">
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
              <span class="text-sm font-semibold text-orange-600">
                ${{ multa.monto }}
              </span>
              <span v-if="multa.fecha_limite" class="text-xs text-gray-400">
                Límite: {{ multa.fecha_limite }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="abrirModal(multa)"
              class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100
                     px-3 py-1.5 rounded-lg transition">
              Editar
            </button>
            <button @click="eliminarMulta(multa)"
              class="text-xs bg-red-50 text-red-600 hover:bg-red-100
                     px-3 py-1.5 rounded-lg transition">
              Eliminar
            </button>
          </div>
        </div>
      </div>
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

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <button @click="enviarNotificacion" :disabled="enviando"
          class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                 text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed">
          {{ enviando ? 'Enviando...' : 'Enviar Notificación' }}
        </button>
      </div>
    </div>

    
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
          <input v-model="form.motivo" type="text"
            placeholder="Ej: Ruido excesivo"
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
        </div>

        <div class="mb-4">
          <label class="text-sm font-medium text-gray-600 mb-1 block">Monto ($)</label>
          <input v-model="form.monto" type="number" min="0" step="0.01"
            placeholder="0.00"
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

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="flex gap-3">
          <button @click="cerrarModal"
            class="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl
                   text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button @click="guardarMulta" :disabled="enviando"
            class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl
                   text-sm font-medium transition disabled:opacity-40">
            {{ enviando ? 'Guardando...' : multaEditando ? 'Actualizar' : 'Crear multa' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>