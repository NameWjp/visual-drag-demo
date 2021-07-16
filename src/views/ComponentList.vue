<template>
  <div class="component-list">
    <div
      v-for="(item, index) in componentList"
      :key="index"
      class="list"
      draggable
    >
      <svg-icon :iconClass="item.icon"></svg-icon>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import componentList from '@/store/component-list';

export default {
  data() {
    return {
      componentList,
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
</style>
