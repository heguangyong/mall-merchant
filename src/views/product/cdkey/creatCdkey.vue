<template>
  <div class="divBox">
    <pages-header ref="pageHeader" :title="`${$route.params.name}`" backUrl="/product/cdkey"></pages-header>
    <el-card class="mt14" shadow="never" :bordered="false">
      <div class="acea-row mb20">
        <el-button size="small" type="primary" class="mr14" v-hasPermi="['merchant:card:secret:add']" @click="handleAdd"
          >添加卡密</el-button
        >
        <el-upload
          v-hasPermi="['merchant:cdkey:library:import:excel']"
          class="mr14"
          action
          :http-request="handleUploadForm"
          :headers="myHeaders"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-button size="small">导入卡密</el-button>
        </el-upload>
        <el-button size="small" @click="handleDownload">下载模板</el-button>
        <el-button size="small" v-if="checkPermi(['merchant:card:secret:delete'])" @click="handleBatchDel"
          >批量删除</el-button
        >
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        size="small"
        :highlight-current-row="true"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @select-all="selectAll"
        @select="selectOne"
        class="operation tableSelection"
      >
        <el-table-column type="selection" width="55" :selectable="selectable"> </el-table-column>
        <el-table-column prop="id" label="卡密ID" min-width="100" />
        <el-table-column prop="libraryId" label="卡密库ID" min-width="100" />
        <el-table-column label="卡号" prop="cardNumber" min-width="230" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="secretNum" label="密码" min-width="230" :show-overflow-tooltip="true" />
        <el-table-column label="出售情况" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :class="scope.row.isUse ? 'colorNotbuy' : 'colorAuxiliary'">{{
              scope.row.isUse ? '已出售' : '未出售'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="200" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleEdit(scope.row)"
              :disabled="checkPermi(['merchant:cdkey:library:update']) && scope.row.isUse"
              >编辑</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="text"
              :disabled="checkPermi(['merchant:card:secret:delete']) && scope.row.isUse"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
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

    <!-- 添加卡密-->
    <add-cdkey ref="addCarMy" :libraryId="tableFrom.libraryId" @handlerSubSuccess="handlerSubSuccess"></add-cdkey>
    <!-- 编辑卡密-->
    <edit-cdkey ref="editCarMy" :cdkeyInfo="cdkeyInfo" @handlerEditSubSuccess="handlerEditSubSuccess"></edit-cdkey>
  </div>
</template>
<script setup>
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import {
  cardSecretBatchDeleteApi,
  cardSecretDeleteApi,
  cardSecretImportExcelApi,
  cardSecretPageListApi,
} from '@/api/productCdkey';
import addCdkey from '@/views/product/components/addCdkey.vue';
import EditCdkey from '@/views/product/components/editCdkey.vue';
import Setting from '@/settings';
import { getToken } from '@/utils/auth';
import { isFileUpload } from '@/utils/ZBKJIutil';
import { mapGetters } from 'vuex';
export default {
  name: 'creatCdkey',
  components: { addCdkey, EditCdkey },
  computed: {
    ...mapGetters(['mediaDomain']),
  },
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
        libraryId: 0,
      },
      multipleSelectionAll: [],
      checkedIds: [], //选择的id集合
      cdkeyInfo: null, //卡密详情
      cardUrl: Setting.apiBaseURL + 'admin/merchant/card/secret/import/excel',
      myHeaders: { 'X-Token': getToken() }, // 上传参数
    };
  },
  mounted() {
    this.tableFrom.libraryId = Number(this.$route.params.id);
    if (checkPermi(['merchant:card:secret:page:list'])) this.getList();
  },
  methods: {
    checkPermi,
    //判断勾选
    selectable(row) {
      if (row.isUse) {
        return false;
      } else {
        return true;
      }
    },
    //导入卡密前校验
    beforeUpload(file) {
      return isFileUpload(file);
    },
    // 上传
    handleUploadForm(param) {
      const formData = new FormData();
      formData.append('file', param.file);
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      cardSecretImportExcelApi(formData, { libraryId: this.tableFrom.libraryId })
        .then((res) => {
          loading.close();
          this.getList(1);
          this.$message.success('导入成功');
        })
        .catch((res) => {
          loading.close();
        });
    },
    //下载模板
    handleDownload() {
      window.open(`${this.mediaDomain}/crmebimage/template/cdkey_template.xlsx`);
    },
    //批量删除
    handleBatchDel() {
      if (this.checkedIds.length === 0) return this.$message.warning('请至少选择一项卡密');
      this.$modalSure('确定要将选中卡密删除吗？').then(() => {
        cardSecretBatchDeleteApi({ ids: this.checkedIds.join(',') }).then(() => {
          this.$message.success('批量删除成功');
          if (this.tableData.data.length === 1 && this.tableFrom.page > 1)
            this.tableFrom.page = this.tableFrom.page - 1;
          this.getList('');
        });
      });
    },
    // 设置选中的方法
    handleSelectionChange(val) {
      this.multipleSelectionAll = val;
      const data = [];
      this.multipleSelectionAll.map((item) => {
        data.push(item.id);
      });
      this.checkedIds = data;
    },
    selectAll(data) {
      let id = data.map((i, index) => {
        return i.id;
      });
      this.checkedIds = Array.from(new Set([...this.checkedIds, ...id]));
    },
    selectOne(data, row) {
      let id = data.map((i, index) => {
        return i.id;
      });
      let index = this.checkedIds.findIndex((e) => {
        return e == row.id;
      });
      this.checkedIds.splice(index, 1);
      this.checkedIds = Array.from(new Set([...this.checkedIds, ...id]));
    },
    //确认提交卡密
    handlerSubSuccess(e) {
      this.$refs.addCarMy.cdkeyShow = false;
      this.getList(1);
    },
    closeCarMy() {
      this.$refs.addCarMy.cdkeyShow = false;
    },
    //编辑卡密回调
    handlerEditSubSuccess() {
      this.getList(1);
    },
    //添加卡密
    handleAdd() {
      this.$refs.addCarMy.cdkeyShow = true;
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      cardSecretPageListApi(this.tableFrom)
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
    // 删除
    handleDelete(id) {
      this.$modalSure('确定删除此卡密吗？').then(() => {
        cardSecretDeleteApi(id).then(() => {
          this.$message.success('删除成功');
          if (this.tableData.data.length === 1 && this.tableFrom.page > 1)
            this.tableFrom.page = this.tableFrom.page - 1;
          this.getList('');
        });
      });
    },
    //编辑
    handleEdit(row) {
      this.$refs.editCarMy.cdkeyShow = true;
      this.cdkeyInfo = {
        cardNumber: row.cardNumber,
        secretNum: row.secretNum,
        key: Date.now(),
        id: row.id,
      };
    },
  },
};
</script>
<style scoped lang="scss">
.colorNotbuy {
  color: #999;
}
</style>
