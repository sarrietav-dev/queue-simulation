<template>
  <div class="container">
    <TheNav />
    <form action="">
      <section>
        <h2>Tasa de llegada</h2>
        <DistributionForm v-model="arrival" />
      </section>
      <section>
        <header class="stations_header">
          <h2>Estaciones</h2>
          <button @click="clientNewStation" :disabled="stations.length === 4" role="button">
            Agregar mas estaciones
          </button>
        </header>
        <div class="grid">
          <StationCard v-for="station in stations" :station="station" :key="station.key" />
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
            Cantidad de simulaciones
            <input v-model="options.simulationRuns" id="simulation_count" />
          </label>
        </div>
      </section>
      <button type="submit">Iniciar simulacion</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import DistributionForm from './components/DistributionForm.vue'
import TheNav from './layout/TheNav.vue'
import StationCard from './components/StationCard.vue'

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

const options = ref<Options>({
  simulationTime: 0,
  simulationRuns: 0
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
</style>
