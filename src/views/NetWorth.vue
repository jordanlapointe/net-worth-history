<template>
  <div>
    <div class="align-items-baseline d-flex">
      <h1 class="mt-2">Net Worth</h1>
      <p class="h4 ml-auto text-muted">${{ mostRecentNetTotal | currency }}</p>
    </div>
    <div class="pb-2" style="height: 75vh">
      <Bar
        v-if="activeTab === 0"
        :options="chartOptions"
        :data="dataNetWorth"
      />
      <LineChart
        v-if="activeTab === 1"
        :options="chartOptionsProjection"
        :data="dataNetWorthFuture"
      />
    </div>
    <div class="mb-4 text-center">
      <b-tabs
        class="border border-primary d-inline-block rounded-lg"
        style="padding: 1px"
        pills
        v-model="activeTab"
      >
        <b-tab title="History" />
        <b-tab title="Future" />
      </b-tabs>
    </div>
    <div class="align-items-baseline d-flex mb-1">
      <h2 class="mb-0">Assets</h2>
      <p class="h5 ml-auto mb-0 text-muted">
        ${{ mostRecentAssetsTotal | currency }}
      </p>
    </div>
    <div class="pb-3" style="height: 40vh">
      <Bar :options="chartOptions" :data="dataAssets" />
    </div>
    <div class="align-items-baseline d-flex mb-1">
      <h2 class="mb-0">Liabilities</h2>
      <p class="h5 ml-auto mb-0 text-muted">
        ${{ mostRecentLiabilitiesTotal | currency }}
      </p>
    </div>
    <div class="pb-3" style="height: 40vh">
      <Bar :options="chartOptions" :data="dataLiabilities" />
    </div>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { Bar, Line as LineChart } from "vue-chartjs";

export default {
  name: "NetWorth",
  components: { Bar, LineChart },
  props: {},
  data() {
    return {
      activeTab: 0,
    };
  },
  computed: {
    ...get("entries", [
      "assetTotals",
      "liabilityTotals",
      "entryDates",
      "futureDates",
      "futureTotals",
      "futureTotalsToo",
      "netTotals",
      "mostRecentAssetsTotal",
      "mostRecentLiabilitiesTotal",
      "mostRecentNetTotal",
    ]),
    ...get("ui", ["chartOptions", "chartOptionsProjection", "colors"]),
    dataNetWorth() {
      return {
        labels: this.entryDates,
        datasets: [{ data: this.netTotals }],
      };
    },
    dataNetWorthFuture() {
      return {
        labels: this.futureDates,
        datasets: [
          {
            data: this.futureTotals.middle,
            borderColor: this.colors.white,
            id: "Avg",
          },
          {
            data: this.futureTotals.low,
            fill: "origin",
            backgroundColor: this.colors.secondary,
            id: "Low",
          },
          {
            data: this.futureTotals.high,
            fill: "-1",
            backgroundColor: this.colors.black,
            id: "High",
          },
        ],
      };
    },
    dataAssets() {
      return {
        labels: this.entryDates,
        datasets: [{ data: this.assetTotals }],
      };
    },
    dataLiabilities() {
      return {
        labels: this.entryDates,
        datasets: [{ data: this.liabilityTotals }],
      };
    },
  },
};
</script>

<style scoped></style>
