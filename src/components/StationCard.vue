<template>
  <article>
    <h3>Estación {{ props.station.id }}</h3>
    <h4>Servidores {{ props.station.servers.length }}</h4>
  </article>
</template>

<script lang="ts" setup>
const props = defineProps<{
  station: StationData
}>()
</script>
