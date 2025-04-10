<template>
  <div class="divBox">
    <el-card class="box-card mt14" :body-style="{ padding: '20px' }" shadow="never" :bordered="false">
    <el-form :model="editDataLocal" ref="editDataLocal" label-width="100px" class="demo-dynamic">
      <el-form-item label="打印机选择：">
        <el-radio-group v-model="editDataLocal.op">
          <el-radio :label="0">通用打印机(仅支持单张打印)</el-radio>
          <el-radio :label="1">快递100打印机(支持批量打印)</el-radio>
        </el-radio-group>
        <div class="line-heightOne from-tips">通用打印机不限型号，在电脑浏览器界面右上角选择打印机并设置即可; 快送100电子面单打印机型号:快送100云打印机二代3寸 电脑Wi-Fi两用</div>
      </el-form-item>
      <div v-if="editDataLocal.op === 1">
        <el-form-item
          label="云打印机编号："
          prop="cloudPrintNo"
          :rules="{ required: true, message: '云打印机编号', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.cloudPrintNo" placeholder="云打印机编号"></el-input>
          <div class="line-heightOne from-tips">快递100电子面单打印机编号,在打印机背面查看</div>
        </el-form-item>
      </div>
        <el-form-item
          label="发货地址："
          prop="senderAddr"
          :rules="{ required: true, message: '发货地址', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.senderAddr" placeholder="发货地址"></el-input>
          <div class="line-heightOne from-tips">电子面单默认发货地址</div>
        </el-form-item>
        <el-form-item
          label="寄件人姓名："
          prop="senderUsername"
          :rules="{ required: true, message: '寄件人姓名', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.senderUsername" placeholder="寄件人姓名"></el-input>
          <div class="line-heightOne from-tips">电子面单默认寄件人姓名</div>
        </el-form-item>
        <el-form-item
          label="寄件人电话："
          prop="senderPhone"
          :rules="{ required: true, validator: validatePhone,message: '电话号码不正确', trigger: 'blur' }"
        >
          <el-input v-model="editDataLocal.senderPhone" placeholder="寄件人电话"></el-input>
          <div class="line-heightOne from-tips">电子面单默认寄件人电话</div>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitClickUp('editDataLocal')">提交</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>
<script>
import {
  merchantElectrSheetEdit,
  merchantElectrSheetInfo
} from '@/api/systemSetting';
import {validatePhone} from "@/utils/toolsValidate";
export default {
  name: 'editElectrSheet',
  data() {
    return {
      editDataLocal: {
        id: 0, // 编辑时大于0
        cloudPrintNo: "",
        op: 0, // 0=通用打印机 1=快递100打印机
        senderAddr: "",
        senderPhone: "",
        senderUsername: ""
      },
      validatePhone:validatePhone
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.handledGetElectrInfo();
    },
    handleSubmitClickUp(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            this.handledEditElectrConfig(this.editDataLocal);
        } else {
          return false;
        }
      });
    },
    handledEditElectrConfig(param) {
      merchantElectrSheetEdit(param).then((data) => {
        this.$message.success('保存成功');
        this.handledGetElectrInfo();
      });
    },
    handledGetElectrInfo(){
      merchantElectrSheetInfo().then((data) => {
        if(data){
          this.editDataLocal = data;
        }
      });
    }
  },
};
</script>

<style scoped></style>
