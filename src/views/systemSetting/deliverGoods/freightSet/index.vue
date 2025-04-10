<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      v-hasPermi="['merchant:shipping:templates:list']"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form ref="form" inline :model="form" @submit.native.prevent label-position="right">
          <el-form-item label="模板名称：">
            <el-input
              @keyup.enter.native="handleSearchList"
              v-model="form.keywords"
              placeholder="请输入模板名称"
              class="selWidth"
              size="small"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never" :bordered="false" class="box-card mt14" :body-style="{ padding: '20px' }">
      <el-button type="primary" size="small" @click="handleSubmit()" v-hasPermi="['merchant:shipping:templates:save']"
        >添加运费模板</el-button
      >
      <el-table v-loading="loading" :data="tableData.list" class="mt20" size="small">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column label="模板名称" min-width="200" prop="name" :show-overflow-tooltip="true" />
        <el-table-column min-width="100" label="计费方式" prop="type">
          <template slot-scope="{ row }">
            <p>{{ row.type | typeFilter }}</p>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="包邮方式" prop="appoint">
          <template slot-scope="{ row }">
            <p>{{ row.appoint | statusFilter }}</p>
          </template>
        </el-table-column>
        <el-table-column label="排序" min-width="100" prop="sort" />
        <el-table-column label="添加时间" min-width="150" prop="createTime" />
        <el-table-column prop="address" fixed="right" width="100" label="操作">
          <template slot-scope="scope">
            <a @click="bindEdit(scope.row)" v-hasPermi="['merchant:shipping:templates:update']">修改</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="bindDelete(scope.row)" v-hasPermi="['merchant:shipping:templates:delete']">删除</a>
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
    <CreatTemplates ref="addTemplates" @getList="getList" />
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

import CreatTemplates from './creatTemplates';
import * as logistics from '@/api/logistics.js';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'ShippingTemplates',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '全国包邮',
        1: '部分包邮',
        2: '自定义',
      };
      return statusMap[status];
    },
    typeFilter(status) {
      const statusMap = {
        0: '无',
        1: '按件数',
        2: '按重量',
        3: '按体积',
      };
      return statusMap[status];
    },
  },
  components: { CreatTemplates },
  data() {
    return {
      isShow: false,
      dialogVisible: false,
      form: {
        keywords: '',
      },
      tableData: '',
      page: 1,
      limit: this.$constants.page.limit[0],
      loading: false,
    };
  },
  created() {
    if (checkPermi(['merchant:shipping:templates:list'])) this.getDataList();
  },
  methods: {
    checkPermi,
    // 添加
    handleSubmit() {
      this.$refs.addTemplates.dialogVisible = true;
      if (!localStorage.getItem('cityList')) this.$refs.addTemplates.getCityList();
      this.$refs.addTemplates.changType(0);
    },
    handleSearchList() {
      this.page = 1;
      this.getDataList();
    },
    // 分页
    pageChange(e) {
      this.page = e;
      this.getDataList();
    },
    handleSizeChange(e) {
      this.limit = e;
      this.getDataList();
    },
    // 数据列表
    getDataList() {
      this.loading = true;
      logistics
        .shippingTemplatesList({
          keywords: encodeURIComponent(this.form.keywords),
          page: this.page,
          limit: this.limit,
        })
        .then((res) => {
          this.loading = false;
          this.tableData = res;
        });
    },
    // 编辑
    bindEdit(item) {
      if (!localStorage.getItem('cityList')) this.$refs.addTemplates.getCityList();
      this.$refs.addTemplates.getInfo(item.id, item.appoint);
      this.$refs.addTemplates.changType(1);
    },
    // 删除
    bindDelete(item) {
      this.$modalSure().then(() => {
        logistics.shippingDetete({ id: item.id }).then((res) => {
          this.$message.success('删除成功');
          this.$store.commit('product/SET_ShippingTemplates', []);
          this.getDataList();
        });
      });
      // logistics.shippingDetete()
    },
    getList() {
      this.getDataList();
    },
  },
};
</script>

<style scoped lang="scss"></style>
