<template>
  <section>
    <nav>
      <ul>
        <li>
          <strong>Simulador</strong>
        </li>
      </ul>
      <ul class="theme_button_container" @click="handleDarkMode">
        <span className="theme_button"> {{ icon }} </span>
      </ul>
    </nav>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const isDarkMode = ref(false)

const icon = computed(() => (isDarkMode.value ? '🌞' : '🌚'))

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (prefersDark) {
    isDarkMode.value = true
    document.documentElement.dataset.theme = 'dark'
  }
})

function handleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.dataset.theme = isDarkMode.value ? 'dark' : 'light'
}
</script>

<style>
.theme_button_container {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  cursor: pointer;
}

.theme_button {
  font-size: 2em;
}
</style>
