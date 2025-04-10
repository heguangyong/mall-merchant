<template>
  <div>
    <el-drawer :visible.sync="dialogVisible" :direction="direction" size="1000px" :before-close="handleClose">
      <div>
        <div class="detailHead">
          <div class="full">
            <div class="order_icon"><span class="iconfont icon-dingdan"></span></div>
            <div class="text">
              <div class="title">
                <span>{{ groupInfo.groupName }}</span>
                <el-tag
                  size="mini"
                  effect="plain"
                  :type="groupInfo.groupProcess == 0 ? 'success' : groupInfo.groupProcess == 1 ? 'warning' : 'info'"
                  >{{ groupProcessArr[groupInfo.groupProcess] }}</el-tag
                >
              </div>
              <div>
                <span class="mr20">{{ `${groupInfo.startTime}至${groupInfo.endTime}` }}</span>
              </div>
            </div>
          </div>
          <ul class="list">
            <li class="item">
              <div class="title">审核状态</div>
              <div>
                <span>{{ groupStatusArr[groupInfo.groupStatus] }}</span>
              </div>
            </li>
            <li class="item">
              <div class="title">开团数</div>
              <div>{{ groupInfo.totalActivityBegin }}</div>
            </li>
            <li class="item">
              <div class="title">成团数</div>
              <div>{{ groupInfo.totalActivityDone }}</div>
            </li>
            <li class="item">
              <div class="title">参团订单数</div>
              <div>{{ groupInfo.totalOrderBegin }}</div>
            </li>
            <li class="item">
              <div class="title">成团订单数</div>
              <div>{{ groupInfo.totalOrderDone }}</div>
            </li>
          </ul>
        </div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="活动信息" name="detail">
            <div class="detailSection" style="border: none">
              <div class="title">基础信息</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">活动标签：</div>
                  <div class="value">{{ groupInfo.buyCount }}人团</div>
                </li>
                <li class="item">
                  <div class="tips">成团人数：</div>
                  <div class="value">{{ groupInfo.buyCount }}</div>
                </li>
                <li class="item">
                  <div class="tips">成团有效期：</div>
                  <div class="value">{{ groupInfo.validHour }}小时</div>
                </li>
                <li class="item">
                  <div class="tips">活动限购：</div>
                  <div class="value">{{ groupInfo.allQuota == -1 ? '不限' : groupInfo.allQuota }}</div>
                </li>
                <li class="item">
                  <div class="tips">单次限购：</div>
                  <div class="value">{{ groupInfo.oncQuota == -1 ? '不限' : groupInfo.oncQuota }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">高级设置</div>
              <ul class="list">
                <li class="item">
                  <div class="tips">凑团：</div>
                  <div class="value">{{ groupInfo.showGroup ? '开启' : '关闭' }}</div>
                </li>
                <li class="item">
                  <div class="tips">虚拟成团：</div>
                  <div class="value">{{ groupInfo.fictiStatus ? '开启' : '关闭' }}</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="goods">
            <div>
              <div
                class="table-box"
                v-for="(item, index) in groupInfo.groupBuyActivityProductResponseList"
                :key="index"
              >
                <div class="detailHead">
                  <div class="full">
                    <i
                      class="iconfont iconChange"
                      :class="item.visible ? 'icon-xuanze' : 'icon-xiala1'"
                      @click="openClose(item)"
                    ></i>
                    <img :src="item.image" alt="" />
                    <div class="text table-text">
                      <div class="title line1" :title="item.productName">{{ item.productName }}</div>
                    </div>
                  </div>
                </div>
                <div class="tablelHead text-title" v-if="!item.groupBuyActivitySkuResponses.length">
                  该商品已下架，无法进行拼团购买！
                </div>
                <div class="tablelHead" v-if="item.groupBuyActivitySkuResponses.length">
                  <el-table
                    :data="item.groupBuyActivitySkuResponses"
                    class="orderDetailList"
                    size="small"
                    v-if="!item.visible"
                  >
                    <el-table-column label="图片">
                      <template slot-scope="scope">
                        <img :src="scope.row['attrValue'][0].image" alt="" />
                      </template>
                    </el-table-column>
                    <el-table-column label="规格" prop="sku">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].sku }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品编码" prop="barCode">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].barCode || '--' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="售价（元）" prop="price">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].price }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="剩余库存" prop="stock">
                      <template slot-scope="scope">
                        <span>{{ scope.row['attrValue'][0].stock }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="拼团价（元）" prop="activePrice"></el-table-column>
                    <el-table-column label="拼团限量" prop="quota"></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
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
  props: {},
  data() {
    return {
      activeName: 'detail',
      direction: 'rtl',
      dialogVisible: false,
      groupInfo: {},
      groupStatusArr: ['初始化', '已拒绝', '已撤销', '待审核', '已通过'],
      groupProcessArr: ['未开始', '进行中', '已结束'],
    };
  },
  watch: {},
  mounted() {
    this.activeName = 'detail';
  },
  methods: {
    openClose(item) {
      if (item.visible) {
        this.$set(item, 'visible', false);
      } else {
        this.$set(item, 'visible', true);
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-tabs__content {
  padding: 0 20px !important;
}

.detailSection {
  padding: 25px 15px !important;
}

::v-deep .el-table th.el-table__cell > .cell,
::v-deep.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  padding-left: 15px;
}

.demo-drawer__content {
  padding: 0 30px;
}

.demo-image__preview {
  display: inline-block;

  .el-image {
    width: 50px;
    height: 50px;
  }
}
.table-box {
  margin-top: 15px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  .detailHead {
    padding: 15px 20px !important;
  }
  .tablelHead {
    padding: 0 20px 15px;
  }
  .full {
    img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
  }
  .title.line1 {
    width: 600px;
  }
}
.table-text {
  .title {
    margin-bottom: 0 !important;
    font-size: 13px !important;
  }
}
.text-title {
  font-size: 12px;
  color: red;
}
.iconChange {
  font-size: 16px !important;
  color: #999 !important;
  cursor: pointer;
}
</style>
