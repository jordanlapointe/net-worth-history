<template>
  <div>
    <slot :onConfirm="handleConfirm" />
    <b-modal
      hide-footer
      hide-header
      size="sm"
      :visible="showModal"
      @hide="handleCancel"
      @shown="handleModalShown"
    >
      <p class="h4 mb-4 mt-3 text-center">Are you sure?</p>
      <b-button ref="cancelButton" block @click="handleCancel">
        Cancel
      </b-button>
      <b-button block :variant="okVariant" @click="handleOk">
        {{ okTitle }}
      </b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "ConfirmAction",
  components: {},
  props: {
    okTitle: { default: "Save", type: String },
    okVariant: { default: "primary", type: String },
  },
  data() {
    return {
      callback: () => {},
      showModal: false,
    };
  },
  computed: {},
  methods: {
    handleCancel() {
      this.showModal = false;
    },
    handleConfirm(callback) {
      this.callback = callback;
      this.showModal = true;
    },
    handleOk() {
      this.callback();
      this.callback = () => {};
      this.showModal = false;
    },
    handleModalShown() {
      this.$refs.cancelButton.focus();
    },
  },
};
</script>
