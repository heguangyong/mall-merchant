<template>
  <div class="divBox">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      v-hasPermi="['merchant:shipping:templates:list']"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form ref="form" inline :model="form" @submit.native.prevent label-position="right">
          <el-form-item label="关键字：">
            <el-input
              @keyup.enter.native="getDataList(1)"
              v-model="form.keywords"
              placeholder="请输入关键字"
              class="selWidth"
              size="small"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-debounceClick="2000" @click="getDataList(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never" :bordered="false" class="box-card mt14" :body-style="{ padding: '20px' }">
      <el-button type="primary" size="small" @click="handleCreat" v-hasPermi="['merchant:express:relate']"
        >新增</el-button
      >
      <el-table v-loading="loading" :data="tableData.data" class="mt20" size="small">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column label="物流公司名称" min-width="200" prop="name" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            <span v-if="row.isDefault" class="font-color">[默认]</span>
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码" min-width="150" prop="code" />
        <el-table-column label="状态" min-width="150" prop="createTime">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['merchant:express:open:switch'])"
              v-model="scope.row.isOpen"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              v-throttle="1000"
              :disabled="scope.row.isDefault"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
            <div v-else>{{ scope.row.isOpen ? '开启' : '关闭' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" fixed="right" width="220" label="操作">
          <template slot-scope="scope">
            <a @click="handleDelete(scope.row)" v-hasPermi="['merchant:express:delete']">删除</a>
            <template v-if="scope.row.isOpen && checkPermi(['merchant:express:default:switch'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleSetDefault(scope.row)">{{ scope.row.isDefault ? '取消默认' : '设为默认' }}</a>
            </template>
            <el-button
              v-if="scope.row.partnerId"
              type="text"
              size="small"
              @click="bindEdit(scope.row)"
              v-hasPermi="['admin:express:info']"
            >月结账号编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block-pagination">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableData.limit"
          :current-page="tableData.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @current-change="pageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <creat-express ref="craetExpressRef" @handlerSuccessSubmit="getDataList(1)" :datekey="datekey"></creat-express>

    <el-dialog title="月结账号配置" :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="月结账号" prop="account" v-if="formData.partnerId">
          <el-input v-model="formData.account" placeholder="请输入月结账号"></el-input>
        </el-form-item>
        <el-form-item label="月结密码" prop="password" v-if="formData.partnerKey">
          <el-input v-model="formData.password" placeholder="请输入月结密码"></el-input>
        </el-form-item>
        <el-form-item label="网点名称" prop="netName" v-if="formData.net">
          <el-input v-model="formData.netName" placeholder="请输入网点名称"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-radio-group v-model="formData.isOpen">
            <el-radio :label="false">关闭</el-radio>
            <el-radio :label="true">开启</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit('formData')" v-hasPermi="['admin:express:update']">确 定</el-button>
      </span>
      <!--<parser v-if="formShow" ref="formBox" class="formBox" :form-conf="formConf" :form-edit-data="formData" :is-edit="isCreate === 1" @submit="submit" />-->
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

import * as logistics from '@/api/logistics.js';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public';
import CreatExpress from './creatExpress.vue';
import { useLogisticsAllList } from '@/hooks/use-order'; // 权限判断函数
import { Debounce } from '@/utils/validate';
export default {
  name: 'ShippingTemplates',
  components: { CreatExpress },
  data() {
    return {
      form: {
        keywords: '',
        page: 1,
        limit: this.$constants.page.limit[0],
      },
      tableData: {
        data: [],
        total: 0,
      },
      loading: false,
      expressAllList: [],
      datekey: 0,
      dialogVisible: false,
      formData: {
        status: false,
        sort:0,
      },
      isCreate: 0,
      editId: 0,
      rules: {
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        account: [{ required: true, message: '请输入月结账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入月结密码', trigger: 'blur' }],
        netName: [{ required: true, message: '请输入网点名称', trigger: 'blur' }],
      },
    };
  },
  created() {
    if (checkPermi(['merchant:express:search:page'])) this.getDataList(1);
    if (!localStorage.getItem('expressAllList')) this.getExpressList();
  },
  methods: {
    checkPermi,
    // 物流公司列表
    async getExpressList() {
      this.expressAllList = await useLogisticsAllList();
    },
    // 添加
    handleCreat() {
      this.datekey = +new Date();
      //this.$refs.craetExpressRef.dialogVisible = true;
    },
    // 分页
    pageChange(e) {
      this.page = e;
      this.getDataList();
    },
    handleSizeChange(e) {
      this.limit = e;
      this.getDataList();
    },
    //修改状态
    handleStatusChange(row) {
      logistics.expressOpenSwitchApi(row.id).then((res) => {
        this.$message.success('更新状态成功');
        this.getDataList();
      });
    },
    // 数据列表
    getDataList(num) {
      this.loading = true;
      this.form.page = num ? num : this.form.page;
      logistics
        .expressPageApi({
          keywords: encodeURIComponent(this.form.keywords),
          page: this.form.page,
          limit: this.form.limit,
        })
        .then((res) => {
          this.loading = false;
          this.tableData.data = res.list;
          this.tableData.total = res.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 默认操作
    handleSetDefault(item) {
      logistics.expressDefaultAwitchApi(item.id).then((res) => {
        this.$message.success('操作成功');
        this.getDataList(1);
      });
    },
    // 删除
    handleDelete(item) {
      this.$modalSure('确定要删除此物流公司吗？').then(() => {
        logistics.expressDeleteApi(item.id).then((res) => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.form);
          this.getDataList();
        });
      });
    },
    //  关闭模态框
    handleClose(done) {
      // this.formData = {}
      // this.formConf.fields = [];
      this.dialogVisible = false;
      this.isCreate = 0;
    },
    // 编辑
    bindEdit(item) {
      this.dialogVisible = true;
      this.editId = item.id;
      this.formData = item;
    },
    submit: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          logistics.expressUpdate(this.formData).then((res) => {
            this.$message.success('操作成功');
            this.handleClose();
            this.getExpressList();
          });
        } else {
          return false;
        }
      });
    }),
  },
};
</script>

<style scoped lang="scss"></style>
