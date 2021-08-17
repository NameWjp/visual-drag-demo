<template>
  <div class="event-control">
    <el-button @click="handleShowEventPanel">添加事件</el-button>
    <div class="tag-wrap">
      <el-tag
        v-for="event in Object.keys(curComponent.events)"
        :key="event"
        closable
        @close="removeEvent(event)"
      >
        {{ event }}
      </el-tag>
    </div>
  </div>
  <el-drawer
    :size="400"
    :withHeader="false"
    v-model="showEventPanel"
    direction="ltr"
  >
    <el-tabs v-model="eventActiveName" type="card">
      <el-tab-pane
        v-for="item in eventList"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <div class="event-content">
          <el-input v-if="item.key == 'redirect'" v-model="item.param" type="textarea" placeholder="请输入完整的 URL" />
          <el-input v-if="item.key == 'alert'" v-model="item.param" type="textarea" placeholder="请输入要 alert 的内容" />
          <el-button style="margin-top: 20px;" @click="addEvent(item.key, item.param)">确定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { eventList } from '@/utils/events';

export default {
  data() {
    return {
      showEventPanel: false,
      eventActiveName: 'redirect',
      eventList,
    };
  },
  computed: {
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  methods: {
    handleShowEventPanel() {
      this.showEventPanel = true;
    },
    addEvent(event, param) {
      this.$store.dispatch('event/addEvent', { event, param });
      this.showEventPanel = false;
    },
    removeEvent(event) {
      this.$store.dispatch('event/removeEvent', event);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.event-control {
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
.event-content {
  padding: 10px 15px;
}
</style>
