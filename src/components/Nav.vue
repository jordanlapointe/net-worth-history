<template>
  <div>
    <div v-if="collapsed">
      <b-button
        v-b-tooltip.bottomleft="'Expand'"
        class="mb-2 px-2"
        ref="collapseButton"
        size="sm"
        variant="outline-secondary"
        @click="handleToggle"
      >
        <BIconArrowBarRight aria-hidden="true" />
        <span class="sr-only"> Expand </span>
      </b-button>
    </div>
    <div v-else>
      <div class="text-right">
        <b-button
          v-b-tooltip.bottomright="'Collapse'"
          class="mb-2 ml-2 px-2"
          ref="expandButton"
          size="sm"
          title="toggle nav"
          variant="outline-secondary"
          @click="handleToggle"
        >
          <BIconArrowBarLeft aria-hidden="true" />
          <span class="sr-only"> Collapse </span>
        </b-button>
      </div>
      <b-nav pills vertical>
        <b-nav-item active-class="" exact-active-class="active" to="/">
          Net Worth
        </b-nav-item>
        <b-nav-item to="/ledger"> Ledger </b-nav-item>
        <b-nav-item to="/settings"> Settings </b-nav-item>
      </b-nav>
      <div
        class="align-items-baseline border-bottom d-flex mb-1 mt-4 mx-3 pb-1"
      >
        <h2 class="h5 mb-0">Assets</h2>
        <p class="h6 mb-0 ml-auto">
          ${{ mostRecentAssetsTotal | currencyShort }}
        </p>
      </div>
      <AccountNavList :accounts="accountsOnlyAssets" categoryName="asset" />
      <div
        class="align-items-baseline border-bottom d-flex mb-1 mt-4 mx-3 pb-1"
      >
        <h2 class="h5 mb-0">Liabilities</h2>
        <p class="h6 mb-0 ml-auto">
          ${{ mostRecentLiabilitiesTotal | currencyShort }}
        </p>
      </div>
      <AccountNavList
        :accounts="accountsOnlyLiabilities"
        categoryName="liability"
      />
    </div>
  </div>
</template>

<script>
import { BIconArrowBarLeft, BIconArrowBarRight } from "bootstrap-vue";
import { get } from "vuex-pathify";
import AccountNavList from "@/components/AccountNavList";

export default {
  name: "Nav",
  components: { AccountNavList, BIconArrowBarLeft, BIconArrowBarRight },
  data() {
    return {
      collapsed: false,
    };
  },
  props: {
    balances: { default: () => [], type: Array },
  },
  mounted() {},
  watch: {},
  computed: {
    ...get("accounts", ["accountsOnlyAssets", "accountsOnlyLiabilities"]),
    ...get("entries", ["mostRecentAssetsTotal", "mostRecentLiabilitiesTotal"]),
  },
  methods: {
    async handleToggle() {
      this.collapsed = !this.collapsed;
      await this.$nextTick();
      const refName = this.collapsed ? "collapseButton" : "expandButton";
      const ref = this.$refs[refName];
      ref.focus();
    },
  },
};
</script>

<style scoped></style>
