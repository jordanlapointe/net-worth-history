<template>
  <div
    v-if="account"
    class="d-flex flex-column pb-2 pt-3"
    style="height: 100vh"
  >
    <div class="align-items-baseline d-flex mb-4 px-2">
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
    <AccessibleChart
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
import AccessibleChart from "@/components/AccessibleChart";

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
