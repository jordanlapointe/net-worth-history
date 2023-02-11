<template>
  <div class="d-flex">
    <b-button-group size="sm">
      <b-button variant="outline-secondary" @click="handleMonthDecrement">
        <span class="sr-only">Previous Month</span>
        <BIconChevronLeft aria-hidden="true" shift-h="-2" />
      </b-button>
      <b-button
        style="margin-left: -1px"
        variant="outline-secondary"
        @click="handleMonthIncrement"
      >
        <span class="sr-only">Next Month</span>
        <BIconChevronRight aria-hidden="true" shift-h="2" />
      </b-button>
    </b-button-group>
    <div class="align-self-baseline h4 px-2 mb-0 font-weight-normal">
      {{ monthFormatted }}
    </div>
  </div>
</template>

<script>
import { BIconChevronLeft, BIconChevronRight } from "bootstrap-vue";
import { format, formatISO, parseISO, startOfMonth } from "date-fns";
import { addMonthsIso } from "@/utilities/dates";

export default {
  name: "LedgerMonth",
  components: {
    BIconChevronLeft,
    BIconChevronRight,
  },
  data() {
    return {};
  },
  props: {
    value: {
      default: () => {
        const currentMonth = startOfMonth(new Date());
        return formatISO(currentMonth);
      },
      type: String,
    },
  },
  mounted() {},
  watch: {},
  computed: {
    monthFormatted() {
      return format(parseISO(this.value), "MMMM yyy");
    },
  },
  methods: {
    handleChange(value) {
      this.$emit("input", value);
    },
    handleMonthDecrement() {
      this.handleChange(addMonthsIso(this.value, -1));
    },
    handleMonthIncrement() {
      this.handleChange(addMonthsIso(this.value, 1));
    },
  },
};
</script>

<style scoped></style>
