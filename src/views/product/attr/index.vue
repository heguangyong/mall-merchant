<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: '20px 20px 2px' }"
      v-hasPermi="['merchant:product:rule:page:list']"
    >
      <el-form inline size="small" @submit.native.prevent>
        <el-form-item label="规格名称：">
          <el-input v-model.trim="keywords" placeholder="请输入规格名称" class="form_content_width" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" :bordered="false" class="box-card mt14" :body-style="{ padding: '20px' }">
      <el-button size="small" type="primary" @click="add" v-hasPermi="['merchant:product:rule:save']"
        >添加商品规格</el-button
      >
      <el-table
        ref="table"
        v-loading="listLoading"
        class="mt20"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="ruleName" label="规格名称" min-width="150" />
        <el-table-column label="商品规格" min-width="150">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.ruleValue" :key="index" class="mr10" v-text="item.value" />
          </template>
        </el-table-column>
        <el-table-column label="商品属性" min-width="300">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.ruleValue" :key="index" v-text="item.detail.join(',')" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <a @click="onEdit(scope.row)" v-hasPermi="['merchant:product:rule:update']">编辑</a>
            <el-divider direction="vertical"></el-divider>
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
  name: 'StoreAttr',
  data() {
    return {
      formDynamic: {
        ruleName: '',
        ruleValue: [],
      },
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
      selectionList: [],
      multipleSelectionAll: [],
      idKey: 'id',
      nextPageFlag: false,
      keyNum: 0,
    };
  },
  mounted() {
    if (checkPermi(['merchant:product:rule:page:list'])) this.getList();
  },
  methods: {
    checkPermi,
    handleSearchList() {
      this.tableFrom.page = 1;
      this.getList();
    },
    add() {
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
          for (var i = 0; i < list.length; i++) {
            list[i].ruleValue = JSON.parse(list[i].ruleValue);
          }
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
    handleDeleteAll() {
      if (!this.multipleSelectionAll.length) return this.$message.warning('请选择商品规格');
      const data = [];
      this.multipleSelectionAll.map((item) => {
        data.push(item.id);
      });
      this.ids = data.join(',');
      this.$modalSure()
        .then(() => {
          attrDeleteApi(this.ids).then(() => {
            this.$message.success('删除成功');
            this.getList();
          });
        })
        .catch(() => {});
    },
    onEdit(val) {
      const _this = this;
      this.$modalAttr(JSON.parse(JSON.stringify(val)), function () {
        _this.getList();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.seachTiele {
  line-height: 35px;
}

.fr {
  float: right;
}

.el-message-box__content {
  padding: 24px;
}
</style>
