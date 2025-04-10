<template>
  <div class="divBox relative">
    <!--搜索条件-->
    <el-card
      v-if="checkPermi(['merchant:cdkey:library:page:list'])"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form inline size="small">
          <el-form-item label="卡密名称：">
            <el-input
              v-model.trim="name"
              placeholder="请输入卡密库名称"
              class="selWidth"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input
              v-model.trim="productName"
              placeholder="请输入商品名称"
              class="selWidth"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!--列表-->
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-button
        size="small"
        type="primary"
        class="mb20"
        v-hasPermi="['merchant:cdkey:library:add']"
        @click="handleAdd()"
        >添加卡密库</el-button
      >
      <el-table v-loading="listLoading" :data="tableData.data" style="width: 100%" size="small" highlight-current-row>
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="卡密库名称" prop="name" min-width="200" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="关联商品" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.productName | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关联商品规格" prop="productAttrValueName" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.productAttrValueName | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="未使用/卡密总数" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ Number(scope.row.totalNum) - Number(scope.row.usedNum) + ' / ' + scope.row.totalNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="250" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.remark | filterEmpty }}</span>
          </template></el-table-column
        >
        <el-table-column prop="createTime" label="创建时间" min-width="200" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <a @click="handleAdd(scope.row)" v-hasPermi="['merchant:cdkey:library:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <router-link :to="{ path: `/product/cdkey/creatCdkey/${scope.row.id}/${scope.row.name}` }">
              <a type="text" v-hasPermi="['merchant:card:secret:page:list']">管理卡密</a>
            </router-link>
            <template
              v-if="
                checkPermi(['merchant:cdkey:library:delete']) &&
                !scope.row.productAttrValueName &&
                !scope.row.productName
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleDelete(scope.row.id)">删除</a>
            </template>
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
        /></div
    ></el-card>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="formValidate.id === 0 ? '新增卡密库' : '编辑卡密库'"
      destroy-on-close
      :close-on-click-modal="false"
      width="540px"
    >
      <el-form
        ref="formValidate"
        class="formValidate"
        :rules="ruleValidate"
        :model="formValidate"
        label-width="85px"
        @submit.native.prevent
      >
        <el-form-item label="卡密库名称:" prop="name">
          <el-input
            v-model.trim="formValidate.name"
            placeholder="请输入卡密库名称，最多32字"
            maxlength="32"
            size="small"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            v-model.trim="formValidate.remark"
            placeholder="请输入备注，最多可输入200字"
            maxlength="200"
            type="textarea"
            size="small"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          class="submission"
          @click="handleSubmit('formValidate')"
          :loading="loadingBtn"
          v-if="checkPermi(['merchant:product:update'])"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script setup>
import { checkPermi } from '@/utils/permission';
import {
  productCdkeyDeleteApi,
  productCdkeyListApi,
  productCdkeysaveApi,
  productUnrelatedUpdateApi,
} from '@/api/productCdkey';
import { Debounce } from '@/utils/validate';
import * as $constants from '@/utils/constants';
import { handleDeleteTable } from '@/libs/public';
const tableFroms = {
  page: 1,
  limit: $constants.page.limit[0],
  name: '',
  productName: '',
};
export default {
  name: 'cdkey',
  data() {
    return {
      productName: '',
      name: '',
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: Object.assign({}, tableFroms),
      dialogVisible: false,
      formValidate: {
        name: '',
        remark: '',
        id: 0,
      },
      loadingBtn: false,
      ruleValidate: {
        name: [{ required: true, message: '请填写卡密库名称', trigger: 'blue' }],
      },
    };
  },
  mounted() {
    if (checkPermi(['merchant:cdkey:library:page:list'])) this.getList();
  },
  methods: {
    checkPermi,
    //重置
    handleReset() {
      this.tableFrom = Object.assign({}, tableFroms);
      this.productName = '';
      this.name = '';
      this.getList(1);
    },
    // 添加
    handleAdd(row) {
      if (row) {
        Object.assign(this.formValidate, row);
      } else {
        Object.assign(this.formValidate, {
          name: '',
          remark: '',
          id: 0,
        });
      }
      this.dialogVisible = true;
    },
    //提交
    handleSubmit: Debounce(function (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          this.formValidate.id === 0
            ? productCdkeysaveApi(this.formValidate)
                .then((res) => {
                  this.$message.success('新增成功');
                  this.dialogVisible = false;
                  this.getList(1);
                  this.loadingBtn = false;
                })
                .catch((res) => {
                  this.loadingBtn = false;
                })
            : productUnrelatedUpdateApi(this.formValidate)
                .then((res) => {
                  this.$message.success('编辑成功');
                  this.loadingBtn = false;
                  this.dialogVisible = false;
                  this.getList(1);
                })
                .catch((res) => {
                  this.loadingBtn = false;
                });
        }
      });
    }),
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.productName = encodeURIComponent(this.productName);
      this.tableFrom.name = encodeURIComponent(this.name);
      productCdkeyListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
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
    // 删除
    handleDelete(id) {
      this.$modalSure('确定删除此卡密吗？').then(() => {
        productCdkeyDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList('');
        });
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
