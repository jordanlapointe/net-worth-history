<template>
  <div>
    <validation-provider
      v-slot="validationContext"
      :name="name"
      :rules="rules"
      :vid="id"
    >
      <b-form-group
        class="mb-0 w-100"
        :label="name"
        label-class="mb-1 w-auto"
        :label-for="`input-${id}`"
        :label-sr-only="labelSrOnly"
      >
        <b-input-group :append="append" :prepend="prepend" :style="groupStyle">
          <b-form-input
            v-on="$listeners"
            aria-describedby="`input-feedback-${id}`"
            :id="`input-${id}`"
            :size="size"
            :state="getValidationState(validationContext)"
            :trim="trim"
            :value="value"
            @input="handleChange"
          />
        </b-input-group>
        <b-form-invalid-feedback
          :id="`input-feedback-${id}`"
          :state="getValidationState(validationContext)"
        >
          {{ validationContext.errors[0] }}
        </b-form-invalid-feedback>
      </b-form-group>
    </validation-provider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "FormInput",
  components: { ValidationProvider },
  props: {
    append: String,
    id: { required: true, type: String },
    groupStyle: { type: String },
    name: { required: true, type: String },
    rules: { default: () => ({ required: true }), type: Object },
    labelSrOnly: { default: false, type: Boolean },
    prepend: String,
    size: { default: "md", type: String },
    trim: { default: false, type: Boolean },
    value: { required: true, type: String },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      if ((dirty || validated) && !valid) {
        return false;
      }
      return null;
    },
    handleChange(value) {
      this.$emit("input", value);
    },
  },
};
</script>
