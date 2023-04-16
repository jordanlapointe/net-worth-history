<template>
  <div class="pt-2">
    <h1 class="h2 mb-2">Settings</h1>
    <b-list-group style="max-width: 420px">
      <b-list-group-item
        class="align-items-center d-flex h5 justify-content-between mb-0"
        to="/settings/assumptions"
      >
        <div>Forecast Assumptions</div>
        <div>
          <BIconChevronRight aria-hidden="true" shift-h="2" />
        </div>
      </b-list-group-item>
      <b-list-group-item
        class="align-items-center d-flex h5 justify-content-between mb-0"
        to="/settings/import"
      >
        <div>Import</div>
        <div>
          <BIconChevronRight aria-hidden="true" shift-h="2" />
        </div>
      </b-list-group-item>
      <b-list-group-item button class="h5 mb-0" @click="handleExport">
        Export (.json)
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { formatISO } from "date-fns";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import database from "@/store/database";
import { BIconChevronRight } from "bootstrap-vue";

export default {
  name: "Settings",
  components: { BIconChevronRight },
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    async handleExport() {
      const accounts = await database.accounts.toArray();
      const balances = await database.balances.toArray();
      const entries = await database.entries.toArray();
      const profiles = await database.profiles.toArray();
      const dataObj = {
        accounts,
        balances,
        entries,
        profiles,
      };
      const date = formatISO(new Date(), {
        representation: "date",
      });
      const dataExport = JSON.stringify(dataObj);
      const dataFilename = `net-worth-export-${date}.json`;
      await writeTextFile(dataFilename, dataExport, {
        dir: BaseDirectory.Download,
      });
      this.$bvToast.toast("Saved to Dowloads folder", {
        title: "Export",
      });
    },
  },
};
</script>

<style scoped></style>
