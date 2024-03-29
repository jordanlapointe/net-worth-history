<template>
  <div class="pb-3 pt-2">
    <validation-observer ref="validationObserver">
      <h1 class="h2 mb-2">Ledger</h1>
      <div class="bg-white d-flex mb-2 py-2 sticky sticky-top">
        <MonthPagination v-model="activeMonth" />
        <MonthSelect v-model="activeMonth" class="ml-2" />
        <ConfirmAction
          v-slot="{ onConfirm }"
          class="ml-5"
          ok-title="Delete Entry"
          ok-variant="danger"
        >
          <b-dropdown
            v-if="entry"
            size="sm"
            toggle-class="text-decoration-none"
            no-caret
            left
            variant="outline-secondary"
          >
            <template #button-content>
              <BIconThreeDots />
              <span class="sr-only"> Actions </span>
            </template>
            <b-dropdown-item variant="danger" @click="onConfirm(handleDelete)">
              Delete Entry…
            </b-dropdown-item>
          </b-dropdown>
        </ConfirmAction>
      </div>
      <b-tabs
        v-if="entry"
        v-model="activeTab"
        nav-wrapper-class="nav-container border border-primary rounded-lg mb-2"
        justified
        lazy
        no-fade
        pills
        size="lg"
      >
        <LedgerTab title="Assets" :total="assetsTotal">
          <LedgerBalanceList :balances="assets" />
        </LedgerTab>
        <LedgerTab title="Liabilities" :total="liabilitiesTotal">
          <LedgerBalanceList :balances="liabilities" />
        </LedgerTab>
      </b-tabs>
      <b-card v-else class="py-5 text-center">
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
    </validation-observer>
  </div>
</template>

<script>
import { BIconThreeDots } from "bootstrap-vue";
import { ValidationObserver } from "vee-validate";
import { call, get } from "vuex-pathify";
import ConfirmAction from "@/components/ConfirmAction.vue";
import LedgerBalanceList from "@/components/LedgerBalanceList.vue";
import MonthPagination from "@/components/MonthPagination.vue";
import MonthSelect from "@/components/MonthSelect.vue";
import LedgerTab from "@/components/LedgerTab.vue";
import { valueToDollarsAbbreviated, valueToNumber } from "@/utilities/currency";

export default {
  name: "Ledger",
  components: {
    BIconThreeDots,
    ConfirmAction,
    LedgerBalanceList,
    MonthPagination,
    MonthSelect,
    LedgerTab,
    ValidationObserver,
  },
  data() {
    return {
      activeTab: 0,
      assets: [],
      assetsTotal: undefined,
      hasChanges: false,
      liabilities: [],
      liabilitiesTotal: undefined,
      activeMonth: "",
    };
  },
  computed: {
    ...get("entries", ["entriesMeta", "mostRecentDate"]),
    entry() {
      return this.entriesMeta[this.activeMonth];
    },
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
  mounted() {
    this.setActiveTab();
    this.setInitialValues();
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    ...call("entries", ["createEntry", "deleteEntry", "updateBalances"]),
    ...call("history", ["redo", "undo"]),
    handleAddEntry() {
      this.createEntry(this.activeMonth);
    },
    handleDelete() {
      this.deleteEntry(this.activeMonth);
    },
    handleKeydown(event) {
      const { ctrlKey, key, metaKey, shiftKey } = event;
      const isInputFocused = event.target.tagName === "INPUT";
      const isUndoShortcut = key === "z" && (ctrlKey || metaKey);
      const isRedoShortcut = isUndoShortcut && shiftKey;
      if (isInputFocused) {
        return;
      }
      if (isUndoShortcut) {
        this.undo();
      }
      if (isRedoShortcut) {
        this.redo();
      }
      event.preventDefault();
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
    setActiveTab() {
      const targetType = this.$route.query.accountType;
      const isLiabilityTargeted = targetType === "LIABILITY";
      if (!isLiabilityTargeted) return;
      this.$nextTick(() => {
        this.activeTab = 1;
      });
    },
    setInitialValues() {
      if (this.entry) {
        const clone = structuredClone(this.entry);
        const { assets, assetsTotal, liabilities, liabilitiesTotal } = clone;
        this.assets = Object.values(assets);
        this.assetsTotal = valueToDollarsAbbreviated(assetsTotal);
        this.liabilities = Object.values(liabilities);
        this.liabilitiesTotal = valueToDollarsAbbreviated(liabilitiesTotal);
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
