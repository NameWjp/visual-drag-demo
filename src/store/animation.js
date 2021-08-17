const state = {};

const getters = {};

const mutations = {};

const actions = {
  addAnimation({ commit, rootGetters }, animation) {
    const component = rootGetters['component/curComponent'];
    const animations = [...component.animations];
    animations.push(animation);
    commit('component/changeComponent', {
      component,
      newComponent: { ...component, animations },
    }, { root: true });
  },
  removeAnimation({ commit, rootGetters }, index) {
    const component = rootGetters['component/curComponent'];
    const animations = [...component.animations];
    animations.splice(index, 1);
    commit('component/changeComponent', {
      component,
      newComponent: { ...component, animations },
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
