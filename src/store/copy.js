import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import generateID from '@/utils/generateID';

let pasteCount = 0;

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
    pasteCount = 0;
  },
  paste({ state, commit }, position) {
    if (!state.copyData) {
      ElMessage.error('请先复制或剪切组件');
      return;
    }

    const data = cloneDeep(state.copyData);
    data.id = generateID();
    if (data.component === 'group') {
      data.propValue.forEach(component => {
        component.id = generateID();
      });
    }

    if (position) {
      data.style.left = position.left;
      data.style.top = position.top;
    } else {
      data.style.left += (pasteCount + 1) * 10;
      data.style.top += (pasteCount + 1) * 10;
    }

    commit('component/addComponent', {
      component: data,
    }, { root: true });
    pasteCount += 1;
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
