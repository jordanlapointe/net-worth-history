<template>
  <div>
    <div class="align-items-baseline border-bottom d-flex mb-1 mt-4 mx-3 pb-1">
      <h2 class="h5 mb-0 text-capitalize">{{ categoryPlural }}</h2>
      <p
        class="h6 mb-0 ml-auto"
        :data-testid="`NavAccountList-${categoryName}Total`"
      >
        ${{ total | currencyShort }}
      </p>
    </div>
    <b-nav pills vertical>
      <template v-if="accountsFiltered.length > 0">
        <b-nav-item
          v-for="account in accountsFiltered"
          :key="account.id"
          :data-testid="`NavAccountList-${categoryName}-${account.id}`"
          :to="`/accounts/${account.id}`"
        >
          <div class="align-items-baseline d-flex">
            <div class="mr-5">
              {{ account.name }}
            </div>
            <div class="ml-auto">
              ${{ mostRecentBalancesByAccountId[account.id] | currencyShort }}
            </div>
          </div>
          <div class="pr-5 small">
            {{ account.institution }}
          </div>
        </b-nav-item>
      </template>
      <p v-else-if="accountFilter" class="mb-0 px-3 text-muted">
        No {{ categoryPlural }} match the filter “{{ accountFilter }}”
      </p>
      <b-nav-item :to="`/accounts/add/${categoryName}`">
        Add <span class="text-capitalize">{{ categoryName }}</span>
        <BIconPlus
          aria-hidden="true"
          class="float-right"
          scale="1.4"
          shift-v="-1"
        />
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
import { BIconPlus } from "bootstrap-vue";
import { get } from "vuex-pathify";

const categoryToPluralMap = {
  asset: "assets",
  liability: "liabilities",
};

export default {
  name: "NavAccountList",
  components: { BIconPlus },
  props: {
    accounts: { required: true, type: Array },
    categoryName: { required: true, type: String },
    total: { required: true, type: Number },
  },
  data() {
    return {};
  },
  computed: {
    ...get("entries", ["mostRecentBalancesByAccountId"]),
    ...get("ui", ["accountFilter"]),
    activeId() {
      return Number(this.$route.params.id);
    },
    categoryPlural() {
      return categoryToPluralMap[this.categoryName];
    },
    accountsFiltered() {
      const filterLowerCase = this.accountFilter.toLowerCase();
      return this.accounts.filter(({ name, institution }) => {
        const accountText = `${institution} ${name}`.toLowerCase();
        return accountText.includes(filterLowerCase);
      });
    },
  },
  watch: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped></style>
