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
            id="account-name"
            v-model.trim="name"
            class="mb-2"
            name="Name"
            size="lg"
          />
          <FormInput
            id="account-institution"
            v-model.trim="institution"
            class="mb-2"
            name="Institution"
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
              v-slot="{ onConfirm }"
              class="ml-auto"
              ok-title="Delete"
              ok-variant="danger"
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
    id: {
      handler() {
        this.setInitialValues();
      },
      immediate: true,
    },
  },
  mounted() {},
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
      this.name = this.account?.name || "";
      this.institution = this.account?.institution || "";
    },
  },
};
</script>
