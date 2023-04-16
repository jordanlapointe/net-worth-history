<template>
  <div class="d-flex">
    <template v-if="initialLoad">
      <Nav v-model="navCollapsed" class="bg-light p-0 overflow-auto vh-100" />
      <div class="flex-grow-1 overflow-auto px-3 vh-100">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script>
import { call, get } from "vuex-pathify";
import Nav from "@/components/Nav.vue";
import "@/styles/main.css";

export default {
  name: "App",
  components: { Nav },
  data() {
    return {
      navCollapsed: false,
      darkModeQuery: window.matchMedia("(prefers-color-scheme: dark)"),
    };
  },
  computed: {
    ...get("entries", ["initialLoad"]),
  },
  mounted() {
    this.darkModeQuery.addEventListener("change", this.refreshColors);
    this.fetchAccounts();
    this.fetchEntries();
    this.fetchProfiles();
    this.refreshColors();
  },
  methods: {
    ...call("accounts", ["fetchAccounts"]),
    ...call("entries", ["fetchEntries"]),
    ...call("profiles", ["fetchProfiles"]),
    ...call("ui", ["refreshColors"]),
  },
};
</script>
