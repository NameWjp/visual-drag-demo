<template>
  <div class="toolbar">
    <el-button>撤消</el-button>
    <el-button>恢复</el-button>
    <label for="input" class="el-button el-button--default el-button--small">
      <span>插入图片</span>
    </label>
    <el-button>预览</el-button>
    <el-button>保存</el-button>
    <el-button>清空画布</el-button>
    <el-button>组合</el-button>
    <el-button>拆分</el-button>
    <el-button>锁定</el-button>
    <el-button>解锁</el-button>
    <div class="canvas-config">
      <span>画布大小</span>
      <input :value="canvasStyle.width" @input="e => setCanvasStyle('width', e.target.value)" />
      <span>*</span>
      <input :value="canvasStyle.height" @input="e => setCanvasStyle('height', e.target.value)" />
    </div>
    <div class="canvas-config">
      <span>画布比例</span>
      <input :value="canvasStyle.scale" @input="handleScaleChange"/> %
    </div>
  </div>
  <input type="file" id="input" hidden />
</template>

<script>
import { mapState } from 'vuex';
import { debounce, cloneDeep } from 'lodash-es';

const needChangeStyle = ['top', 'left', 'width', 'height', 'fontSize', 'borderWidth'];

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('canvas', [
      'canvasStyle',
    ]),
    ...mapState('component', [
      'componentList',
    ]),
  },
  methods: {
    setCanvasStyle(key, value) {
      this.$store.commit('canvas/setCanvasStyle', {
        ...this.canvasStyle,
        [key]: Number(value),
      });
    },
    format(value, scale) {
      return value * (scale / 100);
    },
    getOriginStyle(value) {
      const scale = this.canvasStyle.scale;
      return value / (scale / 100);
    },
    handleScaleChange: debounce(function handleScaleChange(e) {
      const scale = parseInt(e.target.value, 10) || 1;

      const componentList = cloneDeep(this.componentList);
      componentList.forEach(component => {
        Object.keys(component.style).forEach(key => {
          if (needChangeStyle.includes(key)) {
            // 不能用 Math.round 防止 1 px 的边框变 0
            component.style[key] = Math.ceil(
              this.format(this.getOriginStyle(component.style[key]), scale),
            );
          }
        });
      });

      this.setCanvasStyle('scale', scale);
      this.$store.commit('component/setComponentList', componentList);
    }, 1000),
  },
  components: {},
};
</script>

<style scoped lang="scss">
.toolbar {
  height: 64px;
  line-height: 64px;
  box-sizing: border-box;
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 10px;
  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;
    input {
      width: 50px;
      margin-left: 10px;
      outline: none;
      padding: 0 5px;
      border: 1px solid #ddd;
      color: #606266;
    }
    span {
      margin-left: 10px;
    }
  }
}
</style>
