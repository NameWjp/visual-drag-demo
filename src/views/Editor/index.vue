<template>
  <div
    @mousedown="deselectCurComponent"
    @dragover="handleDragover"
    @drop.prevent="handleDrop"
    ref="editor"
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
      :index="index"
      :element="item"
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
import componentList from '@/store/component-list';
import { cloneDeep } from 'lodash-es';
import generateID from '@/utils/generateID';
import Grid from './Grid';
import Shape from './Shape';

const shapeStyle = ['width', 'height', 'top', 'left', 'rotate'];

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('component', [
      'componentList',
    ]),
    ...mapState('canvas', [
      'canvasStyle',
    ]),
    ...mapState('drag', [
      'dragElement',
    ]),
  },
  mounted() {
    this.$store.commit('canvas/setCanvasEl', this.$refs.editor);
  },
  methods: {
    changeStyleWithScale(value) {
      return value * parseInt(this.canvasStyle.scale, 10) / 100;
    },
    deselectCurComponent() {
      this.$store.commit('component/setCurComponentIndex', null);
    },
    getShapeStyle(style) {
      const filter = Object.keys(style).filter(key => !shapeStyle.includes(key));
      return getStyle(style, filter);
    },
    getComponentStyle(style) {
      return getStyle(style, shapeStyle);
    },
    handleDragover(e) {
      if (this.dragElement) {
        e.preventDefault();
      }
    },
    handleDrop(e) {
      const component = cloneDeep(componentList[this.dragElement.dataset.index]);
      component.style.left = e.offsetX;
      component.style.top = e.offsetY;
      component.id = generateID();
      this.$store.commit('component/addComponent', { component });
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
  overflow: hidden;
  .component {
    width: 100%;
    height: 100%;
  }
}
</style>
