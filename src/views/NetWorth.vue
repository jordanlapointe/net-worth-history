<template>
  <div>
    <div class="align-items-baseline d-flex">
      <h1 class="mt-2">Net Worth</h1>
      <p class="h4 ml-auto text-muted">${{ mostRecentNetTotal | currency }}</p>
    </div>
    <div class="pb-2" style="height: 80vh">
      <Bar
        v-if="activeTab === 0"
        :options="chartOptions"
        :data="dataNetWorth"
      />
      <LineChart
        v-if="activeTab === 1"
        :options="projectionChartOptions"
        :data="dataNetWorthFuture"
      />
    </div>
    <b-tabs
      align="center"
      class="d-block pb-3"
      end
      lazy
      pills
      v-model="activeTab"
    >
      <b-tab title="History" />
      <b-tab title="Future" />
    </b-tabs>
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
import { chartOptions, projectionChartOptions } from "@/constants/chartOptions";

export default {
  name: "NetWorth",
  components: { Bar, LineChart },
  props: {},
  data() {
    return {
      activeTab: 1,
      chartOptions,
      projectionChartOptions,
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
            borderColor: "white",
            hoverBackgroundColor: "white",
            id: "Avg",
            tooltip: false,
          },
          {
            data: this.futureTotals.low,
            fill: "origin",
            backgroundColor: "#6c757d",
            id: "Low",
            tooltip: false,
          },
          {
            data: this.futureTotals.high,
            fill: "-1",
            backgroundColor: "#212529",
            id: "High",
            tooltip: false,
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
