<template>
  <div class="divBox" style="padding-bottom: 0">
    <el-row :gutter="14" class="baseInfo">
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :padding="12" :bordered="false" dis-hover shadow="never">
          <div class="acea-row row-between-wrapper">
            <div class="acea-row align-center">
              <span class="main_tit">销售额</span>
            </div>
            <el-tag type="primary">今日</el-tag>
          </div>
          <div class="content" v-if="viewData">
            <span class="content-number spBlock my15">{{ viewData.sales }}</span>
            <el-divider></el-divider>
            <div class="acea-row row-between-wrapper">
              <span class="content-time">昨日数据</span>
              <span class="content-time">{{ viewData.yesterdaySales }} 元</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false" dis-hover shadow="never" :padding="12">
          <div class="acea-row row-between-wrapper">
            <div class="acea-row align-center">
              <span class="main_tit">订单量</span>
            </div>
            <el-tag type="primary">今日</el-tag>
          </div>
          <div class="content" v-if="viewData">
            <span class="content-number spBlock my15">{{ viewData.orderNum || 0 }}</span>
            <el-divider></el-divider>
            <div class="acea-row row-between-wrapper">
              <span class="content-time">昨日数据</span>
              <span class="content-time">{{ viewData.yesterdayOrderNum || 0 }}单</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false" dis-hover shadow="never" :padding="12">
          <div class="acea-row row-between-wrapper">
            <div class="acea-row align-center">
              <span class="main_tit">访客数</span>
            </div>
            <el-tag type="primary">今日</el-tag>
          </div>
          <div class="content" v-if="viewData">
            <span class="content-number spBlock my15">{{ viewData.visitorsNum || 0 }}</span>
            <el-divider></el-divider>
            <div class="acea-row row-between-wrapper">
              <span class="content-time">昨日数据</span>
              <span class="content-time">{{ viewData.yesterdayVisitorsNum || 0 }} 人</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb">
        <el-card :bordered="false" dis-hover shadow="never" :padding="12">
          <div class="acea-row row-between-wrapper">
            <div class="acea-row align-center">
              <span class="main_tit">粉丝数</span>
            </div>
          </div>
          <div class="container" v-if="viewData">
            <div class="con_left">
              <span class="content-number spBlock m-b-15">{{ viewData.followNum || 0 }}</span>
              <span class="main_tit">关注量</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
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

import { viewModelApi } from '@/api/dashboard';
export default {
  data() {
    return {
      grid: { xl: 12, lg: 6, md: 12, sm: 12, xs: 24 },
      viewData: {},
    };
  },
  methods: {
    statisticsOrder() {
      viewModelApi().then(async (res) => {
        this.viewData = res;
      });
    },
  },
  mounted() {
    this.statisticsOrder();
  },
};
</script>
<style scoped lang="scss">
.ivu-mb {
  height: 173px;
  margin-bottom: 14px;
  .el-card {
    height: 173px;
  }
}
.up,
.el-icon-caret-top {
  color: #f5222d;
  font-size: 12px;
  opacity: 1 !important;
}

.down,
.el-icon-caret-bottom {
  color: #39c15b;
  font-size: 12px;
  /*opacity: 100% !important;*/
}
.main_tit {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}
.content-time {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
.main_badge {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin-right: 10px;
  background: #2c90ff;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.my15 {
  margin: 15px 0 15px;
}
.align-center {
  align-items: center;
}
.baseInfo {
  ::v-deep .el-card__header {
    padding: 15px 20px !important;
  }
}

.content {
  &-number {
    font-size: 30px;
    font-weight: 600;
    font-family: PingFangSC-Semibold, PingFang SC;
    color: #333;
  }
  &-time {
    font-size: 14px;
    color: #333333;
    font-weight: 400;
  }
}
.p-10 {
  padding: 10px 0;
}
.p-b-32 {
  padding-bottom: 32px;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 23px 0;
  .con_left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.m-b-15 {
  margin-bottom: 15px;
}
</style>
