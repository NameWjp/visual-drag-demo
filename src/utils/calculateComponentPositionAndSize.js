import { getCenterPoint, calculateRotatedPointCoordinate } from '@/utils/translate';

/**
 * 对角线的四个点的拖拽是任意方向的，可以分别计算旋转前的当前点和对称点的位置信息来计算尺寸
 */
function calculateLeftTop(style, curPosition, pointInfo) {
  const { symmetricPoint } = pointInfo;
  const centerPoint = getCenterPoint(curPosition, symmetricPoint);
  const beforeRotateLeftTopPoint = calculateRotatedPointCoordinate(curPosition, centerPoint, -style.rotate);
  const beforeRotateRightBottomPoint = calculateRotatedPointCoordinate(symmetricPoint, centerPoint, -style.rotate);

  const newWidth = beforeRotateRightBottomPoint.x - beforeRotateLeftTopPoint.x;
  const newHeight = beforeRotateRightBottomPoint.y - beforeRotateLeftTopPoint.y;

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth);
    style.height = Math.round(newHeight);
    style.left = Math.round(beforeRotateLeftTopPoint.x);
    style.top = Math.round(beforeRotateLeftTopPoint.y);
  }
}

function calculateRightTop(style, curPosition, pointInfo) {
  const { symmetricPoint } = pointInfo;
  const centerPoint = getCenterPoint(curPosition, symmetricPoint);
  const beforeRotateRightTopPoint = calculateRotatedPointCoordinate(curPosition, centerPoint, -style.rotate);
  const beforeRotateLeftBottomPoint = calculateRotatedPointCoordinate(symmetricPoint, centerPoint, -style.rotate);

  const newWidth = beforeRotateRightTopPoint.x - beforeRotateLeftBottomPoint.x;
  const newHeight = beforeRotateLeftBottomPoint.y - beforeRotateRightTopPoint.y;

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth);
    style.height = Math.round(newHeight);
    style.left = Math.round(beforeRotateLeftBottomPoint.x);
    style.top = Math.round(beforeRotateRightTopPoint.y);
  }
}

function calculateRightBottom(style, curPosition, pointInfo) {
  const { symmetricPoint } = pointInfo;
  const centerPoint = getCenterPoint(curPosition, symmetricPoint);
  const beforeRotateRightBottomPoint = calculateRotatedPointCoordinate(curPosition, centerPoint, -style.rotate);
  const beforeRotateLeftTopPoint = calculateRotatedPointCoordinate(symmetricPoint, centerPoint, -style.rotate);

  const newWidth = beforeRotateRightBottomPoint.x - beforeRotateLeftTopPoint.x;
  const newHeight = beforeRotateRightBottomPoint.y - beforeRotateLeftTopPoint.y;

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth);
    style.height = Math.round(newHeight);
    style.left = Math.round(beforeRotateLeftTopPoint.x);
    style.top = Math.round(beforeRotateLeftTopPoint.y);
  }
}

function calculateLeftBottom(style, curPosition, pointInfo) {
  const { symmetricPoint } = pointInfo;
  const centerPoint = getCenterPoint(curPosition, symmetricPoint);
  const beforeRotateLeftBottomPoint = calculateRotatedPointCoordinate(curPosition, centerPoint, -style.rotate);
  const beforeRotateRightTopPoint = calculateRotatedPointCoordinate(symmetricPoint, centerPoint, -style.rotate);

  const newWidth = beforeRotateRightTopPoint.x - beforeRotateLeftBottomPoint.x;
  const newHeight = beforeRotateLeftBottomPoint.y - beforeRotateRightTopPoint.y;

  if (newWidth > 0 && newHeight > 0) {
    style.width = Math.round(newWidth);
    style.height = Math.round(newHeight);
    style.left = Math.round(beforeRotateLeftBottomPoint.x);
    style.top = Math.round(beforeRotateRightTopPoint.y);
  }
}

/**
 * 四个中点的拖拽只能沿相应轴的方向拖拽，所以需要先求出轴线上对应的点，再根据旋转后对应的点计算高度和中心点
 */
function calculateTop(style, curPosition, pointInfo) {
  const { symmetricPoint, center } = pointInfo;
  // 先获取旋转前 curPosition 对应坐标，需要注意的是我们是用的是拖拽前的中点，之后需要旋转回来，因为 rotate 属性的旋转中心是中点
  const beforeRotateCurPosition = calculateRotatedPointCoordinate(curPosition, center, -style.rotate);
  // 忽略 x 轴的偏移，计算 y 轴上对应点
  const beforeRotateTopPoint = { x: center.x, y: beforeRotateCurPosition.y };
  // 计算旋转后的坐标
  const afterRotateTopPoint = calculateRotatedPointCoordinate(beforeRotateTopPoint, center, style.rotate);

  if (symmetricPoint.y > afterRotateTopPoint.y) {
    const newHeight = Math.sqrt((afterRotateTopPoint.x - symmetricPoint.x) ** 2 + (afterRotateTopPoint.y - symmetricPoint.y) ** 2);
    const centerPoint = getCenterPoint(afterRotateTopPoint, symmetricPoint);

    style.height = Math.round(newHeight);
    style.top = Math.round(centerPoint.y - (newHeight / 2));
    style.left = Math.round(centerPoint.x - (style.width / 2));
  }
}

function calculateRight(style, curPosition, pointInfo) {
  const { symmetricPoint, center } = pointInfo;
  const beforeRotateCurPosition = calculateRotatedPointCoordinate(curPosition, center, -style.rotate);
  const beforeRotateTopPoint = { x: beforeRotateCurPosition.x, y: center.y };
  const afterRotateTopPoint = calculateRotatedPointCoordinate(beforeRotateTopPoint, center, style.rotate);

  if (symmetricPoint.x < afterRotateTopPoint.x) {
    const newWidth = Math.sqrt((afterRotateTopPoint.x - symmetricPoint.x) ** 2 + (afterRotateTopPoint.y - symmetricPoint.y) ** 2);
    const centerPoint = getCenterPoint(afterRotateTopPoint, symmetricPoint);

    style.width = Math.round(newWidth);
    style.top = Math.round(centerPoint.y - (style.height / 2));
    style.left = Math.round(centerPoint.x - (newWidth / 2));
  }
}

function calculateBottom(style, curPosition, pointInfo) {
  const { symmetricPoint, center } = pointInfo;
  const beforeRotateCurPosition = calculateRotatedPointCoordinate(curPosition, center, -style.rotate);
  const beforeRotateTopPoint = { x: center.x, y: beforeRotateCurPosition.y };
  const afterRotateTopPoint = calculateRotatedPointCoordinate(beforeRotateTopPoint, center, style.rotate);

  if (symmetricPoint.y < afterRotateTopPoint.y) {
    const newHeight = Math.sqrt((afterRotateTopPoint.x - symmetricPoint.x) ** 2 + (afterRotateTopPoint.y - symmetricPoint.y) ** 2);
    const centerPoint = getCenterPoint(afterRotateTopPoint, symmetricPoint);

    style.height = Math.round(newHeight);
    style.top = Math.round(centerPoint.y - (newHeight / 2));
    style.left = Math.round(centerPoint.x - (style.width / 2));
  }
}

function calculateLeft(style, curPosition, pointInfo) {
  const { symmetricPoint, center } = pointInfo;
  const beforeRotateCurPosition = calculateRotatedPointCoordinate(curPosition, center, -style.rotate);
  const beforeRotateTopPoint = { x: beforeRotateCurPosition.x, y: center.y };
  const afterRotateTopPoint = calculateRotatedPointCoordinate(beforeRotateTopPoint, center, style.rotate);

  if (symmetricPoint.x > afterRotateTopPoint.x) {
    const newWidth = Math.sqrt((afterRotateTopPoint.x - symmetricPoint.x) ** 2 + (afterRotateTopPoint.y - symmetricPoint.y) ** 2);
    const centerPoint = getCenterPoint(afterRotateTopPoint, symmetricPoint);

    style.width = Math.round(newWidth);
    style.top = Math.round(centerPoint.y - (style.height / 2));
    style.left = Math.round(centerPoint.x - (newWidth / 2));
  }
}

const funcs = {
  lt: calculateLeftTop,
  t: calculateTop,
  rt: calculateRightTop,
  r: calculateRight,
  rb: calculateRightBottom,
  b: calculateBottom,
  lb: calculateLeftBottom,
  l: calculateLeft,
};

export default function calculateComponentPositionAndSize(name, style, curPosition, pointInfo) {
  funcs[name](style, curPosition, pointInfo);
}
