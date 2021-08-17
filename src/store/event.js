const state = {};

const getters = {};

const mutations = {};

const actions = {
  addEvent({ commit, rootGetters }, { event, param }) {
    const component = rootGetters['component/curComponent'];
    const events = { ...component.events };
    events[event] = param;
    commit('component/changeComponent', {
      component,
      newComponent: { ...component, events },
    }, { root: true });
  },
  removeEvent({ commit, rootGetters }, event) {
    const component = rootGetters['component/curComponent'];
    const events = { ...component.events };
    delete events[event];
    commit('component/changeComponent', {
      component,
      newComponent: { ...component, events },
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
