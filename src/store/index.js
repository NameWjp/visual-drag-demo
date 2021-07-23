import { createStore } from 'vuex';
import component from './component';
import canvas from './canvas';
import drag from './drag';

export default createStore({
  modules: {
    component,
    canvas,
    drag,
  },
});
