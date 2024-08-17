import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'


createApp(App)
  .use(Quasar, {
    plugins: {} 
  })
  .mount('#app')