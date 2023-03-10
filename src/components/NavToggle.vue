<template>
  <b-button
    v-b-tooltip.bottomleft="toggleButtonText"
    size="sm"
    variant="outline-secondary"
    @click="handleToggle"
    v-on="$listeners"
  >
    <BIconArrowBarRight v-if="value" aria-hidden="true" />
    <BIconArrowBarLeft v-else aria-hidden="true" />
    <span class="sr-only"> {{ toggleButtonText }} </span>
  </b-button>
</template>

<script>
import { BIconArrowBarLeft, BIconArrowBarRight } from "bootstrap-vue";

export default {
  name: "Nav",
  components: {
    BIconArrowBarLeft,
    BIconArrowBarRight,
  },
  props: {
    value: { required: true, type: Boolean },
  },
  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    toggleButtonText() {
      return this.value ? "Expand" : "Collapse";
    },
  },
  watch: {},
  mounted() {},
  methods: {
    async handleToggle() {
      this.$emit("input", !this.value);
    },
  },
};
</script>

<style scoped></style>
