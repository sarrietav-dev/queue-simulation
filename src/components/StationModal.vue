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
      <DistributionForm v-if="sameDist" @distribution="handleDistribution" />
      <div v-else>
        <section v-for="(server, index) in servers">
          <header class="server_header">
            <h3>Servidor {{ index }}</h3>
            <a href="#" role="button" className="secondary" @click="handleDeleteServer(index)">
              Eliminar
            </a>
          </header>
          <DistributionForm :distribution="server.distribution" @distribution="handleDistribution" />
        </section>
      </div>
      <footer>
        <a href="#" role="button" class="secondary"> Cancelar </a>
        <a href="#" role="button">Confirmar</a>
      </footer>
    </article>
  </dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DistributionForm from './DistributionForm.vue'

const sameDist = ref(true)

const props = defineProps<{
  open: boolean
  station: StationData
}>()

const servers = ref<ServerData[]>(props.station.servers)

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

function handleDistribution(value: DistributionData) {
  console.log(value)
}

function handleDeleteServer(index: number) {
  props.station.servers.splice(index, 1)
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
