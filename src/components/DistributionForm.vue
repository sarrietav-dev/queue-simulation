<template>
  <div class="grid">
    <label for="distribution"
      >Distribution
      <select v-model="distribution" id="distribution">
        <option value="uniform">Uniforme</option>
        <option value="exponential">Exponencial</option>
        <option value="poisson">Poisson</option>
      </select>
    </label>
    <template v-if="distribution === 'uniform'">
      <label for="min"
        >Min

        <input v-model.number="limits.min" id="min" />
      </label>
      <label for="max"
        >Max

        <input v-model.number="limits.max" id="max" />
      </label>
    </template>
    <label v-else for="lambda"
      >lambda
      <input v-model.number="mean.mean" id="lambda" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

const distribution = ref<DistributionName>('exponential')
const mean = ref<{ mean: number }>({ mean: 0 })
const limits = ref<{ min: number; max: number }>({ min: 0, max: 0 })

watchEffect(() => {
  if (distribution.value === 'uniform') {
    emit('distribution', {
      name: distribution.value,
      mean: {
        a: limits.value.min,
        b: limits.value.max
      }
    })
  } else {
    emit('distribution', {
      name: distribution.value,
      mean: {
        mean: mean.value.mean
      }
    })
  }
})

const emit = defineEmits<{
  (e: 'distribution', value: DistributionData): void
}>()
</script>
