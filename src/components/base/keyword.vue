<template>
  <div class="arrbox">
    <el-tag
      v-for="(item, index) in labelarr"
      :key="index"
      type="success"
      :closable="!isDisabled"
      class="mr5"
      :disable-transitions="false"
      @close="labelhandleClose(item)"
      >{{ item }}
    </el-tag>
    <el-input
      v-model="val"
      size="small"
      class="arrbox_ip"
      maxlength="32"
      placeholder="输入后回车"
      @change="addlabel"
      show-word-limit
      :disabled="isDisabled"
    />
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

export default {
  name: 'keyword',
  props: {
    isDisabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    labelarr: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      val: '',
    };
  },
  methods: {
    labelhandleClose(tag) {
      const index = this.labelarr.indexOf(tag);
      this.labelarr.splice(index, 1);
    },
    addlabel() {
      const count = this.labelarr.indexOf(this.val);
      if (count === -1) {
        this.labelarr.push(this.val);
      }
      this.val = '';
      this.$emit('getLabelarr', this.labelarr);
    },
  },
};
</script>

<style scoped>
.arrbox {
  background-color: white;
  font-size: 12px;
  border-radius: 6px;
  margin-bottom: 0px;
  text-align: left;
  box-sizing: border-box;
  width: 460px;
}
</style>
