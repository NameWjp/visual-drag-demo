<template>
  <el-button style="margin: 0;">{{ propValue }}</el-button>
</template>

<script>

export default {
  props: {
    propValue: {
      type: String,
      default: '',
    },
    element: {
      type: Object,
    },
  },
};
</script>

<style scoped lang="scss">
</style>
