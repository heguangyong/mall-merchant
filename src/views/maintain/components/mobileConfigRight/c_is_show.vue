<template>
  <!--开关-->
  <div v-if="configData" class="acea-row row-middle borderPadding">
    <div class="c_label labelwidth">{{ configData.title }}</div>
    <div style="width: auto" class="ml22">
      <el-switch v-model="configData.val" active-text="是" inactive-text="否" />
    </div>
  </div>
</template>

<script>
// +---------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +---------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +---------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +---------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +---------------------------------------------------------------------
export default {
  name: 'c_is_show',
  props: {
    configObj: {
      type: Object,
    },
    configNme: {
      type: String,
    },
  },
  data() {
    return {
      defaults: {},
      configData: {},
    };
  },
  created() {
    this.defaults = this.configObj;
    this.configData = this.configObj[this.configNme];
  },
  watch: {
    configObj: {
      handler(nVal, oVal) {
        this.defaults = nVal;
        this.configData = nVal[this.configNme];
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.c_label {
  line-height: 20px;
}
.c_row-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
