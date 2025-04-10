<template>
  <div>
    <el-alert title="同意退款后，用户会根据下方地址将商品退回！" type="warning" show-icon class="mb20"> </el-alert>
    <div>
      <div class="detail-term mb20">
        <span class="detail-infoTitle">退货方式：</span
        ><span class="detail-info">{{ refundInfo.afterSalesType === 1 ? '仅退款' : '退货退款' }}</span>
      </div>
      <div class="detail-term acea-row">
        <span class="detail-infoTitle">退回地址：</span>
        <div v-if="!addressList.length">请先去设置-商家地址管理中添加售后地址</div>
        <div v-else v-loading="listLoading" class="h-82%">
          <div v-for="item in addressList" :key="item.id">
            <div v-if="item.isShow" class="">
              <el-card class="box-card" shadow="never" :bordered="false">
                <div class="acea-row row-between">
                  <div class="text-14 text-666 address">
                    <div class="mb10">
                      {{ item.province }}{{ item.city }}{{ item.district }}{{ item.street }}{{ item.detail }}
                      <span v-show="item.isDefault" style="color: #409eff" class="ml10">[默认退货]</span>
                    </div>
                    <div class="">
                      <span class="w-70px inline-block mr15">{{ item.receiverName }}</span
                      >{{ item.receiverPhone }}
                    </div>
                  </div>
                  <div>
                    <el-radio-group v-model="defaultId" @change="handleChecked">
                      <el-radio :label="item.id" size="large">
                        <span class="text-14px text-#666">选择地址</span>
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer-inner">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { merchantAddressListApi } from '@/api/systemSetting';
import { orderAuditApi, orderRefuseApi } from '@/api/order';

export default {
  name: 'agreeToReturn',
  props: {
    refundInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      listLoading: false,
      addressList: [],
      defaultId: 0,
      loading: false,
    };
  },
  mounted() {
    if (localStorage.getItem('merchantAddressList')) {
      this.addressList = JSON.parse(localStorage.getItem('merchantAddressList'));
      let data = this.addressList.find((item) => item.isDefault);
      if (data) {
        this.defaultId = data.id;
      }
    } else {
      this.getList();
    }
  },
  methods: {
    //确定提交
    handleSubmit() {
      this.submit();
    },
    // 提交方法
    submit() {
      this.loading = true;
      orderAuditApi({
        auditType: 'success',
        refundOrderNo: this.refundInfo.refundOrderNo,
        merAddressId: this.defaultId,
      })
        .then((res) => {
          this.loading = false;
          this.$message.success('审核成功');
          this.$emit('onHandleSuccess');
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    handleCancel() {
      this.$emit('onHandleCancel');
    },
    // 列表
    getList() {
      this.listLoading = true;
      merchantAddressListApi()
        .then((res) => {
          this.addressList = res;
          if (this.addressList.length) {
            localStorage.setItem('merchantAddressList', JSON.stringify(res));
            let data = this.addressList.find((item) => item.isDefault);
            this.defaultId = data.id;
          }
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    //选中地址
    handleChecked() {},
  },
};
</script>
<style scoped lang="scss">
.dialog-footer {
  text-align: right;
  padding-top: 20px;
}
.box-card {
  width: 675px;
}
.address {
  width: 450px;
}
::v-deep .el-card__body {
  padding: 0 15px 15px 0 !important;
}
</style>
