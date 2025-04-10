<template>
  <div>
    <el-dialog title="商品列表" :visible.sync="visible" width="944px" :before-close="handleClose" class="dialog-bottom">
      <good-list
        v-if="visible"
        @getStoreItem="getStoreItem"
        :handleNum="handleNum"
        :checked="checked"
        :maxlength="maxlength"
        @closeDialog="closeDialog"
      ></good-list>
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

import goodList from '@/components/goodList/index.vue';
export default {
  name: 'GoodListFrom',
  components: { goodList },
  data() {
    return {
      handleNum: '',
      visible: false,
      callback: function () {},
      checked: [],
      maxlength: 0,
    };
  },
  methods: {
    closeDialog() {
      this.visible = false;
    },
    handleClose() {
      this.visible = false;
    },
    getStoreItem(img) {
      this.callback(img);
      this.visible = false;
    },
  },
};
</script>

<style scoped></style>
