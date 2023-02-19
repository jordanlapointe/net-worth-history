<template>
  <div ref="container" class="position-relative" @mouseleave="handleMouseleave">
    <component
      :is="component"
      ref="chart"
      aria-hidden="true"
      :data="data"
      :options="options"
      style="pointer-events: none"
    />
    <div class="overlay">
      <b-button
        v-for="(label, index) in data.labels"
        :key="label"
        class="border-0 bg-transparent p-0 w-100"
        variant="outline-dark"
        @blur="handleBlur(index)"
        @mouseover="handleHover(index)"
        @focus="handleFocus(index)"
        @keydown.left="handleArrowLeft(index, $event)"
        @keydown.right="handleArrowRight(index, $event)"
      >
        <span class="sr-only">
          {{ formatLabel(label) }}: {{ getValue(index) }}
        </span>
      </b-button>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from "date-fns";
import { valueToDollarsFormatted } from "@/utilities/currency";

export default {
  name: "AccessibleChart",
  components: {},
  props: {
    data: { required: true, type: Object },
    options: { required: true, type: Object },
    component: { required: true, type: Object },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    clearActive() {
      const chart = this.$refs.chart?.$children[0]?.chart;
      chart.setActiveElements([]);
      chart.tooltip.setActiveElements([]);
      chart.update();
    },
    containsFocus() {
      const container = this.$refs.container;
      return container.contains(document.activeElement);
    },
    getValue(index) {
      const values = this.data.datasets.map(({ data }) => {
        return `$${valueToDollarsFormatted(data[index])}`;
      });
      return values.join(", ");
    },
    handleArrowLeft(index, { target }) {
      target.previousSibling.focus();
    },
    handleArrowRight(index, { target }) {
      target.nextSibling.focus();
    },
    handleBlur() {
      this.$nextTick(() => {
        if (!this.containsFocus()) {
          this.clearActive();
        }
      });
    },
    handleFocus(index) {
      this.setActive(index);
    },
    handleHover(index) {
      this.setActive(index);
    },
    handleMouseleave() {
      if (!this.containsFocus()) {
        this.clearActive();
      }
    },
    setActive(index) {
      const chart = this.$refs.chart?.$children[0]?.chart;
      const activeElements = this.data.datasets.map((dataset, datasetIndex) => {
        return {
          datasetIndex,
          index,
        };
      });
      chart.setActiveElements(activeElements);
      chart.tooltip.setActiveElements(activeElements);
      chart.update();
    },
    formatLabel(label) {
      return format(parseISO(label), "LLLL yyyy");
    },
  },
};
</script>

<style scoped>
.overlay {
  bottom: 80px; /* From chartOptions.scales.x.afterFit */
  display: flex;
  left: 60px; /* From chartOptions.scales.y.afterFit */
  position: absolute;
  right: 1px;
  top: 0;
}
</style>