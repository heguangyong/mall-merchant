<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['merchant:pay:component:product:draft:list']"
    >
      <div class="padding-add">
        <el-form inline label-position="right" @submit.native.prevent>
          <el-form-item label="商品名称：">
            <el-input
              v-model="search"
              @keyup.enter.native="getList(1)"
              placeholder="请输入商品名称"
              class="selWidth"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <router-link :to="{ path: '/videoChannel/creatVideoChannel' }">
        <el-button size="small" type="primary" class="mb20" v-hasPermi="['merchant:pay:component:product:draft:add']"
          >添加视频号商品</el-button
        >
      </router-link>
      <el-table v-loading="listLoading" :data="tableData.data" style="width: 100%" size="mini" ref="multipleTable">
        <el-table-column prop="id" label="Id" width="40" />
        <el-table-column label="名称" prop="title" min-width="300">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right" :open-delay="800">
              <div class="text_overflow" slot="reference">{{ scope.row.title }}</div>
              <div class="pup_card">{{ scope.row.title }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品图" min-width="60">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="JSON.parse(scope.row.headImg)[0]" :preview-src-list="JSON.parse(scope.row.headImg)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类目" min-width="150" prop="thirdCatName" />
        <el-table-column prop="sales" label="销量" min-width="80" />
        <el-table-column prop="stock" label="库存" min-width="80" />
        <el-table-column label="微信审核" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.editStatus | editStatusFilter }}</span>
            <div v-show="scope.row.editStatus === 3" class="textE93323">
              拒绝原因：{{ scope.row.platformStatusReason }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="平台审核" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.platformEditStatus | platformStatusFilter }}</span>
            <div v-show="scope.row.platformEditStatus === 3" class="textE93323">
              拒绝原因：{{ scope.row.platformStatusReason }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="addTime" min-width="140" />
        <el-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <router-link :to="{ path: '/videoChannel/creatVideoChannel/' + scope.row.id + '/1' }">
              <a v-hasPermi="['merchant:pay:component:product:draft:info']">详情</a>
            </router-link>
            <template
              v-show="
                (scope.row.platformEditStatus === 1 ||
                  scope.row.platformEditStatus === 3 ||
                  scope.row.editStatus === 3) &&
                checkPermi(['merchant:pay:component:product:draft:update'])
              "
            >
              <el-divider direction="vertical"></el-divider>
              <router-link :to="{ path: '/videoChannel/creatVideoChannel/' + scope.row.id }">
                <a>编辑</a>
              </router-link>
            </template>
            <template
              v-show="scope.row.platformEditStatus !== 2 && checkPermi(['merchant:pay:component:product:draft:delete'])"
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handlerOpenDel(scope.row)">删除</a>
            </template>
            <template
              v-show="
                scope.row.platformEditStatus === 1 ||
                (scope.row.platformEditStatus === 3 && checkPermi(['merchant:pay:component:product:draft:review']))
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handlerReview(scope.row, 2)">提审</a>
            </template>
            <template
              v-show="scope.row.platformEditStatus === 2 && checkPermi(['merchant:pay:component:product:draft:review'])"
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handlerReview(scope.row, 1)">撤回申请</a>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="block mb20">
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

import { draftListApi, draftDelApi, draftReviewApi } from '@/api/marketing';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  name: 'videoList',
  data() {
    return {
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: {
        page: 1,
        limit: this.$constants.page.limit[0],
        proId: '',
        search: '',
      },
      search: '',
    };
  },
  mounted() {
    if (checkPermi(['merchant:pay:component:product:draft:list'])) this.getList();
  },
  methods: {
    checkPermi,
    /**
     * 删除
     * @param rowData
     */
    handlerOpenDel(rowData) {
      this.$modalSure('删除当前数据').then(() => {
        draftDelApi(rowData.id).then((data) => {
          this.$message.success('删除数据成功');
          this.getList();
        });
      });
    },
    /**
     * 提审 platformStatus：2提审，1撤回
     */
    handlerReview(rowData, num) {
      this.$modalSure(num === 2 ? '提审商品至平台吗？' : '撤回申请吗？').then(() => {
        draftReviewApi({ draftProductId: rowData.id, platformEditStatus: num }).then((data) => {
          this.$message.success('提交成功');
          this.getList();
        });
      });
    },
    /**
     * 列表
     * @param num
     */
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.search = encodeURIComponent(this.search);
      draftListApi(this.tableFrom)
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
  },
};
</script>

<style scoped>
.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}
.text_overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}
.pup_card {
  width: 200px;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
  font-size: 12px;
  line-height: 16px;
}
</style>
