<template>
  <div class="divBox">
    <el-card class="box-card" :bordered="false" shadow="never">
      <div slot="header" class="clearfix acea-row">
        <el-form>
          <el-form-item label="用户搜索：" class="search-form-sub">
            <UserSearchInput v-model="tableFrom" />
            <el-button class="search-btn" type="primary" @click="initList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table width="800px" size="small" :data="tableData">
        <el-table-column label="ID" width="80">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" @change.native="changeRow(scope.row)" v-model="templateRadio"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="头像" min-width="60">
          <template slot-scope="{ row }">
            <img :src="row.avatar" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="昵称" min-width="160" prop="nickname"> </el-table-column>
        <el-table-column label="手机号" min-width="80" prop="phone"> </el-table-column>
      </el-table>
      <div class="bottom">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
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

import { userListApi } from '@/api/user';
export default {
  name: 'UserList',
  data() {
    return {
      templateRadio: 0,
      tableFrom: {
        page: 1,
        limit: 10,
        nikename: '',
        searchType: 'all',
        content: '',
      },
      tableData: [],
      total: null,
    };
  },
  created() {
    this.initList();
  },
  methods: {
    changeRow(row) {
      // this.selectedRow = row;
      this.$emit('getRow', row);
    },
    initList() {
      userListApi(this.tableFrom).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
      });
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.initList();
    },
    //页数更改
    handleCurrentChange(val) {
      this.tableFrom.page = val;
      this.initList();
    },
  },
};
</script>

<style scoped lang="scss">
.divBox {
  ::v-deep .el-card__header {
    padding: 0 !important;
  }
  .el-pagination {
    padding: 0 !important;
    margin: 0 !important;
  }
  .bottom {
    padding-top: 30px;
  }
}
.search-btn {
  margin-left: 10px;
}
::v-deep .search-form-sub .el-form-item__content {
  display: flex;
}
</style>
