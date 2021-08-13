<template>
  <div class="contextmenu" :style="{ left: `${info.left}px`, top: `${info.top}px` }">
    <ul @mousedown.stop>
      <template v-if="curComponent">
        <template v-if="!curComponent.isLock">
          <li @click="copy">复制</li>
          <li @click="paste">粘贴</li>
          <li @click="cut">剪切</li>
          <li @click="deleteComponent">删除</li>
          <li @click="lock">锁定</li>
          <li @click="topComponent">置顶</li>
          <li @click="bottomComponent">置底</li>
          <li @click="upComponent">上移</li>
          <li @click="downComponent">下移</li>
        </template>
        <li v-else @click="unlock">解锁</li>
      </template>
      <li v-else @click="paste">粘贴</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import eventEmitter from '@/utils/eventEmitter';

export default {
  props: {
    info: {
      type: Object,
      require: true,
    },
  },
  computed: {
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  methods: {
    copy() {
      this.$store.dispatch('copy/copy');
      this.hideContextMenu();
    },
    paste() {
      this.$store.dispatch('copy/paste', this.info);
      this.$store.dispatch('snapshot/recordSnapshot');
      this.hideContextMenu();
    },
    cut() {
      this.$store.dispatch('copy/cut');
      this.$store.dispatch('snapshot/recordSnapshot');
      this.hideContextMenu();
    },
    deleteComponent() {
      this.$store.dispatch('component/deleteCurComponent');
      this.$store.dispatch('snapshot/recordSnapshot');
      this.hideContextMenu();
    },
    lock() {
      this.$store.dispatch('lock/lock');
      this.$store.dispatch('snapshot/recordSnapshot');
      this.hideContextMenu();
    },
    unlock() {
      this.$store.dispatch('lock/unlock');
      this.$store.dispatch('snapshot/recordSnapshot');
      this.hideContextMenu();
    },
    topComponent() {},
    bottomComponent() {},
    upComponent() {},
    downComponent() {},
    hideContextMenu() {
      eventEmitter.emit('hideContextMenu');
    },
  },
};
</script>

<style scoped lang="scss">
.contextmenu {
  position: absolute;
  ul {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    padding: 6px 0;
    margin: 5px 0;

    li {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
