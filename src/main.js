import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Vue3Clipboard from 'vue3-clipboard'
// import './util/rem'
import App from './App.vue'
import router from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(Vue3Clipboard, {
  autoSetContainer: true,
  appendToBody: true
})

app.mount('#app')
app.directive('showByAuth', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  const adminAuth = ['admin']
  const {
    value: { role, showCondition, otherCondition = true }
  } = binding
  el.style.display = showCondition.includes(role) && otherCondition ? 'inline' : 'none'
})
