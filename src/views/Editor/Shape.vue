<template>
  <div class="shape">
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
  },
  data() {
    return {
      pointList: ['lt', 't', 'rt', 'r', 'rb', 'b', 'bl', 'l'], // 八个方向
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.shape {
  position: absolute;
  &:hover {
    cursor: move;
  }
}
</style>
