/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import * as echarts from '@/echarts.js'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueCalendarHeatmap from 'vue3-calendar-heatmap'



loadFonts()


// Create vue app
const app = createApp(App)



app.use(VueCalendarHeatmap)

// Use plugins
app.use(vuetify)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.config.globalProperties.$echarts = echarts

// Mount vue app
app.mount('#app')
