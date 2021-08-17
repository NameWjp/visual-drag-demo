const state = {
  canvasStyle: { // 画布样式
    width: 1200,
    height: 740,
    scale: 100,
  },
  canvasEl: null,
  canvasMode: 'edit', // 编辑器模式 edit 和 preview 两种
};

const getters = {};

const mutations = {
  setCanvasStyle(state, style) {
    state.canvasStyle = style;
  },
  setCanvasEl(state, el) {
    state.canvasEl = el;
  },
  setCanvasMode(state, mode) {
    state.canvasMode = mode;
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
