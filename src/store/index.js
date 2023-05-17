import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import accounts from "./accounts";
import entries from "./entries";
import history from "./history";
import profiles from "./profiles";
import ui from "./ui";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { accounts, entries, history, profiles, ui },
  plugins: [pathify.plugin],
  strict: true,
});
