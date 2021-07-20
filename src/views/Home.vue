<template>
  <div class="home">
    <toolbar />
    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <component-list />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <p class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation">
            <p class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="事件" name="events">
            <p class="placeholder">请选择组件</p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<script>
import Toolbar from '@/views/Toolbar';
import ComponentList from '@/views/ComponentList';
import componentList from '@/store/component-list';
import { cloneDeep } from 'lodash-es';
import generateID from '@/utils/generateID';
import Editor from '@/views/Editor';

export default {
  components: {
    Toolbar,
    ComponentList,
    Editor,
  },
  data() {
    return {
      activeName: 'attr',
    };
  },
  methods: {
    handleDrop(e) {
      const component = cloneDeep(componentList[e.dataTransfer.getData('index')]);
      component.style.left = e.offsetX;
      component.style.top = e.offsetY;
      component.id = generateID();
      this.$store.commit('addComponent', { component });
    },
  },
};
</script>

<style lang="scss">
.home {
  height: 100vh;
  background: #fff;
  main {
    height: calc(100% - 64px);
    position: relative;
    .left {
      position: absolute;
      height: 100%;
      width: 200px;
      left: 0;
      top: 0;
      padding-top: 10px;
      box-sizing: border-box;
    }
    .right {
      position: absolute;
      height: 100%;
      width: 262px;
      right: 0;
      top: 0;
    }
    .center {
      margin-left: 200px;
      margin-right: 262px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;
      box-sizing: border-box;
      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }
  .placeholder {
    text-align: center;
    color: #333;
  }
}
</style>
