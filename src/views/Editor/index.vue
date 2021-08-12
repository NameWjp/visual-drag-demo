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
import { getStyle, getComponentRotatedStyle } from '@/utils/style';
import componentList from '@/store/component-list';
import { cloneDeep, throttle } from 'lodash-es';
import generateID from '@/utils/generateID';
import eventEmitter from '@/utils/eventEmitter';
import Grid from './Grid';
import Shape from './Shape';
import MarkLine from './MarkLine';
import RectArea from './RectArea';

const shapeStyle = ['width', 'height', 'top', 'left', 'rotate'];

export default {
  data() {
    return {
      areaInfo: {
        left: 0,
        top: 0,
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

    eventEmitter.on('hideArea', this.hideArea);
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
      let left = startX - canvasInfo.x;
      let top = startY - canvasInfo.y;

      this.isShowArea = true;

      const move = throttle((mouseEvent) => {
        const newX = mouseEvent.clientX;
        const newY = mouseEvent.clientY;
        const width = Math.abs(newX - startX);
        const height = Math.abs(newY - startY);
        if (newX < startX) {
          left = newX - canvasInfo.x;
        }
        if (newY < startY) {
          top = newY - canvasInfo.y;
        }

        this.areaInfo = { left, top, width, height };
      }, 10, { trailing: false });

      const up = (e) => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);

        // 点击画布没有移动的时候清除选中区域
        if (e.clientX === startX && e.clientY === startY) {
          this.hideArea();
          return;
        }

        this.createGroup();
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    createGroup() {
      // 获取选中区域的组件数据
      const areaData = this.getSelectArea();
      if (areaData.length <= 1) {
        this.hideArea();
        return;
      }

      // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
      // 要遍历选择区域的每个组件，获取最小的 left 和 top，获取最大的 right 和 bottom
      let left = Infinity;
      let top = Infinity;
      let bottom = -Infinity;
      let right = -Infinity;

      areaData.forEach(component => {
        const style = getComponentRotatedStyle(component.style);
        if (style.left < left) left = style.left;
        if (style.top < top) top = style.top;
        if (style.right > right) right = style.right;
        if (style.bottom > bottom) bottom = style.bottom;
      });

      const width = right - left;
      const height = bottom - top;

      this.areaInfo = {
        left,
        top,
        width,
        height,
      };

      this.$store.commit('compose/setAreaData', {
        style: {
          left,
          top,
          width,
          height,
        },
        components: areaData,
      });
    },
    getSelectArea() {
      const result = [];
      const { left: aLeft, top: aTop, width: aWidth, height: aHeight } = this.areaInfo;
      const aRight = aLeft + aWidth;
      const aBottom = aTop + aHeight;

      // 获取选择区域中的组件
      this.componentList.forEach(component => {
        if (component.isLock) return;

        const { left, top, right, bottom } = getComponentRotatedStyle(component.style);
        if (left >= aLeft && top >= aTop && right <= aRight && bottom <= aBottom) {
          result.push(component);
        }
      });

      return result;
    },
    hideArea() {
      if (this.isShowArea) {
        this.isShowArea = false;
        this.areaInfo = {
          ...this.areaInfo,
          width: 0,
          height: 0,
        };

        this.$store.dispatch('compose/clearAreaData');
      }
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
      this.$store.dispatch('snapshot/recordSnapshot');
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
  user-select: none;
  .component {
    width: 100%;
    height: 100%;
  }
}
</style>
