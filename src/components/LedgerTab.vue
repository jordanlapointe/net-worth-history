<template>
  <b-tab :active="active">
    <template #title>
      <p class="h6 mb-0">{{ title }}</p>
      <span v-if="total" class="d-block small">${{ total }}</span>
    </template>
    <slot></slot>
  </b-tab>
</template>

<script>
export default {
  name: "LedgerTab",
  components: {},
  props: {
    active: { default: false, type: Boolean },
    title: String,
    total: String,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>
