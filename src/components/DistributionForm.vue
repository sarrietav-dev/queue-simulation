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
      <label for="min">
        a
        <input v-model.number="limits.a" id="min" />
      </label>
      <label for="max">
        b
        <input v-model.number="limits.b" id="max" />
      </label>
    </template>
    <label v-else for="lambda"
      >lambda
      <input v-model.number="mean.mean" id="lambda" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, type PropType } from 'vue'

const props = defineProps({
  distribution: {
    type: Object as PropType<DistributionData>,
    default: {
      name: 'exponential',
      mean: { mean: 0 }
    }
  }
})
const distribution = ref<DistributionName>(props.distribution?.name ?? 'exponential')

const mean = (props.distribution?.mean as Mean).mean
  ? ref<Mean>({ mean: (props.distribution?.mean as Mean).mean })
  : ref<Mean>({ mean: 0 })

const limits = (props.distribution?.mean as UniformMean).a
  ? ref<UniformMean>({
      a: (props.distribution?.mean as UniformMean).a,
      b: (props.distribution?.mean as UniformMean).b
    })
  : ref<UniformMean>({ a: 0, b: 0 })

watchEffect(() => {
  if (distribution.value === 'uniform') {
    emit('distribution', {
      name: distribution.value,
      mean: {
        a: limits.value.a,
        b: limits.value.b
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
