<template>
  <el-dialog
    :visible.sync="modals"
    :close-on-click-modal="false"
    :title="secondType !== OrderSecondTypeEnum.Fictitious ? '订单发送货' : '虚拟商品发货'"
    class="order_box"
    :before-close="handleClose"
    width="900px"
  >
    <el-form v-if="modals" ref="formItem" :model="formItem" label-width="95px" @submit.native.prevent :rules="rules">
      <el-form-item v-show="secondType !== OrderSecondTypeEnum.Fictitious" label="配送方式：" prop="deliveryType">
        <el-radio-group v-model="formItem.deliveryType" @change="changeRadio(formItem.deliveryType)" v-removeAriaHidden>
          <el-radio label="express">快递配送</el-radio>
          <el-radio label="noNeed">无需发货</el-radio>
          <el-radio label="merchant">商家送货</el-radio>
        </el-radio-group>
      </el-form-item>
      <SendFrom :formItem="formItem" :isShowBtn="true"></SendFrom>
      <el-form-item v-show="secondType !== OrderSecondTypeEnum.Fictitious" label="分单发货：" prop="isSplit">
        <el-switch
          v-model="formItem.isSplit"
          :active-value="true"
          :inactive-value="false"
          active-text="开启"
          inactive-text="关闭"
        />
        <p v-show="formItem.isSplit" class="from-tips">可选择表格中的商品单独发货，请谨慎操作！</p>
      </el-form-item>
      <template v-if="formItem.isSplit">
        <el-table
          style="padding-left: 75px"
          ref="multipleSelection"
          :data="productList"
          tooltip-effect="dark"
          class="tableSelection"
          size="small"
          :row-key="
            (row) => {
              return row.id;
            }
          "
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :selectable="selectable" :reserve-selection="true" min-width="50" />
          <el-table-column label="商品信息" width="200">
            <template slot-scope="scope">
              <div class="acea-row" style="align-items: center">
                <div class="demo-image__preview line-heightOne refundImg">
                  <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                  <span class="priceBox product-info-text" style="width: 120px">{{ scope.row.productName }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="120">
            <template slot-scope="scope">
              <span class="priceBox">{{ scope.row.sku }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总数（件）" min-width="80">
            <template slot-scope="scope">
              <span class="priceBox">{{ scope.row.payNum }}</span>
              <div class="priceBox textE93323">已发{{ scope.row.deliveryNum }}</div>
              <div class="priceBox textE93323">已退款{{ scope.row.refundNum }}</div>
            </template>
          </el-table-column>
          <el-table-column label="发货数量（件）" min-width="120">
            <template slot-scope="scope">
              <el-input-number
                :disabled="scope.row.deliveryNum === scope.row.payNum"
                v-model.trim="scope.row['num']"
                :min="1"
                :max="
                  Number(scope.row.deliveryNum) == 0
                    ? Number(scope.row.payNum) - Number(scope.row.refundNum)
                    : Number(scope.row.payNum) - Number(scope.row.deliveryNum)
                "
                class="priceBox"
                :step="1"
                @blur="limitCount(scope.row, scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-form>
    <div slot="footer" class="dialog-btn-top">
      <el-button @click="cancel('formItem')">取消</el-button>
      <el-button type="primary" @click="putSend('formItem')">提交</el-button>
    </div>
  </el-dialog>
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

import { orderProDetailApi, orderSendApi } from '@/api/order';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
import SendFrom from './components/sendFrom';
import { useLogistics } from '@/hooks/use-order';
import { postRules } from '@/views/order/default';
import { OrderSecondTypeEnum } from '@/enums/productEnums';
const defaultObj = {
  deliveryType: 'express',
  isSplit: false,
  deliveryMark: '',
  carrierPhone: '',
  deliveryCarrier: '',
  expressCode: '',
  expressNumber: '',
  orderNo: '',
  detailList: [],
  // deliveryType: 'express',
  expressRecordType: '1', // 1=手动填写 2=电子面单
  // expressCode: '',
  company: '', //快递公司
  deliveryName: '',
  deliveryTel: '',
  expressName: '',
  // expressNumber: '',
  expressTempId: '',
  toAddr: '',
  toName: '',
  toTel: '',
  // orderNo: '',
  shipment: {
    sendRealName: '',
    sendPhone: '',
    sendAddress: '',
    kuaidicom: '', //快递公司编码
    serviceType: '', //快递业务类型
    pickupStartTime: '', // 取件开始时间
    pickupEndTime: '', // 取件结束时间
    tempid: '', //电子面单模板id
    dayType: 1, //时间
  },
};
export default {
  name: 'orderSend',
  components: { SendFrom },
  props: {
    orderNo: {
      type: String,
      default: '',
    },
    secondType: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    modals: {
      handler(nVal, oVal) {
        if (nVal) {
          if (this.secondType === this.OrderSecondTypeEnum.Fictitious) this.formItem.deliveryType = 'noNeed';
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      OrderSecondTypeEnum: OrderSecondTypeEnum,
      productList: [],
      formItem: { ...defaultObj },
      modals: false,
      express: [],
      exportTempList: [],
      tempImg: '',
      rules: postRules,
      multipleSelection: [],
    };
  },
  mounted() {
    this.getList();
    if (this.secondType === this.OrderSecondTypeEnum.Integral) this.formItem.deliveryType = 'noNeed';
  },
  methods: {
    checkPermi,
    //决定这一行的 CheckBox 是否可以勾选
    selectable(row, index) {
      if (row.deliveryNum === row.payNum) {
        return false;
      } else {
        return true;
      }
    },
    limitCount(row, i) {
      if (row.num > row.payNum) row.num = row.payNum;
    },
    // 分单发货选择商品
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeRadio(o) {
      this.formItem.deliveryType = o;
      this.$nextTick(function () {
        this.$refs.formItem.clearValidate();
      });
    },
    // 商品信息
    orderProDetail(orderNo) {
      orderProDetailApi(orderNo).then(async (res) => {
        this.productList = res;
        this.productList.map((item) => this.$set(item, 'num', 1));
      });
    },
    // 物流公司列表
    async getList() {
      const params = {
        keywords: '',
        page: 1,
        limit: 50,
        openStatus: true,
      };
      this.express = await useLogistics(params);
      this.express.map((item) => {
        if (item.isDefault) this.formItem.expressCode = item.code;
      });
    },
    // 提交
    putSend: Debounce(function (name) {
      let data = {};
      let attr = [];
      this.formItem.orderNo = this.orderNo;
      this.multipleSelection.map((item) => {
        attr.push({ orderDetailId: item.id, num: item.num });
      });
      this.formItem.detailList = attr;
      if (!this.formItem.isSplit) {
        data = { ...this.formItem };
        delete data.detailList;
      } else {
        if (!this.formItem.detailList.length) return this.$message.warning('请选择分单发货商品');
        let flag = false;
        this.formItem.detailList.map((item) => {
          if (!item.num) {
            flag = true;
          }
        });
        if (flag) {
          this.$message.warning('请填写发货数量');
          return;
        }
        data = this.formItem;
      }
      if (this.formItem.expressRecordType == '2') {
        if (!this.formItem.toAddr) {
          this.$message.warning('请填写寄件人地址');
          return;
        }
        if (!this.formItem.toTel) {
          this.$message.warning('请填写寄件人电话');
          return;
        }
        if (!this.formItem.toName) {
          this.$message.warning('请填写寄件人姓名');
          return;
        }
        if (!this.formItem.expressTempId) {
          this.$message.warning('请选择电子面单');
          return;
        }
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          orderSendApi(data).then((async) => {
            this.$message.success('发货成功');
            this.cancel();
            this.$emit('submitFail');
          });
        } else {
          this.$message.error('请填写信息');
        }
      });
    }),
    handleClose() {
      this.cancel();
    },
    cancel() {
      this.modals = false;
      this.formItem = { ...defaultObj, expressCode: this.formItem.expressCode };
    },
  },
};
</script>

<style scoped lang="scss">
.width8 {
  width: 80%;
}

.width9 {
  width: 70%;
}

.tempImgList {
  // opacity: 1;
  width: 38px !important;
  height: 30px !important;
  // margin-top: -30px;
  cursor: pointer;
  position: absolute;
  z-index: 11;
  img {
    width: 38px !important;
    height: 30px !important;
  }
}
.refundImg {
  display: flex;
  align-items: center;
}
.product-info-text {
  display: block;
  white-space: nowrap; /* 确保文本在一行内显示 */
  overflow: hidden; /* 超出容器部分隐藏 */
  text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
  margin-left: 5px;
}
</style>
