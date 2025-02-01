import './assets/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vue3GoogleLogin, {
    clientId: '302045945633-662pesqfu2tteb6t8r3i6fj2qa82h181.apps.googleusercontent.com'
  })

app.mount('#app')
