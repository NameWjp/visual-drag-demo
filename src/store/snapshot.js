import { cloneDeep } from 'lodash-es';
import eventEmitter from '@/utils/eventEmitter';

const state = {
  snapshotList: [],
  snapshotIndex: -1,
};

const getters = {};

const mutations = {
  setSnapshotList(state, list) {
    state.snapshotList = list;
  },
  setSnapshotIndex(state, index) {
    state.snapshotIndex = index;
  },
};

const actions = {
  recordSnapshot({ state, commit, rootState }) {
    // 添加新的快照
    let snapshotList = [...state.snapshotList];
    const snapshotIndex = state.snapshotIndex + 1;
    snapshotList[snapshotIndex] = cloneDeep(rootState.component.componentList);
    // 在撤销的状态下添加新的快照，要将之前快照清除掉
    if (snapshotIndex < snapshotList.length - 1) {
      snapshotList = snapshotList.slice(0, snapshotIndex + 1);
    }

    commit('setSnapshotList', snapshotList);
    commit('setSnapshotIndex', snapshotIndex);
  },
  redo({ state, commit }) {
    const snapshotList = state.snapshotList;
    let snapshotIndex = state.snapshotIndex;
    if (snapshotIndex < snapshotList.length - 1) {
      snapshotIndex += 1;
      commit('setSnapshotIndex', snapshotIndex);
      // 注意这里也需要深拷贝，否则当前的修改会影响之前的记录
      commit('component/setComponentList', cloneDeep(snapshotList[snapshotIndex]), { root: true });
      commit('component/setCurComponentIndex', null, { root: true });
      eventEmitter.emit('hideArea');
      eventEmitter.emit('hideContextMenu');
    }
  },
  undo({ state, commit }) {
    const snapshotList = state.snapshotList;
    let snapshotIndex = state.snapshotIndex;
    if (snapshotIndex >= 0) {
      snapshotIndex -= 1;
      commit('setSnapshotIndex', snapshotIndex);
      commit('component/setComponentList', cloneDeep(snapshotList[snapshotIndex] || []), { root: true });
      commit('component/setCurComponentIndex', null, { root: true });
      eventEmitter.emit('hideArea');
      eventEmitter.emit('hideContextMenu');
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
