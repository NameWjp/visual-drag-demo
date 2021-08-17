<template>
  <div @click="handleClick">
    <slot />
  </div>
</template>

<script>
import runAnimation from '@/utils/runAnimation';
import { mixins } from '@/utils/events';

export default {
  mixins: [mixins],
  props: {
    element: {
      require: true,
      type: Object,
    },
  },
  mounted() {
    runAnimation(this.$el, this.element.animations);
  },
  methods: {
    handleClick() {
      const events = this.element.events;
      Object.keys(events).forEach(event => {
        this[event](events[event]);
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
