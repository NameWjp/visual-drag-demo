<template>
  <div v-if="canvasMode === 'edit'" class="v-text" @keydown="handleKeyDown">
    <div
      ref="text"
      :class="{ canEdit }"
      :tabindex="element.id"
      :contenteditable="canEdit"
      @dblclick="handleDBClick"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
      :style="{ verticalAlign: element.style.verticalAlign }"
    />
  </div>
  <div v-else class="v-text preview">
    <div v-html="element.propValue" :style="{ verticalAlign: element.style.verticalAlign }"></div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { ctrlCode, listenCodes } from '@/effect/shortcutKey';

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
      isCtrlDown: false,
    };
  },
  computed: {
    ...mapState('canvas', [
      'canvasMode',
    ]),
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  methods: {
    handleKeyDown(e) {
      if (ctrlCode.includes(e.code)) {
        this.isCtrlDown = true;
      } else if (this.isCtrlDown && this.canEdit && listenCodes.includes(e.code)) {
        e.stopPropagation();
      }
    },
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

      const newComponent = { ...this.element };
      newComponent.style.height = height;

      this.$store.commit('component/changeComponent', {
        component: this.element,
        newComponent,
      });
    },
    handleDBClick() {
      if (this.element.isLock) return;

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
          if (this.canvasMode === 'edit') {
            const dom = this.$refs.text;
            const text = dom.innerHTML;
            if (text !== this.element.propValue) {
              dom.innerHTML = this.element.propValue;
              this.adjustTextHeight();
            }
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
  display: table;
  width: 100%;
  height: 100%;
  .canEdit {
    cursor: text;
  }
  div {
    display: table-cell;
    outline: none;
  }
}
.preview {
  user-select: none;
}
</style>
