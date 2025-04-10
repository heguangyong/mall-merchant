<template>
  <div class="divBox" style="padding-bottom: 0">
    <el-row :gutter="14" class="ranking">
      <el-col v-bind="grid" class="ivu-mb mb14" v-hasPermi="['merchant:statistics:home:product:pay:ranking']">
        <el-card class="box-card" shadow="never" :bordered="false">
          <div class="header_title_line">商品支付排行</div>
          <el-table :data="payData" style="width: 100%" class="mt20">
            <el-table-column type="index" label="排名" width="60">
              <template slot-scope="scope">
                <span
                  class="index_common"
                  v-bind:class="[
                    scope.$index + 1 == '1'
                      ? 'index_one'
                      : scope.$index + 1 == '2'
                      ? 'index_two'
                      : scope.$index + 1 == '3'
                      ? 'index_three'
                      : 'index_more',
                  ]"
                >
                  {{ scope.$index + 1 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="商品信息" min-width="320">
              <template slot-scope="scope">
                <div class="product_info">
                  <div class="demo-image__preview line-heightOne">
                    <el-image
                      class="img"
                      :src="scope.row.image"
                      :preview-src-list="[scope.row.image]"
                      v-if="scope.row.image"
                    />
                    <img class="img" style="width: 36px; height: 36px" v-else :src="defaultImg" alt="" />
                  </div>
                  <div class="m-l-10 line1">{{ scope.row.proName }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="salesAmount" label="支付金额"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col v-bind="grid" class="ivu-mb mb14" v-hasPermi="['merchant:statistics:home:product:pageview:ranking']">
        <el-card class="box-card" shadow="never" :bordered="false">
          <div class="header_title_line">商品访客排行</div>
          <el-table :data="pageviewData" style="width: 100%" class="mt20">
            <el-table-column type="index" label="排名" width="60">
              <template slot-scope="scope">
                <span
                  class="index_common"
                  v-bind:class="[
                    scope.$index + 1 == '1'
                      ? 'index_one'
                      : scope.$index + 1 == '2'
                      ? 'index_two'
                      : scope.$index + 1 == '3'
                      ? 'index_three'
                      : 'index_more',
                  ]"
                >
                  {{ scope.$index + 1 }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="商品信息" min-width="320">
              <template slot-scope="scope">
                <div class="product_info">
                  <div class="demo-image__preview line-heightOne">
                    <el-image
                      class="img"
                      :src="scope.row.image"
                      :preview-src-list="[scope.row.image]"
                      v-if="scope.row.image"
                    />
                    <img class="img" style="width: 36px; height: 36px" v-else :src="defaultImg" alt="" />
                  </div>
                  <div class="m-l-10 line1">{{ scope.row.proName }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="pageView" label="访问量"></el-table-column>
          </el-table>
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

import { viewModelApi, pageviewDataApi, payDataApi } from '@/api/dashboard';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  data() {
    return {
      grid: { xl: 12, lg: 12, md: 12, sm: 12, xs: 24 },
      pageviewData: [],
      payData: [],
    };
  },
  methods: {
    checkPermi,
    // 获取商品浏览量排行榜
    getPageviewData() {
      pageviewDataApi().then((res) => {
        this.pageviewData = res;
      });
    },
    // 获取商品支付排行榜
    getPayData() {
      payDataApi().then((res) => {
        this.payData = res;
      });
    },
  },
  mounted() {
    if (checkPermi(['merchant:statistics:home:product:pageview:ranking'])) this.getPageviewData();
    if (checkPermi(['merchant:statistics:home:product:pay:ranking'])) this.getPayData();
  },
};
</script>
<style scoped lang="scss">
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
.ranking {
  ::v-deep .el-card__header {
    padding: 15px 20px !important;
  }
}
.product_info {
  display: flex;
  .img {
    border-radius: 4px 4px 4px 4px;
  }
}
.m-l-10 {
  margin-left: 10px;
}
.line1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.index_common {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  border-radius: 4em; //图案为圆形
  color: #ffffff;
  text-align: center;
}
.index_one {
  background: #ebca80;
}
.index_two {
  background: #abb4c7;
}
.index_three {
  background: #ccb3a0;
}
.index_more {
  background: #cccccc;
}
</style>
