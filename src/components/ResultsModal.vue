<template>
  <dialog :open="props.open">
    <article>
      <header>
        <a href="#close" aria-label="Close" className="close" @click="closeDialog"></a>
        Resultados de la simulacion
      </header>
      <p><strong>Tiempo promedio</strong> {{ props.timeSpent }}</p>
      <p><strong>Cola mas larga</strong> {{ props.longestQueue.size }}</p>
      <p><strong>Estaciones: </strong> {{ props.longestQueue.station.join(', ') }}</p>
    </article>
  </dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
  open: boolean
  timeSpent: number
  longestQueue: {
    size: number
    station: string[]
  }
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeDialog() {
  emit('close')
}
</script>
