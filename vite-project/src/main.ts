import { createApp } from 'vue'
import './style.css'
import './assets/reset.less'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from './App.vue'

createApp(App).use(ElementPlus).mount('#app')
