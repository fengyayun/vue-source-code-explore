import { createApp } from 'vue'
import './style.css'
import './assets/reset.less'
import App from './App.vue'
import Card from './components/Card/index.vue'

createApp(App).component('Card',Card).mount('#app')
