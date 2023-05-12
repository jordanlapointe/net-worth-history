<template>
  <div v-if="account" class="d-flex flex-column pb-4 pt-3 vh-100">
    <div class="align-items-baseline d-flex mb-4">
      <div>
        <h1 class="h4 mb-1">{{ account.name }}</h1>
        <p class="mb-0">
          {{ account.institution }}
          <b-link class="ml-2" :to="`/accounts/${account.id}/edit`">
            Edit
          </b-link>
        </p>
      </div>
      <div class="ml-auto text-right">
        <p class="h5 mb-1 text-muted">
          ${{ mostRecentBalancesByAccountId[account.id] | currency }}
        </p>
        <b-link
          :to="{
            name: 'ledger',
            query: { accountId: account.id, accountType: account.type },
          }"
        >
          Ledger<BIconChevronRight scale="0.8" shift-h="2" shift-v="-1.5" />
        </b-link>
      </div>
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
import { BIconChevronRight } from "bootstrap-vue";
import { get } from "vuex-pathify";
import { Bar } from "vue-chartjs";
import AccessibleChart from "@/components/AccessibleChart.vue";

export default {
  name: "Account",
  components: { AccessibleChart, BIconChevronRight },
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
