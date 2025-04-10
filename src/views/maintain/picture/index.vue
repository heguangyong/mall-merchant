<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false" :body-style="{ padding: '0 20px 20px' }">
      <upload-picture :pictureType="pictureType"></upload-picture>
    </el-card>
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
  name: 'index',
  data() {
    return {
      pictureType: 'maintain',
    };
  },
};
</script>

<style scoped></style>
