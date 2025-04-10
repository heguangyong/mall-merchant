<template>
  <div class="mobile-config-from">
    <div v-for="(item, key) in rCom" :key="key">
      <component
        :is="item.components && item.components.name"
        :configObj="configObj"
        ref="childData"
        :configNme="item.configNme"
        :key="key"
        @getConfig="getConfig"
        :index="activeIndex"
        :num="item.num"
      ></component>
    </div>
    <rightBtn :activeIndex="activeIndex" :configObj="configObj"></rightBtn>
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
import { formatDate } from '@/utils/validate';
import toolCom from '../mobileConfigRight/index.js';
import rightBtn from '../rightBtn/index.vue';
export default {
  name: 'c_home_date',
  componentsName: 'home_date',
  components: {
    ...toolCom,
    rightBtn,
  },
  props: {
    activeIndex: {
      type: null,
    },
    num: {
      type: null,
    },
    index: {
      type: null,
    },
  },
  data() {
    return {
      configObj: {},
      rCom: [
        {
          components: toolCom.c_input_item,
          configNme: 'titleConfig',
        },
        {
          components: toolCom.c_comb_data,
          configNme: 'valConfig',
        },
        {
          components: toolCom.c_input_item,
          configNme: 'tipConfig',
        },
        {
          components: toolCom.c_is_show,
          configNme: 'titleShow',
        },
      ],
    };
  },
  watch: {
    num(nVal) {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[nVal]));
      this.getChange(value);
      this.configObj = value;
    },
    configObj: {
      handler(nVal, oVal) {
        this.getChange(nVal);
        this.$store.commit('mobildConfig/UPDATEARR', { num: this.num, val: nVal });
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[this.num]));
      this.getChange(value);
      this.configObj = value;
    });
  },
  methods: {
    getChange(value) {
      if (value.valConfig.specifyDate) {
        // value.valConfig.specifyDate = formatDate(new Date(value.valConfig.specifyDate), 'yyyy-MM-dd')
      }
    },
    // 获取组件参数
    getConfig(data) {},
  },
};
</script>

<style scoped lang="scss">
.title-tips {
  padding-bottom: 10px;
  font-size: 14px;
  color: #333;
  span {
    margin-right: 14px;
    color: #999;
  }
}
</style>
