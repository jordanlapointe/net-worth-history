<template>
  <div class="align-items-stretch d-flex">
    <b-button
      class="mr-1 text-dark"
      size="sm"
      variant="outline-secondary"
      @click="handleMonthDecrement"
      @click.meta="handleMonthDecrementMeta"
    >
      <span class="sr-only">Previous Month</span>
      <BIconChevronLeft aria-hidden="true" shift-h="-1" />
    </b-button>
    <b-button
      class="text-dark"
      size="sm"
      variant="outline-secondary"
      @click="handleMonthIncrement"
      @click.meta="handleMonthIncrementMeta"
    >
      <span class="sr-only">Next Month</span>
      <BIconChevronRight aria-hidden="true" shift-h="1" />
    </b-button>
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { BIconChevronLeft, BIconChevronRight } from "bootstrap-vue";
import { formatISO, startOfMonth } from "date-fns";
import { addMonthsIso } from "@/utilities/dates";

export default {
  name: "LedgerMonth",
  components: {
    BIconChevronLeft,
    BIconChevronRight,
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
  data() {
    return {};
  },
  computed: {
    ...get("entries", ["entryDates"]),
  },
  watch: {},
  mounted() {},
  methods: {
    emitChange(value) {
      this.$emit("input", value);
    },
    handleMonthDecrement() {
      const previousMonth = addMonthsIso(this.value, -1);
      this.emitChange(previousMonth);
    },
    handleMonthDecrementMeta() {
      const firstMonth = this.entryDates[0];
      this.emitChange(firstMonth);
    },
    handleMonthIncrement() {
      const nextMonth = addMonthsIso(this.value, 1);
      this.emitChange(nextMonth);
    },
    handleMonthIncrementMeta() {
      const lastIndex = this.entryDates.length - 1;
      const lastMonth = this.entryDates[lastIndex];
      this.emitChange(lastMonth);
    },
  },
};
</script>

<style scoped></style>
