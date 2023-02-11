<template>
  <validation-observer ref="validationObserver">
    <b-list-group>
      <b-list-group-item
        v-for="balance in balances"
        :key="balance.id"
        class="bg-light"
      >
        <b-form-row>
          <b-col cols="3">
            {{ balance.account.name }}
            <span class="d-block small">
              {{ balance.account.institution }}
            </span>
          </b-col>
          <b-col cols="8">
            <FormInput
              :id="`balance-${balance.id}`"
              :name="balance.account.name"
              :label-sr-only="true"
              prepend="$"
              :rules="{ number: true }"
              size="lg"
              trim
              v-model="balance.valueFormatted"
              @blur="handleBlur(balance)"
            />
          </b-col>
        </b-form-row>
      </b-list-group-item>
    </b-list-group>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import { call } from "vuex-pathify";
import FormInput from "@/components/FormInput.vue";
import { valueToNumber } from "@/utilities/currency";

export default {
  name: "LedgerBalances",
  components: { FormInput, ValidationObserver },
  data() {
    return {};
  },
  props: {
    balances: { default: () => [], type: Array },
  },
  mounted() {},
  watch: {},
  computed: {},
  methods: {
    updateBalances: call("entries/updateBalances"),
    handleBlur(balance) {
      const { valid } = this.$refs.validationObserver.flags;
      if (!valid) return;
      const balanceFormatted = {
        account: balance.account.id,
        id: balance.id,
        value: valueToNumber(balance.valueFormatted),
      };
      this.updateBalances([balanceFormatted]);
    },
  },
};
</script>

<style scoped></style>
