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
import { getStyle } from '@/utils/style';
import { toPercent } from '@/utils/translate';
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
  created() {
    const parentStyle = this.element.style;
    // 相对于 group 组件重新计算子组件位置信息
    this.propValue.forEach(component => {
      const style = { ...component.style };
      component.groupStyle = getStyle(style);
      component.groupStyle.left = toPercent((style.left - parentStyle.left) / parentStyle.width);
      component.groupStyle.top = toPercent((style.top - parentStyle.top) / parentStyle.height);
      component.groupStyle.width = toPercent(style.width / parentStyle.width);
      component.groupStyle.height = toPercent(style.height / parentStyle.height);
    });
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
