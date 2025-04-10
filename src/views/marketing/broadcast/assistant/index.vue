<template>
  <div class="divBox overflow-box">
    <el-card
      v-if="checkPermi(['merchant:mp:live:assistant:list'])"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form size="small" inline @submit.native.prevent>
          <el-form-item label="商品搜索：">
            <el-input
              v-model="keywords"
              placeholder="可搜索微信号/昵称"
              class="selWidth"
              @keyup.enter.native="getList(1)"
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
      <el-button
        class="mb20"
        v-hasPermi="['merchant:mp:live:assistant:save']"
        size="small"
        type="primary"
        @click="handleEdit(0)"
      >
        <i class="add">+</i> 添加助手
      </el-button>
      <el-table v-loading="listLoading" :data="tableData.data" style="width: 100%" size="small">
        <el-table-column prop="id" label="ID" min-width="150" />
        <el-table-column prop="wechatNickname" label="微信昵称" min-width="150" />
        <el-table-column prop="wechat" label="微信号" min-width="150" />
        <el-table-column prop="createTime" label="创建时间" min-width="200" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <a
              v-hasPermi="['merchant:mp:live:assistant:edit', 'merchant:mp:live:assistant:info']"
              @click="handleEdit(1, scope.row)"
              >编辑</a
            >
            <el-divider direction="vertical"></el-divider>
            <a v-hasPermi="['merchant:mp:live:assistant:delete']" @click="handleDelete(scope.row.id, scope.$index)"
              >删除</a
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
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import {
  liveAssistantSaveApi,
  liveAssistantListApi,
  liveAssistantUpdateApi,
  liveAssistantDelApi,
} from '@/api/marketing';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
export default {
  name: 'AssistantList',
  data() {
    return {
      listLoading: true,
      tableData: {
        data: [],
        total: 0,
      },
      tableForm: {
        page: 1,
        limit: this.$constants.page.limit[0],
        keywords: '',
      },
      keywords: '',
      loading: false,
      keyNum: 0,
    };
  },
  watch: {},
  mounted() {
    if (checkPermi(['merchant:mp:live:assistant:list'])) this.getList('');
  },
  methods: {
    checkPermi,
    handleEdit(isCreate, editDate) {
      const _this = this;
      this.id = editDate ? editDate.id : 0;
      this.$modalParserFrom(
        isCreate === 0 ? '新建小助手' : '编辑小助手',
        'liveAssistant',
        isCreate,
        isCreate === 0
          ? {
              id: 0,
              wechat: '',
              wechatNickname: '',
              assDesc: '',
            }
          : Object.assign({}, editDate),
        function (formValue) {
          _this.submit(formValue);
        },
        (this.keyNum += 1),
      );
    },
    //表单提交
    submit(formValue) {
      const data = {
        id: this.id,
        wechat: formValue.wechat,
        wechatNickname: formValue.wechatNickname,
        assDesc: formValue.assDesc,
      };
      !this.id
        ? liveAssistantSaveApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            })
        : liveAssistantUpdateApi(data)
            .then((res) => {
              this.$message.success('操作成功');
              this.$msgbox.close();
              this.getList();
            })
            .catch(() => {
              this.loading = false;
            });
    },
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableForm.page = num || this.tableForm.page;
      this.tableForm.keywords = encodeURIComponent(this.keywords);
      liveAssistantListApi(this.tableForm)
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
      this.getList('');
    },
    handleSizeChange(val) {
      this.tableForm.limit = val;
      this.getList('');
    },
    // 删除
    handleDelete(id, idx) {
      this.$modalSure('删除该直播助手吗？').then(() => {
        liveAssistantDelApi(id).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableForm);
          this.getList('');
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.add {
  font-style: normal;
}
::v-deep .el-message-box {
  overflow: visible !important;
}
::v-deep .el-form.el-form--label-right .el-col-24:last-of-type .el-form-item--small {
  margin-bottom: 0 !important;
}
</style>
