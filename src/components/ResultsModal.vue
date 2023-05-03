<template>
  <dialog :open="props.open">
    <article>
      <header>
        <a href="#close" aria-label="Close" className="close" @click="closeDialog"></a>
        Resultados de la simulacion
      </header>
      <p v-if="isLoading">Cargando...</p>
      <p v-else><strong>Tiempo promedio</strong> {{ state }}</p>
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
    console.log(response);
    
    return response.reduce((sum, current) => sum + current.time, 0) / response.length
  }),
  0
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
