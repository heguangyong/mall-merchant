<template>
  <div class="divBox">
    <el-card shadow="never" :bordered="false" class="box-card mt14" :body-style="{ padding: '20px' }">
      <el-button size="small" type="primary" @click="handleAddAddress" v-hasPermi="['merchant:address:add']"
        >添加地址</el-button
      >
      <el-table v-loading="listLoading" :data="tableData.data" class="mt20" size="small">
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column :show-overflow-tooltip="true" label="商家地址" min-width="280">
          <template slot-scope="scope">
            <span v-show="scope.row.isDefault" style="color: #409eff" class="mr5">[默认退货]</span>
            <span>{{ scope.row.detail }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="receiverName" label="商家姓名" min-width="100" />
        <el-table-column prop="receiverPhone" label="商家电话" min-width="100" />
        <el-table-column label="是否开启" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['merchant:address:update:show'])"
              v-model="scope.row.isShow"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              :disabled="scope.row.isDefault"
              @click.native="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isShow ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <a @click="handleEditAddress(scope.row)" v-hasPermi="['merchant:address:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <template v-if="!scope.row.isDefault && checkPermi(['merchant:address:set:default']) && scope.row.isShow">
              <a @click="handleSetIsDefault(scope.row)">设为默认</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <a @click="handleDelAddress(scope.row)" v-hasPermi="['merchant:address:delete']">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加-->
    <el-dialog
      :title="formData.id === 0 ? '新增地址' : '编辑地址'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="540px"
      :before-close="handleClose"
    >
      <el-form
        v-if="dialogVisible"
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商家地址：" prop="detail">
          <el-input type="textarea" v-model.trim="formData.detail" placeholder="请填写商家地址"></el-input>
        </el-form-item>
        <el-form-item label="商家姓名：" prop="receiverName">
          <el-input v-model.trim="formData.receiverName" placeholder="请填写商家姓名"></el-input>
        </el-form-item>
        <el-form-item label="商家电话：" prop="receiverPhone">
          <el-input
            v-model.trim="formData.receiverPhone"
            maxlength="11"
            class="width100"
            placeholder="请填写商家电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="开启状态：">
          <el-switch v-model="formData.isShow" class="mr20" active-text="开启" inactive-text="关闭"></el-switch>
          <el-checkbox v-show="formData.isShow" v-model="formData.isDefault">设为默认发货地址</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitForm('formData')">保存</el-button>
      </div>
    </el-dialog>
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
  merchantAddressDeleteApi,
  merchantAddressListApi,
  merchantAddressSaveApi,
  merchantAddressSetDefaultApi,
  merchantAddressUpdateApi,
  merchantAddressUpdateShowApi,
} from '@/api/systemSetting';
import { roterPre } from '@/settings';
import { checkPermi } from '@/utils/permission';
import { Debounce } from '@/utils/validate';
import { validatePhone } from '@/utils/toolsValidate';
const defaultFormData = {
  detail: '',
  id: 0,
  isDefault: false,
  isShow: false,
  receiverName: '',
  receiverPhone: '',
};
export default {
  name: 'BusinessAddress',
  data() {
    return {
      dialogVisible: false,
      btnLoading: false,
      roterPre: roterPre,
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: this.$constants.page.limit[0],
        status: '',
        name: '',
        type: '',
        useType: '',
      },
      formData: Object.assign({}, defaultFormData),
      rules: {
        detail: [{ required: true, message: '请输入商家地址', trigger: 'blur' }],
        receiverName: [{ required: true, message: '请输入商家姓名', trigger: 'blur' }],
        receiverPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
      },
    };
  },
  mounted() {
    if (checkPermi(['merchant:address:list'])) this.getList();
  },
  methods: {
    checkPermi,
    handleClose() {
      this.dialogVisible = false;
    },
    //添加
    handleAddAddress() {
      this.formData = Object.assign({}, defaultFormData);
      this.dialogVisible = true;
    },
    //编辑
    handleEditAddress(row) {
      this.formData = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.formData.isShow) this.formData.isDefault = false;
          this.formData.id === 0
            ? merchantAddressSaveApi(this.formData)
                .then((res) => {
                  this.$message.success('添加成功');
                  this.dialogVisible = false;
                  this.getList();
                })
                .catch(() => {
                  this.btnLoading = false;
                })
            : merchantAddressUpdateApi(this.formData)
                .then((res) => {
                  this.$message.success('编辑成功');
                  this.dialogVisible = false;
                  this.getList();
                })
                .catch(() => {
                  this.btnLoading = false;
                });
        } else {
          return false;
        }
      });
    }),
    // 列表
    getList() {
      this.listLoading = true;
      merchantAddressListApi()
        .then((res) => {
          this.tableData.data = res;
          localStorage.setItem('merchantAddressList', JSON.stringify(res));
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    // 修改状态
    onchangeIsShow(row) {
      if (row.isDefault) return;
      merchantAddressUpdateShowApi(row.id)
        .then(() => {
          this.$message.success('修改成功');
          this.getList();
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    // 设置默认地址
    handleSetIsDefault(rowData) {
      this.$modalSure('设置为默认地址吗?').then(() => {
        merchantAddressSetDefaultApi(rowData.id).then(() => {
          this.$message.success('设置成功');
          this.getList();
        });
      });
    },
    handleDelAddress(rowData) {
      this.$modalSure('删除当前数据?').then(() => {
        merchantAddressDeleteApi(rowData.id).then(() => {
          this.$message.success('删除成功');
          this.getList();
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.fa {
  color: #0a6aa1;
  display: block;
}
.sheng {
  color: #ff0000;
  display: block;
}
</style>
