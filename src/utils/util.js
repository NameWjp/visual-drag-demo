export function isDef(v) {
  return v !== undefined && v !== null;
}

export function $(selector) {
  return document.querySelector(selector);
}
