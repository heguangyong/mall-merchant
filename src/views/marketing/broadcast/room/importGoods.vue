<template>
  <div class="divBox">
    <div class="header clearfix">
      <div class="filter-container">
        <div class="demo-input-suffix acea-row">
          <span class="seachTiele">商品搜索：</span>
          <el-input v-model="keywords" placeholder="请输入商品名称，关键字，产品编号" class="selWidth" size="small">
            <el-button slot="append" icon="el-icon-search" class="el-button-solt" size="small" @click="getList()" />
          </el-input>
        </div>
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="tableData.data"
      style="width: 100%"
      size="small"
      class="tableSelection"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="ID" prop="id" min-width="40" />
      <el-table-column label="商品ID" min-width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.productId | filterEmpty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="130" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.name + '/' + scope.row.productId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图" min-width="100">
        <template slot-scope="scope">
          <div class="demo-image__preview line-heightOne">
            <el-image :src="scope.row.coverImgUrlLocal" :preview-src-list="[scope.row.coverImgUrlLocal]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格类型" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.priceType | priceTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.priceType === 1">{{ scope.row.price }}</span>
          <span v-else>{{ scope.row.price + '~' + scope.row.price2 }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        background
        :page-sizes="$constants.page.limit"
        :page-size="tableForm.limit"
        :current-page="tableForm.page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { liveGoodsListApi } from '@/api/marketing';
export default {
  name: 'importGoods',
  data() {
    return {
      keywords: '',
      tableForm: {
        page: 1,
        limit: this.$constants.page.limit[0],
        reviewStatus: 4,
        keywords: '',
      },
      tableData: {
        data: [],
        total: 0,
      },
      multipleSelectionAll: [],
      multipleSelection: [],
      listLoading: false,
      idKey: 'id',
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      setTimeout(() => {
        this.changePageCoreRecordData();
        let data = [];
        if (this.multipleSelectionAll.length) {
          this.multipleSelectionAll.map((item) => {
            data.push(item.goodsId);
          });
        }
        this.$emit('getGoodList', data);
      }, 50);
    },
    // 设置选中的方法
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
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
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach((row) => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach((row) => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.data.forEach((row) => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach((id) => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableForm.page = num ? num : this.tableForm.page;
      this.tableForm.keywords = encodeURIComponent(this.keywords);
      liveGoodsListApi(this.tableForm)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.$nextTick(function () {
            this.setSelectRow(); //调用跨页选中方法
          });
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    pageChange(page) {
      this.changePageCoreRecordData();
      this.tableForm.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.changePageCoreRecordData();
      this.tableForm.limit = val;
      this.getList();
    },
  },
};
</script>

<style scoped></style>
