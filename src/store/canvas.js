const state = {
  canvasStyle: { // 画布样式
    width: 1200,
    height: 740,
    scale: 100,
  },
};

const getters = {};

const mutations = {
  setCanvasStyle(state, style) {
    state.canvasStyle = style;
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
