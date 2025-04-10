<template>
  <div class="divBox">
    <el-card>
      <div class="mb20">
        <el-button
          v-hasPermi="['merchant:system:form:add']"
          size="small"
          type="primary"
          @click="handlerCreatFrom(0, 'add')"
          >添加表单</el-button
        >
      </div>
      <el-table v-loading="listLoading" :data="tableData.data" size="small">
        <el-table-column label="ID" prop="id" min-width="80" />
        <el-table-column label="表单名称" prop="formName" min-width="150" />
        <el-table-column prop="createTime" label="添加时间" min-width="150" />
        <el-table-column prop="updateTime" label="更新时间" min-width="150" />
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a v-hasPermi="['merchant:system:form:update']" @click="handlerCreatFrom(scope.row.id, 'edit')">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a v-hasPermi="['merchant:system:form:delete']" @click="handlerDelete(scope.row.id)">删除</a>
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
import { systemFormDeleteApi, systemFormPageApi } from '@/api/systemForm';
import { handleDeleteTable } from '@/libs/public';
import { useProduct } from '@/hooks/use-product';
import { checkPermi } from '@/utils/permission';
import * as $constants from '@/utils/constants';
const { handlerCreatFromUse } = useProduct();
export default {
  name: 'systemFormIndex',
  data() {
    return {
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 20,
      },
    };
  },
  mounted() {
    if (checkPermi(['merchant:system:form:page'])) this.getList();
  },
  methods: {
    checkPermi,
    // 列表
    getList() {
      this.listLoading = true;
      systemFormPageApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.$store.commit('mobildConfig/SET_SystemForm', res.list);
          localStorage.setItem('systemFormList', JSON.stringify(res.list));
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
          this.$message.error(res.message);
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
    //删除
    handlerDelete(id) {
      this.$modalSure('确定要删除此表单吗？').then(() => {
        systemFormDeleteApi(id).then((res) => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.$store.commit('mobildConfig/SET_SystemForm', []);
          this.getList();
        });
      });
    },
    //创建、编辑表单
    handlerCreatFrom(id, type) {
      handlerCreatFromUse(id, type);
    },
  },
};
</script>

<style scoped></style>
