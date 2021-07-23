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
      <svg-icon class="icon" :iconClass="item.icon"></svg-icon>
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
  padding: 10px;
  .item {
    box-sizing: border-box;
    user-select: none;
    width: 45%;
    border: 1px solid #ddd;
    cursor: grab;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
    padding: 4px 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      font-size:20px;
      margin-right: 4px;
    }
  }
}
</style>
