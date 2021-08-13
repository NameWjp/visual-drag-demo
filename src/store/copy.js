import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import generateID from '@/utils/generateID';

const state = {
  copyData: null,
};

const getters = {};

const mutations = {
  setCopyData(state, data) {
    state.copyData = data;
  },
};

const actions = {
  copy({ commit, rootGetters }) {
    const component = rootGetters['component/curComponent'];
    if (!component) return;

    commit('setCopyData', component);
  },
  paste({ state, commit }, position) {
    if (!state.copyData) {
      ElMessage.error('请先复制或剪切组件');
      return;
    }

    const data = cloneDeep(state.copyData);
    data.id = generateID();
    if (position) {
      data.style.left = position.left;
      data.style.top = position.top;
    } else {
      data.style.left += 10;
      data.style.top += 10;
    }

    commit('component/addComponent', {
      component: data,
    }, { root: true });
  },
  cut({ dispatch }) {
    dispatch('copy');
    dispatch('component/deleteCurComponent', null, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
