<template>
  <div>
    <el-drawer :visible.sync="dialogVisible" :direction="direction" size="1000px" :before-close="handleClose">
      <div v-if="orderDatalist" v-loading="loading">
        <div class="detailHead">
          <div class="full">
            <div class="order_icon"><span class="iconfont icon-dingdan"></span></div>
            <div class="text">
              <div class="title">{{ orderDatalist.type | orderTypeFilter }}</div>
              <div>
                <span class="mr20">订单号：{{ orderDatalist.orderNo }}</span>
              </div>
            </div>
          </div>
          <ul class="list">
            <li class="item">
              <div class="title">订单状态</div>
              <div class="color-warning">
                <span v-if="orderDatalist.refundStatus === 3">已退款</span>
                <span v-else>{{ orderDatalist.status | orderStatusFilter }}</span>
              </div>
            </li>
            <li class="item">
              <div class="title">实际支付</div>
              <div>¥ {{ orderDatalist.payPrice || '0.0' }}</div>
            </li>
            <li class="item">
              <div class="title">支付方式</div>
              <div>{{ orderDatalist.payType | payTypeFilter }}</div>
            </li>
            <li class="item">
              <div class="title">支付时间</div>
              <div>{{ orderDatalist.payTime | filterEmpty }}</div>
            </li>
          </ul>
        </div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="订单信息" name="detail">
            <div class="detailSection" style="border: none">
              <div class="title">用户信息</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">用户名称：</div>
                  <div class="value">{{ orderDatalist.nikeName }} | {{ orderDatalist.uid }}</div>
                </li>
                <li class="item">
                  <div class="lang">用户电话：</div>
                  <div class="value">{{ orderDatalist.phone }}</div>
                </li>
              </ul>
            </div>
            <div v-show="orderDatalist.shippingType < 2 && orderDatalist.secondType !== 2" class="detailSection">
              <div class="title">收货信息</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">收货人：</div>
                  <div class="value">
                    {{ orderDatalist.realName }}
                  </div>
                </li>
                <li class="item">
                  <div class="lang">收货电话：</div>
                  <div class="value">
                    {{ orderDatalist.userPhone }}
                  </div>
                </li>
                <li class="item">
                  <div class="lang">收货地址：</div>
                  <div class="value">
                    {{ orderDatalist.userAddress }}
                  </div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">订单信息</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">商品总价：</div>
                  <div class="value">{{ orderDatalist.proTotalPrice }}</div>
                </li>
                <li class="item">
                  <div class="lang">商品总数：</div>
                  <div class="value">{{ orderDatalist.totalNum }}</div>
                </li>
                <li class="item">
                  <div class="lang">平台优惠金额：</div>
                  <div class="value">{{ orderDatalist.platCouponPrice }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付状态：</div>
                  <div class="value">{{ orderDatalist.paid ? '已支付' : '未支付' }}</div>
                </li>
                <li class="item">
                  <div class="lang">实际支付：</div>
                  <div class="value">{{ orderDatalist.payPrice || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">商户优惠金额：</div>
                  <div class="value">{{ orderDatalist.merCouponPrice || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">会员抵扣金额：</div>
                  <div class="value">{{ orderDatalist.svipDiscountPrice || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付邮费：</div>
                  <div class="value">{{ orderDatalist.payPostage }}</div>
                </li>
                <li class="item">
                  <div class="lang">赠送积分：</div>
                  <div class="value">{{ orderDatalist.gainIntegral }}</div>
                </li>
                <li class="item">
                  <div class="lang">积分抵扣金额：</div>
                  <div class="value">{{ orderDatalist.integralPrice || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付方式：</div>
                  <div class="value">{{ orderDatalist.payType | payTypeFilter }}</div>
                </li>
                <li class="item">
                  <div class="lang">配送方式：</div>
                  <div v-if="Number(orderDatalist.secondType) > 4" class="value">自动发货</div>
                  <div v-else-if="Number(orderDatalist.secondType) == 2" class="value">虚拟发货</div>
                  <div v-else class="value">{{ orderDatalist.shippingType | shippingTypeFilter }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付时间：</div>
                  <div class="value">{{ orderDatalist.payTime | filterEmpty }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">买家留言</div>
              <ul class="list">
                <li class="item">
                  <div>{{ orderDatalist.userRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">商家备注</div>
              <ul class="list">
                <li class="item">
                  <div>{{ orderDatalist.merchantRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
            <div v-if="orderExtend.length" class="detailSection">
              <div class="title">自定义留言</div>
              <ul class="list">
                <li class="item" v-for="(item, index) in orderExtend" :key="index">
                  <div class="lang" :title="item.title">{{ item.title }}</div>
                  <div>{{ item.title.includes(':') ? '' : '：' }}</div>
                  <div v-if="!Array.isArray(item.value)" class="value">{{ item.value | filterEmpty }}</div>
                  <div v-else class="flex conter">
                    <template v-if="item.value">
                      <div v-for="(pic, idx) in item.value" :key="idx">
                        <el-image v-if="pic.includes('http')" class="pictrue" :src="pic" :preview-src-list="[pic]" />
                        <div v-else class="text-14px fontColor333 ml-5px acea-row row-middle mr5">
                          {{ pic }}
                          <div style="margin-left: 6px" v-show="idx < item.value.length - 1">-</div>
                        </div>
                      </div>
                    </template>
                    <template v-else> - </template>
                  </div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="goods" class="tabBox">
            <el-table class="mt20 orderDetailList" :data="orderDatalist.orderDetailList" size="small">
              <el-table-column label="商品信息" min-width="400" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="demo-image__preview mr15">
                      <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                    </div>
                    <div style="width: 408px">
                      <div class="line1 mb10">{{ scope.row.productName }}</div>
                      <div class="line1 color-909399 line-heightOne">规格：{{ scope.row.sku }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品售价" min-width="90">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="line1">
                      {{ scope.row.price }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="购买数量" min-width="90">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="line1">
                      {{ scope.row.payNum }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="orderDatalist.shippingType == 2 ? '核销数量' : '发货数量'" min-width="90">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="line1">
                      {{ scope.row.deliveryNum }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="售后数量" min-width="90">
                <template slot-scope="scope">
                  <div class="acea-row row-middle">
                    <div class="line1 mb10 line-heightOne">退款中：{{ scope.row.applyRefundNum }}</div>
                    <div class="line1 line-heightOne">退款成功：{{ scope.row.refundNum }}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            v-if="
              orderDatalist.status > 1 &&
              orderDatalist.status < 9 &&
              orderDatalist.secondType < 5 &&
              orderDatalist.status !== 3 &&
              orderDatalist.shippingType != 2
            "
            label="发货记录"
            name="delivery"
            class="tabBox"
          >
            <template v-for="item in InvoiceList">
              <div v-if="InvoiceList.length">
                <el-table class="mt20" :data="item.detailList" size="small" :key="item.id">
                  <el-table-column min-width="400">
                    <template slot="header" slot-scope="scope">
                      <template v-if="item.deliveryType === 'express'">
                        <span class="font-color">【快递配送】</span>
                        <span>{{ item.expressName + '：' + item.trackingNumber }}</span>
                        <span class="ml30">{{ item.createTime }}</span>
                      </template>
                      <template v-else-if="item.deliveryType === 'merchant'">
                        <span class="font-color">【商家送货】</span>
                        <span>{{ item.deliveryCarrier + '：' + item.carrierPhone }}</span>
                        <span class="ml30">{{ item.createTime }}</span>
                      </template>
                      <template v-else>
                        <span class="font-color"
                          >【{{
                            orderDatalist.secondType === OrderSecondTypeEnum.Fictitious ? '虚拟发货' : '无需配送'
                          }}】</span
                        >
                        <span>{{ item.createTime }}</span>
                      </template>
                    </template>
                    <template slot-scope="scope">
                      <div class="acea-row row-middle">
                        <div class="demo-image__preview mr15">
                          <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                        </div>
                        <div style="width: 408px">
                          <div class="line1 mb10 line-heightOne">{{ scope.row.productName }}</div>
                          <div class="line1 color-909399 line-heightOne">规格：{{ scope.row.sku }}</div>
                        </div>
                        <div class="acea-row row-middle ml30">
                          <div class="line1 font12 color-text">X {{ scope.row.num }}</div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="400" fixed="right">
                    <template slot="header" slot-scope="scope">
                      <div class="flex mr10" style="justify-content: flex-end">
                        <a
                          @click="handleEditLogistics(item)"
                          style="line-height: 1; height: auto"
                          v-hasPermi="['merchant:order:invoice:update']"
                          >修改配送信息
                        </a>
                        <a
                          class="ml20"
                          @click="openLogistics(item.id, item.expressName)"
                          style="line-height: 1; height: auto"
                          v-if="checkPermi(['merchant:order:logistics:info']) && item.deliveryType === 'express'"
                          >查看物流
                        </a>
                      </div>
                    </template>
                    <template v-if="item.deliveryType === 'noNeed'" slot-scope="scope">
                      <div class="acea-row row-middle">
                        <div class="font12 color-text">发货备注：{{ item.deliveryMark }}</div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
            <div v-if="parseFloat(orderDatalist.shippingType) === 2">
              <div class="detailSection">
                <ul class="list">
                  <li class="item">
                    <div>核销员名称：</div>
                    <div class="value">{{ orderDatalist.clerkName }} | {{ orderDatalist.clerkId }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
    <el-dialog v-if="orderDatalist" title="提示" :visible.sync="modal2" width="600px">
      <div class="logistics acea-row row-top">
        <div class="logistics_img"><img src="@/assets/imgs/expressi.jpg" /></div>
        <div class="logistics_cent">
          <span class="mb10">物流公司：{{ expressName }}</span>
          <span>物流单号：{{ resultInfo.number }}</span>
          <span v-show="resultInfo.courierPhone">快递站：{{ resultInfo.courierPhone }}</span>
          <span v-show="resultInfo.courierPhone">快递员电话：{{ resultInfo.courierPhone }}</span>
        </div>
      </div>
      <div class="acea-row row-column-around trees-coadd">
        <div class="scollhide">
          <el-timeline :reverse="reverse">
            <el-timeline-item v-for="(item, i) in result" :key="i">
              <p class="time" v-text="item.time"></p>
              <p class="content" v-text="item.status"></p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modal2 = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 修改配送信息-->
    <editDelivery
      :visible="editDeliveryDialogVisible"
      :editData="editData"
      @onCloseVisible="onCloseVisible"
      @onSubmitSuccess="onSubmitSuccess"
    ></editDelivery>
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

import { getLogisticsInfoApi, orderInvoiceListApi, orderDetailApi, refundOrderDetailApi } from '@/api/order';
import { orderRefundStatusFilter } from '@/filters';
import editDelivery from './editDelivery';
import { checkPermi } from '@/utils/permission';
import { OrderSecondTypeEnum } from '@/enums/productEnums'; // 权限判断函数
export default {
  name: 'OrderDetail',
  components: {
    editDelivery,
  },
  props: {
    orderNo: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      OrderSecondTypeEnum: OrderSecondTypeEnum,
      activeName: 'detail',
      direction: 'rtl',
      reverse: true,
      dialogVisible: false,
      orderDatalist: {},
      loading: false,
      modal2: false,
      result: [],
      resultInfo: {},
      InvoiceList: [],
      refundInfo: {},
      editDeliveryDialogVisible: false,
      editData: {},
      orderExtend: [], //系统表单数据
      expressName: '', //快递名称
    };
  },
  watch: {},
  mounted() {},
  methods: {
    checkPermi,
    orderRefundStatusFilter,
    //修改物流信息
    handleEditLogistics(row) {
      this.editDeliveryDialogVisible = true;
      this.editData = row;
    },
    //修改物流信息成功
    onSubmitSuccess() {
      this.getOrderInvoiceList(this.orderNo);
      this.onCloseVisible();
    },
    //关闭配送信息
    onCloseVisible() {
      this.editDeliveryDialogVisible = false;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    openLogistics(id, expressName) {
      this.expressName = expressName;
      this.getOrderData(id);
      this.modal2 = true;
    },
    // 获取订单退款信息
    getRefundOrderDetail(id) {
      refundOrderDetailApi(id).then(async (res) => {
        this.refundInfo = res;
      });
    },
    // 获取订单物流信息
    getOrderData(id) {
      getLogisticsInfoApi(id).then(async (res) => {
        this.resultInfo = res;
        this.result = res.list;
      });
    },
    // 获取订单发货单列表
    getOrderInvoiceList(id) {
      this.InvoiceList = [];
      orderInvoiceListApi(id)
        .then((res) => {
          this.InvoiceList = [...res];
        })
        .catch(() => {});
    },
    getDetail(id) {
      this.loading = true;
      orderDetailApi(id)
        .then((res) => {
          this.orderDatalist = res;
          this.orderExtend = res.orderExtend ? JSON.parse(res.orderExtend) : [];
          this.activeName = 'detail';
          this.loading = false;
        })
        .catch(() => {
          this.orderDatalist = null;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-drawer__header {
  display: flex !important;
  align-items: flex-start !important;
  padding: 15px 15px 0 15px !important;
  margin: 0 !important;
}
::v-deep .el-drawer__body{
  padding: 0 0 30px 0 !important;
}
::v-deep .demo-drawer_title {
  width: 90%;
}
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
.InvoiceList {
  ::v-deep.el-collapse-item__header {
    font-size: 12px;
    color: #606266;
  }
}

.wrapper {
  background-color: #fff;
  margin-top: 7px;
  padding: 10px 12px;
  &-num {
    font-size: 10px;
    color: #999999;
  }

  &-title {
    color: #666666;
    font-size: 12px;
  }

  &-img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 7px;
    overflow: hidden;
    margin-bottom: 10px;

    image {
      width: 100%;
      height: 100%;
    }

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}

.title {
  font-size: 36px;
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

.logistics {
  align-items: center;
  padding: 10px 0px;
  .logistics_img {
    width: 45px;
    height: 45px;
    margin-right: 12px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .logistics_cent {
    span {
      display: block;
      font-size: 12px;
    }
  }
}

.trees-coadd {
  width: 100%;
  height: 400px;
  border-radius: 4px;
  overflow: hidden;
  .scollhide {
    width: 100%;
    height: 100%;
    overflow: auto;
    margin-left: 18px;
    padding: 10px 0 10px 0;
    box-sizing: border-box;
    .content {
      font-size: 12px;
    }

    .time {
      font-size: 12px;
      color: #2d8cf0;
    }
  }
}

.title {
  margin-bottom: 14px;
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

.description {
  &-term {
    display: table-cell;
    padding-bottom: 5px;
    line-height: 20px;
    width: 50%;
    font-size: 12px;
    color: #606266;
  }
  ::v-deep .el-divider--horizontal {
    margin: 12px 0 !important;
  }
}
</style>
