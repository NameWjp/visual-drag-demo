<template>
  <div class="group">
    <component
      class="component"
      v-for="item in propValue"
      :is="item.component"
      :key="item.id"
      :id="getGroupSubID(item.id)"
      :style="item.groupStyle"
      :propValue="item.propValue"
      :element="item"
    />
  </div>
</template>

<script>
import { getGroupSubID } from '@/utils/generateID';

export default {
  props: {
    propValue: {
      type: Array,
      default: () => [],
    },
    element: {
      type: Object,
    },
  },
  methods: {
    getGroupSubID,
  },
};
</script>

<style scoped lang="scss">
.group {
  position: relative;
  .component {
    position: absolute;
  }
}
</style>
