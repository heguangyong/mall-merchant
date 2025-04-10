<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-if="checkPermi(['merchant:order:page:list'])"
    >
      <div class="padding-add">
        <el-form inline label-position="right" @submit.native.prevent>
          <el-form-item label="订单编号：" label-width="66px">
            <el-input
              v-model.trim="tableFrom.orderNo"
              placeholder="请输入订单号"
              class="form_content_width"
              size="small"
              @keyup.enter.native="handleSearchList"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="订单类型：">
            <el-select
              v-model="tableFrom.type"
              clearable
              size="small"
              placeholder="请选择"
              class="form_content_width"
              @change="handleSearchList"
            >
              <el-option v-for="(item, i) in fromType" :key="i" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timeVal"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              @change="onchangeTime"
              class="form_content_width"
            />
          </el-form-item>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="tableFrom" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card
      shadow="never"
      :bordered="false"
      class="box-card mt16"
      :body-style="{ padding: '0 20px 20px' }"
      v-if="checkPermi(['merchant:order:status:num', 'merchant:order:page:list'])"
    >
      <el-tabs class="list-tabs" v-model="tableFrom.status" @tab-click="handleSearchList">
        <el-tab-pane name="all" :label="`全部(${orderChartType.all || 0})`"></el-tab-pane>
        <el-tab-pane name="notShipped" :label="`待发货(${orderChartType.notShipped || 0})`"></el-tab-pane>
        <el-tab-pane name="spike" :label="`待收货(${orderChartType.spike || 0})`"></el-tab-pane>
        <el-tab-pane name="awaitVerification" :label="`待核销(${orderChartType.verification || 0})`"></el-tab-pane>
        <el-tab-pane name="receiving" :label="`已收货(${orderChartType.receiving || 0})`"></el-tab-pane>
        <el-tab-pane name="complete" :label="`已完成(${orderChartType.complete || 0})`"></el-tab-pane>
        <el-tab-pane name="refunded" :label="`已退款(${orderChartType.refunded || 0})`"></el-tab-pane>
        <el-tab-pane name="deleted" :label="`已删除(${orderChartType.deleted || 0})`"></el-tab-pane>
      </el-tabs>
      <div class="mt5">
        <el-button size="small" type="primary" @click="onWriteOff" v-hasPermi="['merchant:order:verification']"
          >核销订单</el-button
        >
        <el-button size="small" @click="exports" v-hasPermi="['merchant:export:order:excel']">导出</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        size="mini"
        class="mt20"
        highlight-current-row
        :row-key="
          (row) => {
            return row.orderNo;
          }
        "
      >
        <el-table-column label="订单号" min-width="220" v-if="checkedCities.includes('订单号')">
          <template slot-scope="scope">
            <div class="acea-row">
              <font v-show="scope.row.type === 1" class="mr5">[秒杀]</font>
              <font v-show="scope.row.type === 2" class="mr5">[拼团]</font>
              <span style="display: block" v-text="scope.row.orderNo" />
            </div>
            <div class="flex">
              <span class="colorPrompt" v-show="parseInt(scope.row.refundStatus) > 0" style="display: block">{{
                scope.row.refundStatus | orderRefundStatusFilter
              }}</span>
              <span v-show="scope.row.refundStatus == 2" class="colorPrompt">{{
                `（已退款 ${scope.row.refundNum} / 购买 ${scope.row.totalNum}）`
              }}</span>
            </div>
            <span v-show="scope.row.isUserDel" class="colorPrompt" style="display: block">用户已删除</span>
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" min-width="150" v-if="checkedCities.includes('用户昵称')">
          <template slot-scope="scope">
            <span :class="scope.row.isLogoff == true ? 'colorPrompt' : ''">{{ scope.row.nickName }}</span>
            <span :class="scope.row.isLogoff == true ? 'colorPrompt' : ''" v-if="scope.row.isLogoff == true">|</span>
            <span v-if="scope.row.isLogoff == true" class="colorPrompt">(已注销)</span>
          </template>
        </el-table-column>
        <el-table-column prop="payPrice" label="实际支付" min-width="80" v-if="checkedCities.includes('实际支付')" />
        <el-table-column label="支付方式" min-width="80" v-if="checkedCities.includes('支付方式')">
          <template slot-scope="scope">
            <span>{{ scope.row.payType | payTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" min-width="100" v-if="checkedCities.includes('订单状态')">
          <template slot-scope="scope">
            <span class="textE93323 tag-background notStartTag tag-padding" v-if="scope.row.refundStatus === 3"
              >已退款</span
            >
            <span
              :class="scope.row.status < 5 ? 'doingTag' : 'endTag'"
              class="tag-background tag-padding"
              v-else-if="
                scope.row.groupBuyRecordStatus == 99 || scope.row.status == 9 || scope.row.groupBuyRecordStatus == 10
              "
              >{{ scope.row.status | orderStatusFilter }}</span
            >
            <span class="textE93323 tag-background notStartTag tag-padding" v-else>{{
              scope.row.groupBuyRecordStatus == 0 ? '拼团中' : '拼团失败'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.merchantRemark | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" min-width="150" v-if="checkedCities.includes('下单时间')" />
        <el-table-column width="180" fixed="right">
          <template slot="header">
            <p>
              <span style="padding-right: 5px">操作</span>
              <i class="el-icon-setting" @click="handleAddItem"></i>
            </p>
          </template>
          <template slot-scope="scope">
            <a
              @click="onOrderDetails(scope.row.orderNo)"
              v-if="checkPermi(['merchant:order:info']) && scope.row.groupBuyRecordStatus != 0"
              >详情
            </a>
            <el-divider direction="vertical" v-if="scope.row.groupBuyRecordStatus != 0"></el-divider>
            <template
              v-if="
                (scope.row.status === 1 || scope.row.status === 2) &&
                parseFloat(scope.row.refundStatus) < 3 &&
                checkPermi(['merchant:order:send']) &&
                scope.row.groupBuyRecordStatus != 0
              "
            >
              <a @click="sendOrder(scope.row)">发货 </a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <el-dropdown trigger="click" v-if="scope.row.groupBuyRecordStatus != 0">
              <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="onDirectRefund(scope.row)"
                  v-if="
                    scope.row.refundStatus == 0 &&
                    !scope.row.userRefundSign &&
                    checkPermi(['merchant:order:direct:refund'])
                  "
                  >直接退款
                </el-dropdown-item>
                <!-- 打印小票订单状态  待发货/待核销/待收货/已收货/已核销/已完成/已退款 原始订单状态
       订单状态（0：待支付，1：待发货,2：部分发货， 3：待核销，4：待收货,5：已收货,6：已完成，9：已取消）-->
                <el-dropdown-item
                  @click.native="handlePrintReceipt(scope.row)"
                  v-if="
                    (parseFloat(scope.row.status) < 7 || scope.row.refundStatus == 3) &&
                    merPrintStatus !== 2 &&
                    checkPermi(['merchant:order:print'])
                  "
                  >打印小票
                </el-dropdown-item>
                <el-dropdown-item @click.native="onOrderMark(scope.row)" v-if="checkPermi(['merchant:order:mark'])"
                  >订单备注
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.isUserDel === 1 && checkPermi(['merchant:order:delete'])"
                  @click.native="handleDelete(scope.row, scope.$index)"
                  >删除订单
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
      <div class="card_abs" v-show="card_select_show">
        <template>
          <div class="cell_ht">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
              >全选
            </el-checkbox>
            <el-button size="small" type="text" @click="checkSave()">保存</el-button>
          </div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in columnData" :label="item" :key="item" class="check_cell">{{
              item
            }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </div>
    </el-card>

    <!--记录-->
    <el-dialog title="操作记录" :visible.sync="dialogVisibleJI" width="700px">
      <el-table v-loading="LogLoading" border :data="tableDataLog.data" style="width: 100%">
        <el-table-column prop="oid" label="ID" min-width="80" />
        <el-table-column prop="changeMessage" label="操作记录" min-width="280" />
        <el-table-column prop="createTime" label="操作时间" min-width="280" />
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableFromLog.limit"
          :current-page="tableFromLog.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataLog.total"
          @size-change="handleSizeChangeLog"
          @current-change="pageChangeLog"
        />
      </div>
    </el-dialog>

    <!--详情-->
    <details-from ref="orderDetail" :orderNo="orderNo" />

    <!-- 发送货 -->
    <order-send ref="send" :orderNo="orderNo" :secondType="secondType" @submitFail="handleSearchList"></order-send>

    <!-- 直接退款 -->
    <direct-refund
      v-if="dialogVisibleDirectRefund"
      :dialogVisibleDirectRefund="dialogVisibleDirectRefund"
      :type="type"
      @handlerSuccessClose="handlerSuccessClose"
      @handlerSuccessSubmit="handlerSuccessSubmit"
      :orderNo="orderNo"
    ></direct-refund>
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

import {
  orderStatusNumApi,
  orderListApi,
  orderLogApi,
  orderMarkApi,
  orderDeleteApi,
  orderPrint,
  orderDetailApi,
  writeUpdateApi,
  orderExcelApi,
  orderPrintReceiptApi,
} from '@/api/order';
import detailsFrom from './components/orderDetail';
import orderSend from './orderSend';
import Cookies from 'js-cookie';
import { isWriteOff } from '@/utils';
import { checkPermi } from '@/utils/permission';
import DirectRefund from '@/views/order/components/directRefund.vue';
import * as $constants from '@/utils/constants';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
let tableFroms = {
  status: 'all',
  dateLimit: '',
  orderNo: '',
  page: 1,
  limit: $constants.page.limit[0],
  type: '',
  searchType: 'all',
  content: '',
};
export default {
  name: 'orderlistDetails',
  components: {
    DirectRefund,
    detailsFrom,
    orderSend,
  },
  data() {
    return {
      RefuseVisible: false,
      RefuseData: {},
      orderNo: '',
      refundVisible: false,
      refundData: {},
      dialogVisibleJI: false,
      tableDataLog: {
        data: [],
        total: 0,
      },
      tableFromLog: {
        page: 1,
        limit: this.$constants.page.limit[0],
        orderNo: 0,
      },
      LogLoading: false,
      isCreate: 1,
      editData: null,
      dialogVisible: false,
      tableData: {
        data: [],
        total: 0,
      },
      listLoading: false,
      tableFrom: Object.assign({}, tableFroms),
      orderChartType: {},
      timeVal: [],
      fromList: this.$constants.fromList,
      fromType: [
        { value: '', text: '全部' },
        { value: '0', text: '普通' },
        { value: '1', text: '秒杀' },
        { value: '2', text: '拼团' },
      ],
      selectionList: [],
      ids: '',
      orderids: '',
      cardLists: [],
      isWriteOff: isWriteOff(),
      proType: 0,
      active: false,
      card_select_show: false,
      checkAll: false,
      checkedCities: ['订单号', '用户昵称', '实际支付', '支付方式', '订单状态', '下单时间'],
      columnData: ['订单号', '用户昵称', '实际支付', '支付方式', '订单状态', '下单时间'],
      isIndeterminate: true,
      orderDatalist: null,
      merPrintStatus: Cookies.get('merPrint'), // 商家小票打印开关状态
      dialogVisibleDirectRefund: false,
      secondType: 0, //订单二级类型:0-普通订单，1-积分订单，2-虚拟订单，4-视频号订单，5-云盘订单，6-卡密订单
      type: 0, //订单类型
    };
  },
  mounted() {
    if (checkPermi(['merchant:order:page:list'])) this.getList();
    if (checkPermi(['merchant:order:status:num'])) this.getOrderStatusNum();
  },
  methods: {
    checkPermi,
    //直接退款
    onDirectRefund(row) {
      this.orderNo = row.orderNo;
      this.type = row.type;
      this.dialogVisibleDirectRefund = true;
    },
    //直接退款关闭
    handlerSuccessClose() {
      this.dialogVisibleDirectRefund = false;
    },
    //直接退款成功回调
    handlerSuccessSubmit() {
      this.dialogVisibleDirectRefund = false;
      this.getList();
    },
    // 核销订单
    onWriteOff(row) {
      this.$modalPrompt('text', '核销订单', null, '核销码').then((V) => {
        writeUpdateApi({ verifyCode: V }).then(() => {
          this.$message.success('核销成功');
          this.handleSearchList();
        });
      });
    },
    handleReset() {
      this.tableFrom.type = '';
      this.tableFrom.dateLimit = '';
      this.tableFrom.orderNo = '';
      this.tableFrom.page = 1;
      this.tableFrom.content = '';
      this.tableFrom.searchType = 'all';
      this.selectChange();
    },
    resetFormRefundhandler() {
      this.refundVisible = false;
    },
    resetFormRefusehand() {
      this.RefuseVisible = false;
    },
    resetForm(formValue) {
      this.dialogVisible = false;
    },
    handleSearchList() {
      this.tableFrom.page = 1;
      this.getList();
      this.getOrderStatusNum();
    },
    // 发送
    sendOrder(row) {
      if (row.isLogoff) {
        this.$modalSure('当前用户已注销，有责发货！').then(() => {
          this.onSend(row);
        });
      } else {
        if (row.refundStatus == 1) return this.$message.error('请先处理售后，再进行发货/核销操作');
        this.onSend(row);
      }
    },
    handlePrintReceipt(row) {
      this.$modalSure('确认打印小票').then(() => {
        orderPrintReceiptApi(row.orderNo).then((data) => {
          this.$message.success('小票打印成功');
        });
      });
    },
    //发货操作
    onSend(row) {
      this.secondType = row.secondType;
      this.orderNo = row.orderNo;
      this.$refs.send.modals = true;
      //this.$refs.send.getList();
      this.$refs.send.orderProDetail(row.orderNo);
    },
    // 订单删除
    handleDelete(row, idx) {
      if (row.isDel) {
        this.$modalSure().then(() => {
          orderDeleteApi({ orderNo: row.orderNo }).then(() => {
            this.$message.success('删除成功');
            handleDeleteTable(this.tableData.data.length, this.tableFrom);
            this.getList();
            this.getOrderStatusNum();
          });
        });
      } else {
        this.$confirm('您选择的的订单存在用户未删除的订单，无法删除用户未删除的订单！', '提示', {
          confirmButtonText: '确定',
          type: 'error',
        });
      }
    },
    // 详情
    onOrderDetails(id) {
      this.orderNo = id;
      this.$refs.orderDetail.getDetail(id);
      this.$refs.orderDetail.getOrderInvoiceList(id);
      this.$refs.orderDetail.dialogVisible = true;
    },
    getDetail(id) {
      this.loading = true;
      orderDetailApi(id)
        .then((res) => {
          this.orderDatalist = res;
          this.loading = false;
        })
        .catch(() => {
          this.orderDatalist = null;
          this.loading = false;
        });
    },
    // 订单记录
    onOrderLog(id) {
      this.dialogVisibleJI = true;
      this.LogLoading = true;
      this.tableFromLog.orderNo = id;
      orderLogApi(this.tableFromLog)
        .then((res) => {
          this.tableDataLog.data = res.list;
          this.tableDataLog.total = res.total;
          this.LogLoading = false;
        })
        .catch(() => {
          this.LogLoading = false;
        });
    },
    pageChangeLog(page) {
      this.tableFromLog.page = page;
      this.onOrderLog();
    },
    handleSizeChangeLog(val) {
      this.tableFromLog.limit = val;
      this.onOrderLog();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 备注
    onOrderMark(row) {
      this.$modalPrompt('textarea', '备注', row.merchantRemark, '订单备注').then((V) => {
        orderMarkApi({ remark: V, orderNo: row.orderNo }).then(() => {
          this.$message.success('操作成功');
          this.getList();
        });
      });
    },
    handleSelectionChange(val) {
      this.selectionList = val;
      const data = [];
      this.selectionList.map((item) => {
        data.push(item.orderNo);
      });
      this.ids = data.join(',');
    },
    // 选择时间
    selectChange(tab) {
      this.timeVal = [];
      this.tableFrom.page = 1;
      this.getList();
      this.getOrderStatusNum();
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.tableFrom.page = 1;
      this.getList();
      this.getOrderStatusNum();
    },
    // 列表
    getList() {
      this.listLoading = true;
      orderListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list || [];
          this.tableData.total = res.total;
          this.listLoading = false;
          this.checkedCities = this.$cache.local.has('order_stroge')
            ? this.$cache.local.getJSON('order_stroge')
            : this.checkedCities;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 获取各状态数量
    getOrderStatusNum() {
      let data = Object.assign({}, this.tableFrom);
      delete data.page;
      delete data.limit;
      delete data.status;
      orderStatusNumApi(data).then((res) => {
        this.orderChartType = res;
      });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    exports() {
      let data = {
        dateLimit: this.tableFrom.dateLimit,
        orderNo: this.tableFrom.orderNo,
        status: this.tableFrom.status,
        type: this.tableFrom.type,
      };
      orderExcelApi(data).then((res) => {
        window.open(res.fileName);
      });
    },
    handleAddItem() {
      if (this.card_select_show) {
        this.$set(this, 'card_select_show', false);
      } else if (!this.card_select_show) {
        this.$set(this, 'card_select_show', true);
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.columnData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnData.length;
    },
    checkSave() {
      this.$set(this, 'card_select_show', false);
      this.$modal.loading('正在保存到本地，请稍候...');
      this.$cache.local.setJSON('order_stroge', this.checkedCities);
      setTimeout(this.$modal.closeLoading(), 1000);
    },
    //打印小票
    onOrderPrint(data) {
      orderPrint(data.orderNo)
        .then((res) => {
          this.$modal.msgSuccess('打印成功');
        })
        .catch((error) => {
          this.$modal.msgError(error.message);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
font {
  color: var(--prev-color-primary);
}
.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}

.demo-table-expand {
  ::v-deep .label {
    width: 83px !important;
  }
}

.refunding {
  span {
    display: block;
  }
}

.el-icon-arrow-down {
  font-size: 12px;
}

.tabBox_tit {
  font-size: 12px !important;
  /*margin: 0 2px 0 10px;*/
  letter-spacing: 1px;
  /*padding: 5px 0;*/
  box-sizing: border-box;
}

.text_overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.pup_card {
  width: 200px;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 16px;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.relative {
  position: relative;
}

.card_abs {
  position: absolute;
  padding-bottom: 15px;
  top: 340px;
  right: 40px;
  width: 200px;
  background: #fff;
  z-index: 99999;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
}

.cell_ht {
  height: 50px;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check_cell {
  width: 100%;
  padding: 15px 20px 0;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
</style>
