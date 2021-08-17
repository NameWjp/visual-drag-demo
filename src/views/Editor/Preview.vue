<template>
  <div class="bg" v-if="show">
    <el-button @click="close" class="close">关闭</el-button>
    <div class="canvas-container">
      <div
        class="canvas"
        :style="{
          width: `${changeStyleWithScale(canvasStyle.scale, canvasStyle.width)}px`,
          height: `${changeStyleWithScale(canvasStyle.scale, canvasStyle.height)}px`
        }"
      >
        <preview-wrapper
          v-for="item in componentList"
          :key="item.id"
          :element="item"
        >
          <component
            class="component"
            :is="item.component"
            :propValue="item.propValue"
            :element="item"
            :style="getStyle(item.style)"
          />
        </preview-wrapper>
      </div>
    </div>
  </div>
</template>

<script>
import { changeStyleWithScale } from '@/utils/translate';
import { mapState } from 'vuex';
import PreviewWrapper from '@/views/Editor/PreviewWrapper';
import { getStyle } from '@/utils/style';

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('component', [
      'componentList',
    ]),
    ...mapState('canvas', [
      'canvasStyle',
    ]),
  },
  methods: {
    getStyle,
    changeStyleWithScale,
    close() {
      this.$emit('update:show', false);
      this.$store.commit('canvas/setCanvasMode', 'edit');
    },
  },
  components: {
    PreviewWrapper,
  },
};
</script>

<style scoped lang="scss">
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0, .5);
  z-index: 10;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  .canvas-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 80px);
    height: calc(100% - 160px);
    overflow: auto;
    .canvas {
      position: relative;
      background: #fff;
      margin: auto;
      .component {
        position: absolute;
      }
    }
  }
}
</style>
