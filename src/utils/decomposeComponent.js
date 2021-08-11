import { mod360 } from '@/utils/translate';
import { $ } from '@/utils/util';
import { getGroupSubID } from '@/utils/generateID';

export default function decomposeComponent(component, editorRect, parentStyle) {
  const componentRect = $(`#${getGroupSubID(component.id)}`).getBoundingClientRect();
  // 获取子组件的中心坐标
  const center = {
    x: componentRect.left - editorRect.left + componentRect.width / 2,
    y: componentRect.top - editorRect.top + componentRect.height / 2,
  };

  component.style.rotate = mod360(component.style.rotate + parentStyle.rotate);
  component.style.width = parseFloat(component.groupStyle.width) / 100 * parentStyle.width;
  component.style.height = parseFloat(component.groupStyle.height) / 100 * parentStyle.height;
  component.style.left = center.x - component.style.width / 2;
  component.style.top = center.y - component.style.height / 2;
  component.groupStyle = {};
}
