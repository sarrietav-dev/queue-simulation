<template>
  <DistributionForm @distribution="handleDistribution" />
</template>

<script lang="ts" setup>
import DistributionForm from './components/DistributionForm.vue'

function handleDistribution(value: DistributionData) {
  console.log(value)
}
</script>
