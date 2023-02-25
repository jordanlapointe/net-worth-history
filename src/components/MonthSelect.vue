<template>
  <b-form-select
    :value="value"
    class="py-0"
    :options="options"
    style="font-size: 1.25rem; height: auto; width: auto"
    @input="handleSelect"
  />
</template>

<script>
import { get } from "vuex-pathify";
import { format, formatISO, parseISO, startOfMonth } from "date-fns";

export default {
  name: "LedgerMonth",
  components: {},
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
      options: [],
    };
  },
  computed: {
    ...get("entries", ["entryDates"]),
  },
  watch: {
    entryDates: {
      handler() {
        this.setOptions();
      },
      immediate: true,
    },
    value() {
      this.setOptions();
    },
  },
  mounted() {},
  methods: {
    handleSelect(value) {
      this.$emit("input", value);
    },
    setOptions() {
      const containsCurrentMonth = this.entryDates.includes(this.value);
      const dates = containsCurrentMonth
        ? this.entryDates
        : this.entryDates.concat([this.value]);
      this.options = dates.map((date) => ({
        text: format(parseISO(date), "LLLL yyyy"),
        value: date,
      }));
    },
  },
};
</script>

<style scoped></style>
