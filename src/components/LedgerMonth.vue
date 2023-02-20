<template>
  <div class="align-items-stretch d-flex">
    <b-button
      class="mr-1"
      size="sm"
      variant="outline-secondary"
      @click="handleMonthDecrement"
      @click.meta="handleMonthDecrementMeta"
    >
      <span class="sr-only">Previous Month</span>
      <BIconChevronLeft aria-hidden="true" shift-h="-1" />
    </b-button>
    <b-button
      class="mr-2"
      size="sm"
      variant="outline-secondary"
      @click="handleMonthIncrement"
      @click.meta="handleMonthIncrementMeta"
    >
      <span class="sr-only">Next Month</span>
      <BIconChevronRight aria-hidden="true" shift-h="1" />
    </b-button>
    <b-form-select
      :value="value"
      class="py-0"
      :options="options"
      style="font-size: 1.25rem; height: auto"
      @input="handleSelect"
    />
  </div>
</template>

<script>
import { get } from "vuex-pathify";
import { BIconChevronLeft, BIconChevronRight } from "bootstrap-vue";
import { format, formatISO, parseISO, startOfMonth } from "date-fns";
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
    return {
      baseOptions: [],
    };
  },
  computed: {
    ...get("entries", ["entryDates"]),
    monthFormatted() {
      return format(parseISO(this.value), "MMMM yyy");
    },
    options() {
      const hasEntry = this.entryDates.includes(this.value);
      return hasEntry
        ? this.baseOptions
        : this.baseOptions.concat([
            {
              text: format(parseISO(this.value), "LLLL yyyy"),
              value: this.value,
            },
          ]);
    },
  },
  watch: {},
  mounted() {
    this.baseOptions = this.entryDates.map((date) => ({
      text: format(parseISO(date), "LLLL yyyy"),
      value: date,
    }));
  },
  methods: {
    emitChange(value) {
      this.$emit("input", value);
    },
    handleMonthDecrement() {
      const lastMonth = addMonthsIso(this.value, -1);
      this.emitChange(lastMonth);
    },
    handleMonthDecrementMeta() {
      const lastMonth = this.entryDates[0];
      this.emitChange(lastMonth);
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
    handleSelect(value) {
      this.emitChange(value);
    },
  },
};
</script>

<style scoped></style>
