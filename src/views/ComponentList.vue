<template>
  <div class="component-list">
    <div
      v-for="(item, index) in componentList"
      :key="index"
      :data-index="index"
      class="item"
      draggable="true"
      @dragstart="handleDragStart"
    >
      <svg-icon class="icon" :class="item.icon" :iconClass="item.icon" />
      <span class="text">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import componentList from '@/store/component-list';

export default {
  data() {
    return {
      componentList,
    };
  },
  created() {
    window.ondragend = () => {
      this.$store.commit('drag/setDragElement', null);
    };
  },
  methods: {
    handleDragStart(e) {
      this.$store.commit('drag/setDragElement', e.target);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.component-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px 15px;
  .item {
    box-sizing: border-box;
    width: 45%;
    height: 30px;
    border: 1px solid #ddd;
    cursor: grab;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      font-size: 18px;
      margin-right: 3px;
      &.tupian {
        font-size: 24px;
        margin-right: 0;
      }
      &.button {
        font-size: 20px;
      }
    }
  }
}
</style>
