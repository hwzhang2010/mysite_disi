import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
Vue.L = Vue.prototype.$L = L

import ECharts from 'vue-echarts/components/ECharts.vue'
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'  //柱图
import "echarts/lib/chart/line"  //线图
import "echarts/lib/chart/pie"  //饼图
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title.js'
// 注册组件后即可使用
Vue.component('v-chart', ECharts)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
//Vue.use(ElementUI, { locale })
Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
