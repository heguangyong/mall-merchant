<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <div slot="header" class="clearfix">
        <div class="container" v-hasPermi="['merchant:product:rule:page:list']">
          <el-form inline size="small" @submit.native.prevent>
            <el-form-item label="标签名称：">
              <el-input v-model.trim="keywords" placeholder="请输入标签名称" class="selWidth" clearable>
                <el-button slot="append" icon="el-icon-search" @click="seachList" />
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="acea-row">
          <el-button size="small" type="primary" @click="handleAdd" v-hasPermi="['merchant:product:rule:save']"
            >添加标签</el-button
          >
        </div>
      </div>
      <el-table
        ref="table"
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="ruleName" label="标签名称" />
        <el-table-column prop="ruleName" label="排序" />
        <el-table-column label="操作" fixed width="100">
          <template slot-scope="scope">
            <a @click="handleEdit(scope.row)" v-hasPermi="['merchant:product:rule:update']">编辑</a>
            <el-divider></el-divider>
            <a @click="handleDelete(scope.row.id, scope.$index)" v-hasPermi="['merchant:product:rule:delete']">删除</a>
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
    </el-card>
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

import { templateListApi, attrDeleteApi } from '@/api/product';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
export default {
  name: 'ProductLabel',
  data() {
    return {
      tableFrom: {
        page: 1,
        limit: this.$constants.page.limit[0],
        keywords: '',
      },
      keywords: '',
      tableData: {
        data: [],
        loading: false,
        total: 0,
      },
      listLoading: false,
    };
  },
  mounted() {
    if (checkPermi(['merchant:product:rule:page:list'])) this.getList();
  },
  methods: {
    checkPermi,
    seachList() {
      this.tableFrom.page = 1;
      this.getList();
    },
    //添加
    handleAdd() {
      const _this = this;
      this.$modalAttr(
        Object.assign({}, this.formDynamic),
        function () {
          _this.getList();
        },
        (this.keyNum += 1),
      );
    },
    // 列表
    getList() {
      this.listLoading = true;
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      templateListApi(this.tableFrom)
        .then((res) => {
          const list = res.list;
          this.tableData.data = list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch(() => {
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
    handleDelete(id, idx) {
      this.$modalSure()
        .then(() => {
          attrDeleteApi(id).then(() => {
            this.$message.success('删除成功');
            handleDeleteTable(this.tableData.data.length, this.tableFrom);
            this.getList();
          });
        })
        .catch(() => {});
    },
    //编辑
    handleEdit(val) {
      const _this = this;
      this.$modalAttr(JSON.parse(JSON.stringify(val)), function () {
        _this.getList();
      });
    },
  },
};
</script>

<style scoped></style>
