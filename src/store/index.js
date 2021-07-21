import { createStore } from 'vuex';
import component from './component';
import canvas from './canvas';

export default createStore({
  modules: {
    component,
    canvas,
  },
});
