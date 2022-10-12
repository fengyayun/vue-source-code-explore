import { createApp } from 'vue'
import './style.css'
import './assets/reset.less'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'animate.css'

createApp(App).use(ElementPlus).mount('#app')
