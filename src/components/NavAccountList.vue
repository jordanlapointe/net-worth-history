<template>
  <div>
    <div class="align-items-baseline border-bottom d-flex mb-1 mt-4 mx-3 pb-1">
      <h2 class="h5 mb-0 text-capitalize">{{ title }}</h2>
      <p class="h6 mb-0 ml-auto">${{ total | currencyShort }}</p>
    </div>
    <b-nav pills vertical>
      <b-nav-item
        v-for="account in accounts"
        :key="account.id"
        :to="`/accounts/${account.id}`"
      >
        <div class="align-items-baseline d-flex">
          <div class="mr-5 text-truncate" style="max-width: 15vw">
            {{ account.name }}
          </div>
          <div class="ml-auto small">
            ${{ mostRecentBalancesByAccountId[account.id] | currencyShort }}
          </div>
        </div>
        <div class="pr-5 small">
          {{ account.institution }}
        </div>
      </b-nav-item>
      <b-nav-item :to="`/accounts/add/${categoryName}`">
        Add <span class="text-capitalize">{{ categoryName }}</span>
        <BIconPlus aria-hidden="true" shift-v="-1" />
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
import { BIconPlus } from "bootstrap-vue";
import { get } from "vuex-pathify";

export default {
  name: "NavAccountList",
  components: { BIconPlus },
  data() {
    return {};
  },
  props: {
    accounts: { required: true, type: Array },
    categoryName: { required: true, type: String },
    total: { required: true, type: Number },
  },
  mounted() {},
  watch: {},
  computed: {
    ...get("entries", ["mostRecentBalancesByAccountId"]),
    activeId() {
      return Number(this.$route.params.id);
    },
    title() {
      const categoryToTitleMap = {
        asset: "Assets",
        liability: "Liabilities",
      };
      return categoryToTitleMap[this.categoryName];
    },
  },
  methods: {},
};
</script>

<style scoped></style>
