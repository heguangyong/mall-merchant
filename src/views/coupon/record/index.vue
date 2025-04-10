<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['merchant:coupon:user:page:list']"
    >
      <div class="padding-add">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item label="使用状态：">
            <el-select
              v-model="tableFromIssue.status"
              placeholder="请选择使用状态"
              clearable
              class="selWidth"
              @change="handleSearchList"
            >
              <el-option label="已使用" value="1" />
              <el-option label="未使用" value="0" />
              <el-option label="已过期" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="优惠劵名：">
            <el-input v-model.trim="name" placeholder="请输入优惠劵" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-table v-loading="Loading" :data="issueData.data" style="width: 100%">
        <el-table-column prop="id" label="优惠券ID" min-width="80" />
        <el-table-column prop="name" label="优惠券名称" min-width="150" />
        <el-table-column prop="user" label="用户信息" min-width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.nickname }}/{{ scope.row.uid }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="面值" min-width="100" />
        <el-table-column prop="minPrice" label="最低消费额" min-width="120" />
        <el-table-column prop="startTime" label="使用有效期" min-width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.startTime">
              {{ scope.row.startTime }} -<br />
              {{ scope.row.endTime }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="使用范围" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.category | couponCategoryFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领取时间" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" min-width="100">
          <template slot-scope="scope">
            <el-tag class="endTag tag-background" v-if="scope.row.status == 1">已使用</el-tag>
            <el-tag class="doingTag tag-background" v-else-if="scope.row.status == 0">未使用</el-tag>
            <el-tag class="notStartTag tag-background" v-else>已失效</el-tag>
          </template>
          <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.status | statusFilter }}</span>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="使用时间" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.useTime | filterEmpty }}</span>
          </template>
        </el-table-column>
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

import { couponUserListApi } from '@/api/marketing';
import { roterPre } from '@/settings';
import { checkPermi } from '@/utils/permission';
import * as $constants from '@/utils/constants'; // 权限判断函数
const tableFroms = {
  page: 1,
  limit: $constants.page.limit[0],
  name: '',
  status: '',
};
export default {
  name: 'CouponUser',
  filters: {
    failFilter(status) {
      const statusMap = {
        receive: '自己领取',
        send: '后台发送',
        give: '满赠',
        new: '新人',
        buy: '买赠送',
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: '未使用',
        1: '已使用',
        2: '已过期',
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      Loading: false,
      roterPre: roterPre,
      imgList: [],
      tableFromIssue: Object.assign({}, tableFroms),
      issueData: {
        data: [],
        total: 0,
      },
      name: '',
      loading: false,
      options: [],
    };
  },
  mounted() {
    if (checkPermi(['merchant:coupon:user:page:list'])) this.getIssueList();
  },
  methods: {
    checkPermi,
    handleSearchList() {
      this.tableFromIssue.page = 1;
      this.getIssueList();
    },
    //重置
    handleReset() {
      this.tableFromIssue = Object.assign({}, tableFroms);
      this.name = '';
      this.handleSearchList();
    },
    // 列表
    getIssueList() {
      this.Loading = true;
      this.tableFromIssue.name = encodeURIComponent(this.name);
      couponUserListApi(this.tableFromIssue)
        .then((res) => {
          this.issueData.data = res.list;
          this.issueData.total = res.total;
          // this.issueData.data.map((item) => {
          //   this.imgList.push(item.user.avatar)
          // })
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
  },
};
</script>

<style scoped lang="scss">
.seachTiele {
  line-height: 35px;
}
.fa {
  color: #0a6aa1;
  display: block;
}
.sheng {
  color: #ff0000;
  display: block;
}
</style>
