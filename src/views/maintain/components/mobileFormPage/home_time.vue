<template>
  <div class="text-box acea-row row-between-wrapper">
    <span class="title">{{ titleTxt }}</span>
    <div class="textVal">
      <span class="place" v-if="tipVal">{{ tipVal }}</span>
      <span class="place on" v-else>{{ time }}</span>
      <span class="iconfont icon-xuanze"></span>
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
import { formatDate } from '@/utils/validate';
import { mapState } from 'vuex';
export default {
  name: 'home_time',
  cname: '时间',
  icon: 'icon-biaodanzujian-shijian',
  configName: 'c_home_time',
  type: 0, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'times', // 外面匹配名称
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
        name: 'times',
        timestamp: this.num,
        titleConfig: {
          title: '标题',
          val: '时间',
          place: '请输入标题',
          max: 10,
          type: 'form',
          isShow: 1,
        },
        valConfig: {
          title: '默认值',
          type: 'time',
          specifyDate: '',
          tabVal: 0,
          tabData: 0,
          tabList: [
            {
              name: '显示',
            },
            {
              name: '隐藏',
            },
          ],
          dataList: [
            {
              name: '当前时间',
            },
            {
              name: '指定时间',
            },
          ],
        },
        tipConfig: {
          title: '提示语',
          val: '请选择',
          place: '请输入提示语',
          max: 10,
          type: 'form',
          isShow: 1,
        },
        titleShow: {
          title: '是否必填',
          val: true,
          type: 'form',
        },
      },
      titleTxt: '',
      tipVal: '',
      pageData: {},
      time: '',
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
        if (data.valConfig.tabVal == 0) {
          if (data.valConfig.tabData == 0) {
            this.tipVal = '';
            var now = new Date();
            var hours = now.getHours(); // 得到时间
            var minutes = now.getMinutes(); // 得到分钟
            let minute = minutes < 10 ? '0' + minutes : minutes;
            hours = hours.toString().padStart(2, '0');
            var current = `${hours}:${minute}`;
            this.time = current;
          } else {
            if (data.valConfig.specifyDate) {
              this.tipVal = '';
              this.time = data.valConfig.specifyDate;
            } else {
              this.tipVal = data.tipConfig.val;
            }
          }
        } else {
          this.tipVal = data.tipConfig.val;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.text-box {
  width: 100%;
  background: #fff;
  padding: 11px 10px 11px 12px;
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  .title {
    width: 95px;
  }
  .textVal {
    width: 250px;
    text-align: right;
    .iconfont {
      color: #999;
      margin-left: 10px;
    }
    .place {
      font-weight: 400;
      color: #cccccc;
      &.on {
        color: #333;
      }
    }
  }
}
</style>
