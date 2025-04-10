<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="540px" append-to-body :before-close="handleResetForm">
    <el-form
      v-if="dialogVisible && formValidate"
      ref="formValidate"
      class="formValidate"
      :model="formValidate"
      :rules="rules"
      @submit.native.prevent
      label-width="80px"
    >
      <el-form-item label="配送人员：" prop="personnelName">
        <el-input
          v-model.trim="formValidate.personnelName"
          :maxlength="16"
          placeholder="请输入配送人员姓名"
          size="small"
          clearable
        >
        </el-input>
        <div class="from-tips mb5">订单采用商家直接配送的方式发货，根据配送人员的姓名来进行选择。</div>
      </el-form-item>
      <el-form-item label="联系电话：" prop="personnelPhone">
        <el-input v-model.trim="formValidate.personnelPhone" placeholder="请输入配送人员联系电话"></el-input>
        <div class="from-tips mb5">订单采用商家直接配送的方式发货后，用户可通过手机号码联系该配送员。</div>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input-number
          v-model.trim="formValidate.sort"
          :min="0"
          :max="99"
          :step="1"
          step-strictly
          placeholder="请输入排序"
          label="排序"
        ></el-input-number>
        <div class="from-tips mb5">请输入0~99的数字，数字越大越靠前。</div>
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
import { validatePhone } from '@/utils/toolsValidate';
import { personnelEditApi, personnelSaveApi } from '@/api/deliveryPersonnel';
import { defaultData } from '@/views/systemSetting/deliveryPersonnel/default';
export default {
  name: 'CreatPersonnel',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: {},
    },
  },
  watch: {
    editData: {
      handler(nVal, oVal) {
        if (nVal) {
          this.formValidate = this.editData;
          this.title = this.formValidate.id ? '修改配送员' : '新增配送员';
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      title: '',
      formValidate: Object.assign({}, defaultData),
      loadingBtn: false,
      rules: {
        personnelName: [{ required: true, message: '请输入配送人员姓名', trigger: 'blue' }],
        personnelPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
      },
    };
  },
  mounted() {},
  methods: {
    //取消
    handleResetForm() {
      this.$emit('handlerCloseFrom');
      this.$refs.formValidate.resetFields();
    },
    // 提交
    handleSure() {
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            this.loadingBtn = true;
            const data = this.formValidate.id
              ? await personnelEditApi(this.formValidate)
              : await personnelSaveApi(this.formValidate);
            if (data) this.$message.success(data);
            this.$emit('handlerSuccessSubmit');
            this.handleResetForm();
            this.loadingBtn = false;
          } catch (e) {
            this.loadingBtn = false;
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
