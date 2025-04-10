<template>
  <div>
    <el-time-select
      placeholder="起始时间"
      v-model="startTime"
      :picker-options="{
        start: '00:00',
        step: '01:00',
        end: '24:00',
      }"
    >
    </el-time-select>
    <el-time-select
      placeholder="结束时间"
      v-model="endTime"
      :picker-options="{
        start: '00:00',
        step: '01:00',
        end: '24:00',
        minTime: startTime,
      }"
    >
    </el-time-select>
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
  name: 'TimeSelect',
  data() {
    return {
      startTime: '',
      endTime: '',
    };
  },
  props: {
    value: {},
  },
  beforeMount() {
    // 接收 v-model 数据
    if (this.value) {
      this.startTime = this.value.split(',')[0];
      this.endTime = this.value.split(',')[1];
    }
  },
  watch: {
    startTime: function (val) {
      this.$emit('input', [val, this.endTime].join(','));
    },
    endTime: function (val) {
      this.$emit('input', [this.startTime, val].join(','));
    },
  },
};
</script>

<style scoped></style>
