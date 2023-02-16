<template>
  <div class="pt-3">
    <h1 class="h4 mb-1">{{ id ? "Edit" : "New" }} Account</h1>
    <p class="h5 font-weight-normal mb-3 text-capitalize text-muted">
      {{ $route.params.category }}
    </p>
    <validation-observer v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(handleSave)">
        <b-card footer-class="d-flex" style="max-width: 28em">
          <FormInput
            class="mb-2"
            id="account-name"
            name="Name"
            size="lg"
            v-model.trim="name"
          />
          <FormInput
            class="mb-2"
            id="account-institution"
            name="Institution"
            v-model.trim="institution"
          />
          <template #footer>
            <b-button class="px-4" type="submit" variant="success">
              Save
            </b-button>
            <b-button
              class="ml-2 px-5"
              :to="id ? `/accounts/${id}` : '/'"
              variant="secondary"
            >
              Cancel
            </b-button>
            <ConfirmAction
              v-if="id"
              class="ml-auto"
              ok-title="Delete"
              ok-variant="danger"
              v-slot="{ onConfirm }"
            >
              <b-button
                v-b-tooltip.left="'Delete…'"
                class="px-2"
                variant="outline-danger"
                @click="onConfirm(handleDelete)"
              >
                <span class="sr-only">Delete</span>
                <BIconTrash shift-v="-1" />
              </b-button>
            </ConfirmAction>
          </template>
        </b-card>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { BIconTrash } from "bootstrap-vue";
import { ValidationObserver } from "vee-validate";
import { call, get } from "vuex-pathify";
import ConfirmAction from "@/components/ConfirmAction";
import FormInput from "@/components/FormInput.vue";

export default {
  name: "AccountEdit",
  components: { BIconTrash, ConfirmAction, FormInput, ValidationObserver },
  props: {},
  data() {
    return {
      institution: "",
      name: "",
    };
  },
  mounted() {
    this.setInitialValues();
  },
  computed: {
    ...get("accounts", ["accountsById"]),
    account() {
      return this.accountsById[this.id];
    },
    id() {
      return Number(this.$route.params.id);
    },
    type() {
      return this.account
        ? this.account.type
        : this.$route.params.category.toUpperCase();
    },
  },
  watch: {
    account(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.setInitialValues();
      }
    },
  },
  methods: {
    addAccount: call("accounts/addAccount"),
    deleteAccount: call("accounts/deleteAccount"),
    updateAccount: call("accounts/updateAccount"),
    async handleDelete() {
      await this.deleteAccount(this.id);
      this.$router.push("/");
    },
    async handleSave() {
      if (this.id) {
        await this.updateAccount({
          id: Number(this.id),
          name: this.name,
          institution: this.institution,
          type: this.type,
        });
        this.$router.push("./");
      } else {
        const accountId = await this.addAccount({
          name: this.name,
          institution: this.institution,
          type: this.type,
        });
        this.$router.push(`../${accountId}`);
      }
    },
    setInitialValues() {
      if (!this.account) return;
      this.name = this.account.name;
      this.institution = this.account.institution;
    },
  },
};
</script>
