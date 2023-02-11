<template>
  <b-container v-if="initialLoad" fluid>
    <b-row>
      <b-col
        class="column-nav bg-light pb-4 pt-2 px-1"
        style="max-width: fit-content"
      >
        <Nav />
      </b-col>
      <b-col class="column-content"> <router-view /> </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { call, get } from "vuex-pathify";
import Nav from "./components/Nav";

export default {
  name: "App",
  components: { Nav },
  mounted() {
    this.fetchAccounts();
    this.fetchEntries();
    this.fetchProfiles();
  },
  computed: {
    ...get("entries", ["initialLoad"]),
  },
  methods: {
    fetchAccounts: call("accounts/fetchAccounts"),
    fetchEntries: call("entries/fetchEntries"),
    fetchProfiles: call("profiles/fetchProfiles"),
  },
};
</script>

<style scoped>
.app-container,
.column-content,
.column-nav {
  height: 100vh;
}
.column-content,
.column-nav {
  overflow: auto;
}
</style>
