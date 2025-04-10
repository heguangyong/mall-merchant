<template>
  <div class="divBox relative">
    <el-card :bordered="false" shadow="never" class="ivu-mt" :body-style="{ padding: 0 }">
      <div class="padding-add">
        <el-form size="small" label-position="right" inline @submit.native.prevent>
          <el-form-item label="活动名称：">
            <el-input v-model="formData.groupName" placeholder="请输入活动名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动进程：" class="inline">
            <el-select
              v-model="formData.groupProcess"
              clearable
              placeholder="请选择活动进程"
              class="selWidth"
              @change="selectChange"
            >
              <el-option label="未开始" value="0" />
              <el-option label="进行中" value="1" />
              <el-option label="已结束" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动日期：" class="inline">
            <el-date-picker
              class="selWidth"
              v-model="formData.startTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
              @change="timeChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动状态：" class="inline">
            <el-select
              v-model="formData.activityStatus"
              clearable
              placeholder="请选择活动状态"
              class="selWidth"
              @change="selectChange"
            >
              <el-option label="开启" value="1" />
              <el-option label="关闭" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs v-model="formData.groupStatus" class="list-tabs" @tab-click="handleClick">
        <el-tab-pane :label="`已通过(${countArr.length && countArr[3].count})`" name="4" />
        <el-tab-pane :label="`待审核(${countArr.length && countArr[2].count})`" name="3" />
        <el-tab-pane :label="`已拒绝(${countArr.length && countArr[0].count})`" name="1" />
        <el-tab-pane :label="`已撤销(${countArr.length && countArr[1].count})`" name="2" />
      </el-tabs>
      <el-button type="primary" size="small" @click="toAdd" v-hasPermi="['merchant:groupbuy:activity:add']"
        >添加活动</el-button
      >
      <el-table :data="tableData" size="small" ref="multipleTable" row-key="id" class="mt20 tableSelection">
        <el-table-column label="ID" prop="id" width="60"></el-table-column>
        <el-table-column label="活动名称" prop="groupName" min-width="150" />
        <el-table-column label="活动时间" min-width="150">
          <template slot-scope="scope"> {{ scope.row.startTime }} 至 {{ scope.row.endTime }} </template>
        </el-table-column>
        <el-table-column label="成团人数" prop="buyCount" />
        <el-table-column label="活动进程">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              effect="plain"
              :type="scope.row.groupProcess == 0 ? 'success' : scope.row.groupProcess == 1 ? 'warning' : 'info'"
              >{{ groupProcessArr[scope.row.groupProcess] }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="参与商品数" prop="productCount" />
        <el-table-column label="开团数" prop="totalActivityBegin" :render-header="totalActivityBeginHeader" />
        <el-table-column label="成团数" prop="totalActivityDone" :render-header="totalActivityDoneHeader" />
        <el-table-column
          label="参团订单数"
          prop="totalOrderBegin"
          min-width="100"
          :render-header="totalOrderBeginHeader"
        />
        <el-table-column
          label="成团订单数"
          prop="totalOrderDone"
          min-width="100"
          :render-header="totalOrderDoneHeader"
        />
        <el-table-column label="拒绝原因" prop="refusal" v-if="formData.groupStatus == 1" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.refusal || '平台强制关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" prop="status">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['merchant:groupbuy:activity:change:status'])"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.activityStatus"
              active-text="开启"
              inactive-text="关闭"
              @change="changeStatus(scope.row, $event)"
            />
            <div v-else>{{ scope.row.activityStatus ? '显示' : '隐藏' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operate" min-width="200">
          <template slot-scope="scope">
            <a @click="toDeatil(scope.row)" v-hasPermi="['merchant:groupbuy:activity:info']">详情</a>
            <el-divider v-if="scope.row.groupStatus != 3" direction="vertical"></el-divider>
            <a
              v-if="scope.row.groupStatus != 3"
              @click="toUpdate(scope.row)"
              v-hasPermi="['merchant:groupbuy:activity:info']"
              >编辑</a
            >
            <el-divider direction="vertical"></el-divider>
            <a @click="toCopy(scope.row)">复制</a>
            <el-divider direction="vertical" v-if="formData.groupStatus == '3'"></el-divider>
            <template
              v-if="
                checkPermi(['merchant:groupbuy:activity:delete']) &&
                scope.row.groupStatus != 3 &&
                scope.row.activityStatus === 0
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="delGroup(scope.row)">删除</a>
            </template>
            <a
              v-if="scope.row.groupStatus == 3"
              @click="rollback(scope.row)"
              v-hasPermi="['merchant:groupbuy:activity:rollback']"
              >撤回</a
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-size="formData.limit"
          :current-page="formData.page"
          :total="total"
          :page-sizes="[20, 40, 60, 80]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <!-- 活动详情 -->
    <activityDetail ref="detail"></activityDetail>
  </div>
</template>

<script>
import activityDetail from './detail.vue';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import {
  groupBuyList,
  groupBuyDelete,
  groupBuyInfo,
  groupBuyListCount,
  groupActivityStatus,
  groupbuyActivityRollback,
} from '@/api/group';
export default {
  components: {
    activityDetail,
  },
  data() {
    return {
      tableData: [],
      formData: {
        page: 1,
        limit: 20,
        groupName: '',
        groupProcess: '',
        activityStatus: '',
        startTime: '',
        groupStatus: '4',
      },
      total: 0,
      countArr: [],
      groupProcessArr: ['未开始', '进行中', '已结束'],
    };
  },
  created() {
    this.$route.params.type && (this.formData.groupStatus = this.$route.params.type);
    if (checkPermi(['merchant:groupbuy:activity:list'])) this.getData();
  },
  methods: {
    checkPermi,
    search() {
      this.formData.page = 1;
      this.getData();
    },
    totalOrderDoneHeader(h, { column }) {
      return this.headerText(
        h,
        column,
        '成团订单数：此拼团活动用户已经拼团成功的所有成功订单数统计（不包含未支付的订单数据）',
      );
    },
    totalOrderBeginHeader(h, { column }) {
      return this.headerText(h, column, '参团订单数：此拼团活动用户开团的所有订单数统计（不包含未支付的订单数据）');
    },
    totalActivityDoneHeader(h, { column }) {
      return this.headerText(h, column, '成团数：此拼团活动用户已经拼团成功的团次数统计');
    },
    // 开团提示
    totalActivityBeginHeader(h, { column }) {
      return this.headerText(h, column, '开团数：此拼团活动用户开团的次数统计');
    },
    headerText(h, column, text) {
      const serviceContent = [
        h(
          'div',
          {
            slot: 'content',
          },
          text,
        ),
      ];
      return h('div', [
        h('span', column.label),
        h(
          'el-tooltip',
          {
            props: {
              placement: 'top',
            },
          },
          [
            serviceContent,
            h('i', {
              class: 'el-icon-warning-outline',
              style: 'color:#999;margin-left:5px;',
            }),
          ],
        ),
      ]);
    },
    //撤回
    rollback(row) {
      this.$modalSure('要撤回此活动吗？').then(() => {
        groupbuyActivityRollback(row.id).then((res) => {
          this.$message({
            type: 'success',
            message: '撤回成功!',
          });
          this.getData();
        });
      });
    },
    timeChange(e) {
      this.formData.page = 1;
      this.getData();
    },
    handleClick(tab, event) {
      this.formData.page = 1;
      this.getData();
    },
    selectChange() {
      this.formData.page = 1;
      this.getData();
    },
    //活动状态开关
    changeStatus(row, e) {
      groupActivityStatus({ id: row.id, status: e }).then((res) => {
        this.$message({
          type: 'success',
          message: '修改成功!',
        });
      });
    },
    getData() {
      groupBuyList(this.formData).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
        this.getCount();
      });
    },
    getCount() {
      groupBuyListCount(this.formData).then((res) => {
        this.countArr = res;
      });
    },
    //详情
    toDeatil(row) {
      groupBuyInfo(row.id).then((res) => {
        this.$refs.detail.groupInfo = res;
        this.$refs.detail.dialogVisible = true;
      });
    },
    //关闭
    delGroup(row) {
      this.$modalSure('要删除此活动吗？').then(() => {
        groupBuyDelete(row.id).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.getData();
        });
      });
    },
    //添加活动
    toAdd() {
      this.$router.push({
        path: '/marketing/group/createGroup',
      });
    },
    //编辑活动  type=1编辑 2 复制
    toUpdate(row) {
      this.$router.push({ path: `/marketing/group/createGroup/${row.id}/1` });
    },
    toCopy(row) {
      this.$router.push({ path: `/marketing/group/createGroup/${row.id}/2` });
    },
    handleSizeChange(val) {
      this.formData.limit = val;
      this.getData();
    },
    pageChange(page) {
      this.formData.page = page;
      this.getData();
    },
    //重置
    reset() {
      this.formData.page = 1;
      this.formData.groupName = '';
      this.formData.groupProcess = '';
      this.formData.activityStatus = '';
      this.formData.startTime = '';
      this.formData.groupStatus = '4';
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped></style>
