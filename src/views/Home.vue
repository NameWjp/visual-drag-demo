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
        <div class="content">
          <editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="属性" name="attr">
            <attr-list v-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="动画" name="animation">
            <animation-list v-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
          <el-tab-pane label="事件" name="events">
            <event-list v-if="curComponent" />
            <p v-else class="placeholder">请选择组件</p>
          </el-tab-pane>
        </el-tabs>
      </section>
    </main>
  </div>
</template>

<script>
import Toolbar from '@/views/Toolbar';
import ComponentList from '@/views/ComponentList';
import Editor from '@/views/Editor';
import AttrList from '@/views/AttrList';
import { mapGetters } from 'vuex';
import { CANVAS_DATA, CANVAS_STYLE } from '@/constant';
import generateID from '@/utils/generateID';
import { listenGlobalKeyDown } from '@/effect/shortcutKey';
import AnimationList from '@/views/AnimationList';
import EventList from '@/views/EventList';

export default {
  components: {
    Toolbar,
    ComponentList,
    Editor,
    AttrList,
    AnimationList,
    EventList,
  },
  data() {
    return {
      activeName: 'attr',
    };
  },
  computed: {
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  created() {
    this.restore();
    // 全局按键监听
    listenGlobalKeyDown();
  },
  methods: {
    restore() {
      const canvasData = JSON.parse(localStorage.getItem(CANVAS_DATA));
      if (canvasData) {
        this.$store.commit('component/setComponentList', this.resetID(canvasData));
      }
      const canvasStyle = JSON.parse(localStorage.getItem(CANVAS_STYLE));
      if (canvasStyle) {
        this.$store.commit('canvas/setCanvasStyle', canvasStyle);
      }
    },
    resetID(data) {
      data.forEach(item => {
        item.id = generateID();
      });
      return data;
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
