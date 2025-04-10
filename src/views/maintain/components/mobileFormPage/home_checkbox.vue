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
  name: 'home_checkbox',
  cname: '多选框',
  icon: 'icon-biaodanzujian-duoxuankuang',
  configName: 'c_home_checkbox',
  type: 0, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'checkboxs', // 外面匹配名称
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
        name: 'checkboxs',
        timestamp: this.num,
        titleConfig: {
          title: '标题',
          val: '多选框',
          place: '请输入标题',
          max: 10,
          type: 'form',
          isShow: 1,
        },
        wordsConfig: {
          title: '选项',
          list: [
            { val: '选项一', show: false },
            { val: '选项二', show: false },
          ],
          isShow: 1,
        },
        titleShow: {
          title: '是否必填',
          val: true,
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
    width: 90px;
  }
  .textVal {
    max-width: 265px;
    .item {
      font-size: 13px;
      color: #282828;
      padding: 5px 0;
      margin: 0 10px;
      .select {
        width: 17px;
        height: 17px;
        border: 1px solid #cccccc;
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
