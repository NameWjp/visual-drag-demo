import store from '@/store';
import eventEmitter from '@/utils/eventEmitter';

const vCode = 'KeyV'; // 粘贴
const cCode = 'KeyC'; // 复制
const xCode = 'KeyX'; // 剪切

const yCode = 'KeyY'; // 重做
const zCode = 'KeyZ'; // 撤销

const gCode = 'KeyG'; // 组合
const bCode = 'KeyB'; // 拆分

const lCode = 'KeyL'; // 锁定
const uCode = 'KeyU'; // 解锁

const sCode = 'KeyS'; // 保存
const pCode = 'KeyP'; // 预览
const dCode = 'KeyD'; // 删除
const deleteCode = 'Delete'; // 删除
const eCode = 'KeyE'; // 清空画布

export const ctrlCode = ['ControlLeft', 'ControlRight'];
export const listenCodes = [
  vCode, cCode, xCode, yCode, zCode, gCode, bCode, lCode, uCode,
  sCode, pCode, dCode, deleteCode, eCode,
];

// 下面的函数不需要选择组件即可执行
function paste() {
  store.dispatch('copy/paste');
  store.dispatch('snapshot/recordSnapshot');
}
function redo() {
  store.dispatch('snapshot/redo');
}
function undo() {
  store.dispatch('snapshot/undo');
}
function save() {
  eventEmitter.emit('save');
}
function preview() {
  // todo preview
}
function clearComponents() {
  store.commit('component/setComponentList', []);
  store.dispatch('snapshot/recordSnapshot');
}

// 下面的函数都需要选择组件才能执行
function unlock() {
  store.dispatch('lock/unlock');
  store.dispatch('snapshot/recordSnapshot');
}
function copy() {
  store.dispatch('copy/copy');
}
function cut() {
  store.dispatch('copy/cut');
  store.dispatch('snapshot/recordSnapshot');
}
function compose() {
  const componentList = store.state.component.componentList;
  if (store.state.compose.areaData.components.length) {
    store.dispatch('compose/compose');
    store.commit('component/setCurComponentIndex', componentList.length - 1);
    store.dispatch('snapshot/recordSnapshot');
  }
}
function decompose() {
  const curComponent = store.getters['component/curComponent'];
  if (!curComponent.isLock && curComponent.component === 'group') {
    store.dispatch('compose/decompose');
    store.commit('component/setCurComponentIndex', null);
    store.dispatch('snapshot/recordSnapshot');
  }
}
function deleteComponent() {
  store.dispatch('component/deleteCurComponent');
  store.dispatch('snapshot/recordSnapshot');
}
function lock() {
  store.dispatch('lock/lock');
  store.dispatch('snapshot/recordSnapshot');
}

// 未选择组件的情况下可以进行的操作
const baseMap = {
  [vCode]: paste,
  [yCode]: redo,
  [zCode]: undo,
  [gCode]: compose,
  [sCode]: save,
  [pCode]: preview,
  [eCode]: clearComponents,
};

// 选择组件且锁状态下可以执行的操作
const lockMap = {
  ...baseMap,
  [uCode]: unlock,
  [dCode]: deleteComponent,
  [deleteCode]: deleteComponent,
};

// 选择组件且未锁定状态下可以执行的操作
const unlockMap = {
  ...baseMap,
  [cCode]: copy,
  [xCode]: cut,
  [bCode]: decompose,
  [dCode]: deleteComponent,
  [deleteCode]: deleteComponent,
  [lCode]: lock,
};

let isCtrlDown = false;
export function listenGlobalKeyDown() {
  window.onkeydown = (e) => {
    const curComponent = store.getters['component/curComponent'];
    if (ctrlCode.includes(e.code)) {
      isCtrlDown = true;
    } else if (e.code === deleteCode && curComponent) {
      deleteComponent();
    } else if (isCtrlDown) {
      e.preventDefault();
      if (!curComponent) {
        baseMap[e.code] && baseMap[e.code]();
      } else if (curComponent.isLock) {
        lockMap[e.code] && lockMap[e.code]();
      } else {
        unlockMap[e.code] && unlockMap[e.code]();
      }
    }
  };

  window.onkeyup = (e) => {
    if (ctrlCode.includes(e.code)) {
      isCtrlDown = false;
    }
  };
}
