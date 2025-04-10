<template>
  <div>
    <el-dialog title="优惠劵" :visible.sync="visible" width="944px" :before-close="handleClose" class="dialog-bottom">
      <coupon-list
        v-if="visible"
        :handle="handle"
        :userIds="userIds"
        :couponData="coupons"
        @getCouponId="getCouponId"
        :keyNum="keyNum"
        :userType="userType"
        @dialogclose="dialogclose"
      ></coupon-list>
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

import couponList from '../index.vue';
export default {
  name: 'CouponFrom',
  components: { couponList },
  data() {
    return {
      visible: false,
      callback: function () {},
      handle: '',
      keyNum: 0,
      coupons: [],
      userIds: '',
      userType: '',
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
    },
    getCouponId(couponObj) {
      this.callback(couponObj);
      this.visible = false;
    },
    dialogclose() {
      this.visible = false;
    },
  },
};
</script>

<style scoped></style>
