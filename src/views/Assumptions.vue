<template>
  <b-form class="pt-3" @submit.stop.prevent="handleSubmit">
    <b-link class="h5" to="./">Settings</b-link>
    <BIconSlashLg rotate="-20" variant="secondary" />
    <h1 class="h3 mb-3">Forecast Assumptions</h1>
    <b-card style="width: 420px">
      <FormInput
        id="yearly-contribution"
        v-model="contribution"
        class="mb-4"
        name="Yearly Contribution"
        prepend="$"
        :rules="{ number: true, required: true }"
        size="lg"
        trim
      />
      <FormInput
        id="high-growth"
        v-model="growthHigh"
        append="%"
        class="mb-2"
        group-style="max-width: 14em"
        name="High Growth (Optimistic)"
        :rules="{ number: true, required: true }"
        trim
      />
      <FormInput
        id="low-growth"
        v-model="growthLow"
        append="%"
        class="mb-3"
        group-style="max-width: 10em"
        name="Low Growth (Pessimistic)"
        :rules="{ number: true, required: true }"
        trim
      />
      <template #footer>
        <b-button class="px-4" type="submit" variant="success"> Save </b-button>
        <b-button
          class="ml-2 px-5"
          to="/settings"
          type="button"
          variant="secondary"
        >
          Cancel
        </b-button>
      </template>
    </b-card>
  </b-form>
</template>

<script>
import FormInput from "@/components/FormInput.vue";
import { call, get } from "vuex-pathify";
import { valueToDollarsFormatted, valueToNumber } from "@/utilities/currency";
import { BIconSlashLg } from "bootstrap-vue";

export default {
  name: "Assumptions",
  components: { FormInput, BIconSlashLg },
  props: {},
  data() {
    return {
      contribution: "0",
      growthLow: "0",
      growthHigh: "0",
    };
  },
  computed: {
    ...get("profiles", ["defaultProfile"]),
  },
  watch: {
    defaultProfile: {
      handler(newValue) {
        const { contribution, growthLow, growthHigh } = newValue;
        this.contribution = valueToDollarsFormatted(contribution);
        this.growthLow = String(growthLow);
        this.growthHigh = String(growthHigh);
      },
      immediate: true,
    },
  },
  methods: {
    updateDefaultProfile: call("profiles/updateDefaultProfile"),
    async handleSubmit() {
      await this.updateDefaultProfile({
        contribution: valueToNumber(this.contribution),
        growthLow: valueToNumber(this.growthLow),
        growthHigh: valueToNumber(this.growthHigh),
      });
      this.$router.push("./");
    },
  },
};
</script>
