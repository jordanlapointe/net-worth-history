<template>
  <div>
    <div class="mb-2 text-right">
      <b-button
        v-b-tooltip.bottomleft="toggleButtonText"
        size="sm"
        variant="outline-secondary"
        @click="handleToggle"
      >
        <BIconArrowBarRight v-if="collapsed" aria-hidden="true" />
        <BIconArrowBarLeft v-else aria-hidden="true" />
        <span class="sr-only"> {{ toggleButtonText }} </span>
      </b-button>
    </div>
    <div v-if="!collapsed">
      <b-nav pills vertical>
        <b-nav-item active-class="" exact-active-class="active" to="/">
          Net Worth
          <span class="small float-right">
            ${{ mostRecentNetTotal | currencyShort }}
          </span>
        </b-nav-item>
        <b-nav-item to="/ledger"> Ledger </b-nav-item>
        <b-nav-item to="/settings"> Settings </b-nav-item>
      </b-nav>
      <NavAccountList
        :accounts="accountsOnlyAssets"
        categoryName="asset"
        :total="mostRecentAssetsTotal"
      />
      <NavAccountList
        :accounts="accountsOnlyLiabilities"
        categoryName="liability"
        :total="mostRecentLiabilitiesTotal"
      />
    </div>
  </div>
</template>

<script>
import { BIconArrowBarLeft, BIconArrowBarRight } from "bootstrap-vue";
import { get } from "vuex-pathify";
import NavAccountList from "@/components/NavAccountList";

export default {
  name: "Nav",
  components: { NavAccountList, BIconArrowBarLeft, BIconArrowBarRight },
  props: {
    balances: { default: () => [], type: Array },
  },
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    ...get("accounts", ["accountsOnlyAssets", "accountsOnlyLiabilities"]),
    ...get("entries", [
      "mostRecentAssetsTotal",
      "mostRecentLiabilitiesTotal",
      "mostRecentNetTotal",
    ]),
    toggleButtonText() {
      return this.collapsed ? "Expand" : "Collapse";
    },
  },
  watch: {},
  mounted() {},
  methods: {
    async handleToggle() {
      this.collapsed = !this.collapsed;
    },
  },
};
</script>

<style scoped></style>
