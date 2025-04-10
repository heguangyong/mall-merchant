<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['merchant:coupon:page:list']"
    >
      <div class="padding-add">
        <el-form inline size="small" label-position="right" @submit.native.prevent>
          <el-form-item label="优惠名称：">
            <el-input v-model.trim="name" placeholder="请输入优惠券名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="开启状态：">
            <el-select
              v-model="tableFrom.status"
              placeholder="请选择"
              class="filter-item selWidth"
              @change="handleSearchList"
              clearable
            >
              <el-option label="未开启" :value="0" />
              <el-option label="开启" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="领取方式：">
            <el-select
              v-model="tableFrom.receiveType"
              placeholder="请选择"
              class="filter-item selWidth"
              @change="handleSearchList"
              clearable
            >
              <el-option label="手动领取" :value="1" />
              <el-option label="赠送券" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="优惠类别：">
            <el-select
              v-model="tableFrom.category"
              placeholder="请选择"
              class="filter-item selWidth"
              @change="handleSearchList"
              clearable
            >
              <el-option label="商家券" :value="1" />
              <el-option label="商品券" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <router-link :to="{ path: '/coupon/list/save' }">
        <el-button size="small" type="primary" v-hasPermi="['merchant:coupon:save']">添加优惠劵</el-button>
      </router-link>
      <el-table v-loading="listLoading" :data="tableData.data" style="width: 100%" size="mini" class="mt20">
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column prop="name" :show-overflow-tooltip="true" label="名称" min-width="180" />
        <el-table-column label="类别" min-width="80">
          <template slot-scope="{ row }">
            <span>{{ row.category | couponCategoryFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="面值" min-width="100" />
        <el-table-column prop="name" label="领取方式" min-width="100">
          <template slot-scope="{ row }">
            <span>{{ row.receiveType | couponUserTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="260" label="领取日期">
          <template slot-scope="{ row }">
            <div v-if="row.receiveEndTime">{{ row.receiveStartTime }} - {{ row.receiveEndTime }}</div>
            <span v-else>不限时</span>
          </template>
        </el-table-column>
        <el-table-column min-width="260" label="使用时间">
          <template slot-scope="{ row }">
            <div v-if="row.day">{{ row.day }}天</div>
            <span v-else> {{ row.useStartTime }} - {{ row.useEndTime }} </span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="发布数量">
          <template slot-scope="{ row }">
            <span v-if="!row.isLimited">不限量</span>
            <div v-else>
              <span class="fa">发布：{{ row.total }}</span>
              <span class="sheng">剩余：{{ row.lastTotal }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否开启" min-width="100" fixed="right">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['merchant:coupon:update:status'])"
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              @click.native="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.status ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <!--<el-button type="text" class="mr10" size="small" @click="receive(scope.row)" v-hasPermi="['admin:coupon:user:list']">领取记录</el-button>-->
            <template v-if="scope.row.status && checkPermi(['merchant:coupon:info'])">
              <router-link :to="{ path: '/coupon/list/save/' + scope.row.id }">
                <a>复制</a>
              </router-link>
              <el-divider direction="vertical"></el-divider>
            </template>

            <a @click="handleDelMenu(scope.row)" v-hasPermi="['merchant:coupon:delete']">删除</a>

            <template v-if="scope.row.category === 2 && checkPermi(['merchant:coupon:product:join:edit'])">
              <el-divider direction="vertical"></el-divider>
              <router-link :to="{ path: '/coupon/list/save/' + scope.row.id + '/' + 'edit' }">
                <a>编辑</a>
              </router-link>
            </template>
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
    <!--领取记录-->
    <el-dialog title="领取记录" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-table v-loading="Loading" :data="issueData.data" style="width: 100%">
        <el-table-column prop="nickname" label="用户名" min-width="120" />
        <el-table-column label="用户头像" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="领取时间" min-width="180" />
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableFromIssue.limit"
          :current-page="tableFromIssue.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="issueData.total"
          @size-change="handleSizeChangeIssue"
          @current-change="pageChangeIssue"
        />
      </div>
    </el-dialog>
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

import { marketingListApi, couponIssueStatusApi, couponUserListApi, couponDeleteApi } from '@/api/product';
import { roterPre } from '@/settings';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { mapGetters } from 'vuex';
import * as $constants from '@/utils/constants';
const tableFroms = {
  page: 1,
  limit: $constants.page.limit[0],
  status: '',
  name: '',
  type: '',
  useType: '',
};
export default {
  name: 'CouponList',
  data() {
    return {
      Loading: false,
      dialogVisible: false,
      roterPre: roterPre,
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: Object.assign({}, tableFroms),
      name: '',
      tableFromIssue: {
        page: 1,
        limit: this.$constants.page.limit[0],
        couponId: '',
      },
      issueData: {
        data: [],
        total: 0,
      },
    };
  },
  mounted() {
    if (!this.merProductClassify.length) this.$store.dispatch('product/getMerProductClassify');
    if (checkPermi(['merchant:coupon:page:list'])) this.getList();
  },
  computed: {
    ...mapGetters(['merProductClassify']),
  },
  methods: {
    checkPermi,
    handleSearchList() {
      this.tableFrom.page = 1;
      this.getList();
    },
    //重置
    handleReset() {
      this.tableFrom = Object.assign({}, tableFroms);
      this.name = '';
      this.handleSearchList();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 领取记录
    receive(row) {
      this.dialogVisible = true;
      this.tableFromIssue.couponId = row.id;
      this.getIssueList();
    },
    // 列表
    getIssueList() {
      this.Loading = true;
      couponUserListApi(this.tableFromIssue)
        .then((res) => {
          this.issueData.data = res.list;
          this.issueData.total = res.total;
          this.Loading = false;
        })
        .catch((res) => {
          this.Loading = false;
          this.$message.error(res.message);
        });
    },
    pageChangeIssue(page) {
      this.tableFromIssue.page = page;
      this.getIssueList();
    },
    handleSizeChangeIssue(val) {
      this.tableFromIssue.limit = val;
      this.getIssueList();
    },
    // 列表
    getList() {
      this.listLoading = true;
      this.tableFrom.name = encodeURIComponent(this.name);
      marketingListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
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
    // 修改状态
    onchangeIsShow(row) {
      couponIssueStatusApi(row.id)
        .then(() => {
          this.$message.success('修改成功');
          this.getList();
        })
        .catch(() => {
          row.status = !row.status;
        });
    },
    handleDelMenu(rowData) {
      this.$modalSure('删除当前数据?').then(() => {
        couponDeleteApi(rowData.id).then((data) => {
          this.$message.success('删除成功');
          this.getList();
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.fa {
  color: #0a6aa1;
  display: block;
}
.sheng {
  color: #ff0000;
  display: block;
}
</style>
