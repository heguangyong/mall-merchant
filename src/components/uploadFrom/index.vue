<template>
  <div>
    <!--    此处 特殊需求 title 不显示的 自己额外用icon 实现关闭事件-->
    <el-dialog
      title="上传图片"
      :visible.sync="visible"
      width="950px"
      :modal="booleanVal"
      append-to-body
      :before-close="handleClose"
    >
      <el-button
        class="selfDialogClose"
        type="text"
        icon="el-icon-close"
        circle
        @click="handleClose"
        size="medium"
      ></el-button>
      <upload-picture
        v-if="visible"
        :isMore="isMore"
        :modelName="modelName"
        @getImage="getImage"
        v-hasPermi="['merchant:upload:image']"
      />
    </el-dialog>
  </div>
</template>

<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import UploadPicture from '../base/uploadPicture';
export default {
  name: 'UploadFroms',
  components: { UploadPicture },
  data() {
    return {
      visible: false,
      callback: function () {},
      isMore: '',
      modelName: '',
      ISmodal: false,
      booleanVal: false,
      isShowVideo: true,
    };
  },
  watch: {
    // show() {
    //   this.visible = this.show
    // }
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.callback(this.visible);
    },
    getImage(img) {
      this.callback(img);
      this.visible = false;
    },
  },
};
</script>

<style scoped>
/* 统一组件中的特殊组件 */
::v-deep .el-dialog__header {
  display: none !important;
}
::v-deep .el-dialog__body {
  padding: 2px 20px 0 20px !important;
}
.selfDialogClose {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 3px;
  pointer-events: auto;
  z-index: 999;
  font-size: 20px;
  color: #363f4d;
}
</style>
