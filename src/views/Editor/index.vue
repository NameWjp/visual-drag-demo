<template>
  <div
    @mousedown="handleMouseDown"
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

    <!-- 标线 -->
    <mark-line />

    <!-- 选中区域 -->
    <rect-area :info="areaInfo" v-show="isShowArea && areaInfo.width > 0 && areaInfo.height > 0" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getStyle } from '@/utils/style';
import componentList from '@/store/component-list';
import { cloneDeep, throttle } from 'lodash-es';
import generateID from '@/utils/generateID';
import Grid from './Grid';
import Shape from './Shape';
import MarkLine from './MarkLine';
import RectArea from './RectArea';

const shapeStyle = ['width', 'height', 'top', 'left', 'rotate'];

export default {
  data() {
    return {
      areaInfo: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      isShowArea: false,
    };
  },
  computed: {
    ...mapState('component', [
      'componentList',
    ]),
    ...mapState('canvas', [
      'canvasStyle',
      'canvasEl',
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
    handleMouseDown(e) {
      this.deselectCurComponent();
      this.getSelectRectInfo(e);
    },
    deselectCurComponent() {
      this.$store.commit('component/setCurComponentIndex', null);
    },
    getSelectRectInfo(e) {
      const canvasInfo = this.canvasEl.getBoundingClientRect();

      const startX = e.clientX;
      const startY = e.clientY;
      let x = startX - canvasInfo.x;
      let y = startY - canvasInfo.y;

      this.isShowArea = true;

      const move = throttle((mouseEvent) => {
        const newX = mouseEvent.clientX;
        const newY = mouseEvent.clientY;
        const width = Math.abs(newX - startX);
        const height = Math.abs(newY - startY);
        if (newX < startX) {
          x = newX - canvasInfo.x;
        }
        if (newY < startY) {
          y = newY - canvasInfo.y;
        }

        this.areaInfo = { x, y, width, height };
      }, 10);

      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        this.hideArea();
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    hideArea() {
      this.isShowArea = false;
      this.areaInfo = {
        ...this.areaInfo,
        width: 0,
        height: 0,
      };
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
    MarkLine,
    RectArea,
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
