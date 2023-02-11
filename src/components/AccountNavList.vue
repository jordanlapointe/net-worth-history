<template>
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
</template>

<script>
import { BIconPlus } from "bootstrap-vue";
import { get } from "vuex-pathify";

export default {
  name: "AccountNavList",
  components: { BIconPlus },
  data() {
    return {};
  },
  props: {
    accounts: { required: true, type: Array },
    categoryName: { required: true, type: String },
  },
  mounted() {},
  watch: {},
  computed: {
    ...get("entries", ["mostRecentBalancesByAccountId"]),
    activeId() {
      return Number(this.$route.params.id);
    },
  },
  methods: {},
};
</script>

<style scoped></style>
