<template>
  <b-list-group v-if="balancesFiltered.length > 0">
    <LedgerBalance
      v-for="balance in balancesFiltered"
      :key="balance.id"
      :balance="balance"
    />
  </b-list-group>
  <b-card v-else-if="accountFilter" class="lead text-center">
    No matches for “{{ accountFilter }}”
  </b-card>
</template>

<script>
import { get } from "vuex-pathify";
import LedgerBalance from "@/components/LedgerBalance.vue";

export default {
  name: "LedgerBalanceList",
  components: {
    LedgerBalance,
  },
  props: {
    balances: { required: true, type: Array },
  },
  data() {
    return {};
  },
  computed: {
    ...get("ui", ["accountFilter"]),
    balancesFiltered() {
      const filterLowerCase = this.accountFilter.toLowerCase();
      return this.balances.filter(({ account }) => {
        const { name, institution } = account;
        const accountText = `${institution} ${name}`.toLowerCase();
        return accountText.includes(filterLowerCase);
      });
    },
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>
