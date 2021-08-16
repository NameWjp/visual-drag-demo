<template>
  <div class="animation-control">
    <el-button @click="handleShowAnimatePanel">添加动画</el-button>
    <el-button @click="previewAnimate">预览动画</el-button>
    <div class="tag-wrap">
      <el-tag
        v-for="(animate, index) in curComponent.animations"
        :key="animate.value"
        closable
        @close="removeAnimation(index)"
      >
        {{ animate.label }}
      </el-tag>
    </div>
  </div>
  <el-drawer
    :size="400"
    :withHeader="false"
    v-model="showAnimatePanel"
    direction="ltr"
  >
    <el-tabs v-model="animationActiveName" type="card">
      <el-tab-pane
        v-for="item in animationClassData"
        :key="item.label"
        :label="item.label"
        :name="item.label"
      >
        <div class="animation-list">
          <div
            class="animate"
            v-for="animate in item.children"
            :key="animate.value"
            @mouseover="handleMouseover(animate.value)"
            @click="addAnimation(animate)"
          >
            <div
              class="animate__animated"
              :class="[hoverPreviewAnimate === animate.value && `animate__${animate.value}`]"
            >
              {{ animate.label }}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
import animationClassData from '@/utils/animationClassData';
import { mapGetters } from 'vuex';
import eventEmitter from '@/utils/eventEmitter';

export default {
  data() {
    return {
      showAnimatePanel: false,
      animationActiveName: '进入',
      hoverPreviewAnimate: '',
      animationClassData,
    };
  },
  computed: {
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  methods: {
    handleShowAnimatePanel() {
      this.showAnimatePanel = true;
    },
    handleMouseover(val) {
      this.hoverPreviewAnimate = val;
    },
    addAnimation(animate) {
      this.$store.dispatch('animation/addAnimation', animate);
      this.showAnimatePanel = false;
    },
    removeAnimation(index) {
      this.$store.dispatch('animation/removeAnimation', index);
    },
    previewAnimate() {
      eventEmitter.emit('runAnimation');
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.animation-control {
  text-align: center;
  .tag-wrap {
    margin-top: 20px;
    overflow: hidden;
    .el-tag {
      display: block;
      width: 50%;
      margin: auto;
      margin-bottom: 10px;
    }
  }
}
.animation-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 20px;
  .animate {
    position: relative;
    flex: 0 0 100px;
    height: 60px;
    display: inline-block;
    margin: 5px;
    & > div {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #f5f8fb;
      font-size: 12px;
      color: #333;
      border-radius: 3px;
      user-select: none;
      cursor: pointer;
    }
  }
}
</style>
