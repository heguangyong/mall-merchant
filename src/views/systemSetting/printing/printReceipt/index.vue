<template>
  <div class="divBox">
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-button
        v-if="checkPermi(['merchant:admin:print:save'])"
        type="primary"
        size="small"
        @click="handleAddPrintReceipt()"
        >添加</el-button
      >
      <el-table v-loading="tableDataPram.loading" :data="tableData.list" class="mt20" size="small">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column label="名称" min-width="180" prop="printName" />
        <el-table-column label="打印机类型" prop="printType">
          <template slot-scope="{ row }">
            <p>{{ row.printType | printTypeFilter }}</p>
          </template>
        </el-table-column>
        <el-table-column label="当前打印机编号" min-width="180">
          <template slot-scope="{ row }">
            <p v-if="row.printType === 0">{{ row.printYlyMerchineNo }}</p>
            <p v-else-if="row.printType === 1">{{ row.printFeSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="150" prop="updateTime" />
        <el-table-column label="状态" min-width="150">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['merchant:admin:print:update:status'])"
              v-model="scope.row.status"
              :active-value="1"
              active-text="启用"
              :inactive-value="0"
              inactive-text="停用"
              @change="handleOnchangeIsShow(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" fixed="right" width="150" label="操作">
          <template slot-scope="scope">
            <router-link :to="{ path: `/operation/printing/printreceipt/creatPrintreceipt/${scope.row.id}` }">
              <a size="small" type="text">设置</a>
            </router-link>
            <el-divider direction="vertical"></el-divider>
            <a @click="bindEdit(scope.row)" v-hasPermi="['merchant:admin:print:edit']">修改</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="bindDelete(scope.row)" v-hasPermi="['merchant:admin:print:delete']">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block-pagination">
        <el-pagination
          background
          :page-sizes="[20, 40, 60, 80]"
          :page-size="tableData.limit"
          :current-page="tableData.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @current-change="pageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog
      :visible.sync="editPrintReceiptConfig.dialogVisible"
      :title="(editPrintReceiptConfig.edit ? '编辑' : '新增') + '小票打印配置'"
      class="dialog-bottom"
    >
      <edit-print-receipt
        v-if="editPrintReceiptConfig.dialogVisible"
        :isEdit="editPrintReceiptConfig.edit"
        :edit-data="editPrintReceiptConfig.editData"
        @unVisible="handleEditPrintDialogUnVisible"
        @closeDialog="closeDialog"
      ></edit-print-receipt>
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

import * as systemSetting from '@/api/systemSetting';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import editPrintReceipt from './editPrintReceipt.vue';
export default {
  name: 'printReceipt',
  filters: {
    printTypeFilter(status) {
      const statusMap = {
        0: '易联云',
        1: '飞蛾云',
      };
      return statusMap[status];
    },
  },
  components: { editPrintReceipt },
  data() {
    return {
      editPrintReceiptConfig: {
        dialogVisible: false,
        edit: false, // false=新增 true=编辑
        editData: {},
      },
      tableData: {
        data: [],
        total: 0,
      },
      tableDataPram: {
        page: 1,
        limit: 20,
        loading: false,
      },
    };
  },
  created() {
    if (checkPermi(['merchant:admin:print:list'])) this.getDataList();
  },
  methods: {
    checkPermi,
    closeDialog() {
      this.editPrintReceiptConfig.dialogVisible = false;
    },
    // 添加
    handleAddPrintReceipt() {
      this.editPrintReceiptConfig.dialogVisible = true;
      this.editPrintReceiptConfig.edit = false;
    },
    // 分页
    pageChange(e) {
      this.tableDataPram.page = e;
      this.getDataList();
    },
    handleSizeChange(e) {
      this.tableDataPram.limit = e;
      this.getDataList();
    },
    // 数据列表
    getDataList() {
      this.tableDataPram.loading = true;
      systemSetting.merchantPrintList(this.tableDataPram).then((data) => {
        this.tableDataPram.loading = false;
        this.tableData = data;
      });
    },
    // 编辑
    bindEdit(item) {
      this.editPrintReceiptConfig.editData = item;
      this.editPrintReceiptConfig.dialogVisible = true;
      this.editPrintReceiptConfig.edit = true;
    },
    // 删除
    bindDelete(param) {
      this.$modalSure('删除当前数据?').then(() => {
        if (this.tableData.list.length === 1) {
          this.tableDataPram.page = this.tableDataPram.page - 1;
        }
        systemSetting.merchantPrintDelete(param.id).then((data) => {
          this.$message.success('删除成功');
          this.getList();
        });
      });
    },
    getList() {
      this.getDataList();
    },
    handleOnchangeIsShow(row) {
      systemSetting.merchantPrintStatus(row).then((data) => {
        this.$message.success('更新状态成功');
        this.getDataList();
      });
    },
    handleEditPrintDialogUnVisible() {
      this.getDataList();
      this.editPrintReceiptConfig.editData = {};
      this.editPrintReceiptConfig.dialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>
