<template>
  <b-list-group-item :class="isTarget ? 'is-target' : ''">
    <validation-observer v-slot="{ valid }">
      <b-form-row ref="balanceContainer">
        <b-col cols="3">
          {{ balance.account.name }}
          <span class="d-block small">
            {{ balance.account.institution }}
          </span>
        </b-col>
        <b-col cols="7">
          <FormInput
            :id="`balance-${balance.id}`"
            v-model="balance.valueFormatted"
            :name="balance.account.name"
            :label-sr-only="true"
            prepend="$"
            :rules="{ number: true }"
            size="lg"
            trim
            @blur="handleBlur(valid)"
          />
        </b-col>
        <b-col cols="2">
          <b-button
            v-if="showCarryForward"
            v-b-tooltip.top="
              `Carry Forward: $${balance.valuePreviousFormatted}`
            "
            class="px-2"
            size="lg"
            variant="light"
            @click="handleCarryForward()"
          >
            <BIconClockHistory scale="0.7" shift-v="-1.5" />
            <span class="sr-only">
              {{ balance.valuePreviousFormatted }}
            </span>
          </b-button>
        </b-col>
      </b-form-row>
    </validation-observer>
  </b-list-group-item>
</template>

<script>
import { BIconClockHistory } from "bootstrap-vue";
import { ValidationObserver } from "vee-validate";
import { call } from "vuex-pathify";
import FormInput from "@/components/FormInput.vue";
import { valueToNumber } from "@/utilities/currency";

export default {
  name: "LedgerBalance",
  components: { BIconClockHistory, FormInput, ValidationObserver },
  props: {
    balance: { required: true, type: Object },
  },
  data() {
    return {
      isTarget: false,
    };
  },
  computed: {
    showCarryForward() {
      const hasBalance = this.balance.value;
      const hasPreviousBalance = ![undefined, 0].includes(
        this.balance.valuePrevious
      );
      return !hasBalance && hasPreviousBalance;
    },
  },
  watch: {},
  mounted() {
    const accountId = this.balance.account.id;
    const targetId = this.$route.query.accountId;
    if (accountId !== targetId) return;
    const element = this.$refs.balanceContainer;
    element.scrollIntoView({ block: "center", behavior: "smooth" });
    this.isTarget = true;
    this.$router.replace({
      query: {},
    });
  },
  methods: {
    ...call("entries", ["updateBalances"]),
    handleBlur(isValid) {
      if (!isValid) return;
      const balanceFormatted = {
        account: this.balance.account.id,
        id: this.balance.id,
        value: valueToNumber(this.balance.valueFormatted),
      };
      this.updateBalances([balanceFormatted]);
    },
    handleCarryForward() {
      const balanceFormatted = {
        account: this.balance.account.id,
        id: this.balance.id,
        value: this.balance.valuePrevious,
      };
      this.updateBalances([balanceFormatted]);
    },
  },
};
</script>

<style scoped>
@keyframes intro {
  33% {
    background-color: var(--secondary);
    transform: scale(1.01);
  }
}
.is-target {
  animation: intro 2s 0.25s;
}
</style>
