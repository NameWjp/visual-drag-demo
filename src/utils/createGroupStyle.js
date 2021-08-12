import { getStyle } from '@/utils/style';
import { toPercent } from '@/utils/translate';

export default function createGroupStyle(groupComponent) {
  const parentStyle = groupComponent.style;
  // 相对于 group 组件重新计算子组件位置信息
  groupComponent.propValue.forEach(component => {
    const style = { ...component.style };
    component.groupStyle = getStyle(style);
    component.groupStyle.left = toPercent((style.left - parentStyle.left) / parentStyle.width);
    component.groupStyle.top = toPercent((style.top - parentStyle.top) / parentStyle.height);
    component.groupStyle.width = toPercent(style.width / parentStyle.width);
    component.groupStyle.height = toPercent(style.height / parentStyle.height);
  });
}
