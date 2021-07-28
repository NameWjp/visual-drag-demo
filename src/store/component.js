import { isDef } from '@/utils/util';

const state = {
  componentList: [], // 组件数据
  curComponentIndex: null, // 当前组件
};

const getters = {
  curComponent: state => {
    if (isDef(state.curComponentIndex)) {
      return state.componentList[state.curComponentIndex];
    }
    return null;
  },
};

const mutations = {
  setComponentList(state, list) {
    state.componentList = list;
  },
  setCurComponentIndex(state, index) {
    state.curComponentIndex = index;
  },
  addComponent(state, { component, index }) {
    if (isDef(index)) {
      state.componentList.splice(index, 0, component);
    } else {
      state.componentList.push(component);
    }
  },
  changeComponent(state, { component, newComponent }) {
    const index = state.componentList.findIndex(c => c === component);
    if (index !== -1) {
      state.componentList.splice(index, 1, newComponent);
    }
  },
};

const actions = {
  setCurComponentStyle({ getters, commit }, {
    top, left, width, height, rotate,
  }) {
    if (getters.curComponent) {
      const curComponent = { ...getters.curComponent };

      if (top) curComponent.style.top = top;
      if (left) curComponent.style.left = left;
      if (width) curComponent.style.width = width;
      if (height) curComponent.style.height = height;
      if (rotate) curComponent.style.rotate = rotate;

      commit('changeComponent', {
        component: getters.curComponent,
        newComponent: curComponent,
      });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
