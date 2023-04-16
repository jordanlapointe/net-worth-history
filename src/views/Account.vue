<template>
  <div v-if="account" class="d-flex flex-column pb-4 pt-3 vh-100">
    <div class="align-items-baseline d-flex mb-4">
      <div>
        <h1 class="h5 mb-1">{{ account.name }}</h1>
        <p class="mb-0">
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
    <AccessibleChart
      id="Account-chart"
      class="flex-grow-1"
      :component="Bar"
      :data="chartNetWorth"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { Bar } from "vue-chartjs";
import AccessibleChart from "@/components/AccessibleChart.vue";

export default {
  name: "Account",
  components: { AccessibleChart },
  props: {},
  data() {
    return { Bar };
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
