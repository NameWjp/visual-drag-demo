<template>
  <div class="toolbar">
    <el-button>撤消</el-button>
    <el-button>恢复</el-button>
    <label for="input" class="el-button el-button--default el-button--small">插入图片</label>
    <el-button>预览</el-button>
    <el-button @click="save">保存</el-button>
    <el-button @click="clearComponents">清空画布</el-button>
    <el-button :disabled="!areaData.components.length" @click="compose">组合</el-button>
    <el-button
      :disabled="!curComponent || curComponent.isLock || curComponent.component !== 'group'"
      @click="decompose"
    >
      拆分
    </el-button>
    <el-button @click="handleLock" :disabled="!curComponent || curComponent.isLock">锁定</el-button>
    <el-button @click="handleUnlock" :disabled="!curComponent || !curComponent.isLock">解锁</el-button>
    <div class="canvas-config">
      <span>画布大小</span>
      <input :value="canvasStyle.width" @input="setCanvasStyle('width', $event.target.value)" />
      <span>*</span>
      <input :value="canvasStyle.height" @input="setCanvasStyle('height', $event.target.value)" />
    </div>
    <div class="canvas-config">
      <span>画布比例</span>
      <input :value="canvasStyle.scale" @input="handleScaleChange"/> %
    </div>
  </div>
  <input type="file" @change="handleFileChange" id="input" hidden />
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { debounce } from 'lodash-es';
import { commonStyle, commonAttr } from '@/store/component-list';
import generateID from '@/utils/generateID';
import { CANVAS_DATA, CANVAS_STYLE } from '@/constant';

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
    ...mapState('compose', [
      'areaData',
    ]),
    ...mapGetters('component', [
      'curComponent',
    ]),
  },
  methods: {
    compose() {
      this.$store.dispatch('compose/compose');
    },
    decompose() {
      this.$store.dispatch('compose/decompose');
    },
    clearComponents() {
      this.$store.commit('component/setComponentList', []);
    },
    save() {
      localStorage.setItem(CANVAS_DATA, JSON.stringify(this.componentList));
      localStorage.setItem(CANVAS_STYLE, JSON.stringify(this.canvasStyle));
      this.$message.success('保存成功');
    },
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

      const componentList = [...this.componentList];
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
    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file.type.includes('image')) {
        this.$message.error('只能插入图片');
        return;
      }

      const reader = new FileReader();
      reader.onload = (res) => {
        const base64Url = res.target.result;

        const img = new Image();
        img.onload = () => {
          this.$store.commit('component/addComponent', {
            component: {
              ...commonAttr,
              id: generateID(),
              component: 'picture',
              label: '图片',
              propValue: base64Url,
              style: {
                ...commonStyle,
                left: 0,
                top: 0,
                borderRadius: '',
                width: img.width,
                height: img.height,
              },
            },
          });
        };

        img.src = base64Url;
      };

      reader.readAsDataURL(file);
    },
    handleLock() {
      this.changeCurComponent({ isLock: true });
    },
    handleUnlock() {
      this.changeCurComponent({ isLock: false });
    },
    changeCurComponent(attr) {
      const newComponent = { ...this.curComponent, ...attr };
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
