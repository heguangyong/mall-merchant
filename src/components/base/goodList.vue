<template>
  <div class="divBox">
    <div class="header clearfix">
      <div class="container">
        <el-form inline>
          <el-form-item label="商品搜索：">
            <el-input
              v-model.trim="tableFrom.keywords"
              @input="onInput($event)"
              placeholder="请输入商品名称，关键字，产品编号"
              class="selWidth"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList(1)" />
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData.data"
      style="width: 100%"
      size="mini"
      ref="table"
      tooltip-effect="dark"
      highlight-current-row
      max-height="400"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="handleNum === 'many'" type="selection" width="55" />
      <el-table-column width="55" key="1" v-if="handleNum !== 'many'">
        <template slot-scope="scope">
          <el-radio :label="scope.row.id" v-model="templateRadio" @change.native="getTemplateRow(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" min-width="50" />
      <el-table-column label="商品图" min-width="80">
        <template slot-scope="scope">
          <div class="demo-image__preview line-heightOne">
            <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="storeName" label="商品名称" min-width="180" />
    </el-table>
    <div class="block mb20">
      <el-pagination
        :page-sizes="[1, 2, 3, 4]"
        :page-size="tableFrom.limit"
        :current-page="tableFrom.page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
    <div v-if="handleNum === 'many'" class="right-align">
      <el-button size="small" type="primary" @click="ok">确定</el-button>
    </div>
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

import { productLstApi, productDeleteApi, putOnShellApi, offShellApi, productHeadersApi } from '@/api/product';
export default {
  name: 'goodList',
  props: {
    handleNum: {
      type: String,
      default: '',
    },
    checked: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      templateRadio: 0,
      props: {
        children: 'child',
        label: 'name',
        value: 'id',
        emitPath: false,
      },
      listLoading: true,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: 1,
        cateId: '',
        keywords: '',
        type: '1',
      },
      imgList: [],
      multipleSelection: [],
      multipleSelectionAll: [],
      checkedPage: [],
      isChecked: false,
      isIndex: 0,
      idKey: 'id',
      checkBox: [],
      checkedIds: [], // 订单当前页选中的数据
    };
  },
  mounted() {
    this.tableFrom.page = 1;
    this.getList();
    if (!this.checked) return;
    this.checked.forEach((row) => {
      this.$refs.table.toggleRowSelection(row);
    });
  },
  methods: {
    onInput(e) {
      this.$forceUpdate();
    },
    changeType(v) {
      this.isChecked = v;
      const index = this.checkedPage.indexOf(this.tableFrom.page);
      this.isIndex = index;
      this.checkedPage.push(this.tableFrom.page);
      if (index > -1) {
        this.checkedPage.splice(index, 1);
      }
      this.syncCheckedId(v);
    },
    changeOne(v, order) {
      if (v) {
        const index = this.checkedIds.indexOf(order.id);
        if (index === -1) {
          this.checkedIds.push(order.id);
          this.checkBox.push(order);
        }
      } else {
        const index = this.checkedIds.indexOf(order.id);
        if (index > -1) {
          this.checkedIds.splice(index, 1);
          this.checkBox.splice(index, 1);
        }
      }
    },
    syncCheckedId(o) {
      const ids = this.tableData.data.map((v) => v.id);
      if (o) {
        this.tableData.data.forEach((item) => {
          const index = this.checkedIds.indexOf(item.id);
          if (index === -1) {
            this.checkedIds.push(item.id);
            this.checkBox.push(item);
          }
        });
      } else {
        this.tableData.data.forEach((item) => {
          const index = this.checkedIds.indexOf(item.id);
          if (index > -1) {
            this.checkedIds.splice(index, 1);
            this.checkBox.splice(index, 1);
          }
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      setTimeout(() => {
        this.$selfUtil.changePageCoreRecordData(
          this.multipleSelectionAll,
          this.multipleSelection,
          this.tableData.data,
          (e) => {
            this.multipleSelectionAll = e;
          },
        );
      }, 50);
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      const idKey = this.idKey;
      const selectAllIds = [];
      this.multipleSelectionAll.forEach((row) => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.data.length; i++) {
        if (selectAllIds.indexOf(this.tableData.data[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData.data[i], true);
        }
      }
    },
    ok() {
      this.$emit('getStoreItem', this.multipleSelectionAll);
    },
    getTemplateRow(row) {
      this.$emit('getStoreItem', row);
    },
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      productLstApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
          this.$nextTick(function () {
            this.setSelectRow(); // 调用跨页选中方法
          });
        })
        .catch((res) => {
          this.listLoading = false;
          this.$message.error(res.message);
        });
    },
    pageChange(page) {
      this.$selfUtil.changePageCoreRecordData(
        this.multipleSelectionAll,
        this.multipleSelection,
        this.tableData.data,
        (e) => {
          this.multipleSelectionAll = e;
        },
      );
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.$selfUtil.changePageCoreRecordData(
        this.multipleSelectionAll,
        this.multipleSelection,
        this.tableData.data,
        (e) => {
          this.multipleSelectionAll = e;
        },
      );
      this.tableFrom.limit = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.right-align {
  float: right;
}
.selWidth {
  width: 250px !important;
}
.seachTiele {
  line-height: 35px;
}
.fr {
  float: right;
}
</style>
