<template>
  <b-tab :active="active">
    <template #title>
      <span class="font-weight-bold mb-0">{{ title }}</span>
      <span v-if="total" class="d-block">${{ total }}</span>
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
