<template>
  <StationModal open :station="{ id: '0', key: '1', servers: [] }" />
</template>

<script lang="ts" setup>
import StationModal from './components/StationModal.vue'
</script>
