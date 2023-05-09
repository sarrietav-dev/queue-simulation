import { createApp } from 'vue'
import App from './App.vue'

import '@picocss/pico/css/pico.min.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
