<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      v-hasPermi="['merchant:delivery:personnel:page']"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form ref="form" inline :model="tableFrom" :rules="rules" @submit.native.prevent label-position="right">
          <el-form-item label="配送人员：">
            <el-input
              @keyup.enter.native="getList(1)"
              v-model.trim="personnelName"
              placeholder="请输入配送人员姓名"
              class="selWidth"
              size="small"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="personnelPhone">
            <el-input
              v-model.trim="tableFrom.personnelPhone"
              class="selWidth"
              placeholder="请输入配送人员手机号码"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="创建日期：">
            <el-date-picker
              v-model="timeVal"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="selWidth"
              @change="onchangeTime"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-debounceClick="2000" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never" :bordered="false" class="box-card mt14" :body-style="{ padding: '20px' }">
      <el-button
        type="primary"
        size="small"
        @click="handleCreatPersonnel()"
        v-hasPermi="['merchant:delivery:personnel:save']"
        >新增</el-button
      >
      <el-table v-loading="loading" :data="tableData.data" class="mt20" size="small">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column label="配送人员" min-width="200" prop="personnelName" :show-overflow-tooltip="true" />
        <el-table-column label="手机号码" min-width="150" prop="personnelPhone" />
        <el-table-column label="排序" min-width="150" prop="sort" />
        <el-table-column prop="createTime" label="创建时间" min-width="200" />
        <el-table-column fixed="right" width="120" label="操作">
          <template slot-scope="scope">
            <a @click="handleCreatPersonnel(scope.row)" v-hasPermi="['merchant:delivery:personnel:edit']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleDelete(scope.row)" v-hasPermi="['merchant:delivery:personnel:delete']">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block-pagination">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableData.limit"
          :current-page="tableData.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @current-change="pageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <creat-personnel
      :dialogVisible="dialogVisible"
      :editData="editData"
      @handlerCloseFrom="handlerCloseFrom"
      @handlerSuccessSubmit="handlerSuccessSubmit"
    ></creat-personnel>
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

import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { handleDeleteTable } from '@/libs/public';
import CreatPersonnel from './creatPersonnel.vue';
import { validatePhone } from '@/utils/toolsValidate';
import { personnelDeleteApi, personnelListApi } from '@/api/deliveryPersonnel';
import { defaultData } from '@/views/systemSetting/deliveryPersonnel/default';
export default {
  name: 'DeliveryPersonnel',
  components: { CreatPersonnel },
  data() {
    return {
      rules: {
        personnelPhone: [{ validator: validatePhone, trigger: 'blur' }],
      },
      timeVal: [],
      tableFrom: {
        page: 1,
        dateLimit: '',
        personnelName: '',
        personnelPhone: '',
        limit: this.$constants.page.limit[0],
      },
      personnelName: '',
      tableData: {
        data: [],
        total: 0,
      },
      loading: false,
      dialogVisible: false,
      editData: Object.assign({}, defaultData),
    };
  },
  created() {
    if (checkPermi(['merchant:delivery:personnel:page'])) this.getList(1);
  },
  methods: {
    checkPermi,
    //重置
    handleReset() {
      this.tableFrom.dateLimit = '';
      this.tableFrom.personnelName = '';
      this.tableFrom.personnelPhone = '';
      this.timeVal = [];
      this.personnelName = '';
      this.getList();
    },
    handlerCloseFrom() {
      this.dialogVisible = false;
    },
    handlerSuccessSubmit() {
      this.getList(1);
      this.dialogVisible = false;
    },
    // 添加
    handleCreatPersonnel(row) {
      this.editData = row ? row : Object.assign({}, defaultData);
      this.dialogVisible = true;
    },
    // 分页
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.getList(1);
    },
    // 数据列表
    getList(num) {
      this.loading = true;
      let params = {
        ...this.tableFrom,
        page: num ? num : this.tableFrom.page,
        personnelName: encodeURIComponent(this.personnelName),
      };
      personnelListApi(params)
        .then((res) => {
          this.loading = false;
          this.tableData.data = res.list;
          this.tableData.total = res.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 删除
    handleDelete(item) {
      this.$modalSure('确定要删除此配送人员吗？').then(() => {
        personnelDeleteApi(item.id).then((res) => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
        });
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
