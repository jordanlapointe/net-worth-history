import { make } from "vuex-pathify";

const state = {
  redo: [],
  undo: [],
};

const getters = {
  ...make.getters(state),
  // getterName(state, getters, rootGetters) {
  //   return 'value';
  // },
};

const mutations = {
  ...make.mutations(state),
  addChange(state, change) {
    state.redo = [];
    state.undo.push(change);
  },
  goBackwards(state) {
    const change = state.undo.pop();
    state.redo = [change, ...state.redo];
  },
  goForwards(state) {
    const change = state.redo.shift();
    state.undo.push(change);
  },
};

const actions = {
  ...make.actions(state),
  redo({ commit, state }) {
    const hasRedos = state.redo.length > 0;
    if (!hasRedos) {
      return;
    }
    const change = state.redo.at(0);
    const { handler, to } = change;
    handler(to);
    commit("goForwards");
  },
  rememberChange({ commit, rootState }, change) {
    const { handler, to } = change;
    handler(to);
    commit("addChange", change);
  },
  undo({ commit, state }) {
    const hasUndos = state.undo.length > 0;
    if (!hasUndos) {
      return;
    }
    const change = state.undo.at(-1);
    const { handler, from } = change;
    handler(from);
    commit("goBackwards");
  },
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state,
};
