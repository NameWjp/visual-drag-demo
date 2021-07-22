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
    console.log(state.componentList);
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

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
