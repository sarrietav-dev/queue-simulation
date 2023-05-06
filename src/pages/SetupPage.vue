<template>
  <div class="container">
    <TheNav />
    <form @submit.prevent="onSubmit">
      <section>
        <h2>Tasa de llegada</h2>
        <DistributionForm v-model="arrival" />
      </section>
      <section>
        <header class="stations_header">
          <h2>Estaciones</h2>
          <button
            @click="clientNewStation"
            :disabled="stations.length === 4"
            type="button"
            role="button"
          >
            Agregar mas estaciones
          </button>
        </header>
        <div class="grid">
          <StationCard
            @click="openEditStationModal(index)"
            v-for="(station, index) in stations"
            :station="station"
            :key="station.key"
            class="station_card"
          />
        </div>
      </section>
      <section>
        <header>
          <h2>Otras opciones</h2>
        </header>
        <div class="grid">
          <label htmlFor="simulation_duration">
            Duración de la simulación
            <input v-model="options.simulationTime" id="simulation_duration" />
          </label>
          <label htmlFor="simulation_count">
            Semilla
            <input v-model="options.seed" id="simulation_count" />
          </label>
        </div>
      </section>
      <button type="submit">Iniciar simulacion</button>
    </form>
  </div>
  <Teleport to="body">
    <StationModal
      v-if="isEditModalOpen && stationEditingIndex !== null"
      :open="isEditModalOpen"
      v-model="stations[stationEditingIndex]"
      @close="handleEditModalClose"
    />
  </Teleport>
  <Teleport to="body">
    <ResultsModal v-if="resultModalOpen" :open="resultModalOpen" @close="handleResultsModalClose" />
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DistributionForm from '../components/DistributionForm.vue'
import TheNav from '../layout/TheNav.vue'
import StationCard from '../components/StationCard.vue'
import StationModal from '../components/StationModal.vue'
import ResultsModal from '../components/ResultsModal.vue'
import { useSimulations } from '../store/simulations'
import { SimulationRunner } from '../utils/simulation-runner'

const store = useSimulations()

const arrival = ref<DistributionData>({
  name: 'exponential',
  mean: { mean: 0 }
})

const stations = ref<StationData[]>([
  {
    id: '0',
    key: Math.random().toString(36).substring(2, 9),
    servers: [
      {
        key: Math.random().toString(36).substring(2, 9),
        distribution: {
          name: 'exponential',
          mean: { mean: 0 }
        }
      }
    ]
  }
])

const resultModalOpen = ref(false)

const stationEditingIndex = ref<number | null>(null)
const isEditModalOpen = ref(false)

const options = ref<Options>({
  simulationTime: 0,
  seed: 0
})

function clientNewStation() {
  if (stations.value.length >= 4) return

  stations.value.push({
    id: stations.value.length.toString(),
    key: Math.random().toString(36).substring(2, 9),
    servers: [
      {
        key: Math.random().toString(36).substring(2, 9),
        distribution: {
          name: 'exponential',
          mean: { mean: 0 }
        }
      }
    ]
  })
}

function openEditStationModal(index: number) {
  stationEditingIndex.value = index
  isEditModalOpen.value = true
}

function handleEditModalClose() {
  isEditModalOpen.value = false
  stationEditingIndex.value = null
}

function handleResultsModalClose() {
  resultModalOpen.value = false
}

function onSubmit() {
  store.$state.simulations = new SimulationRunner({
    arrival: arrival.value,
    stations: stations.value,
    options: options.value
  }).runs
  resultModalOpen.value = true
}
</script>

<style>
.stations_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button[role='button'] {
  width: initial;
}

.station_card {
  cursor: pointer;
}
</style>
