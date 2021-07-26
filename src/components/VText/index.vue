<template>
  <div class="v-text">
    <div
      ref="text"
      :contenteditable="canEdit"
      @dblclick="handleDBClick"
      @blur="handleBlur"
      @input="handleInput"
      @paste.prevent="clearStyle"
    />
  </div>
</template>

<script>

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
  methods: {
    clearStyle(e) {
      const clp = e.clipboardData;
      const text = clp.getData('text/plain') || '';
      if (text) {
        const dom = this.$refs.text;
        dom.append(text);
        // 移动光标到末尾
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.selectAllChildren(dom);
        selection.collapseToEnd();
        // 重新调整大小
        this.$emit('input', this.element, e.target.innerHTML);
      }
    },
    handleInput(e) {
      this.$emit('input', this.element, e.target.innerHTML);
    },
    handleBlur(e) {
      this.canEdit = false;
      this.$store.commit('component/changeComponent', {
        component: this.element,
        newComponent: {
          ...this.element,
          propValue: e.target.innerHTML || '&nbsp;',
        },
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
  line-height: 1.4;
  div {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
