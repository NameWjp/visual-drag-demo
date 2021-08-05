<template>
  <div class="picture">
    <img :src="propValue">
  </div>
</template>

<script>
export default {
  props: {
    propValue: {
      type: String,
      require: true,
    },
    element: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.picture {
  overflow: hidden;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
