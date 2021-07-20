import { isDef } from '@/utils/util';
import { createStore } from 'vuex';

export default createStore({
  state: {
    componentData: [],
    curComponentIndex: null,
  },
  getters: {
    curComponent: state => {
      if (isDef(state.curComponentIndex)) {
        return state.componentData[state.curComponentIndex];
      }
      return null;
    },
  },
  mutations: {
    addComponent(state, { component, index }) {
      if (isDef(index)) {
        state.componentData.split(index, 0, component);
      } else {
        state.componentData.push(component);
      }
    },
  },
  actions: {
  },
  modules: {
  },
});
