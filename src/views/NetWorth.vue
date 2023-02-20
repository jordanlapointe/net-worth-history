<template>
  <div class="py-2">
    <div class="align-items-baseline d-flex mb-4">
      <h1 class="h2 mb-0">Net Worth</h1>
      <p class="h4 ml-auto text-muted" data-testid="NetWorth-net-total">
        ${{ mostRecentNetTotal | currency }}
      </p>
    </div>
    <AccessibleChart
      v-if="activeTab === 0"
      id="NetWorth-chart"
      :component="Bar"
      :data="dataNetWorth"
      :options="chartOptions"
      style="height: 75vh"
    />
    <AccessibleChart
      v-if="activeTab === 1"
      id="NetWorth-futureChart"
      :component="Line"
      :data="dataNetWorthFuture"
      :options="chartOptionsProjection"
      style="height: 75vh"
    />
    <div class="text-center">
      <b-tabs
        v-model="activeTab"
        class="border border-primary d-inline-block rounded-lg"
        style="padding: 1px"
        pills
      >
        <b-tab title-link-class="px-4" title="History" />
        <b-tab title-link-class="px-4" title="Future" />
      </b-tabs>
      <hr />
    </div>
    <div class="align-items-baseline d-flex mb-2">
      <h2 class="h3 mb-1">Assets</h2>
      <p class="h5 ml-auto mb-0 text-muted" data-testid="NetWorth-assets-total">
        ${{ mostRecentAssetsTotal | currency }}
      </p>
    </div>
    <AccessibleChart
      id="NetWorth-assetsChart"
      class="mb-3"
      :component="Bar"
      :data="dataAssets"
      :options="chartOptions"
      style="height: 40vh"
    />
    <div class="align-items-baseline d-flex mb-2">
      <h2 class="h3 mb-1">Liabilities</h2>
      <p
        class="h5 ml-auto mb-0 text-muted"
        data-testid="NetWorth-liabilities-total"
      >
        ${{ mostRecentLiabilitiesTotal | currency }}
      </p>
    </div>
    <AccessibleChart
      id="NetWorth-liabilitiesChart"
      :component="Bar"
      :data="dataLiabilities"
      :options="chartOptions"
      style="height: 40vh"
    />
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { Bar, Line } from "vue-chartjs";
import AccessibleChart from "@/components/AccessibleChart";

export default {
  name: "NetWorth",
  components: { AccessibleChart },
  props: {},
  data() {
    return {
      activeTab: 0,
      Bar,
      Line,
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
