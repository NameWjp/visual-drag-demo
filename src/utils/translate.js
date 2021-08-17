export function mod360(deg) {
  return (deg + 360) % 360;
}

// 角度转弧度 (Math.PI = 180 度)
export function angleToRadian(angle) {
  return angle * Math.PI / 180;
}

// 弧度转角度 (Math.PI = 180 度)
export function radianToAngle(radian) {
  return radian * 180 / Math.PI;
}

export function toPercent(val) {
  return `${val * 100}%`;
}

/**
 * 计算一个点根据圆心旋转一定角度后的坐标
 * @param {Object} point  旋转前的点坐标
 * @param {Object} center 旋转中心
 * @param {Object} rotate 旋转的角度
 * @param {Object}        旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 欧比旺麦格雷戈 的回答有具体的推导
 */
export function calculateRotatedPointCoordinate(point, center, rotate) {
  return {
    x: (point.x - center.x) * Math.cos(angleToRadian(rotate)) - (point.y - center.y) * Math.sin(angleToRadian(rotate)) + center.x,
    y: (point.x - center.x) * Math.sin(angleToRadian(rotate)) + (point.y - center.y) * Math.cos(angleToRadian(rotate)) + center.y,
  };
}

// 求两点的中点坐标
export function getCenterPoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

// 根据缩放比例求尺寸
export function changeStyleWithScale(scale, value) {
  return value * parseInt(scale, 10) / 100;
}
