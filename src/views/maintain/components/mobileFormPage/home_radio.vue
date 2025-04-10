<template>
  <div class="text-box acea-row row-between">
    <div class="title">{{ titleTxt }}</div>
    <div class="textVal acea-row row-middle row-right">
      <div class="item acea-row row-middle" v-for="(item, index) in list" :key="index">
        <div class="select acea-row row-center-wrapper" :class="item.show ? 'on' : ''">
          <span class="iconfont icon-complete" v-if="item.show"></span>
        </div>
        <div>{{ item.val }}</div>
      </div>
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
import { mapState } from 'vuex';
export default {
  name: 'home_radio',
  cname: '单选框',
  icon: 'icon-biaodanzujian-danxuankuang',
  configName: 'c_home_radio',
  type: 0, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'radios', // 外面匹配名称
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
      defaultConfig: {
        name: 'radios',
        timestamp: this.num,
        titleConfig: {
          title: '标题',
          val: '单选框',
          place: '请输入标题',
          max: 10,
          type: 'form',
          isShow: 1,
        },
        wordsConfig: {
          title: '选项',
          list: [
            { val: '选项一', show: true },
            { val: '选项二', show: false },
          ],
        },
        titleShow: {
          title: '是否必填',
          val: false,
          type: 'form',
          isShow: 1,
        },
      },
      titleTxt: '',
      pageData: {},
      list: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.pageData = this.$store.state.mobildConfig.defaultArray[this.num];
      this.setConfig(this.pageData);
    });
  },
  methods: {
    setConfig(data) {
      if (!data) return;
      if (data.titleConfig) {
        this.titleTxt = data.titleConfig.val;
        this.list = data.wordsConfig.list;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.text-box {
  width: 100%;
  background: #fff;
  padding: 8px 5px 8px 12px;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  align-items: baseline;
  .title {
    width: 95px;
  }
  .textVal {
    max-width: 250px;
    .item {
      font-size: 13px;
      color: #282828;
      padding: 5px 0;
      margin: 0 10px;
      .select {
        width: 19px;
        height: 19px;
        border: 1px solid #cccccc;
        border-radius: 50%;
        margin-right: 7px;
        .iconfont {
          font-size: 12px;
        }
        &.on {
          background-color: #e93323;
          color: #fff;
          border-color: #e93323;
        }
      }
    }
  }
}
</style>
