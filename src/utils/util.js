export function isDef(v) {
  return v !== undefined && v !== null;
}

export function $(selector) {
  return document.querySelector(selector);
}

export function swap(arr, i, j) {
  const list = [...arr];
  list[i] = arr[j];
  list[j] = arr[i];
  return list;
}
