// 公共样式
export const commonStyle = {
};

export const commonAttr = {
};

// 编辑器左侧组件列表
const list = [
  {
    label: '文字',
    icon: 'wenben',
  },
];

for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i];
  item.style = { ...commonStyle, ...item.style };
  list[i] = { ...commonAttr, ...item };
}

export default list;
