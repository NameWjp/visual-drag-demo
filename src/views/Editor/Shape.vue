<template>
  <div
    class="shape"
    :class="{ active }"
    @mousedown.stop="handleMouseDownOnShape"
  >
    <div
      class="shape-point"
      v-for="item in (active ? pointList : [])"
      :key="item"
      :style="getPointStyle(item)"
    >
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { throttle } from 'lodash-es';

const notPreventDefaultComponents = ['v-text'];

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
      pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'bl', 'l'], // 八个方向
    };
  },
  computed: {
    ...mapState('component', [
      'curComponentIndex',
    ]),
    ...mapGetters('component', [
      'curComponent',
    ]),
    active() {
      return this.index === this.curComponentIndex;
    },
  },
  methods: {
    handleMouseDownOnShape(e) {
      // // 文字类型的不能阻止默认行为
      if (!notPreventDefaultComponents.includes(this.element.component)) {
        e.preventDefault();
      }
      this.selectCurComponent();
      this.dragCurComponent(e);
    },
    dragCurComponent(e) {
      const pos = { ...this.defaultStyle };
      const startX = e.clientX;
      const startY = e.clientY;
      const left = pos.left;
      const top = pos.top;

      const move = throttle((mouseEvent) => {
        const curX = mouseEvent.clientX;
        const curY = mouseEvent.clientY;
        pos.left = curX - startX + left;
        pos.top = curY - startY + top;

        this.$store.dispatch('component/setCurComponentStyle', pos);
      }, 20);

      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    selectCurComponent() {
      this.$store.commit('component/setCurComponentIndex', this.index);
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
      };

      return style;
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.shape {
  position: absolute;
  &:hover {
    cursor: move;
  }
  &.active {
    outline: 1px solid #59c7f9;
    user-select: none;
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
  }
}
</style>
