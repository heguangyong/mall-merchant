<template>
  <div class="mobile-config">
    <el-form ref="formInline">
      <div v-for="(item, key) in rCom" :key="key">
        <component
          :is="item.components.name"
          :configObj="configObj"
          ref="childData"
          :configNme="item.configNme"
          :key="key"
          :index="activeIndex"
          :num="item.num"
          @getConfig="getConfig"
        ></component>
      </div>
      <rightBtn :activeIndex="activeIndex" :configObj="configObj"></rightBtn>
    </el-form>
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
import toolCom from '@/components/PageDiy/mobileConfigRight/index.js';
import rightBtn from '@/components/PageDiy/rightBtn/index.vue';
export default {
  name: 'c_home_comb',
  componentsName: 'home_comb',
  cname: '头部组件',
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
  components: {
    ...toolCom,
    rightBtn,
  },
  data() {
    return {
      hotIndex: 1,
      configObj: {}, // 配置对象
      rCom: [
        {
          components: toolCom.c_checked_tab,
          configNme: 'setUp',
        },
      ],
    };
  },
  watch: {
    num(nVal) {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[nVal]));
      this.configObj = value;
    },
    configObj: {
      handler(nVal, oVal) {
        this.$store.commit('mobildConfig/UPDATEARR', { num: this.num, val: nVal });
      },
      deep: true,
    },
    'configObj.setUp.tabVal': {
      handler(nVal, oVal) {
        var arr = [this.rCom[0]];
        if (nVal == 0) {
          this.rCom = [];
        } else {
          let tempArr = [
            {
              components: toolCom.c_title,
              configNme: 'followColor',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'followColor',
            },
            {
              components: toolCom.c_slider,
              configNme: 'logoStyleRadius',
            },
          ];
          this.rCom = arr.concat(tempArr);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[this.num]));
      this.configObj = value;
    });
  },
  methods: {
    getConfig() {
      // if (this.configObj.searConfig.tabVal === 0) {
      //   this.configObj.logoConfig.isShow = 0;
      // } else {
      //   this.configObj.logoConfig.isShow = 1;
      // }
    },
  },
};
</script>

<style scoped lang="scss">
.title-tips {
  padding-bottom: 10px;
  color: #333;
  span {
    margin-right: 14px;
    color: #999;
  }
}
</style>
