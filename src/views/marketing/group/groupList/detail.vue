<template>
  <div class="detail-box">
    <el-drawer :visible.sync="dialogVisible" :direction="direction" size="1000px" :before-close="handleClose">
      <div>
        <div class="detailHead">
          <div class="full">
            <img :src="data.productImage" alt="" />
            <div class="text">
              <div class="title line1" :title="data.productName">
                {{ data.productName }}
              </div>
            </div>
          </div>
          <ul class="list">
            <li class="item">
              <div class="title">拼团状态</div>
              <div
                class="titleStatus"
                :class="data.recordStatus == 0 ? 'info' : data.recordStatus == 10 ? 'success' : 'warning'"
              >
                {{ data.recordStatus == 0 ? '拼团中' : data.recordStatus == 10 ? '已成功' : '已失败' }}
              </div>
            </li>
            <li class="item">
              <div class="title">成团人数</div>
              <div>{{ data.buyingCountNum }}</div>
            </li>
            <li class="item">
              <div class="title">已参团人数</div>
              <div>{{ data.yetBuyingNum }}</div>
            </li>
            <li class="item">
              <div class="title">开团时间</div>
              <div>{{ data.createTime }}</div>
            </li>
            <li class="item">
              <div class="title">结束时间</div>
              <div>{{ data.endTime }}</div>
            </li>
          </ul>
        </div>
        <div class="table-line"></div>
        <div class="table-box detailHead">
          <el-table :data="data.memberDataList" class="mt20 orderDetailList" size="small">
            <el-table-column label="用户头像">
              <template slot-scope="scope">
                <div class="demo-image__preview">
                  <el-image :src="scope.row.memberAvatar" fit="cover" style="width: 50px; height: 50px" />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户信息" min-width="140">
              <template slot-scope="scope">
                <div class="acea-row">
                  <div>{{ scope.row.memberNickname }}</div>
                  <span class="fenge">|</span>
                  <div>{{ scope.row.memberId }}</div>
                  <div class="leader" v-if="scope.row.isLeader == 1">团长</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderNo" min-width="190"></el-table-column>
            <el-table-column label="商品规格" prop="orderDetailSku"></el-table-column>
            <el-table-column label="拼团时间" prop="createTime" min-width="180"></el-table-column>
            <el-table-column label="购买数量" prop="payNum"></el-table-column>
            <el-table-column label="实付金额" prop="payPrice"></el-table-column>
            <el-table-column label="已退款数量" prop="refundNum" min-width="100"></el-table-column>
          </el-table>
        </div>
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
      data: '',
    };
  },
  created() {},
  mounted() {
    this.activeName = 'detail';
  },
  methods: {
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

.full {
  img {
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }
}

.detail-box {
  position: relative;

  .block {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .table-line {
    border-top: 0.5px solid #eee;
  }
}
.fenge {
  margin: 0 5px;
}
.leader {
  font-size: 11px;
  background: #e93323;
  color: #fff;
  padding: 0 3px;
  border-radius: 5px;
  margin-left: 5px;
}
.success {
  color: var(--prev-color-endTag-color) !important;
  border: 1px solid var(--prev-color-endTag-border) !important;
}
.info {
  color: var(--prev-color-warning-color) !important;
  border: 1px solid var(--prev-color-warning-color) !important;
}
.warning {
  color: var(--prev-color-prompt-color) !important;
  border: 1px solid var(--prev-color-prompt-color) !important;
}
.titleStatus {
  font-size: 12px;
  width: 60px;
  padding: 2px 0;
  text-align: center;
  border-radius: 3px;
}
</style>
