<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['merchant:seckill:activity:page']"
    >
      <div class="padding-add">
        <el-form size="small" inline @submit.native.prevent label-position="right">
          <el-form-item label="活动日期：">
            <el-date-picker
              v-model="tableForm.date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              size="small"
              type="date"
              placeholder="活动日期"
              class="selWidth"
              @change="getList(1)"
            />
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input
              v-model="name"
              @keyup.enter.native="getList(1)"
              placeholder="请输入活动名称"
              class="selWidth"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
        ref="multipleTable"
        class="operation"
      >
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column prop="name" label="活动名称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="productNum" label="商品数量" min-width="90" />
        <el-table-column prop="oneQuota" label="单次限购" min-width="90" />
        <el-table-column prop="allQuota" label="活动限购" min-width="90" />
        <el-table-column prop="productCategoryNames" label="商品分类" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column label="商家星级" min-width="140">
          <template slot-scope="scope">
            <el-rate disabled v-model="scope.row.merStars" style="margin-top: 8px"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="活动状态" min-width="90">
          <template slot-scope="scope">
            <el-tag class="notStartTag tag-background" v-if="scope.row.status == 0">未开始</el-tag>
            <el-tag class="doingTag tag-background" v-if="scope.row.status == 1">进行中</el-tag>
            <el-tag class="endTag tag-background" v-if="scope.row.status == 2">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="活动日期" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate }} - {{ scope.row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="活动时间" min-width="110">
          <template slot-scope="scope">
            <div v-for="(item, i) in scope.row.timeList" :key="i">{{ item }}<br /></div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" />
        <el-table-column label="操作" width="90" fixed="right">
          <template slot-scope="scope" v-hasPermi="['merchant:seckill:product:add']">
            <a
              :disabled="scope.row.status === 2 || Number(merStarLevel) < scope.row.merStars"
              type="text"
              size="small"
              v-hasPermi="['merchant:seckill:product:add']"
              @click="goOn(scope.row.id)"
              >参加活动</a
            >
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
    </el-card>
  </div>
</template>

<script>
import { seckillActivityListApi, seckillAtivityDelApi } from '@/api/marketing';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import Cookies from 'js-cookie';
import * as $constants from '@/utils/constants';
import { handleDeleteTable } from '@/libs/public';
const tableForms = {
  page: 1,
  limit: $constants.page.limit[0],
  name: '',
  date: '',
};
export default {
  name: 'SeckillList',
  data() {
    return {
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableForm: Object.assign({}, tableForms),
      name: '',
      fromList: this.$constants.fromList,
      merStarLevel: Cookies.get('merStarLevel'),
    };
  },
  mounted() {
    if (checkPermi(['merchant:seckill:activity:page'])) this.getList(1);
    if (checkPermi(['merchant:plat:product:category:cache:tree']))
      this.$store.dispatch('product/getAdminProductClassify');
  },
  methods: {
    checkPermi,
    goOn(id) {
      this.$router.push({ path: `/marketing/seckill/creatActivity/${id}` });
    },
    // 删除
    handleDelete(id) {
      this.$modalSure(`删除该秒杀活动吗？`).then(() => {
        seckillAtivityDelApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableForm);
          this.getList();
        });
      });
    },
    handleReset() {
      this.tableForm = Object.assign({}, tableForms);
      this.name = '';
      this.getList(1);
    },
    // 列表
    getList(num) {
      this.tableForm.page = num ? num : this.tableForm.page;
      this.tableForm.name = encodeURIComponent(this.name);
      this.listLoading = true;
      seckillActivityListApi(this.tableForm)
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
      this.tableForm.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableForm.limit = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.divBox {
  ::v-deep {
    .el-badge__content.is-fixed.is-dot {
      right: 1px;
      top: 5px;
    }
  }
}
</style>
