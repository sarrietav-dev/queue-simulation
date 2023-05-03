<template>
  <dialog :open="props.open">
    <article>
      <header>Estación {{ props.station.id }}</header>
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
        <section v-for="(server, index) in servers">
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
import { ref, watch } from 'vue'
import DistributionForm from './DistributionForm.vue'

const props = defineProps<{
  open: boolean
  station: StationData
}>()

const emit = defineEmits<{
  (e: 'confirm', value: StationData): void
  (e: 'close'): void
}>()

const servers = ref<ServerData[]>(props.station.servers)

const sameDist = ref(false)
const sameDistValue = ref<DistributionData>({
  name: 'exponential',
  mean: { mean: 0 }
})
watch(sameDist, () => handleSameDistributionChange())
function handleSameDistributionChange() {
  if (sameDist.value) {
    servers.value.forEach((server) => {
      server.distribution = sameDistValue.value
    })
  }
}

function handleCreateServer() {
  servers.value.push({
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
  emit('confirm', {
    id: props.station.id,
    key: props.station.key,
    servers: servers.value
  })
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
