<template>
  <validation-observer ref="validationObserver" v-slot="{ handleSubmit }">
    <b-form
      v-if="activeMonth"
      class="py-2"
      @submit.prevent="handleSubmit(handleSave)"
    >
      <h1 class="mb-2">Ledger</h1>
      <div class="bg-white d-flex mb-2 px-2 py-2 sticky sticky-top">
        <LedgerMonth v-model="activeMonth" />
        <b-dropdown
          v-if="entry"
          class="ml-auto"
          size="sm"
          toggle-class="text-decoration-none"
          no-caret
          right
          variant="outline-secondary"
        >
          <template #button-content>
            <BIconThreeDots />
            <span class="sr-only"> Actions </span>
          </template>
          <ConfirmAction
            class="ml-auto"
            ok-title="Delete Entry"
            ok-variant="danger"
            v-slot="{ onConfirm }"
          >
            <b-dropdown-item variant="danger" @click="onConfirm(handleDelete)">
              Delete Entry…
            </b-dropdown-item>
          </ConfirmAction>
        </b-dropdown>
      </div>
      <b-tabs
        v-if="entry"
        nav-wrapper-class="nav-container border border-primary rounded-lg mb-1"
        justified
        no-fade
        pills
        size="lg"
      >
        <LedgerTab active title="Assets" :total="assetsTotal">
          <LedgerBalances :balances="assets" />
        </LedgerTab>
        <LedgerTab title="Liabilities" :total="liabilitiesTotal">
          <LedgerBalances :balances="liabilities" />
        </LedgerTab>
      </b-tabs>
      <b-card class="py-5 text-center" v-else>
        <div class="mb-5 mt-3">
          <p class="text-muted">There is no entry for this month.</p>
          <b-button
            class="px-4"
            size="lg"
            variant="success"
            @click="handleAddEntry"
          >
            Add Entry
          </b-button>
        </div>
      </b-card>
    </b-form>
  </validation-observer>
</template>

<script>
import { BIconThreeDots } from "bootstrap-vue";
import { ValidationObserver } from "vee-validate";
import { call, get } from "vuex-pathify";
import ConfirmAction from "@/components/ConfirmAction";
import LedgerBalances from "@/components/LedgerBalances";
import LedgerMonth from "@/components/LedgerMonth";
import LedgerTab from "@/components/LedgerTab";
import { valueToDollarsFormatted, valueToNumber } from "@/utilities/currency";

export default {
  name: "Ledger",
  data() {
    return {
      assets: [],
      assetsTotal: undefined,
      hasChanges: false,
      liabilities: [],
      liabilitiesTotal: undefined,
      activeMonth: "",
    };
  },
  components: {
    BIconThreeDots,
    ConfirmAction,
    LedgerBalances,
    LedgerMonth,
    LedgerTab,
    ValidationObserver,
  },
  mounted() {
    this.setInitialValues();
  },
  watch: {
    async activeMonth(newValue, oldValue) {
      const observer = await this.$refs.validationObserver;
      const isValid = await observer.validate();
      if (oldValue) {
        await this.handleSave();
      }
      if (isValid) {
        this.setInitialValues();
      }
    },
    entriesMeta() {
      this.setInitialValues();
    },
    mostRecentDate: {
      handler(newValue) {
        if (this.activeMonth) return;
        this.activeMonth = newValue;
      },
      immediate: true,
    },
  },
  computed: {
    ...get("entries", ["entriesMeta", "mostRecentDate"]),
    entry() {
      return this.entriesMeta[this.activeMonth];
    },
  },
  methods: {
    createEntry: call("entries/createEntry"),
    deleteEntry: call("entries/deleteEntry"),
    updateBalances: call("entries/updateBalances"),
    handleAddEntry() {
      this.createEntry(this.activeMonth);
    },
    handleDelete() {
      this.deleteEntry(this.activeMonth);
    },
    handleSave() {
      const balances = [].concat(this.assets, this.liabilities);
      const balancesFormatted = balances.map((balance) => ({
        account: balance.account.id,
        id: balance.id,
        value: valueToNumber(balance.valueFormatted),
      }));
      this.updateBalances(balancesFormatted);
    },
    setInitialValues() {
      if (this.entry) {
        const clone = structuredClone(this.entry);
        const { assets, assetsTotal, liabilities, liabilitiesTotal } = clone;
        this.assets = Object.values(assets);
        this.assetsTotal = valueToDollarsFormatted(assetsTotal);
        this.liabilities = Object.values(liabilities);
        this.liabilitiesTotal = valueToDollarsFormatted(liabilitiesTotal);
      } else {
        this.assets = [];
        this.liabilities = [];
        this.assetsTotal = undefined;
        this.liabilitiesTotal = undefined;
      }
      this.hasChanges = false;
    },
  },
};
</script>

<style scoped>
::v-deep .nav {
  padding: 1px;
}
</style>
