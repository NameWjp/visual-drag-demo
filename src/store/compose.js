import decomposeComponent from '@/utils/decomposeComponent';
import generateID from '@/utils/generateID';
import { commonStyle, commonAttr } from '@/store/component-list';
import eventEmitter from '@/utils/eventEmitter';
import createGroupStyle from '@/utils/createGroupStyle';

function getDefaultAreaData() {
  return {
    style: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
    components: [],
  };
}

const state = {
  areaData: getDefaultAreaData(),
};

const getters = {};

const mutations = {
  setAreaData(state, data) {
    state.areaData = data;
  },
};

const actions = {
  clearAreaData({ commit }) {
    commit('setAreaData', getDefaultAreaData());
  },
  compose({ state, commit, dispatch, rootState }) {
    const components = [];

    state.areaData.components.forEach(component => {
      if (component.component === 'group') {
        // 如果存在 group 组件，则提前拆分
        dispatch('decompose', component);
        components.push(...component.propValue);
      } else {
        components.push(component);
      }
    });

    // 删除原先的组件
    dispatch('batchDeleteComponent', components);
    const groupComponent = {
      id: generateID(),
      component: 'group',
      ...commonAttr,
      style: {
        ...commonStyle,
        ...state.areaData.style,
      },
      propValue: components,
    };
    // 生成子组件样式
    createGroupStyle(groupComponent);
    // 添加 group 组件
    commit('component/addComponent', { component: groupComponent }, { root: true });
    commit('component/setCurComponentIndex', rootState.component.componentList.length - 1, { root: true });
    eventEmitter.emit('hideArea');
  },
  decompose({ commit, rootState, rootGetters }, component) {
    component = component || rootGetters['component/curComponent'];
    if (!component || component.component !== 'group') return;

    const parentStyle = { ...component.style };
    const subComponents = component.propValue;
    const editorRect = rootState.canvas.canvasEl.getBoundingClientRect();

    subComponents.forEach(component => {
      // 还原子组件样式
      decomposeComponent(component, editorRect, parentStyle);
      commit('component/addComponent', { component }, { root: true });
    });

    commit('component/deleteComponentById', component.id, { root: true });
    commit('component/setCurComponentIndex', null, { root: true });
  },
  // 将已经放入 group 组件的数据删除
  batchDeleteComponent({ commit }, deleteComponents) {
    deleteComponents.forEach(component => {
      commit('component/deleteComponentById', component.id, { root: true });
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
