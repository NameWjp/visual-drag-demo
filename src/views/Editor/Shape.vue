<template>
  <div
    ref="shape"
    class="shape"
    :class="{ checked: isChecked, lock: element.isLock }"
    @mousedown.stop.prevent="handleMouseDownOnShape"
  >
    <svg-icon
      v-show="active"
      class="rotate"
      iconClass="rotate"
      @mousedown.stop="handleRotate"
    />
    <svg-icon
      v-show="element.isLock"
      class="lock-icon"
      iconClass="lock"
    />
    <div
      class="shape-point"
      v-for="item in (active ? pointList : [])"
      :key="item"
      :style="getPointStyle(item)"
      @mousedown.stop="handleMouseDownOnPoint(item, $event)"
    />
    <slot></slot>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { throttle } from 'lodash-es';
import { mod360, radianToAngle } from '@/utils/translate';
import calculateComponentPositionAndSize from '@/utils/calculateComponentPositionAndSize';
import eventEmitter from '@/utils/eventEmitter';

export default {
  props: {
    index: {
      require: true,
      type: Number,
    },
    element: {
      require: true,
      type: Object,
    },
    defaultStyle: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {
      pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'], // 八个方向
      // 每个点对应的角度，以 rb 到 lt 为轴
      initialAngle: {
        lt: 0,
        t: 45,
        rt: 90,
        r: 135,
        rb: 180,
        b: 225,
        lb: 270,
        l: 315,
      },
      // 每个范围对应的光标
      angleToCursor: [
        { start: 337.5, end: 22.5, cursor: 'nw' },
        { start: 22.5, end: 67.5, cursor: 'n' },
        { start: 67.5, end: 112.5, cursor: 'ne' },
        { start: 112.5, end: 157.5, cursor: 'e' },
        { start: 157.5, end: 202.5, cursor: 'se' },
        { start: 202.5, end: 247.5, cursor: 's' },
        { start: 247.5, end: 292.5, cursor: 'sw' },
        { start: 292.5, end: 337.5, cursor: 'w' },
      ],
      cursors: {},
    };
  },
  computed: {
    ...mapState('component', [
      'curComponentIndex',
    ]),
    ...mapState('canvas', [
      'canvasEl',
    ]),
    ...mapGetters('component', [
      'curComponent',
    ]),
    isChecked() {
      return this.index === this.curComponentIndex;
    },
    active() {
      return this.isChecked && !this.element.isLock;
    },
  },
  mounted() {
    // 用于 group 组件创建后获取光标
    if (this.isChecked) {
      this.getCursor();
    }
  },
  methods: {
    // 思路：旋转前和旋转后相对于x正方向的夹角的差值即为旋转的角度
    handleRotate(e) {
      const style = { ...this.defaultStyle };
      const startX = e.clientX;
      const startY = e.clientY;
      const startRotate = style.rotate;

      // 元素中心点位置
      const rect = this.$refs.shape.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 旋转前的角度
      const rotateDegreeBefore = radianToAngle(Math.atan2(startY - centerY, startX - centerX));
      // 是否旋转
      let hasMove = false;

      const move = throttle((mouseEvent) => {
        hasMove = true;
        const curX = mouseEvent.clientX;
        const curY = mouseEvent.clientY;
        // 旋转后的角度
        const rotateDegreeAfter = radianToAngle(Math.atan2(curY - centerY, curX - centerX));
        // 计算角度值：初始角度 + 旋转的角度
        style.rotate = startRotate + (rotateDegreeAfter - rotateDegreeBefore);
        // 设置样式
        this.$store.dispatch('component/setCurComponentStyle', style);
      }, 10);

      const up = () => {
        if (hasMove) {
          this.$store.dispatch('snapshot/recordSnapshot');
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        // 旋转后重新计算光标方向
        this.getCursor();
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    handleMouseDownOnShape(e) {
      this.selectCurComponent();

      if (this.element.isLock) return;

      this.getCursor();
      this.dragCurComponent(e);
    },
    selectCurComponent() {
      this.$store.commit('component/setCurComponentIndex', this.index);
    },
    getCursor() {
      const { angleToCursor, initialAngle, pointList, curComponent } = this;
      const rotate = mod360(curComponent.style.rotate);
      const result = {};
      // 按照习惯点和范围是对应的关系，从上一个命中的角度索引匹配下一个，降低时间复杂度
      let lastMatchIndex = -1;

      pointList.forEach(point => {
        const angle = mod360(initialAngle[point] + rotate);
        const len = angleToCursor.length;

        while (true) {
          lastMatchIndex = (lastMatchIndex + 1) % len;

          const { start, end, cursor } = angleToCursor[lastMatchIndex];
          if (start > end && (angle >= start || angle < end)) {
            result[point] = `${cursor}-resize`;
            return;
          }
          if (start < end && (angle >= start && angle < end)) {
            result[point] = `${cursor}-resize`;
            return;
          }
        }
      });

      this.cursors = result;
    },
    dragCurComponent(e) {
      const pos = { ...this.defaultStyle };
      const startX = e.clientX;
      const startY = e.clientY;
      const left = pos.left;
      const top = pos.top;

      // 上一次拖拽的位置信息，用于判断当前拖拽的方向
      let preX = e.clientX;
      let preY = e.clientY;
      // 是否移动
      let hasMove = false;

      const move = throttle((mouseEvent) => {
        hasMove = true;
        const curX = mouseEvent.clientX;
        const curY = mouseEvent.clientY;
        pos.left = curX - startX + left;
        pos.top = curY - startY + top;

        this.$store.dispatch('component/setCurComponentStyle', pos);

        // 触发元素移动事件，用于显示标线、吸附功能
        eventEmitter.emit('move', curY > preY, curX > preX);
        preX = curX;
        preY = curY;
      }, 10);

      const up = () => {
        if (hasMove) {
          this.$store.dispatch('snapshot/recordSnapshot');
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        // 用于隐藏标线
        eventEmitter.emit('unmove');
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    getPointStyle(point) {
      const { width, height } = this.defaultStyle;
      const hasT = /t/.test(point);
      const hasB = /b/.test(point);
      const hasL = /l/.test(point);
      const hasR = /r/.test(point);
      let left = 0;
      let top = 0;

      if (point.length === 2) {
        // 四个角的点
        left = hasL ? 0 : width;
        top = hasT ? 0 : height;
      } else {
        // 上下两个点
        if (hasT || hasB) {
          left = width / 2;
          top = hasT ? 0 : height;
        }
        // 左右两个点
        if (hasL || hasR) {
          left = hasL ? 0 : width;
          top = height / 2;
        }
      }

      const style = {
        left: `${left}px`,
        top: `${top}px`,
        cursor: this.cursors[point],
      };

      return style;
    },
    handleMouseDownOnPoint(point, e) {
      const style = { ...this.defaultStyle };

      // 组件中心点
      const center = {
        x: style.left + style.width / 2,
        y: style.top + style.height / 2,
      };

      // 画布位置信息
      const canvasRect = this.canvasEl.getBoundingClientRect();

      // 当前点击圆点位置信息
      const pointRect = e.target.getBoundingClientRect();
      // 当前点击的圆点的中心相对于画布的坐标
      const curPoint = {
        x: Math.round(pointRect.left - canvasRect.left + e.target.offsetWidth / 2),
        y: Math.round(pointRect.top - canvasRect.top + e.target.offsetHeight / 2),
      };

      // 当前点击的圆点的对称圆点中心坐标
      const symmetricPoint = {
        x: 2 * center.x - curPoint.x,
        y: 2 * center.y - curPoint.y,
      };

      // 是否移动
      let hasMove = false;

      const move = throttle((mouseEvent) => {
        hasMove = true;
        const curPosition = {
          x: mouseEvent.clientX - canvasRect.left,
          y: mouseEvent.clientY - canvasRect.top,
        };

        calculateComponentPositionAndSize(point, style, curPosition, {
          center,
          curPoint,
          symmetricPoint,
        });

        this.$store.dispatch('component/setCurComponentStyle', style);
      }, 10);

      const up = () => {
        if (hasMove) {
          this.$store.dispatch('snapshot/recordSnapshot');
        }
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.shape {
  position: absolute;
  user-select: none;
  &:hover {
    cursor: move;
  }
  &.lock {
    opacity: .5;
  }
  &.lock:hover {
    cursor: not-allowed;
  }
  &.checked {
    outline: 1px solid #59c7f9;
  }

  .rotate {
    position: absolute;
    left: 50%;
    top: -34px;
    transform: translateX(-50%);
    font-size: 20px;
    color: #59c7f9;
    cursor: grab;
  }

  .lock-icon {
    position: absolute;
    right: 0;
    top: 0;
  }

  .shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    box-sizing: border-box;
    margin-top: -4px;
    margin-left: -4px;
    border-radius: 50%;
    z-index: 1;
  }
}
</style>
