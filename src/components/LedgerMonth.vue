<template>
  <div class="align-items-stretch d-flex">
    <b-button
      size="sm"
      variant="outline-secondary"
      @click="handleMonthDecrement"
    >
      <span class="sr-only">Previous Month</span>
      <BIconChevronLeft aria-hidden="true" shift-h="-1" />
    </b-button>
    <b-button
      class="ml-1"
      size="sm"
      variant="outline-secondary"
      @click="handleMonthIncrement"
    >
      <span class="sr-only">Next Month</span>
      <BIconChevronRight aria-hidden="true" shift-h="1" />
    </b-button>
    <b-form-select
      :value="value"
      class="ml-1 pl-3 pr-5 py-0"
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
      this.emitChange(addMonthsIso(this.value, -1));
    },
    handleMonthIncrement() {
      this.emitChange(addMonthsIso(this.value, 1));
    },
    handleSelect(value) {
      this.emitChange(value);
    },
  },
};
</script>

<style scoped></style>
