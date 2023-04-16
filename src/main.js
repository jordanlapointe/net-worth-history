import { BootstrapVue } from "bootstrap-vue";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import Vue from "vue";
import {
  valueToDollarsFormatted,
  valueToDollarsAbbreviated,
} from "@/utilities/currency";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins";

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

Vue.config.productionTip = false;

Vue.filter("currency", function (value) {
  return valueToDollarsFormatted(value);
});
Vue.filter("currencyShort", function (value) {
  return valueToDollarsAbbreviated(value);
});

Vue.use(BootstrapVue, {
  BCard: {
    bgVariant: "light",
    bodyClass: "bg-transparent",
    footerBgVariant: "white",
  },
  BNavItem: {
    activeClass: "active",
  },
});

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
