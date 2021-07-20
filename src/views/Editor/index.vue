<template>
  <div class="editor">
    <component
      v-for="item in componentData"
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
    ...mapState([
      'componentData',
    ]),
  },
  methods: {
    getShapeStyle(style) {
      const filter = Object.keys(style).filter(key => !shapeStyle.includes(key));
      console.log(getStyle(style, filter));
      return getStyle(style, filter);
    },
    getComponentStyle(style) {
      console.log(getStyle(style, shapeStyle));
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
}
</style>
