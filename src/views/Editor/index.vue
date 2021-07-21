<template>
  <div class="editor">
    <component
      v-for="item in componentList"
      class="component"
      :is="item.component"
      :propValue="item.propValue"
      :element="item"
      :style="getComponentStyle(item.style)"
      :key="item.id"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getStyle } from '@/utils/style';

const shapeStyle = ['width', 'height', 'top', 'left', 'rotate'];

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('component', [
      'componentList',
    ]),
  },
  methods: {
    getShapeStyle(style) {
      const filter = Object.keys(style).filter(key => !shapeStyle.includes(key));
      return getStyle(style, filter);
    },
    getComponentStyle(style) {
      return getStyle(style, shapeStyle);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.editor {
  position: relative;
  background: #fff;
  margin: auto;
  .component {
    width: 100%;
    height: 100%;
  }
}
</style>
