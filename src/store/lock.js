const state = {};

const getters = {};

const mutations = {};

const actions = {
  lock({ rootGetters, commit }) {
    const component = rootGetters['component/curComponent'];
    if (component.isLock) return;
    const newComponent = { ...component, isLock: true };
    commit('component/changeComponent', {
      component,
      newComponent,
    }, { root: true });
  },
  unlock({ rootGetters, commit }) {
    const component = rootGetters['component/curComponent'];
    if (!component.isLock) return;
    const newComponent = { ...component, isLock: false };
    commit('component/changeComponent', {
      component,
      newComponent,
    }, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
