import Vue from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/less/font-awesome.less";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
