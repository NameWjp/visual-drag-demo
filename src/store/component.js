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
  deleteComponentById(state, id) {
    const index = state.componentList.findIndex(c => c.id === id);
    if (index !== -1) {
      state.componentList.splice(index, 1);
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
  setCurComponentStyle({ getters, commit }, style) {
    if (getters.curComponent) {
      const curComponent = { ...getters.curComponent };

      curComponent.style = {
        ...curComponent.style,
        ...style,
      };

      commit('changeComponent', {
        component: getters.curComponent,
        newComponent: curComponent,
      });
    }
  },
  lock({ getters, commit }) {
    const newComponent = { ...getters.curComponent, isLock: true };
    commit('changeComponent', {
      component: getters.curComponent,
      newComponent,
    });
  },
  unlock({ getters, commit }) {
    const newComponent = { ...getters.curComponent, isLock: false };
    commit('changeComponent', {
      component: getters.curComponent,
      newComponent,
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
