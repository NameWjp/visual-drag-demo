<template>
  <div
    @mousedown="clearCurComponent"
    class="editor"
    :style="{
      width: `${changeStyleWithScale(canvasStyle.width)}px`,
      height: `${changeStyleWithScale(canvasStyle.height)}px`
    }"
  >
    <!-- 网格图案 -->
    <grid />

    <!-- 编辑组件 -->
    <shape
      v-for="(item, index) in componentList"
      :key="item.id"
      :style="getShapeStyle(item.style)"
      :defaultStyle="item.style"
      :active="index === curComponentIndex"
      @click="selectCurComponent(index)"
    >
      <component
        class="component"
        :is="item.component"
        :propValue="item.propValue"
        :element="item"
        :style="getComponentStyle(item.style)"
      />
    </shape>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getStyle } from '@/utils/style';
import { changeStyleWithScale } from '@/utils/translate';
import Shape from './Shape';
import Grid from './Grid';

const shapeStyle = ['width', 'height', 'top', 'left', 'rotate'];

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('component', [
      'componentList',
      'curComponentIndex',
    ]),
    ...mapState('canvas', [
      'canvasStyle',
    ]),
  },
  methods: {
    changeStyleWithScale,
    clearCurComponent() {
      this.$store.commit('component/setCurComponentIndex', null);
    },
    selectCurComponent(index) {
      this.$store.commit('component/setCurComponentIndex', index);
    },
    getShapeStyle(style) {
      const filter = Object.keys(style).filter(key => !shapeStyle.includes(key));
      return getStyle(style, filter);
    },
    getComponentStyle(style) {
      return getStyle(style, shapeStyle);
    },
  },
  components: {
    Shape,
    Grid,
  },
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
