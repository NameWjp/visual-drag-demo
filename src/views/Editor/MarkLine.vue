<template>
  <div class="mark-line">
    <div
      v-for="line in lines"
      :key="line"
      class="line"
      :class="line.includes('x') ? 'xline' : 'yline'"
      :ref="line"
      v-show="lineStatus[line]"
    ></div>
  </div>
</template>

<script>
import eventEmitter from '@/utils/eventEmitter';
import { mapState, mapGetters } from 'vuex';
import { getComponentRotatedStyle } from '@/utils/style';

export default {
  data() {
    return {
      lines: ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'], // 对应三条横线和三条竖线
      diff: 4, // 相距 diff 像素将自动吸附
      lineStatus: {
        xt: false,
        xc: false,
        xb: false,
        yl: false,
        yc: false,
        yr: false,
      },
    };
  },
  computed: {
    ...mapState('component', [
      'componentList',
    ]),
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  mounted() {
    eventEmitter.on('move', this.showLine);
    eventEmitter.on('unmove', this.hideLine);
  },
  methods: {
    // 标线是基于旋转后的图形，将组件的坐标转化为旋转后的坐标后计算是否触发标线。
    showLine(isDownward, isRightward) {
      this.hideLine();

      const curComponentStyle = getComponentRotatedStyle(this.curComponent.style);
      const curComponentHalfWidth = curComponentStyle.width / 2;
      const curComponentHalfHeight = curComponentStyle.height / 2;
      const needToShow = [];

      this.componentList.forEach(component => {
        if (component === this.curComponent) return;

        const componentStyle = getComponentRotatedStyle(component.style);
        const { top, right, bottom, left } = componentStyle;
        const componentHalfWidth = componentStyle.width / 2;
        const componentHalfHeight = componentStyle.height / 2;

        const conditions = {
          top: [
            // 拖拽元素的底边和当前元素的上边
            {
              isNearly: this.isNearly(curComponentStyle.bottom, top), // 是否靠近了
              line: 'xt', // 触发的标线的名称
              dragShift: top - curComponentStyle.height, // 拖拽元素需要移动的位置
              lineShift: top, // 标线需要移动的位置
            },
            // 拖拽元素的上边和当前元素的上边
            {
              isNearly: this.isNearly(curComponentStyle.top, top),
              line: 'xt',
              dragShift: top,
              lineShift: top,
            },
            // 拖拽元素的中点和当前元素的中点水平对齐
            {
              isNearly: this.isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
              line: 'xc',
              dragShift: top + componentHalfHeight - curComponentHalfHeight,
              lineShift: top + componentHalfHeight,
            },
            // 拖拽元素的底边和当前元素的底边
            {
              isNearly: this.isNearly(curComponentStyle.bottom, bottom),
              line: 'xb',
              dragShift: bottom - curComponentStyle.height,
              lineShift: bottom,
            },
            // 拖拽元素的上边和当前元素的底边
            {
              isNearly: this.isNearly(curComponentStyle.top, bottom),
              line: 'xb',
              dragShift: bottom,
              lineShift: bottom,
            },
          ],
          left: [
            // 拖拽元素的右边和当前元素的左边
            {
              isNearly: this.isNearly(curComponentStyle.right, left),
              line: 'yl',
              dragShift: left - curComponentStyle.width,
              lineShift: left,
            },
            // 拖拽元素的左边和当前元素的左边
            {
              isNearly: this.isNearly(curComponentStyle.left, left),
              line: 'yl',
              dragShift: left,
              lineShift: left,
            },
            // 拖拽元素的中点和当前元素的中点垂直对齐
            {
              isNearly: this.isNearly(curComponentStyle.left + curComponentHalfWidth, left + componentHalfWidth),
              line: 'yc',
              dragShift: left + componentHalfWidth - curComponentHalfWidth,
              lineShift: left + componentHalfWidth,
            },
            // 拖拽元素的右边和当前元素的右边
            {
              isNearly: this.isNearly(curComponentStyle.right, right),
              line: 'yr',
              dragShift: right - curComponentStyle.width,
              lineShift: right,
            },
            // 拖拽元素的左边和当前元素的右边
            {
              isNearly: this.isNearly(curComponentStyle.left, right),
              line: 'yr',
              dragShift: right,
              lineShift: right,
            },
          ],
        };

        Object.keys(conditions).forEach(key => {
          // 处理所有符合条件的行为
          conditions[key].forEach(condition => {
            if (!condition.isNearly) return;

            // 处理吸附
            this.$store.dispatch('component/setCurComponentStyle', {
              [key]: this.translateCurComponentShift(key, condition, curComponentStyle),
            });

            // 处理标线
            this.$refs[condition.line].style[key] = `${condition.lineShift}px`;
            if (!needToShow.includes(condition.line)) {
              needToShow.push(condition.line);
            }
          });
        });
      });

      if (needToShow.length) {
        // 根据移动的方向，同一方向上的标线只展示一条
        this.chooseShowLine(needToShow, isDownward, isRightward);
      }
    },
    // 当向下拖拽，按从下到上的顺序展示，否则相反
    // 当向右拖拽，则从右到做的顺序展示，否则相反
    chooseShowLine(needToShow, isDownward, isRightward) {
      if (isDownward) {
        if (needToShow.includes('xb')) {
          this.lineStatus.xb = true;
        } else if (needToShow.includes('xc')) {
          this.lineStatus.xc = true;
        } else if (needToShow.includes('xt')) {
          this.lineStatus.xt = true;
        }
      } else {
        if (needToShow.includes('xt')) {
          this.lineStatus.xt = true;
        } else if (needToShow.includes('xc')) {
          this.lineStatus.xc = true;
        } else if (needToShow.includes('xb')) {
          this.lineStatus.xb = true;
        }
      }

      if (isRightward) {
        if (needToShow.includes('yr')) {
          this.lineStatus.yr = true;
        } else if (needToShow.includes('yc')) {
          this.lineStatus.yc = true;
        } else if (needToShow.includes('yl')) {
          this.lineStatus.yl = true;
        }
      } else {
        if (needToShow.includes('yl')) {
          this.lineStatus.yl = true;
        } else if (needToShow.includes('yc')) {
          this.lineStatus.yc = true;
        } else if (needToShow.includes('yr')) {
          this.lineStatus.yr = true;
        }
      }
    },
    hideLine() {
      Object.keys(this.lineStatus).forEach(line => {
        this.lineStatus[line] = false;
      });
    },
    isNearly(dragValue, targetValue) {
      return Math.abs(dragValue - targetValue) <= this.diff;
    },
    translateCurComponentShift(key, condition, curComponent) {
      const { width, height, rotate } = this.curComponent.style;
      if (rotate === 0) {
        return condition.dragShift;
      }

      if (key === 'top') {
        // 旋转前 = 旋转后 + diffY / 2
        return Math.round(condition.dragShift + (curComponent.height - height) / 2);
      }

      if (key === 'left') {
        // 旋转前 = 旋转后 + diffX / 2
        return Math.round(condition.dragShift + (curComponent.width - width) / 2);
      }

      return null;
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.mark-line {
  height: 100%;

  .line {
    background: #59c7f9;
    position: absolute;
    z-index: 1000;

    &.xline {
      width: 100%;
      height: 1px;
    }

    &.yline {
      width: 1px;
      height: 100%;
    }
  }
}
</style>
