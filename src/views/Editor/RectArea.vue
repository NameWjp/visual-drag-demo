<template>
  <div
    :style="{
      left: `${info.left}px`,
      top: `${info.top}px`,
      width: `${info.width}px`,
      height: `${info.height}px`,
    }"
    class="area"
  />
</template>

<script>

export default {
  props: {
    info: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style scoped lang="scss">
.area {
  position: absolute;
  border: 1px solid #70c0ff;
  box-sizing: border-box;
}
</style>
