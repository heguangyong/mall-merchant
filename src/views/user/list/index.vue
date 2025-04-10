<template>
  <div class="divBox relative">
    <el-card
      v-hasPermi="['merchant:user:page:list']"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add" ref="tableheader">
        <el-form
          inline
          size="small"
          :model="userFrom"
          ref="userFrom"
          label-width="66px"
          :label-position="labelPosition"
        >
          <div class="acea-row search-form" v-if="!collapse">
            <div class="search-form-box">
              <el-form-item label="用户搜索：" label-for="nickname">
                <UserSearchInput v-model="userFrom" />
              </el-form-item>
              <el-form-item label="访问时间：">
                <el-date-picker
                  v-model="timeVal"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  size="small"
                  type="daterange"
                  placement="bottom-end"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="form_content_width"
                  :picker-options="pickerOptions"
                  @change="onchangeTime"
                />
              </el-form-item>
            </div>
            <el-form-item class="search-form-sub">
              <el-button type="primary" size="small" @click="handleSearchList">搜索</el-button>
              <el-button size="small" @click="handleReset('userFrom')" class="ResetSearch">重置</el-button>
              <a class="ivu-ml-8 font12 ml10" @click="collapse = !collapse">
                <template v-if="!collapse"> 展开 <i class="el-icon-arrow-down" /> </template>
                <template v-else> 收起 <i class="el-icon-arrow-up" /> </template>
              </a>
            </el-form-item>
          </div>
          <div v-if="collapse" class="acea-row search-form">
            <div class="search-form-box">
              <el-form-item label="用户搜索：" label-for="nickname">
                <UserSearchInput v-model="userFrom" />
              </el-form-item>
              <el-form-item label="访问时间：">
                <el-date-picker
                  v-model="timeVal"
                  align="right"
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  size="small"
                  type="daterange"
                  placement="bottom-end"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="form_content_width"
                  :picker-options="pickerOptions"
                  @change="onchangeTime"
                />
              </el-form-item>
              <el-form-item label="性别：">
                <el-select v-model="userFrom.sex" placeholder="请选择" size="small" class="selWidth" clearable>
                  <el-option value="" label="全部"></el-option>
                  <el-option value="0" label="未知"></el-option>
                  <el-option value="1" label="男"></el-option>
                  <el-option value="2" label="女"></el-option>
                  <el-option value="3" label="保密"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="注册类型：">
                <el-select
                  v-model="userFrom.registerType"
                  placeholder="请选择"
                  @change="getList(1)"
                  clearable
                  class="form_content_width"
                >
                  <el-option v-for="item in registerTypeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item class="search-form-sub">
              <el-button type="primary" size="small" @click="handleSearchList">搜索</el-button>
              <el-button size="small" @click="handleReset('userFrom')" class="ResetSearch">重置</el-button>
              <a class="ivu-ml-8 font12 ml10" @click="collapse = !collapse">
                <template v-if="!collapse"> 展开 <i class="el-icon-arrow-down" /> </template>
                <template v-else> 收起 <i class="el-icon-arrow-up" /> </template>
              </a>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
      <el-table
        ref="table"
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="mini"
        :height="tableHeight"
        highlight-current-row
      >
        <el-table-column type="expand" width="40">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="真实姓名：">
                <span>{{ props.row.realName | filterEmpty }}</span>
              </el-form-item>
              <el-form-item label="性别：">
                <span>{{ props.row.sex | sexFilter }}</span>
              </el-form-item>
              <el-form-item label="首次访问：">
                <span>{{ props.row.createTime | filterEmpty }}</span>
              </el-form-item>
              <el-form-item label="近次访问：">
                <span>{{ props.row.lastLoginTime | filterEmpty }}</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{ props.row.mark | filterEmpty }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="70" align="right" />
        <el-table-column label="头像" width="60">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" min-width="180">
          <template slot-scope="scope">
            <span :class="scope.row.isLogoff == true ? 'red' : ''">{{ scope.row.nickname | filterEmpty }}</span>
            <span :class="scope.row.isLogoff == true ? 'red' : ''" v-if="scope.row.isLogoff == true">|</span>
            <span v-if="scope.row.isLogoff == true" class="red">(已注销)</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.phone | filterEmpty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="registerType" label="注册类型" min-width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.registerType | registerTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermi(['merchant:user:detail'])" label="操作" width="70" fixed="right">
          <template slot-scope="scope">
            <a @click="onDetails(scope.row.id)">用户详情</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="userFrom.limit"
          :current-page="userFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <!--用户详情-->
    <detail-user ref="userDetailFrom"></detail-user>
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

import { userListApi } from '@/api/user';
import userList from '@/components/userList';
import detailUser from './userDetails.vue';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
export default {
  name: 'UserIndex',
  components: { detailUser },
  filters: {
    sexFilter(status) {
      const statusMap = {
        0: '未知',
        1: '男',
        2: '女',
        3: '保密',
      };
      return statusMap[status];
    },
    typeFilter(value) {
      const statusMap = {
        facebook: 'Facebook',
        twitter: 'Twitter',
        google: 'Google',
        email: 'Email',
        phone: 'Phone',
        visitor: '游客',
      };
      return statusMap[value];
    },
  },
  data() {
    return {
      registerTypeList: [
        {
          value: 'wechat',
          label: '公众号',
        },
        {
          value: 'routine',
          label: '小程序',
        },
        {
          value: 'h5',
          label: 'H5',
        },
        {
          value: 'iosWx',
          label: '微信ios',
        },
        {
          value: 'androidWx',
          label: '微信安卓',
        },
        {
          value: 'ios',
          label: 'ios',
        },
      ],
      tableHeight: 0,
      formExtension: {
        image: '',
        spreadUid: '',
        userId: '',
      },
      ruleInline: {},
      extensionVisible: false,
      userVisible: false,
      levelInfo: '',
      pickerOptions: this.$timeOptions,
      loadingBtn: false,
      PointValidateForm: {
        integralType: 2,
        integralValue: 0,
        moneyType: 2,
        moneyValue: 0,
        uid: '',
      },
      loadingPoint: false,
      VisiblePoint: false,
      visible: false,
      userIds: '',
      dialogVisible: false,
      levelVisible: false,
      levelData: [],
      groupData: [],
      labelData: [],
      selData: [],
      labelPosition: 'right',
      collapse: false,
      props: {
        children: 'child',
        label: 'name',
        value: 'name',
        emitPath: false,
      },
      propsCity: {
        children: 'child',
        label: 'name',
        value: 'name',
      },
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      nikename: '',
      userFrom: {
        registerType: '',
        sex: '',
        dateLimit: '',
        page: 1,
        limit: this.$constants.page.limit[0],
        searchType: 'all',
        content: '',
      },
      grid: {
        xl: 8,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24,
      },
      levelList: [],
      labelLists: [],
      groupList: [],
      selectedData: [],
      timeVal: [],
      dynamicValidateForm: {
        groupId: [],
      },
      loading: false,
      groupIdFrom: [],
      selectionList: [],
      batchName: '',
      uid: 0,
      Visible: false,
      keyNum: 0,
      address: [],
      multipleSelectionAll: [],
      idKey: 'uid',
      checkAll: false,
      isIndeterminate: true,
    };
  },
  created() {
    // 浏览器高度
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;

    // 此处减去100即为当前屏幕内除了表格高度以外其它内容的总高度，
    // this.tableHeight = windowHeight - 388;
  },
  activated() {
    this.userFrom.nikename = '';
    if (checkPermi(['merchant:user:page:list'])) this.getList(1);
  },
  mounted() {
    if (checkPermi(['merchant:user:page:list'])) this.getList();
    this.$nextTick(() => {
      let tableHeader = this.$refs.tableheader.offsetHeight;
      this.tableHeight = this.$selfUtil.getTableHeight(tableHeader + 100);
    });
  },
  methods: {
    checkPermi,
    filterRegisterType(status) {
      const statusMap = {
        wechat: '#FD5ACC',
        routine: '#A277FF',
        h5: '#E8B600',
        iosWx: '#1BBE6B',
        androidWx: '#EF9C20',
        ios: '#1890FF',
      };
      return statusMap[status];
    },
    onCollapse() {
      this.collapse = !this.collapse;
      this.$nextTick(() => {
        let tableHeader = this.$refs.tableheader.offsetHeight;
        this.tableHeight = this.$selfUtil.getTableHeight(tableHeader + 150);
      });
    },
    getTemplateRow(row) {
      this.formExtension.image = row.avatar;
      this.formExtension.spreadUid = row.uid;
    },
    // setExtension(row){
    //   this.formExtension = {
    //       image: '',
    //       spreadUid: '',
    //       userId: row.uid
    //   };
    //   this.extensionVisible = true
    // },
    handleCloseExtension() {
      this.extensionVisible = false;
    },
    modalPicTap() {
      this.userVisible = true;
    },
    resetForm() {
      this.visible = false;
    },
    handleReset(formName) {
      this.userFrom.registerType = '';
      this.userFrom.sex = '';
      this.userFrom.dateLimit = '';
      this.userFrom.page = 1;
      this.userFrom.searchType = 'all';
      this.userFrom.content = '';
      this.nikename = '';
      this.levelData = [];
      this.groupData = [];
      this.labelData = [];
      this.timeVal = [];
      this.getList();
    },
    // 发送文章
    sendNews() {
      if (this.selectionList.length === 0) return this.$message.warning('请先选择用户');
      const _this = this;
      this.$modalArticle(function (row) {}, 'send');
    },
    // 发送优惠劵
    onSend() {
      if (this.selectionList.length === 0) return this.$message.warning('请选择要设置的用户');
      const _this = this;
      this.$modalCoupon(
        'send',
        (this.keyNum += 1),
        [],
        function (row) {
          _this.formValidate.give_coupon_ids = [];
          _this.couponData = [];
          row.map((item) => {
            _this.formValidate.give_coupon_ids.push(item.coupon_id);
            _this.couponData.push(item.title);
          });
          _this.selectionList = [];
        },
        this.userIds,
        'user',
      );
    },
    Close() {
      this.Visible = false;
      this.levelVisible = false;
    },
    // 账户详情
    onDetails(id) {
      this.$refs.userDetailFrom.getUserDetail(id);
      this.$refs.userDetailFrom.dialogUserDetail = true;
    },
    // 积分余额
    handlePointClose() {
      this.VisiblePoint = false;
      this.PointValidateForm = {
        integralType: 2,
        integralValue: 0,
        moneyType: 2,
        moneyValue: 0,
        uid: '',
      };
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs['dynamicValidateForm'].resetFields();
    },
    // 搜索
    handleSearchList() {
      this.userFrom.page = 1;
      this.getList();
    },
    // 具体日期
    onchangeTime(e) {
      this.timeVal = e;
      this.userFrom.dateLimit = e ? this.timeVal.join(',') : '';
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.userFrom.page = num ? num : this.userFrom.page;
      this.userFrom.nikename = encodeURIComponent(this.nikename);
      // this.userFrom.level = this.levelData.join(',')
      this.userFrom.groupId = this.groupData.join(',');
      this.userFrom.labelId = this.labelData.join(',');
      userListApi(this.userFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
      this.checkedCities = this.$cache.local.has('user_stroge')
        ? this.$cache.local.getJSON('user_stroge')
        : this.checkedCities;
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
      this.userFrom.page = page;
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
      this.userFrom.limit = val;
      this.getList();
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.columnData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnData.length;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-table__cell:nth-child(2) .cell {
  padding-left: 14px;
  padding-right: 14px;
}
.search-form {
  display: flex;
  justify-content: space-between;
  .search-form-box {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
}
.search-form-sub {
  display: flex;
}
.red {
  color: #ed4014;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.text-right {
  text-align: right;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33.33%;
}
.seachTiele {
  line-height: 30px;
}
.container {
  min-width: 821px;
  ::v-deep .el-form-item {
    width: 100%;
  }
  ::v-deep .el-form-item__content {
    width: 72%;
  }
}
.btn_bt {
  border-top: 1px dashed #ccc;
  padding-top: 20px;
}
.relative {
  position: relative;
}
.card_abs {
  position: absolute;
  padding-bottom: 15px;
  right: 40px;
  width: 200px;
  background: #fff;
  z-index: 99999;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
}
.cell_ht {
  height: 50px;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check_cell {
  width: 100%;
  padding: 15px 20px 0;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.userbtn {
  position: absolute;
  right: 0;
}
::v-deep.el-tag {
  color: #fff !important;
}
</style>
