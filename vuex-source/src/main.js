import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// store 实例挂到根组件上了

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
