<template>
  <div class="grid">
    <label for="distribution"
      >Distribution
      <select v-model="distributionName" id="distribution">
        <option value="uniform">Uniforme</option>
        <option value="exponential">Exponencial</option>
        <option value="poisson">Poisson</option>
      </select>
    </label>
    <template v-if="distributionName === 'uniform'">
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
import { ref, watchEffect } from 'vue'

const props = defineProps<{ modelValue: DistributionData }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DistributionData): void
}>()

const distributionName = ref<DistributionName>(props.modelValue?.name ?? 'exponential')

const mean = (props.modelValue?.mean as Mean).mean
  ? ref<Mean>({ mean: (props.modelValue?.mean as Mean).mean })
  : ref<Mean>({ mean: 0 })

const limits = (props.modelValue?.mean as UniformMean).a
  ? ref<UniformMean>({
      a: (props.modelValue?.mean as UniformMean).a,
      b: (props.modelValue?.mean as UniformMean).b
    })
  : ref<UniformMean>({ a: 0, b: 0 })

watchEffect(() => {
  if (distributionName.value === 'uniform') {
    emit('update:modelValue', {
      name: distributionName.value,
      mean: {
        a: limits.value.a,
        b: limits.value.b
      }
    })
  } else {
    emit('update:modelValue', {
      name: distributionName.value,
      mean: {
        mean: mean.value.mean
      }
    })
  }
})
</script>
