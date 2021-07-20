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
