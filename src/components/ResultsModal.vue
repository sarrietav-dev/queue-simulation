<template>
  <dialog :open="props.open">
    <article>
      <header>
        <a href="#close" aria-label="Close" className="close" @click="closeDialog"></a>
        Resultados de la simulación
      </header>
      <p v-if="isLoading">Cargando...</p>
      <p v-else>
        <p>
          <strong>Tiempo: </strong> {{ state.time }}
        </p>
        <p>
          <strong>Tiempo promedio de espera de un cliente:</strong> {{ state.waitTime }}
        </p>
      </p>
    </article>
  </dialog>
</template>

<script lang="ts" setup>
import { useSimulations } from '@/store/simulations'
import { onMounted } from 'vue'
import { useAsyncState } from '@vueuse/core'

const data = useSimulations()

const { state, isLoading, execute } = useAsyncState(
  Promise.all(data.$state.simulations).then((response) => {
    const [resp] = response

    return {
      time: resp.time,
      waitTime: resp.waitTimeAverage
    }
  }),
  {
    time: 0,
    waitTime: 0
  }
)

onMounted(() => execute())

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeDialog() {
  emit('close')
}
</script>
