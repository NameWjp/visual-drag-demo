import { swap } from '@/utils/util';
import { ElMessage } from 'element-plus';

const state = {};

const getters = {};

const mutations = {};

const actions = {
  upComponent({ commit, rootState }) {
    const componentList = rootState.component.componentList;
    const curComponentIndex = rootState.component.curComponentIndex;
    if (curComponentIndex < componentList.length - 1) {
      const newComponentList = swap(componentList, curComponentIndex, curComponentIndex + 1);
      commit('component/setComponentList', newComponentList, { root: true });
      commit('component/setCurComponentIndex', curComponentIndex + 1, { root: true });
    } else {
      ElMessage.error('已经到顶了');
    }
  },
  downComponent({ commit, rootState }) {
    const componentList = rootState.component.componentList;
    const curComponentIndex = rootState.component.curComponentIndex;
    if (curComponentIndex > 0) {
      const newComponentList = swap(componentList, curComponentIndex, curComponentIndex - 1);
      commit('component/setComponentList', newComponentList, { root: true });
      commit('component/setCurComponentIndex', curComponentIndex - 1, { root: true });
    } else {
      ElMessage.error('已经到底了');
    }
  },
  topComponent({ commit, rootState }) {
    const componentList = rootState.component.componentList;
    const curComponentIndex = rootState.component.curComponentIndex;
    if (curComponentIndex < componentList.length - 1) {
      const newComponentList = [...componentList];
      const [item] = newComponentList.splice(curComponentIndex, 1);
      newComponentList.push(item);
      commit('component/setComponentList', newComponentList, { root: true });
      commit('component/setCurComponentIndex', componentList.length - 1, { root: true });
    } else {
      ElMessage.error('已经到顶了');
    }
  },
  bottomComponent({ commit, rootState }) {
    const componentList = rootState.component.componentList;
    const curComponentIndex = rootState.component.curComponentIndex;
    if (curComponentIndex > 0) {
      const newComponentList = [...componentList];
      const [item] = newComponentList.splice(curComponentIndex, 1);
      newComponentList.unshift(item);
      commit('component/setComponentList', newComponentList, { root: true });
      commit('component/setCurComponentIndex', 0, { root: true });
    } else {
      ElMessage.error('已经到底了');
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
