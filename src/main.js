import './assets/main.css'
import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputMask from 'primevue/inputmask'

// Componentes PrimeVue


import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue);

app.use(createPinia())
app.use(router)

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Dialog', Dialog);
app.component('InputNumber', InputNumber);
app.component('InputMask', InputMask);

app.mount('#app')
