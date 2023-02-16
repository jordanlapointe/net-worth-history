<template>
  <div v-if="account" class="d-flex flex-column pt-3" style="height: 100vh">
    <div class="align-items-baseline d-flex">
      <div>
        <h1 class="h4 mb-0">{{ account.name }}</h1>
        <p>
          {{ account.institution }}
          <b-link class="ml-2" :to="`/accounts/${account.id}/edit`">
            Edit
          </b-link>
        </p>
      </div>
      <p class="h5 ml-auto text-muted">
        ${{ mostRecentBalancesByAccountId[account.id] | currency }}
      </p>
    </div>
    <div class="flex-grow-1 pb-2">
      <Bar :options="chartOptions" :data="chartNetWorth" />
    </div>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { Bar } from "vue-chartjs";

export default {
  name: "Account",
  components: { Bar },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...get("accounts", ["accountsById"]),
    ...get("entries", [
      "entryDates",
      "balancesByAccountId",
      "mostRecentBalancesByAccountId",
    ]),
    ...get("ui", ["chartOptions"]),
    account() {
      return this.accountsById[this.accountId];
    },
    accountId() {
      return Number(this.$route.params.id);
    },
    chartNetWorth() {
      const balances = this.balancesByAccountId[this.accountId];
      return {
        labels: this.entryDates,
        datasets: [{ data: balances }],
      };
    },
  },
};
</script>
