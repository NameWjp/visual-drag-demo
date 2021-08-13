import { createStore } from 'vuex';
import component from './component';
import canvas from './canvas';
import drag from './drag';
import compose from './compose';
import snapshot from './snapshot';
import lock from './lock';
import copy from './copy';
import layer from './layer';

export default createStore({
  modules: {
    component,
    canvas,
    drag,
    compose,
    snapshot,
    lock,
    copy,
    layer,
  },
});
