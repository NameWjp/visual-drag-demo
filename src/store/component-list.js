// 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1,
};

export const commonAttr = {
};

// 编辑器左侧组件列表
const list = [
  {
    component: 'v-text',
    label: '文字',
    propValue: '双击编辑文字',
    icon: 'text',
    style: {
      width: 200,
      height: 22,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: '',
    },
  },
];

for (let i = 0; i < list.length; i++) {
  const item = list[i];
  item.style = { ...commonStyle, ...item.style };
  list[i] = { ...commonAttr, ...item };
}

export default list;
