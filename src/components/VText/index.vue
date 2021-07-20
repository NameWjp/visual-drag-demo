<template>
  <div class="v-text">
    <div v-html="element.propValue"></div>
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
  data() {
    return {
      canEdit: false,
    };
  },
  methods: {
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
