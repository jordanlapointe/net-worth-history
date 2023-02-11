import { make } from "vuex-pathify";
import { TYPE_ASSET, TYPE_LIABILITY } from "@/constants/account";
import { sortByProperties } from "@/utilities/arrays";
import {
  validateAccount,
  validateAccountWithoutId,
} from "@/utilities/validation";
import database from "./database";

const state = {
  data: [],
};

const getters = {
  ...make.getters(state),
  // getterName(state, getters, rootGetters) {
  //   return 'value';
  // },
  accounts({ data: accounts }) {
    const value = sortByProperties(accounts, ["institution", "name"]);
    return value;
  },
  accountsById({ data: accounts }) {
    const value = accounts.reduce((accumulator, account) => {
      accumulator[account.id] = account;
      return accumulator;
    }, {});
    return value;
  },
  accountIds(state, { accounts }) {
    return accounts.map(({ id }) => id);
  },
  accountsByType(state, { accounts }) {
    return accounts.reduce(
      (accumulator, account) => {
        const category = accumulator[account.type];
        category.push(account);
        return accumulator;
      },
      {
        [TYPE_ASSET]: [],
        [TYPE_LIABILITY]: [],
      }
    );
  },
  accountsOnlyAssets(state, { accountsByType }) {
    return accountsByType[TYPE_ASSET];
  },
  accountsOnlyLiabilities(state, { accountsByType }) {
    return accountsByType[TYPE_LIABILITY];
  },
};

const mutations = {
  ...make.mutations(state),
  setAccounts(state, accounts) {
    state.data = accounts;
  },
};

const actions = {
  ...make.actions(state),
  async fetchAccounts({ commit }) {
    const accountsData = await database.accounts.toArray();
    commit("setAccounts", accountsData);
  },
  async addAccount({ dispatch }, account) {
    const isValid = validateAccountWithoutId(account);
    if (!isValid) return;
    const accountId = await database.accounts.add({
      institution: account.institution,
      name: account.name,
      type: account.type,
    });
    await dispatch("fetchAccounts");
    return accountId;
  },
  async updateAccount({ dispatch }, account) {
    const isValid = validateAccount(account);
    if (!isValid) return;
    await database.accounts.put({
      id: account.id,
      institution: account.institution,
      name: account.name,
      type: account.type,
    });
    await dispatch("fetchAccounts");
  },
  async deleteAccount({ dispatch }, accountId) {
    if (typeof accountId !== "number") {
      throw new Error(`"id" must be type "number"`);
    }
    const balances = await database.balances
      .where("account")
      .equals(accountId)
      .toArray();
    const balanceIds = balances.map(({ id }) => id);
    await database.entries.toCollection().modify((value) => {
      value.balances = value.balances.filter((id) => !balanceIds.includes(id));
    });
    await database.balances.bulkDelete(balanceIds, {
      allKeys: true,
    });
    await database.accounts.delete(accountId);
    await dispatch("fetchAccounts");
    await dispatch("entries/fetchEntries", null, { root: true });
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
