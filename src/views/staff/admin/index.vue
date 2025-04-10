<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{
        padding: 0,
      }"
    >
      <div class="padding-add" ref="tableheader">
        <el-form inline size="small" ref="userFrom" label-width="66px">
          <div class="acea-row search-form">
            <div class="search-form-box">
              <el-form-item label="员工状态：">
                <el-select
                  v-model="staffSearchData.status"
                  placeholder="请选择"
                  clearable
                  class="form_content_width"
                  @change="getSearch"
                >
                  <el-option v-for="(item, index) in statusOption" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="员工搜索：">
                <el-input
                  v-model="staffSearchData.keywords"
                  placeholder="请输入员工姓名或手机号搜索"
                  clearable
                  class="form_content_width"
                />
              </el-form-item>
              <el-form-item class="search-form-sub">
                <el-button type="primary" size="small" @click="getSearch">搜索</el-button>
                <el-button size="small" class="ResetSearch" @click="handleReset">重置</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-button size="small" type="primary" @click="addStaff">添加员工</el-button>
      <el-table
        ref="table"
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
        highlight-current-row
        class="mt20"
      >
        <el-table-column prop="id" label="ID" min-width="50"> </el-table-column>
        <el-table-column label="头像" min-width="80">
          <template slot-scope="{ row }">
            <img :src="row.avatar" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="员工姓名" min-width="80"> </el-table-column>
        <el-table-column prop="user" label="关联用户" min-width="100">
          <template slot-scope="{ row }">
            <span
              >uid:<a @click="toDetail(row.uid)" class="uid">{{ row.uid }}</a></span
            >
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="100"> </el-table-column>
        <el-table-column prop="admin" label="管理权限" min-width="220">
          <template slot-scope="{ row }">{{ roleText(row.role) }} </template>
        </el-table-column>
        <el-table-column prop="creatTime" label="创建时间" min-width="100"> </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="{ row }">
            <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="updataStaff(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="{ row }">
            <a @click="handleEditMenu(row)">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a @click="handleDelMenu(row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        />
      </div>
    </el-card>
    <!-- 弹窗框 -->
    <el-dialog
      :title="editDialogConfig.isCreate === 0 ? `添加员工` : `编辑员工`"
      :visible.sync="editDialogConfig.visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="540px"
      class="dialog-bottom"
    >
      <adminEdit
        v-if="editDialogConfig.visible"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.data"
        @hideEditDialog="hideEditDialog"
      />
    </el-dialog>
    <!--用户详情-->
    <detailUser ref="userDetailFrom"></detailUser>
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

import adminEdit from '../adminEdit';
import { employeeRoleList, employeeDelRole, employeeGetInfo, employeeAddRole, employeeUpdateRole } from '@/api/staff';
import { userDetailApi } from '@/api/user';
import detailUser from './userDetails.vue';
export default {
  components: { adminEdit, detailUser },
  data() {
    return {
      roleArr: ['', '订单管理', '商品管理', '售后管理', '代客下单', '订单核销', '销量/用户统计'],
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      staffSearchData: {
        page: 1,
        limit: 10,
        keywords: '',
        status: '',
      },
      identityOption: [
        {
          label: '上货员',
          value: 0,
        },
        {
          label: '管理员',
          value: 1,
        },
      ],
      statusOption: [
        {
          label: '关闭',
          value: 0,
        },
        {
          label: '开启',
          value: 1,
        },
      ],
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=添加，1=编辑
        data: {
          nickname: null,
          userAvatar: null,
        },
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //关联用户详情
    toDetail(id) {
      this.$refs.userDetailFrom.getUserDetail(id);
      this.$refs.userDetailFrom.dialogUserDetail = true;
    },
    //表单重置
    handleReset() {
      this.staffSearchData.keywords = '';
      this.staffSearchData.status = '';
      this.getRoleList();
    },
    //表单搜索
    getSearch() {
      this.getRoleList();
    },
    //sie更改
    handleSizeChange(val) {
      this.staffSearchData.limit = val;
      this.getRoleList();
    },
    //页数更改
    handleCurrentChange(val) {
      this.staffSearchData.page = val;
      this.getRoleList();
    },
    //更新
    updataStaff(row) {
      employeeUpdateRole(row).then((res) => {
        this.$message.success(row.status == 1 ? '开启成功' : '关闭成功');
      });
    },
    //拼接管理权限
    roleText(role) {
      let str = '';
      let arr = role.split(',');
      arr.forEach((ele, index) => {
        str += this.roleArr[ele];
        index != arr.length - 1 && (str += '、');
      });
      return str;
    },
    //获取表格列表
    getRoleList() {
      employeeRoleList(this.staffSearchData).then((res) => {
        this.tableData.data = res.list;
        this.tableData.total = res.total;
      });
    },
    //添加员工
    addStaff() {
      this.editDialogConfig.isCreate = 0;
      this.editDialogConfig.visible = true;
    },
    //关闭弹出框
    hideEditDialog(type, isCreate) {
      this.editDialogConfig.visible = false;
      this.getRoleList();
      isCreate == 0 && this.$message.success('添加成功');
      isCreate == 1 && this.$message.success('编辑成功');
    },
    //编辑
    handleEditMenu(row) {
      this.editDialogConfig.isCreate = 1;
      this.editDialogConfig.data = row;
      userDetailApi(row.uid).then((res) => {
        this.editDialogConfig.data['nickname'] = res.nickname;
        this.editDialogConfig.data['userAvatar'] = res.avatar;
        this.editDialogConfig.visible = true;
      });
    },
    //删除
    handleDelMenu(row) {
      this.$modalSure('该员工删除后，将无法使用移动端-商家管理').then(() => {
        employeeDelRole(row.id).then((res) => {
          this.$message.success('删除成功');
          this.getRoleList();
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 40px !important;
  font-size: 12px !important;
}
</style>
