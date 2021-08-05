import { angleToRadian } from '@/utils/translate';

export function getStyle(style, filter = []) {
  const needPxUnit = [
    'fontSize', 'width', 'height', 'top', 'left',
    'borderWidth', 'letterSpacing', 'borderRadius',
  ];

  const result = {};

  Object.keys(style).forEach(key => {
    if (!filter.includes(key)) {
      if (key !== 'rotate') {
        result[key] = style[key];

        if (needPxUnit.includes(key)) {
          result[key] += 'px';
        }
      } else {
        result.transform = `${key}(${style[key]}deg)`;
      }
    }
  });

  return result;
}

// 获取一个组件旋转后用一个矩形恰能够装入的矩形的样式
export function getComponentRotatedStyle(style) {
  style = { ...style };

  if (style.rotate !== 0) {
    // 画一个矩形的旋转示意图即可得出以下等式
    const newWidth = style.width * Math.abs(Math.cos(angleToRadian(style.rotate))) + style.height * Math.abs(Math.sin(angleToRadian(style.rotate)));
    const diffX = (newWidth - style.width) / 2;
    style.left -= diffX;
    style.right = style.left + newWidth;

    const newHeight = style.width * Math.abs(Math.sin(angleToRadian(style.rotate))) + style.height * Math.abs(Math.cos(angleToRadian(style.rotate)));
    const diffY = (newHeight - style.height) / 2;
    style.top -= diffY;
    style.bottom = style.top + newHeight;

    style.width = newWidth;
    style.height = newHeight;
  } else {
    style.bottom = style.top + style.height;
    style.right = style.left + style.width;
  }

  return style;
}
