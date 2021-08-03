<template>
  <div class="v-text">
    <div
      ref="text"
      :class="{ canEdit }"
      :contenteditable="canEdit"
      @dblclick="handleDBClick"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    propValue: {
      type: String,
      require: true,
    },
    element: {
      type: Object,
    },
  },
  data() {
    return {
      canEdit: false,
    };
  },
  computed: {
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  methods: {
    handleMousedown(e) {
      if (this.canEdit) {
        e.stopPropagation();
      }
    },
    handleInput(e) {
      const propValue = e.target.innerHTML;
      const newComponent = { ...this.element };
      newComponent.propValue = propValue;

      this.$store.commit('component/changeComponent', {
        component: this.element,
        newComponent,
      });

      this.adjustTextHeight();
    },
    handleBlur() {
      this.canEdit = false;
    },
    adjustTextHeight() {
      const element = this.$refs.text;
      element.style.height = 'auto';
      let height = element.offsetHeight;
      element.style.height = '';

      if (height < this.element.style.height) {
        height = this.element.style.height;
      }

      this.$store.dispatch('component/setCurComponentStyle', {
        height,
      });
    },
    handleDBClick() {
      this.canEdit = true;
      // 全选
      this.$nextTick(() => {
        this.selectAllText(this.$refs.text);
      });
    },
    selectAllText(element) {
      const range = document.createRange();
      range.selectNodeContents(element);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    },
  },
  components: {},
  watch: {
    element: {
      handler() {
        this.$nextTick(() => {
          const dom = this.$refs.text;
          const text = dom.innerHTML;
          if (text !== this.element.propValue) {
            dom.innerHTML = this.element.propValue;
            this.adjustTextHeight();
          }
        });
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.v-text {
  .canEdit {
    cursor: text;
  }
  div {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
