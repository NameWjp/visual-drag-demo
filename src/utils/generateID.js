let id = 0;
// 用于生成 vue 组件的 key
export default function generateID() {
  return id++;
}

const groupKey = 'group_sub_';
export function getGroupSubID(id) {
  return groupKey + id;
}
