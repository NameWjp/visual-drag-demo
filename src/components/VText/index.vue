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
    handleMousedown(e) {
      if (this.canEdit) {
        e.stopPropagation();
      }
    },
    handleInput(e) {
      const propValue = e.target.innerHTML;
      e.target.style.height = 'auto';
      this.$nextTick(() => {
        let height = e.target.offsetHeight;
        e.target.style.height = '';
        if (height < this.element.style.height) {
          height = this.element.style.height;
        }
        this.changeComponent(propValue, height);
      });
    },
    handleBlur(e) {
      this.canEdit = false;
      const propValue = e.target.innerHTML;
      if (!propValue) {
        this.changeComponent('&nbsp;');
      }
    },
    changeComponent(value, height) {
      const newComponent = { ...this.element };
      newComponent.propValue = value;
      if (height) {
        newComponent.style.height = height;
      }

      this.$store.commit('component/changeComponent', {
        component: this.element,
        newComponent,
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
