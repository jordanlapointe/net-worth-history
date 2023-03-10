<template>
  <div v-if="initialLoad" class="d-flex">
    <Nav v-model="navCollapsed" class="bg-light p-0 overflow-auto vh-100" />
    <div class="flex-grow-1 overflow-auto px-3 vh-100">
      <router-view />
    </div>
  </div>
</template>

<script>
import { call, get } from "vuex-pathify";
import Nav from "./components/Nav";

export default {
  name: "App",
  components: { Nav },
  data() {
    return {
      navCollapsed: false,
    };
  },
  computed: {
    ...get("entries", ["initialLoad"]),
  },
  mounted() {
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    this.fetchAccounts();
    this.fetchEntries();
    this.fetchProfiles();
    this.refreshColors();
    darkModePreference.addEventListener("change", this.refreshColors);
  },
  methods: {
    fetchAccounts: call("accounts/fetchAccounts"),
    fetchEntries: call("entries/fetchEntries"),
    fetchProfiles: call("profiles/fetchProfiles"),
    refreshColors: call("ui/refreshColors"),
  },
};
</script>

<style scoped></style>
