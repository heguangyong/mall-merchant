<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['merchant:product:reply:page:list']"
    >
      <div class="padding-add">
        <el-form inline label-position="right" @submit.native.prevent>
          <el-form-item label="用户搜索：" label-for="nickname">
            <UserSearchInput v-model="tableFrom" />
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              @change="onchangeTime"
              v-model="timeVal"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="daterange"
              placement="bottom-end"
              placeholder="自定义时间"
              class="form_content_width"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="回复状态：">
            <el-select
              v-model="tableFrom.isReply"
              placeholder="请选择回复状态"
              @change="handleSearchList"
              size="small"
              class="form_content_width"
              clearable
            >
              <el-option label="已回复" :value="1"></el-option>
              <el-option label="未回复" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评价星级：" class="star">
            <el-rate v-model="tableFrom.star" @change="handleSearchList"></el-rate>
          </el-form-item>
          <el-form-item label="商品搜索：">
            <el-input
              v-model.trim="productSearch"
              placeholder="请输入商品名称"
              class="form_content_width"
              size="small"
              @keyup.enter.native="handleSearchList"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearchList">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never" :bordered="false" class="box-card mt14" :body-style="{ padding: '20px' }">
      <el-button size="small" type="primary" @click="add" v-hasPermi="['merchant:product:reply:virtual']"
        >添加自评</el-button
      >
      <el-table :data="tableData.list" size="small" class="mt20">
        <el-table-column prop="id" label="ID" width="50" />
        <el-table-column label="商品信息" prop="productImage" min-width="300" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="demo-image__preview acea-row row-middle line-heightOne" v-if="scope.row.productName">
              <el-image
                :src="scope.row.productImage"
                :preview-src-list="[scope.row.productImage]"
                class="mr10 line-heightOne"
              />
              <div class="info line2">{{ scope.row.productName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户昵称" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :class="scope.row.isLogoff == true ? 'red' : ''">{{ scope.row.nickname }}</span>
            <span :class="scope.row.isLogoff == true ? 'red' : ''" v-if="scope.row.isLogoff == true">|</span>
            <span v-if="scope.row.isLogoff == true" class="red">(已注销)</span>
          </template>
        </el-table-column>
        <el-table-column prop="star" label="评价星级" min-width="90" />
        <el-table-column prop="comment" label="评价内容" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column prop="merchantReplyContent" label="回复内容" min-width="200" :show-overflow-tooltip="true" />
        <el-table-column label="评价时间" min-width="150">
          <template slot-scope="scope">
            <span> {{ scope.row.createTime || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <template v-if="!scope.row.merchantReplyContent && checkPermi(['merchant:product:reply:comment'])">
              <a @click="reply(scope.row.id)">回复</a>
              <el-divider direction="vertical"></el-divider>
            </template>
            <a @click="handleDelete(scope.row.id, scope.$index)" v-hasPermi="['merchant:product:reply:delete']">删除</a>
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
        /></div
    ></el-card>

    <el-dialog
      title="添加自评"
      :append-to-body="false"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      width="920px"
      @close="handleClose"
      class="dialog-bottom"
    >
      <creat-comment :key="timer" ref="formValidate" @getList="handleSearchList"></creat-comment>
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

import creatComment from './creatComment.vue';
import { replyListApi, replyDeleteApi, replyCommentApi } from '@/api/product';
import { formatDates } from '@/utils/index';
import { checkPermi } from '@/utils/permission';
import * as $constants from '@/utils/constants';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
export default {
  name: 'StoreComment',
  filters: {
    formatDate(time) {
      if (time !== 0) {
        const date = new Date(time * 1000);
        return formatDates(date, 'yyyy-MM-dd hh:mm');
      }
    },
  },
  directives: {
    // 计算是否滚动到最下面
    selectLoadMore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          if (this.scrollHeight - this.scrollTop < this.clientHeight + 1) {
            binding.value();
          }
        });
      },
    },
  },
  components: { creatComment },
  data() {
    return {
      fromList: this.$constants.fromList,
      tableData: {
        total: 0,
      },
      listLoading: false,
      tableFrom: {
        page: 1,
        limit: $constants.page.limit[0],
        isReply: '',
        dateLimit: '',
        star: null,
        nickname: '',
        productSearch: '',
        searchType: 'all',
        content: '',
      },
      nickname: '',
      productSearch: '',
      timeVal: [],
      loading: false,
      dialogVisible: false,
      timer: '',
    };
  },
  watch: {
    $route(to, from) {
      this.getList();
    },
  },
  mounted() {
    if (checkPermi(['merchant:product:reply:page:list'])) this.getList();
  },
  methods: {
    checkPermi,
    handleSearchList() {
      this.dialogVisible = false;
      this.tableFrom.page = 1;
      this.getList();
    },
    //重置
    handleReset() {
      this.tableFrom.page = 1;
      this.tableFrom.isReply = '';
      this.tableFrom.dateLimit = '';
      this.tableFrom.star = null;
      this.tableFrom.nickname = '';
      this.tableFrom.productSearch = '';
      this.tableFrom.searchType = 'all';
      this.tableFrom.content = '';
      this.nickname = '';
      this.productSearch = '';
      this.selectChange();
    },
    // 回复
    reply(id) {
      this.$modalPrompt('textarea', '回复', null, '回复内容').then((V) => {
        replyCommentApi({
          id: id,
          merchantReplyContent: V,
        }).then((res) => {
          this.$message({
            type: 'success',
            message: '回复成功',
          });
          this.getList();
        });
      });
    },
    // 选择时间
    selectChange() {
      this.timeVal = [];
      this.tableFrom.page = 1;
      this.getList();
    },
    add() {
      this.dialogVisible = true;
      this.timer = new Date().getTime();
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.formValidate.pics = [];
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.tableFrom.dateLimit = e ? this.timeVal.join(',') : '';
      this.tableFrom.page = 1;
      this.getList();
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure().then(() => {
        replyDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.list.length, this.tableFrom);
          this.getList();
        });
      });
    },
    // 列表
    getList() {
      this.listLoading = true;
      this.tableFrom.nickname = encodeURIComponent(this.nickname);
      this.tableFrom.productSearch = encodeURIComponent(this.productSearch);
      if (this.tableFrom.star === 0) this.tableFrom.star = null;
      replyListApi(this.tableFrom)
        .then((res) => {
          this.tableData = res;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch(() => {
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
.red {
  color: #ed4014;
}
.table {
  ::v-deep .el-tooltip {
    white-space: inherit !important;
  }
}
.star {
  ::v-deep.el-rate {
    line-height: 2.2 !important;
  }
}
.table {
  ::v-deep el-image__inner,
  .el-image__placeholder,
  .el-image__error {
    width: auto !important;
  }
}
.info {
  width: 82%;
}
</style>
