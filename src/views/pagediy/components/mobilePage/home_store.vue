<template>
  <div class="page-container" v-if="configObj">
    <!--店铺信息-->
    <div id="store" class="diyStore">
      <div class="pictrue overflow" :style="logoStyleRadius">
        <img :src="JavaMerchantConfigInfo.avatar" alt="" />
      </div>
      <div class="text">
        <div class="acea-row row-middle mb5">
          <div class="name text333">crmeb旗舰店</div>
          <div class="iconfont icon-xuanze text333"></div>
        </div>
        <div class="merchantInfo flex">
          <div class="mr6 self_min merType bg-color">自营</div>
          <div class="mr10 merType color-FAAD14">{{ JavaMerchantBaseInfo.merType }}</div>
          <div class="score">
            <div class="starsList flex">
              <div v-for="(itemn, indexn) in JavaMerchantBaseInfo.starLevel" :key="indexn">
                <span class="iconfont icon-pingfen textE93323"></span>
              </div>
              <div class="flex" v-show="Number(JavaMerchantBaseInfo.starLevel) < 5">
                <span v-for="(itemn, indexn) in noStarLevel" :key="indexn" class="iconfont icon-pingfen noCheck"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button hover-class="none" class="merCollect" :style="followColor">
        <span class="iconfont icon-guanzhu"></span>{{ JavaMerchantBaseInfo.isCollect ? '已关注' : '关注' }}
      </button>
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
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'home_store',
  cname: '店铺信息',
  icon: 't-icon-zujian-dianpujie',
  configName: 'c_home_store',
  type: 0, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'homeStore', // 外面匹配名称
  props: {
    index: {
      type: null,
    },
    num: {
      type: null,
    },
  },
  computed: {
    ...mapState('mobildConfig', ['defaultArray']),
    //关注颜色
    followColor() {
      return [
        {
          color: this.configObj.followColor.color[0].item,
        },
        {
          border: `1px solid ${this.configObj.followColor.color[0].item}`,
        },
      ];
    },
    //logo圆角
    logoStyleRadius() {
      return [
        { 'border-radius': this.configObj.logoStyleRadius.val ? this.configObj.logoStyleRadius.val + 'px' : '0' },
      ];
    },
  },
  watch: {
    pageData: {
      handler(nVal, oVal) {
        this.setConfig(nVal);
      },
      deep: true,
    },
    num: {
      handler(nVal, oVal) {
        let data = this.$store.state.mobildConfig.defaultArray[nVal];
        this.setConfig(data);
      },
      deep: true,
    },
    defaultArray: {
      handler(nVal, oVal) {
        let data = this.$store.state.mobildConfig.defaultArray[this.num];
        this.setConfig(data);
      },
      deep: true,
    },
  },
  data() {
    return {
      // 默认初始化数据禁止修改
      defaultConfig: {
        name: 'homeStore',
        timestamp: this.num,
        setUp: {
          cname: '店铺信息',
        },
        // 关注按钮颜色
        followColor: {
          tabTitle: '样式设置',
          title: '关注按钮颜色',
          default: [
            {
              item: '#303133',
            },
          ],
          color: [
            {
              item: '#303133',
            },
          ],
        },
        logoStyleRadius: {
          title: 'logo圆角',
          name: 'logoStyleRadius',
          val: 7,
          min: 0,
          max: 30,
        },
      },
      // tabVal: '',
      pageData: {},
      style: 0,
      curIndex: 0,
      bgUrl: '',
      configObj: null,
      JavaMerchantBaseInfo: {}, //商户信息
      JavaMerchantConfigInfo: {}, //商户头像、背景图信息
      noStarLevel: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.pageData = this.$store.state.mobildConfig.defaultArray[this.num];
      this.setConfig(this.pageData);
    });
    this.JavaMerchantBaseInfo = JSON.parse(localStorage.getItem('JavaMerchantBaseInfo'));
    this.JavaMerchantConfigInfo = JSON.parse(localStorage.getItem('JavaMerchantConfigInfo'));
    if (parseInt(this.JavaMerchantBaseInfo.starLevel) < 5)
      this.noStarLevel = 5 - parseInt(this.JavaMerchantBaseInfo.starLevel);
  },
  methods: {
    getConfig(data) {},
    setConfig(data) {
      if (!data) return;
      if (data) {
        this.configObj = data;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.diyStore {
  background: #fff;
}
.pictrue {
  margin-right: 6px !important;
}
.mr6 {
  margin-right: 8px !important;
}
.icon-pingfen {
  font-size: 11px !important;
}
</style>
