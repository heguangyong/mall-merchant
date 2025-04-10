<template>
  <div class="divBox">
    <el-table
      class="mb20"
      ref="table"
      v-loading="listLoading"
      :data="tableData.data"
      style="width: 100%"
      size="mini"
      max-height="400"
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="handle === 'wu'" type="selection" width="55" />
      <el-table-column prop="id" label="ID" min-width="50" />
      <el-table-column prop="name" label="优惠券名称" min-width="90" />
      <el-table-column prop="money" label="优惠券面值" min-width="90" />
      <el-table-column prop="minPrice" label="最低消费额" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.minPrice === 0 ? '不限制' : scope.row.minPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期限" min-width="220">
        <template slot-scope="scope">
          <span>{{
            scope.row.isFixedTime ? scope.row.useStartTime + ' 一 ' + scope.row.useEndTime : scope.row.day + '天'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" min-width="90">
        <template slot-scope="scope">
          <span>{{ !scope.row.isLimited ? '不限量' : scope.row.lastTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="handle === 'send'" label="操作" width="70" fixed="right">
        <template slot-scope="scope">
          <a class="mr10" @click="sendGrant(scope.row.id)" v-hasPermi="['admin:coupon:user:receive']">发送</a>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="handle === 'wu'" class="dialog-footer-inner btnBottom">
      <el-button size="small" @click="dialogcloseFun">取消</el-button>
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

import { couponUserApi } from '@/api/marketing';
import { productCouponListApi } from '@/api/product';
export default {
  name: 'CouponList',
  props: {
    handle: {
      type: String,
      default: '',
    },
    couponData: {
      type: Array,
      default: () => [],
    },
    keyNum: {
      type: Number,
      default: 0,
    },
    userIds: {
      type: String,
      default: '',
    },
    userType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      listLoading: true,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        keywords: '',
        type: '',
      },
      multipleSelection: [],
      multipleSelectionAll: [],
      idKey: 'id',
      nextPageFlag: false,
      attr: [],
    };
  },
  watch: {
    keyNum: {
      deep: true,
      handler(val) {
        this.getList();
      },
    },
  },
  mounted() {
    this.tableFrom.page = 1;
    this.getList();
    if (!this.couponData) return;
    this.couponData.forEach((row) => {
      this.$refs.table.toggleRowSelection(row);
    });
  },
  methods: {
    dialogcloseFun() {
      this.$emit('dialogclose', null);
    },
    close() {
      this.multipleSelection = [];
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
      if (this.multipleSelection.length > 0) {
        this.$emit('getCouponId', this.multipleSelectionAll);
        this.close();
      } else {
        this.$message.warning('请先选择优惠劵');
      }
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.userType ? (this.tableFrom.type = 1) : (this.tableFrom.type = 3);
      productCouponListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res;
          this.tableData.total = res;
          this.listLoading = false;
          this.$nextTick(function () {
            this.setSelectRow(); // 调用跨页选中方法
          });
        })
        .catch((res) => {
          this.listLoading = false;
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
    // 发送
    sendGrant(id) {
      this.$modalSure('发送优惠劵吗').then(() => {
        couponUserApi({ couponId: id, uid: this.userIds }).then(() => {
          this.$message.success('发送成功');
          this.getList();
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.selWidth {
  width: 219px !important;
}
.seachTiele {
  line-height: 35px;
}
.btnBottom {
  padding: 10px 0 20px 0;
}
</style>
