<template>
  <!--单选框组-->
  <div class="flex borderPadding mb20">
    <div class="title-tips labelwidth" v-if="configData.title">
      <span>{{ configData.title }}</span>
    </div>
    <div class="radio-boxs labelml">
      <el-radio-group v-model="configData.tabVal" size="large" @change="radioChange($event)">
        <el-radio :label="index" v-for="(item, index) in configData.list" :key="index" class="mb10">
          <span>{{ item.name }}</span>
        </el-radio>
      </el-radio-group>
    </div>
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
  name: 'c_tab_radio',
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
      formData: {
        type: 0,
      },
      defaults: {},
      configData: {},
    };
  },
  watch: {
    configObj: {
      handler(nVal, oVal) {
        this.defaults = nVal;
        this.configData = nVal[this.configNme];
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.defaults = this.configObj;
      this.configData = this.configObj[this.configNme];
    });
  },
  methods: {
    radioChange(e) {
      if (this.defaults.picStyle) {
        this.defaults.picStyle.tabVal = '0';
      }

      this.$emit('getConfig', { name: 'tab_radio', values: e });
      // this.$emit('getConfig', e);
    },
  },
};
</script>

<style scoped lang="scss">
.radio-boxs {
  margin-left: 36px;
  margin-bottom: -10px;
}
.title-tips {
  font-size: 12px;
  color: #333;
  span {
    color: #999;
  }
}
</style>
