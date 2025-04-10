<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <div slot="header" class="clearfix"></div>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="ID" min-width="180" />
        <el-table-column label="物流公司名称" min-width="150" prop="name" />
        <el-table-column min-width="200" label="编码" prop="code" />
        <el-table-column min-width="100" label="排序" prop="sort" sortable />
        <el-table-column label="是否显示" min-width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              class="demo"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              :disabled="true"
              v-if="checkPermi(['admin:express:update:show'])"
            />
          </template>
        </el-table-column>
      </el-table>
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

import parser from '@/components/FormGenerator/components/parser/Parser';
import * as logistics from '@/api/logistics.js';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
export default {
  name: 'CompanyList',
  components: { parser },
  data() {
    return {
      constants: this.$constants,
      // 表单
      formConf: { fields: [] },
      form: {
        keywords: '',
      },
      tableData: [],
      page: 1,
      limit: this.$constants.page.limit[0],
      loading: false,
      dialogVisible: false,
      fromType: 'add',
      formData: {
        status: false,
      },
      isCreate: 0,
      formShow: false,
      editId: 0,
    };
  },
  created() {
    this.getExpressList();
  },
  methods: {
    checkPermi,
    //  获取物流公司列表
    getExpressList() {
      this.loading = true;
      logistics
        .expressAllApi()
        .then((res) => {
          this.loading = false;
          this.tableData = res;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-plus {
  margin-right: 5px;
}
.formBox {
  .el-input-number--medium {
    width: 100px;
  }
}
</style>
