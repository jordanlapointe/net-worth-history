<template>
  <validation-observer ref="validationObserver">
    <b-list-group v-if="balancesFiltered.length > 0">
      <b-list-group-item v-for="balance in balancesFiltered" :key="balance.id">
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
              v-model="balance.valueFormatted"
              :name="balance.account.name"
              :label-sr-only="true"
              prepend="$"
              :rules="{ number: true }"
              size="lg"
              trim
              @blur="handleBlur(balance)"
            />
          </b-col>
        </b-form-row>
      </b-list-group-item>
    </b-list-group>
    <b-card v-else-if="accountFilter" class="lead text-center">
      No accounts match the filter “{{ accountFilter }}”
    </b-card>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from "vee-validate";
import { call, get } from "vuex-pathify";
import FormInput from "@/components/FormInput.vue";
import { valueToNumber } from "@/utilities/currency";

export default {
  name: "LedgerBalances",
  components: { FormInput, ValidationObserver },
  props: {
    balances: { default: () => [], type: Array },
  },
  data() {
    return {};
  },
  computed: {
    ...get("ui", ["accountFilter"]),
    balancesFiltered() {
      const filterLowerCase = this.accountFilter.toLowerCase();
      return this.balances.filter(({ account }) => {
        const { name, institution } = account;
        const accountText = `${institution} ${name}`.toLowerCase();
        return accountText.includes(filterLowerCase);
      });
    },
  },
  watch: {},
  mounted() {},
  methods: {
    ...call("entries", ["updateBalances"]),
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
