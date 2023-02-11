import { make } from "vuex-pathify";
import { validateProfile } from "@/utilities/validation";
import database from "./database";

const defaultProfileId = 1;

const state = {
  data: [],
};

const getters = {
  ...make.getters(state),
  // getterName(state, getters, rootGetters) {
  //   return 'value';
  // },
  defaultProfile({ data: profiles }) {
    return profiles.find(({ id }) => id === defaultProfileId);
  },
};

const mutations = {
  ...make.mutations(state),
  setProfiles(state, profiles) {
    state.data = profiles;
  },
};

const actions = {
  ...make.actions(state),
  async fetchProfiles({ commit }) {
    const profilesData = await database.profiles.toArray();
    commit("setProfiles", profilesData);
  },
  async updateDefaultProfile({ dispatch }, profile) {
    const isValid = validateProfile(profile);
    if (!isValid) return;
    await database.profiles.put({
      id: defaultProfileId,
      contribution: profile.contribution,
      growthHigh: profile.growthHigh,
      growthLow: profile.growthLow,
    });
    await dispatch("fetchProfiles");
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
