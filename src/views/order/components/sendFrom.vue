<template>
  <div>
    <div v-if="formItem.deliveryType === 'express'">
      <el-form-item label="发货类型：">
        <el-radio-group v-model="formItem.expressRecordType" @change="changeSendTypeRadio(formItem.expressRecordType)">
          <el-radio label="1">手动填写</el-radio>
          <el-radio label="2" :disabled="merElectPrint == 0" v-if="checkPermi(['admin:order:sheet:info'])"
            >电子面单打印</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formItem.deliveryType === 'express'" label="快递公司：" prop="expressCode">
        <el-select
          @change="onChangeExpress"
          v-model="formItem.expressCode"
          filterable
          :style="isShowBtn ? 'width: 82%' : 'width:100%'"
        >
          <el-option v-for="item in express" :key="item.id" :label="item.name" :value="item.code"
            >{{ item.name }}
            <span v-if="item.account" type="info" class="line-heightOne from-tips"> | 月结账号已配</span>
          </el-option>
        </el-select>
        <el-button
          v-show="isShowBtn"
          class="ml24"
          type="primary"
          size="small"
          @click="handleCreat"
          v-hasPermi="['merchant:express:relate']"
          >设置物流公司</el-button
        >
      </el-form-item>
      <!--手动填写-->
      <template v-if="formItem.expressRecordType === '1'">
        <el-form-item v-if="formItem.deliveryType === 'express'" label="快递单号：" prop="expressNumber">
          <el-input v-model.trim="formItem.expressNumber" placeholder="请输入快递单号"></el-input>
        </el-form-item>
      </template>
      <!--电子面单打印-->
      <template v-if="formItem.expressRecordType === '2'">
        <el-form-item label="电子面单：" class="express_temp_id" prop="expressTempId" label-width="95px">
          <div class="acea-row">
            <el-select
              v-model="formItem.expressTempId"
              placeholder="请选择电子面单"
              :class="[formItem.expressTempId ? 'width9' : 'width8']"
              @change="onChangeImg"
            >
              <el-option
                v-for="(item, i) in exportTempList"
                :value="item.temp_id"
                :key="i"
                :label="item.title"
              ></el-option>
            </el-select>
            <div v-if="formItem.expressTempId" style="position: relative">
              <div class="tempImgList ml10">
                <div class="demo-image__preview">
                  <el-image style="width: 36px; height: 36px" :src="tempImg" :preview-src-list="[tempImg]" />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="寄件人姓名：" prop="toName">
          <el-input v-model="formItem.toName" placeholder="请输入寄件人姓名" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="寄件人电话：" prop="toTel">
          <el-input v-model="formItem.toTel" placeholder="请输入寄件人电话" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="寄件人地址：" prop="toAddr">
          <el-input v-model="formItem.toAddr" placeholder="请输入寄件人地址" style="width: 80%"></el-input>
        </el-form-item>
      </template>
    </div>

    <el-form-item v-if="formItem.deliveryType === 'noNeed'" label="发货备注：">
      <el-input
        v-model.trim="formItem.deliveryMark"
        show-word-limit
        :autosize="{ minRows: 4 }"
        maxlength="250"
        type="textarea"
        placeholder="请输入备注信息，最多可输入250字"
      ></el-input>
    </el-form-item>
    <el-form-item v-if="formItem.deliveryType === 'merchant'" label="配送人员：" prop="deliveryCarrier">
      <div class="acea-row">
        <el-select
          v-model="selectedValue"
          value-key="id"
          :style="isShowBtn ? 'width: 80%' : 'width:95%'"
          filterable
          clearable
          @change="handleChangePersonnel"
        >
          <el-option v-for="item in personnelList" :key="item.id" :label="item.personnelName" :value="item" />
        </el-select>
        <el-button v-show="isShowBtn" class="ml24" @click="handleCreatPersonnel()">添加配送员</el-button>
      </div>
    </el-form-item>
    <el-form-item v-if="formItem.deliveryType === 'merchant'" label="手机号码：" prop="carrierPhone">
      <el-input v-model.trim="formItem.carrierPhone" disabled placeholder="请输入配送人员手机号码"></el-input>
    </el-form-item>
    <!--物流公司-->
    <creat-express ref="craetExpressRef" @handlerSuccessSubmit="getList"></creat-express>
    <!-- 添加配送员 -->
    <creat-personnel
      :dialogVisible="dialogVisible"
      :editData="editData"
      @handlerCloseFrom="handlerCloseFrom"
      @handlerSuccessSubmit="handlerSuccessSubmit"
    ></creat-personnel>
  </div>
</template>

<script>
import CreatExpress from '@/views/systemSetting/logisticsManagement/creatExpress.vue';
import { useLogistics } from '@/hooks/use-order';
import { defaultData } from '@/views/systemSetting/deliveryPersonnel/default';
import { personnelListApi } from '@/api/deliveryPersonnel';
import CreatPersonnel from '@/views/systemSetting/deliveryPersonnel/creatPersonnel';
import { checkPermi } from '@/utils/permission';
import { merchantElectrSheetInfo } from '@/api/systemSetting';
import Cookies from 'js-cookie';
import { exportTempApi } from '@/api/logistics';
export default {
  name: 'sendFrom',
  components: { CreatExpress, CreatPersonnel },
  data() {
    return {
      selectedValue: null,
      express: [],
      dialogVisible: false,
      editData: Object.assign({}, defaultData),
      tableFrom: {
        page: 1,
        limit: 9999,
      },
      personnelList: [],
      shipmentExpress: {}, // 电子面单发货信息
      exportTempList: [],
      merElectPrint: Cookies.get('merElectPrint'), // 商家小票打印开关状态
      currentItemCode: '',
    };
  },
  props: {
    formItem: {
      type: Object,
      default: null,
    },
    isShowBtn: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.getList();
    this.getPersonnelList();
    //if (checkPermi(['admin:pass:shipment:express']))
    this.getShipmentExpress();
  },
  methods: {
    checkPermi,
    //选择配送员
    handleChangePersonnel(e) {
      this.formItem.deliveryCarrier = e.personnelName;
      this.formItem.carrierPhone = e.personnelPhone;
    },
    // 取消选配送员弹窗
    handlerCloseFrom() {
      this.dialogVisible = false;
    },
    // 选配送员确定回调
    handlerSuccessSubmit() {
      this.getPersonnelList();
      this.dialogVisible = false;
    },
    // 配送员列表
    async getPersonnelList() {
      const data = await personnelListApi(this.tableFrom);
      this.personnelList = data.list;
      if (!this.isShowBtn)
        this.selectedValue = this.personnelList.filter((item) => item.personnelPhone === this.formItem.carrierPhone)[0];
    },
    // 添加
    handleCreatPersonnel(row) {
      this.editData = row ? row : Object.assign({}, defaultData);
      this.dialogVisible = true;
    },
    // 添加
    handleCreat() {
      if (!localStorage.getItem('expressAllList')) this.$refs.craetExpressRef.getExpressList();
      this.$refs.craetExpressRef.dialogVisible = true;
    },
    // 物流公司列表
    async getList() {
      const params = {
        keywords: '',
        page: 1,
        limit: 50,
        openStatus: true,
      };
      this.express = await useLogistics(params);
      this.express.map((item) => {
        if (item.isDefault && !this.formItem.id) this.formItem.expressCode = item.code;
      });
    },
    getShipmentExpress() {
      merchantElectrSheetInfo().then((data) => {
        this.shipmentExpress = data;
        this.formItem.toName = data.senderUsername;
        this.formItem.toTel = data.senderPhone;
        this.formItem.toAddr = data.senderAddr;
      });
    },
    changeSendTypeRadio(expressRecordType) {
      if (expressRecordType === '2') {
        this.formItem.expressCode && this.exportTemp(this.formItem.expressCode);
        this.getShipmentExpress();
      }
    },
    // 快递公司选择
    onChangeExpress: function (val) {
      const currentItem = this.express.filter((item) => item.code == val)[0];
      this.formItem.expressName = val.name;
      this.formItem.expressTempId = '';
      this.currentItemCode = currentItem.code;
      if (this.formItem.expressRecordType === '2') this.exportTemp(currentItem.code);
    },
    // 电子面单模板
    exportTemp(code) {
      exportTempApi({ com: code }).then(async (res) => {
        this.exportTempList = res.data.data || [];
      });
    },
    onChangeImg(item) {
      this.exportTempList.map((i) => {
        if (i.temp_id === item) this.tempImg = i.pic;
      });
    },
  },
};
</script>

<style scoped></style>
