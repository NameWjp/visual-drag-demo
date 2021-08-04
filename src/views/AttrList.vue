<template>
  <div class="attr-list">
    <el-form label-width="70px">
      <el-form-item
        v-for="key in styleKeys"
        :key="key"
        :label="labelMap[key]"
      >
        <el-color-picker
          v-if="colorPickerKeys.includes(key)"
          :model-value="curComponent.style[key]"
          @update:modelValue="val => handleChangeStyle(key, val)"
        />
        <el-select
          v-else-if="Object.keys(selectKeyMap).includes(key)"
          :model-value="curComponent.style[key]"
          @update:modelValue="val => handleChangeStyle(key, val)"
          placeholder="请选择"
        >
          <el-option
            v-for="item in selectKeyMap[key]"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
        <el-input
          type="number"
          :model-value="curComponent.style[key]"
          @update:modelValue="val => handleChangeStyle(key, val)"
          v-else
        />
      </el-form-item>
      <el-form-item label="内容" v-if="showContentComponents.includes(curComponent.component)">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          :model-value="curComponent.propValue"
          @update:modelValue="handleChangeValue"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

const hideStyleKeys = ['rotate'];

export default {
  data() {
    return {
      // 展示内容的组件
      showContentComponents: ['v-text', 'rect-shape'],
      // 颜色选择
      colorPickerKeys: ['borderColor', 'color', 'backgroundColor'],
      // 下拉选择框
      selectKeyMap: {
        textAlign: [
          {
            label: '左对齐',
            value: 'left',
          },
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '右对齐',
            value: 'right',
          },
        ],
        borderStyle: [
          {
            label: '实线',
            value: 'solid',
          },
          {
            label: '虚线',
            value: 'dashed',
          },
        ],
        verticalAlign: [
          {
            label: '上对齐',
            value: 'top',
          },
          {
            label: '居中对齐',
            value: 'middle',
          },
          {
            label: '下对齐',
            value: 'bottom',
          },
        ],
      },
      // label 映射
      labelMap: {
        left: 'x 坐标',
        top: 'y 坐标',
        height: '高',
        width: '宽',
        color: '颜色',
        backgroundColor: '背景色',
        borderStyle: '边框风格',
        borderWidth: '边框宽度',
        borderColor: '边框颜色',
        borderRadius: '边框半径',
        fontSize: '字体大小',
        fontWeight: '字体粗细',
        lineHeight: '行高',
        letterSpacing: '字间距',
        opacity: '透明度',
        textAlign: '左右对齐',
        verticalAlign: '上下对齐',
      },
    };
  },
  computed: {
    ...mapGetters('component', [
      'curComponent',
    ]),
    styleKeys() {
      let result = [];
      if (this.curComponent) {
        result = Object.keys(this.curComponent.style).filter(key => !hideStyleKeys.includes(key));
      }
      return result;
    },
  },
  methods: {
    handleChangeStyle(key, val) {
      this.$store.dispatch('component/setCurComponentStyle', { [key]: val });
    },
    handleChangeValue(propValue) {
      const newComponent = { ...this.curComponent };
      newComponent.propValue = propValue;

      this.$store.commit('component/changeComponent', {
        component: this.curComponent,
        newComponent,
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.attr-list {
  padding: 20px;
  height: 100%;
  overflow: auto;
}
</style>
