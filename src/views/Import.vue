<template>
  <validation-observer v-slot="{ handleSubmit }">
    <ConfirmAction
      ok-title="Import"
      ok-variant="warning"
      v-slot="{ onConfirm }"
    >
      <b-form
        class="pt-3"
        @submit.stop.prevent="handleSubmit(() => onConfirm(handleImport))"
      >
        <h1 class="h2 mb-4">Import</h1>
        <b-card style="width: fit-content">
          <b-form-group
            class="mb-0"
            label="File (.json)"
            label-for="file-upload"
          >
            <validation-provider
              v-slot="validationContext"
              name="Upload"
              :rules="{ required: true }"
            >
              <b-form-file
                accept=".json"
                drop-placeholder="Drop .json here"
                id="file-upload"
                size="lg"
                :state="getValidationState(validationContext)"
                v-model="fileUpload"
              />
            </validation-provider>
          </b-form-group>
          <p class="mb-2 mt-3 small">
            All existing data will be deleted and replaced.
          </p>
          <template #footer>
            <b-button class="px-4" size="md" type="submit" variant="warning">
              Import…
            </b-button>
            <b-button
              class="ml-2 px-5"
              size="md"
              to="/settings"
              type="button"
              variant="secondary"
            >
              Cancel
            </b-button>
          </template>
        </b-card>
      </b-form>
    </ConfirmAction>
  </validation-observer>
</template>

<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { call } from "vuex-pathify";
import ConfirmAction from "@/components/ConfirmAction";
import database from "@/store/database";
import {
  validateAccount,
  validateBalance,
  validateEntry,
} from "@/utilities/validation";

export default {
  name: "Import",
  components: { ConfirmAction, ValidationObserver, ValidationProvider },
  props: {},
  data() {
    return { fileUpload: undefined, isValid: null };
  },
  computed: {},
  watch: {
    async fileUpload() {
      this.isValid = this.fileUpload.type === "application/json";
    },
  },
  methods: {
    fetchAccounts: call("accounts/fetchAccounts"),
    fetchEntries: call("entries/fetchEntries"),
    getValidationState({ dirty, validated, valid = null }) {
      if ((dirty || validated) && !valid) {
        return false;
      }
      return null;
    },
    async handleImport() {
      const data = await this.fileUpload.text();
      const dataParsed = JSON.parse(data);
      const { accounts, balances, entries } = dataParsed;
      const hasValidAccounts = accounts.every((account) => {
        return validateAccount(account);
      });
      const hasValidBalances = balances.every((balance) => {
        return validateBalance(balance);
      });
      const hasValidEntries = entries.every((entry) => {
        return validateEntry(entry);
      });
      if (!hasValidAccounts || !hasValidBalances || !hasValidEntries) return;
      await database.accounts.clear();
      await database.balances.clear();
      await database.entries.clear();
      await database.accounts.bulkPut(accounts);
      await database.balances.bulkPut(balances);
      await database.entries.bulkPut(entries);
      this.fetchAccounts();
      this.fetchEntries();
      this.$router.push("./");
    },
  },
};
</script>
