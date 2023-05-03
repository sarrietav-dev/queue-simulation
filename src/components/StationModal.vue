<template>
  <dialog :open="props.open">
    <article>
      <header>Estación {{ props.modelValue.id }}</header>
      <section class="station_buttons">
        <h2 class="server_count">
          Servidores <span v-show="sameDist">{{ servers.length }}</span>
        </h2>
        <div class="control_buttons">
          <button :disabled="servers.length === 4" role="button" @click="handleCreateServer">
            Agregar mas servidores
          </button>
          <label htmlFor="same_dist">
            <input type="checkbox" v-model="sameDist" id="same_dist" />
            Misma distribución?
          </label>
        </div>
      </section>
      <DistributionForm v-if="sameDist" v-model="sameDistValue" />
      <div v-else>
        <section :key="server.key" v-for="(server, index) in servers">
          <header class="server_header">
            <h3>Servidor {{ index }}</h3>
            <a href="#" role="button" className="secondary" @click="handleDeleteServer(index)">
              Eliminar
            </a>
          </header>
          <DistributionForm v-model="server.distribution" />
        </section>
      </div>
      <footer>
        <a href="#" role="button" class="secondary" @click="closeDialog"> Cancelar </a>
        <a href="#" role="button" @click="handleConfirm">Confirmar</a>
      </footer>
    </article>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import DistributionForm from './DistributionForm.vue'

const props = defineProps<{
  open: boolean
  modelValue: StationData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: StationData): void
  (e: 'close'): void
}>()

const servers = ref<ServerData[]>(props.modelValue.servers)

const sameDist = ref(false)
const sameDistValue = ref<DistributionData>({
  name: 'exponential',
  mean: { mean: 0 }
})

watchEffect(() => {
  if (sameDist.value) {
    servers.value.forEach((server) => {
      server.distribution = sameDistValue.value
    })
  }
})

function handleCreateServer() {
  servers.value.push({
    key: Math.random().toString(36).substring(2, 9),
    distribution: {
      mean: {
        mean: 0
      },
      name: 'exponential'
    }
  })
}

function handleDeleteServer(index: number) {
  if (servers.value.length === 1) return
  servers.value.splice(index, 1)
}

function handleConfirm() {
  emit('update:modelValue', {
    id: props.modelValue.id,
    key: props.modelValue.key,
    servers: servers.value
  })
  emit('close')
}

function closeDialog() {
  emit('close')
}
</script>

<style>
.server_count {
  margin: 0;
}

.control_buttons {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.server_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

article {
  min-width: 50%;
}

.station_buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
