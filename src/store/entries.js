import { make } from "vuex-pathify";
import { valueToDollarsFormatted, valueToNumber } from "@/utilities/currency";
import { addMonthsIso } from "@/utilities/dates";
import { validateBalance, validateDate } from "@/utilities/validation";
import database from "./database";

const accountTypeMap = {
  ASSET: "assets",
  LIABILITY: "liabilities",
};

const state = {
  data: [],
  initialLoad: false,
};

const getters = {
  ...make.getters(state),
  // getterName(state, getters, rootGetters) {
  //   return 'value';
  // },
  balancesByAccountId(state, { entriesByDate, entryDates }, { accounts }) {
    const { data: accountData } = accounts;
    return entryDates.reduce((accumulator, date) => {
      const { balances } = entriesByDate[date];
      const balancesById = balances.reduce((accumulator, balance) => {
        accumulator[balance.account.id] = balance;
        return accumulator;
      }, {});
      accountData.forEach(({ id }) => {
        const balance = balancesById[id];
        if (!accumulator[id]) accumulator[id] = [];
        accumulator[id].push(balance?.value);
      });
      return accumulator;
    }, {});
  },
  entriesByDate({ data: entries }) {
    const value = entries.reduce((accumulator, entry) => {
      accumulator[entry.date] = entry;
      return accumulator;
    }, {});
    return value;
  },
  entriesMeta({ data: entries }) {
    const metadata = {};
    entries.forEach((entry) => {
      const balances = Object.values(entry.balances);
      const entryMeta = balances.reduce(
        (accumulator, balance) => {
          const type = accountTypeMap[balance.account.type];
          const polarity = type === "liabilities" ? -1 : 1;
          accumulator[type][balance.account.id] = balance;
          accumulator[`${type}Total`] += balance.value;
          accumulator.netTotal += balance.value * polarity;
          return accumulator;
        },
        {
          assets: {},
          assetsTotal: 0,
          liabilities: {},
          liabilitiesTotal: 0,
          netTotal: 0,
        }
      );
      metadata[entry.date] = {
        ...entry,
        ...entryMeta,
      };
    });
    return metadata;
  },
  entryDates({ data: entries }) {
    return entries.map(({ date }) => date).sort();
  },
  assetTotals(state, { entriesMeta }) {
    const list = Object.values(entriesMeta);
    return list.map(({ assetsTotal }) => assetsTotal);
  },
  futureDates(state, { mostRecentEntry }) {
    return Array.from({ length: 120 }, (_, i) => i + 1).map((i) =>
      addMonthsIso(mostRecentEntry.date, i)
    );
  },
  futureTotals(state, { mostRecentEntry }, { profiles }) {
    const { netTotal } = mostRecentEntry;
    const profile = profiles.data[0];
    const initialValue = {
      low: [netTotal],
      middle: [netTotal],
      high: [netTotal],
    };
    if (!profile) return initialValue;
    const { contribution, growthLow, growthHigh } = profile;
    const contributionMonthly = contribution / 12;
    const monthlyGrowthLow = 1 + growthLow / 100 / 12;
    const monthlyGrowthHigh = 1 + growthHigh / 100 / 12;
    return Array.from({ length: 120 }, (_, i) => i + 1).reduce(
      (accumulator, _, index) => {
        const valueLow =
          accumulator.low[index] * monthlyGrowthLow + contributionMonthly;
        const valueHigh =
          accumulator.high[index] * monthlyGrowthHigh + contributionMonthly;
        const valueMiddle = (valueLow + valueHigh) / 2;
        accumulator.low.push(valueLow);
        accumulator.middle.push(valueMiddle);
        accumulator.high.push(valueHigh);
        return accumulator;
      },
      initialValue
    );
  },
  liabilityTotals(state, { entriesMeta }) {
    const list = Object.values(entriesMeta);
    return list.map(({ liabilitiesTotal }) => liabilitiesTotal);
  },
  netTotals(state, { entriesMeta }) {
    const list = Object.values(entriesMeta);
    return list.map(({ netTotal }) => netTotal);
  },
  mostRecentDate(state, { entryDates }) {
    const lastIndex = entryDates.length - 1;
    return entryDates[lastIndex];
  },
  mostRecentEntry(state, { entriesMeta, mostRecentDate }) {
    return entriesMeta[mostRecentDate];
  },
  mostRecentAssetsTotal(state, { mostRecentEntry }) {
    return mostRecentEntry?.assetsTotal;
  },
  mostRecentLiabilitiesTotal(state, { mostRecentEntry }) {
    return mostRecentEntry?.liabilitiesTotal;
  },
  mostRecentNetTotal(state, { mostRecentEntry }) {
    return mostRecentEntry?.netTotal;
  },
  mostRecentBalancesByAccountId(state, { mostRecentEntry }) {
    const balances = mostRecentEntry?.balances || [];
    return balances.reduce((accumulator, balance) => {
      accumulator[balance.account.id] = balance.value;
      return accumulator;
    }, {});
  },
};

const mutations = {
  ...make.mutations(state),
  setEntries(state, entries) {
    state.data = entries.map((entry, index) => {
      const previousEntry = entries[index - 1];
      return {
        ...entry,
        balances: entry.balances.map((balance) => {
          const previousBalance = previousEntry?.balances.find(
            ({ account }) => account.id === balance.account.id
          );
          const previousValue = previousBalance?.value;
          return {
            ...balance,
            value: valueToNumber(balance.value),
            valueFormatted: valueToDollarsFormatted(balance.value),
            valuePrevious: previousBalance
              ? valueToNumber(previousValue)
              : undefined,
            valuePreviousFormatted: previousBalance
              ? valueToDollarsFormatted(previousValue)
              : undefined,
          };
        }),
      };
    });
    if (!state.initialLoad) {
      state.initialLoad = true;
    }
  },
};

const actions = {
  ...make.actions(state),
  async createEntry({ dispatch, rootState }, date) {
    const isValid = validateDate(date);
    if (!isValid) return;
    const { data: accounts } = rootState.accounts;
    const newBalances = accounts.map((account) => ({
      account: account.id,
      value: 0,
    }));
    const newBalanceIds = await database.balances.bulkAdd(newBalances, {
      allKeys: true,
    });
    await database.entries.add({
      date,
      balances: newBalanceIds,
    });
    await dispatch("fetchEntries");
  },
  async deleteEntry({ dispatch }, date) {
    const isValid = validateDate(date);
    if (!isValid) {
      return;
    }
    const entry = await database.entries.get(date);
    await database.balances.bulkDelete(entry.balances);
    await database.entries.delete(date);
    await dispatch("fetchEntries");
  },
  async fetchEntries({ commit }) {
    const entriesData = await database.entries.populate().toArray();
    commit("setEntries", entriesData);
  },
  async updateBalances({ dispatch }, newBalances) {
    const isValid = newBalances.every(validateBalance);
    if (!isValid) {
      return;
    }
    const ids = newBalances.map(({ id }) => id);
    const oldBalances = await database.balances.bulkGet(ids);
    const change = {
      async handler(newValue) {
        await database.balances.bulkPut(newValue);
        await dispatch("fetchEntries");
      },
      from: oldBalances,
      to: newBalances,
    };
    dispatch("history/rememberChange", change, { root: true });
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
