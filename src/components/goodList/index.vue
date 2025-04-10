<template>
  <div class="divBox">
    <div class="header clearfix">
      <div class="container">
        <el-form inline label-width="120px" size="small">
          <el-form-item label="商品搜索:">
            <el-input
              v-model.trim="tableFrom.name"
              @input="onInput($event)"
              placeholder="请输入商品名称"
              class="selWidth"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList(1)" />
            </el-input>
          </el-form-item>
          <el-form-item label="平台商品分类:">
            <el-cascader
              v-model="tableFrom.categoryId"
              class="selWidth"
              :options="categoryList"
              :props="props"
              filterable
              clearable
              @change="getList(1)"
            />
          </el-form-item>
          <el-form-item label="商户商品分类555:">
            <el-cascader
              v-model="tableFrom.cateId"
              class="selWidth"
              :options="mercategoryList"
              :props="props"
              filterable
              clearable
              @change="getList(1)"
            />
          </el-form-item>
          <el-form-item label="商品状态:">
            <el-select
              clearable
              v-model="tableFrom.isShow"
              placeholder="请选择商品状态"
              class="selWidth"
              @change="getList(1)"
            >
              <el-option label="上架" value="1" />
              <el-option label="下架" value="0" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData.data"
      style="width: 100%"
      size="mini"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column key="2" v-if="handleNum === 'many'" width="55">
        <template slot="header" slot-scope="scope">
          <el-checkbox
            slot="reference"
            :value="isChecked && checkedPage.indexOf(tableFrom.page) > -1"
            @change="changeType"
          />
        </template>
        <template slot-scope="scope">
          <el-checkbox :value="checkedIds.indexOf(scope.row.id) > -1" @change="(v) => changeOne(v, scope.row)" />
        </template>
      </el-table-column>
      <el-table-column width="55" key="1" v-if="handleNum !== 'many'">
        <template slot-scope="scope">
          <el-radio :label="scope.row.id" v-model="templateRadio" @change.native="getTemplateRow(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" min-width="50" />
      <el-table-column label="商品图" min-width="60">
        <template slot-scope="scope">
          <div class="demo-image__preview line-heightOne">
            <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="250" show-overflow-tooltip />
      <el-table-column prop="categoryName" label="商品分类" min-width="150" show-overflow-tooltip />
      <el-table-column label="商品类型" min-width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.type | productTpyeFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品状态" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.isShow ? '上架' : '下架' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block mb20 left inline-block">
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        :page-size="tableFrom.limit"
        :current-page="tableFrom.page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
    <div class="right-align inline-block">
      <el-button size="small" @click="close">取消</el-button>
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

import { productActivityListApi } from '@/api/product';
import store from '@/store';
export default {
  name: 'GoodList',
  props: {
    handleNum: {
      type: String,
      default: '',
    },
    checked: {
      type: Array,
      default: () => [],
    },
    maxlength: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      templateRadio: 0,
      props: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: false,
        emitPath: false,
      },
      listLoading: true,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        categoryId: '', // 平台商品分类
        page: 1,
        limit: this.$constants.page.limit[0],
        cateId: '', //商户分类id
        keywords: '',
        type: 1,
      },
      imgList: [],
      multipleSelection: [],
      checkedPage: [],
      isChecked: false,
      isIndex: 0,
      checkBox: [],
      merCateList: store.getters.merProductClassify,
      checkedIds: [], // 订单当前页选中的数据
      categoryList: [],
      mercategoryList: [],
    };
  },
  created() {
    if (!localStorage.getItem('merProductClassify')) store.dispatch('product/getMerProductClassify');
  },
  computed: {},
  mounted() {
    if (!store.getters.merPlatProductClassify.length) store.dispatch('product/getAdminProductClassify');
    if (!store.getters.merProductClassify.length) store.dispatch('product/getMerProductClassify');
    this.$nextTick(() => {
      this.categoryList = store.getters.merPlatProductClassify;
      this.mercategoryList = store.getters.merProductClassify;
    });
    this.getList();
    if (this.checked.length) {
      let [...arr2] = this.checked;
      this.checkBox = arr2;
      this.checkedIds = arr2.map((item) => {
        return item.id;
      });
    }
  },
  methods: {
    close() {
      this.$emit('closeDialog', null);
    },
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
      const tables = [];
      val.map((item) => {
        tables.push({ src: item.image, id: item.id });
      });
      this.multipleSelection = tables;
    },
    ok() {
      if (this.checkBox.length > this.maxlength && this.maxlength > 0)
        return this.$message.warning(`最多选择${this.maxlength}个`);
      this.$emit('getStoreItem', this.checkBox);
    },
    getTemplateRow(row) {
      this.$emit('getStoreItem', row);
    },
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      productActivityListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          // res.list.map((item) => {
          //   this.imgList.push(item.image)
          // })
          this.tableData.data.forEach((item) => {
            this.checked.forEach((element) => {
              if (Number(item.id) === Number(element.id)) {
                this.$nextTick(() => {
                  this.$refs.multipleTable.toggleRowSelection(item, true);
                });
              }
            });
          });
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
  },
};
</script>

<style scoped lang="scss">
.right-align {
  float: right;
  padding-bottom: 20px;
  padding-top: 10px;
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
::v-deep .el-pagination {
  justify-content: flex-start !important;
  padding: 0;
  margin-top: 10px;
}
.inline-block {
  display: inline-block;
  margin-top: 20px;
}
</style>
