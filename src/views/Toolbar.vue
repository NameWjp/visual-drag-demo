<template>
  <div class="toolbar">
    <el-button>撤消</el-button>
    <el-button>重做</el-button>
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
      <input />
      <span>*</span>
      <input />
    </div>
    <div class="canvas-config">
      <span>画布比例</span>
      <input /> %
    </div>
  </div>
  <input type="file" id="input" hidden />
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
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
