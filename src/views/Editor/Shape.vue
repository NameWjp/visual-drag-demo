<template>
  <div
    class="shape"
    :class="{ active }"
    @mousedown.stop
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

export default {
  props: {
    active: {
      type: Boolean,
      default: false,
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
  methods: {
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
