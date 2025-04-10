<template>
  <el-dialog
    title="新增物流公司"
    :visible.sync="dialogVisible"
    width="540px"
    append-to-body
    :before-close="handleResetForm"
  >
    <el-form
      v-if="dialogVisible"
      ref="formValidate"
      class="formValidate"
      :model="formValidate"
      :rules="rules"
      @submit.native.prevent
      label-width="80px"
    >
      <el-form-item label="物流公司：" required prop="expressId">
        <el-select v-model="formValidate.expressId" placeholder="请选择" clearable filterable style="width: 100%">
          <el-option v-for="item in expressAllList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleResetForm">取 消</el-button>
      <el-button type="primary" @click="handleSure" :loading="loadingBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { expressRelateApi } from '@/api/logistics';
import { useLogisticsAllList } from '@/hooks/use-order';

export default {
  props: {
    datekey: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    datekey() {
      this.dialogVisible = true;
      if (localStorage.getItem('expressAllList'))
        this.expressAllList = JSON.parse(localStorage.getItem('expressAllList'));
    },
  },
  data() {
    return {
      dialogVisible: false,
      formValidate: {
        expressId: null,
      },
      expressAllList: [],
      loadingBtn: false,
      rules: {
        expressId: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
      },
    };
  },
  mounted() {
    if (localStorage.getItem('expressAllList'))
      this.expressAllList = JSON.parse(localStorage.getItem('expressAllList'));
  },
  methods: {
    // 物流公司列表
    async getExpressList() {
      this.expressAllList = await useLogisticsAllList();
    },
    //取消
    handleResetForm() {
      this.dialogVisible = false;
      this.$refs.formValidate.resetFields();
    },
    // 提交
    handleSure() {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          expressRelateApi(this.formValidate)
            .then(async (res) => {
              this.$message.success('新增成功');
              this.$emit('handlerSuccessSubmit');
              this.handleResetForm();
              this.loadingBtn = false;
            })
            .catch((res) => {
              this.loadingBtn = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
