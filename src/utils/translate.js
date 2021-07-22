import store from '@/store';

export function changeStyleWithScale(value) {
  return value * parseInt(store.state.canvas.canvasStyle.scale, 10) / 100;
}
