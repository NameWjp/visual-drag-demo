const state = {
  dragElement: null,
};

const getters = {};

const mutations = {
  setDragElement(state, element) {
    state.dragElement = element;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
