<template>
  <div
    class="border-right"
    :class="showBorderEffect ? 'border-dark' : 'border-light'"
    :style="collapsed ? '' : 'min-width: 220px; width: 22vw;'"
  >
    <div class="bg-light d-flex mb-1 pl-3 pr-1 py-2 sticky-top">
      <NavToggle
        v-model="collapsed"
        @blur="showBorderEffect = false"
        @focus="showBorderEffect = true"
        @mouseover="showBorderEffect = true"
        @mouseout="showBorderEffect = false"
      />
      <b-input-group v-if="!collapsed" class="ml-3" size="sm">
        <b-form-input
          v-model="accountFilter"
          class="px-3"
          placeholder="Filter Accounts"
        />
      </b-input-group>
    </div>
    <div v-if="!collapsed" class="px-1">
      <b-nav pills vertical>
        <b-nav-item active-class="" exact-active-class="active" to="/">
          Net Worth
          <span class="float-right" data-testid="Nav-netWorth">
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
import { get, sync } from "vuex-pathify";
import NavAccountList from "@/components/NavAccountList.vue";
import NavToggle from "@/components/NavToggle.vue";

export default {
  name: "Nav",
  components: {
    NavAccountList,
    NavToggle,
  },
  props: {
    value: { default: false, type: Boolean },
  },
  data() {
    return {
      collapsed: false,
      showBorderEffect: false,
    };
  },
  computed: {
    ...get("accounts", ["accountsOnlyAssets", "accountsOnlyLiabilities"]),
    ...get("entries", [
      "mostRecentAssetsTotal",
      "mostRecentLiabilitiesTotal",
      "mostRecentNetTotal",
    ]),
    accountFilter: sync("ui/accountFilter"),
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
