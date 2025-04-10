<template>
  <div>
    <el-form :model="editDataLocal" ref="editDataLocal" label-width="100px" class="demo-dynamic">
      <el-form-item
        label="配置名称："
        prop="printName"
        :rules="{ required: true, message: '打印机配置名称不能为空', trigger: 'blur' }"
      >
        <el-input v-model="editDataLocal.printName" placeholder="打印机配置名称"></el-input>
      </el-form-item>
      <el-form-item label="打印机类型：">
        <el-radio-group v-model="editDataLocal.printType">
          <el-radio :label="0">易联云</el-radio>
          <el-radio :label="1">飞鹅云</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="editDataLocal.printType === 0">
        <el-form-item
          label="AppId："
          prop="printYlyAppid"
          :rules="{ required: true, message: 'AppId不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printYlyAppid" placeholder="AppId"></el-input>
        </el-form-item>
        <el-form-item
          label="Userid："
          prop="printYlyUserid"
          :rules="{ required: true, message: 'Userid不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printYlyUserid" placeholder="Userid"></el-input>
        </el-form-item>
        <el-form-item
          label="Sec："
          prop="printYlySec"
          :rules="{ required: true, message: 'Sec不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printYlySec" placeholder="Sec"></el-input>
        </el-form-item>
        <el-form-item
          label="打印机编码："
          prop="printYlyMerchineNo"
          :rules="{ required: true, message: '打印机编码不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printYlyMerchineNo" placeholder="打印机编码"></el-input>
        </el-form-item>
      </div>
      <div v-if="editDataLocal.printType === 1">
        <el-form-item
          label="Name："
          prop="printFeName"
          :rules="{ required: true, message: 'Name不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printFeName" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item
          label="User："
          prop="printFeUser"
          :rules="{ required: true, message: 'User不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printFeUser" placeholder="User"></el-input>
        </el-form-item>
        <el-form-item
          label="Ukey："
          prop="printFeUkey"
          :rules="{ required: true, message: 'Ukey不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printFeUkey" placeholder="Ukey"></el-input>
        </el-form-item>
        <el-form-item
          label="打印机编码："
          prop="printFeSn"
          :rules="{ required: true, message: '打印机编码不能为空', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.printFeSn" placeholder="打印机编码"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="状态：">
        <el-switch
          v-model="editDataLocal.status"
          :active-value="1"
          active-text="启用"
          :inactive-value="0"
          inactive-text="停用"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handleSubmitClickUp('editDataLocal')">提交</el-button>
    </div>
  </div>
</template>
<script>
import * as systemSetting from '@/api/systemSetting';
export default {
  name: 'editPrintReceipt',
  props: {
    isEdit: {
      type: Boolean,
      required: true,
      default: false,
    },
    editData: {
      type: Object,
      required: true,
      default: {},
    },
  },
  data() {
    return {
      editDataLocal: {
        id: 0, // 编辑时大于0
        merId: 0,
        printType: 0, // 0=易联云 1=飞蛾云
        printName: '',
        printYlyAppid: '',
        printYlyUserid: '',
        printYlySec: '',
        printYlyMerchineNo: '',
        printFeName: '',
        printFeUser: '',
        printFeUkey: '',
        printFeSn: '',
        status: 0, // 0未启用 1=启用
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    close() {
      this.$emit('closeDialog');
    },
    initData() {
      if (this.isEdit) {
        const {
          id,
          merId,
          printType,
          printName,
          printYlyAppid,
          printYlyUserid,
          printYlySec,
          printYlyMerchineNo,
          printFeName,
          printFeUser,
          printFeUkey,
          printFeSn,
          status,
        } = this.editData;
        this.editDataLocal.id = id;
        this.editDataLocal.merId = merId;
        this.editDataLocal.printType = printType;
        this.editDataLocal.printName = printName;
        this.editDataLocal.printYlyAppid = printYlyAppid;
        this.editDataLocal.printYlyUserid = printYlyUserid;
        this.editDataLocal.printYlySec = printYlySec;
        this.editDataLocal.printYlyMerchineNo = printYlyMerchineNo;
        this.editDataLocal.printFeName = printFeName;
        this.editDataLocal.printFeUser = printFeUser;
        this.editDataLocal.printFeUkey = printFeUkey;
        this.editDataLocal.printFeUkey = printFeUkey;
        this.editDataLocal.printFeSn = printFeSn;
        this.editDataLocal.status = status;
      }
    },
    handleSubmitClickUp(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.handledEditPrintConfig(this.editDataLocal);
          } else {
            this.handledAddPrintConfig(this.editDataLocal);
          }
        } else {
          return false;
        }
      });
    },
    handledAddPrintConfig(param) {
      systemSetting.merchantPrintSave(param).then((data) => {
        this.$message.success('新增成功');
        this.handledCloseDia();
      });
    },
    handledEditPrintConfig(param) {
      systemSetting.merchantPrintEdit(param).then((data) => {
        this.$message.success('编辑成功');
        this.handledCloseDia();
      });
    },
    handledCloseDia() {
      this.$emit('unVisible');
    },
  },
};
</script>

<style scoped></style>
