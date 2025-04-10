<template>
  <div class="divBox relative">
    <el-card :bordered="false" shadow="never" class="ivu-mt" :body-style="{ padding: '0 20px 20px' }">
      <el-tabs v-model="loginType" class="list-tabs">
        <el-tab-pane :label="item.name" :name="item.type.toString()" v-for="(item, index) in headeNum" :key="index" />
      </el-tabs>
      <div v-if="loginType === '1'" class="information">
        <div class="basic-information" v-loading="loading">
          <div><span class="tips">商户名称：</span>{{ merData.name }}</div>
          <div><span class="tips">商户登录帐号：</span>{{ merData.phone }}</div>
          <div><span class="tips">商户负责人姓名：</span>{{ merData.realName }}</div>
          <div><span class="tips">商户分类：</span>{{ merData.merCategory }}</div>
          <div><span class="tips">商户类别：</span>{{ merData.isSelf | selfTypeFilter }}</div>

          <div><span class="tips">店铺类型：</span>{{ merData.merType }}</div>
          <div><span class="tips">商户手续费：</span>{{ merData.handlingFee }}%</div>
          <div><span class="tips">添加商品：</span>{{ merData.productSwitch ? '需平台审核' : '平台免审核' }}</div>
          <div>
            <span class="tips">商户星级：</span
            ><el-rate v-model="merData.starLevel" disabled text-color="#ff9900"> </el-rate>
          </div>
          <div><span class="tips">商户入驻时间：</span>{{ merData.createTime }}</div>
          <div v-if="merData.qualificationPicture">
            <span class="tips">商户资质：</span>
            <div class="acea-row">
              <div v-for="(item, index) in JSON.parse(merData.qualificationPicture)" :key="index" class="pictrue">
                <el-image :src="item" :preview-src-list="[item]"> </el-image>
              </div>
            </div>
          </div>
          <div v-hasPermi="['merchant:switch:update']">
            <span class="tips">开启商户：</span>
            <el-switch
              v-model="merData.isSwitch"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              @change="changeSwitch"
            >
            </el-switch>
          </div>
        </div>
      </div>
      <div v-if="loginType === '2'" class="business-msg">
        <div class="form-data">
          <el-form :model="merInfoForm" :rules="rules" ref="merInfoForm" label-width="140px" class="demo-ruleForm">
            <el-form-item label="商户主头像：" prop="avatar">
              <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'avatar')">
                <div v-if="merInfoForm.avatar" class="pictrue"><img :src="merInfoForm.avatar" /></div>
                <div v-else class="upLoad">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
                <div class="from-tips">请上传小于500kb的图片（90*90 px）</div>
              </div>
            </el-form-item>
            <el-form-item label="H5商户背景图：" prop="backImage">
              <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'backImage')">
                <div v-if="merInfoForm.backImage" class="pictrue"><img :src="merInfoForm.backImage" /></div>
                <div v-else class="upLoad">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
                <div class="from-tips">请上传小于500kb的图片（375*180 px）</div>
              </div>
            </el-form-item>
            <el-form-item label="H5商户街背景图：" prop="streetBackImage">
              <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'streetBackImage')">
                <div v-if="merInfoForm.streetBackImage" class="pictrue">
                  <img :src="merInfoForm.streetBackImage" />
                </div>
                <div v-else class="upLoad">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
                <div class="from-tips">请上传小于500kb的图片（355*78 px）</div>
              </div>
            </el-form-item>
            <el-form-item label="H5商户封面图：" prop="coverImage">
              <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'coverImage')">
                <div v-if="merInfoForm.coverImage" class="pictrue">
                  <img :src="merInfoForm.coverImage" />
                </div>
                <div v-else class="upLoad">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
                <div class="from-tips">请上传小于500kb的图片（350*350 px）</div>
              </div>
            </el-form-item>
            <el-form-item label="H5商户logo（横）：" prop="rectangleLogo">
              <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'rectangleLogo')">
                <div v-if="merInfoForm.rectangleLogo" class="pictrue">
                  <img :src="merInfoForm.rectangleLogo" />
                </div>
                <div v-else class="upLoad">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
                <div class="from-tips">请上传小于500kb的图片（300*88 px）</div>
              </div>
            </el-form-item>
            <el-form-item label="商户简介：" prop="intro">
              <el-input type="textarea" v-model.trim="merInfoForm.intro" maxlength="200" class="width100"></el-input>
            </el-form-item>
            <el-form-item label="商户关键字：" prop="labelarr">
              <keyword @getLabelarr="getLabelarr" :labelarr="labelarr" class="width100"></keyword>
            </el-form-item>
            <el-form-item label="客服类型：" prop="serviceType">
              <el-select v-model="merInfoForm.serviceType" placeholder="请选择" class="width100">
                <el-option v-for="item in serviceList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="merInfoForm.serviceType === 'H5'" label="H5链接：" prop="serviceLink">
              <el-input v-model.trim="merInfoForm.serviceLink" class="width100"></el-input>
            </el-form-item>
            <el-form-item v-if="merInfoForm.serviceType === 'phone'" label="电话：" prop="servicePhone">
              <el-input v-model.trim="merInfoForm.servicePhone" class="width100"></el-input>
            </el-form-item>
            <el-form-item label="警戒库存：" prop="alertStock">
              <el-input-number
                v-model.trim="merInfoForm.alertStock"
                :min="1"
                :max="9999"
                label="警戒库存"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="自提开关：" prop="alertStock">
              <el-switch
                v-model="merInfoForm.isTakeTheir"
                :active-value="true"
                :inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="小票打印开关：" prop="receiptPrintingSwitch">
              <el-radio-group v-model="merInfoForm.receiptPrintingSwitch">
                <!--                  小票打印开关：0关闭，1=手动打印，2=自动打印，3=自动和手动-->
                <el-radio :label="0">关闭</el-radio>
                <el-radio :label="1">手动打印</el-radio>
                <el-radio :label="2">自动打印</el-radio>
                <el-radio :label="3">自动和手动</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="电子面单开关：" prop="electrPrintingSwitch">
              <el-radio-group v-model="merInfoForm.electrPrintingSwitch">
                <el-radio :label="0">关闭</el-radio>
                <el-radio :label="1">开启</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商户地址：" prop="addressDetail">
              <el-input
                class="width100"
                v-model="merInfoForm.addressDetail"
                enter-button="查找位置"
                placeholder="请查找位置"
              
              >
                <!--<el-button-->
                <!--slot="append"-->
                <!--style="background: #46a6ff; color: #fff; border-radius: 0 4px 4px 0;"-->
                <!--@click="onSearchs"-->
                <!--&gt;查找位置</el-button>-->
              </el-input>
              <!-- <iframe id="mapPage" width="100%" height="500px" frameborder="0" :src="keyUrl" /> -->
            </el-form-item>
            <el-form-item v-if="checkPermi(['merchant:config:info:edit'])">
              <el-button type="primary" @click="handlerSubmit('merInfoForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="loginType === '3'" class="business-msg">
        <div class="form-data">
          <el-form ref="settlementForm" :model="settlementForm" label-width="100px">
            <el-form-item label="结算类型：" label-width="120px">
              <el-radio-group v-model="settlementForm.settlementType">
                <el-radio label="bank">银行卡</el-radio>
                <el-radio label="wechat">微信</el-radio>
                <el-radio label="alipay">支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <z-b-parser
            v-if="loginType === '3'"
            :is-create="1"
            :form-conf="formConf"
            :edit-data="transferData"
            :form-name="formId"
            @submit="transferhandlerSubmit"
            :key-num="keyNum"
          />
        </div>
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
  merchantSwitchApi,
  merchantTransferEditApi,
  getBaseInfoApi,
  merchantUpdateApi,
  merchantConfigInfoApi,
  merchantTransferApi,
} from '@/api/merchant';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { Debounce } from '@/utils/validate';
import Cookies from 'js-cookie';
export default {
  name: 'Information',
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入客服电话'));
      } else {
        let regPone = null;
        const mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; // 最新16手机正则
        const tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; // 座机
        if (value.charAt(0) == 0) {
          // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
          regPone = tel;
        } else {
          regPone = mobile;
        }
        if (!regPone.test(value)) {
          return callback(new Error("请填写客服电话(座机格式'区号-座机号码')"));
        }
        callback();
      }
    };
    const validateVal = (rule, value, callback) => {
      if (this.labelarr.length === 0) {
        callback(new Error('请输入后回车'));
      } else {
        callback();
      }
    };
    return {
      formConf: { fields: [] },
      isCreate: 0,
      loginType: '1',
      headeNum: [
        { type: '1', name: '商户信息' },
        { type: '2', name: '店铺信息' },
        { type: '3', name: '结算信息' },
      ],
      merData: {}, // 默认数据
      submitLoading: false, // 提交loading
      editData: {},
      transferData: {},
      keyNum: 0,
      loading: false,
      merInfoForm: {
        avatar: '',
        backImage: '',
        streetBackImage: '',
        rectangleLogo: '',
        coverImage: '',
        intro: '',
        keywords: '',
        alertStock: 1,
        addressDetail: '',
        serviceType: '',
        serviceLink: null,
        servicePhone: '',
        latitude: '34.32908', //纬度
        longitude: '108.70641', //经度
        isTakeTheir: false,
        receiptPrintingSwitch: 0, // 小票打印开关：0关闭，1=自动打印，2=手动打印，3=自动和手动
        electrPrintingSwitch: 0, // 电子面单开关 0关闭 1开启
        txMapKey: '2XHBZ-4M3LB-Z4WUN-NSHVF-CQ3KQ-DABMV',
      },
      rules: {
        intro: [{ required: true, message: '请输入商户简介', trigger: 'blur' }],
        avatar: [{ required: true, message: '请上传商户主头像', trigger: 'change' }],
        backImage: [{ required: true, message: '请上传H5商户背景图', trigger: 'change' }],
        streetBackImage: [{ required: true, message: '请上传H5商户街背景图', trigger: 'change' }],
        coverImage: [{ required: true, message: '请上传商户封面图', trigger: 'change' }],
        rectangleLogo: [{ required: true, message: '请上传商户logo（横）', trigger: 'change' }],
        labelarr: [{ required: true, validator: validateVal, trigger: 'blur' }],
        alertStock: [{ required: true, message: '请输入警戒库存', trigger: 'blur' }],
        serviceType: [{ required: true, message: '请选择客服类型', trigger: 'change' }],
        serviceLink: [{ required: true, message: '请输入H5链接', trigger: 'blur' }],
        servicePhone: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        addressDetail: [{ required: true, message: '请选择商户地址', trigger: 'blur' }],
      },
      keyUrl: '',
      labelarr: [],
      serviceList: [
        {
          value: 'H5',
          label: 'H5链接',
        },
        {
          value: 'phone',
          label: '电话',
        },
      ],
      settlementForm: {
        settlementType: 'bank',
      },
      formId: '结算信息-银行卡',
    };
  },
  watch: {
    'settlementForm.settlementType': {
      handler: function (val) {
        switch (val) {
          case 'bank':
            this.formId = '结算信息-银行卡';
            break;
          case 'wechat':
            this.formId = '结算信息-微信';
            break;
          default:
            this.formId = '结算信息-支付宝';
            break;
        }
        this.keyNum += 1;
      },
      immediate: false,
      deep: true,
    },
  },
  created() {
    if (checkPermi(['merchant:config:info'])) this.getConfigInfo();
    if (checkPermi(['merchant:settlement:info'])) this.getMerchantTransfer();
    if (checkPermi(['merchant:base:info'])) this.getInfo();
  },
  mounted: function () {
    let that = this;
    window.addEventListener(
      'message',
      function (event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module === 'locationPicker') {
          // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          window.parent.selectAdderss(loc);
        }
      },
      false,
    );
    window.selectAdderss = this.selectAdderss;
  },
  methods: {
    checkPermi,
    getLabelarr(attr) {
      this.labelarr = attr;
    },
    // 点击商品图
    modalPicTap(tit, val) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          switch (val) {
            case 'avatar':
              _this.merInfoForm.avatar = img[0].sattDir;
              break;
            case 'backImage':
              _this.merInfoForm.backImage = img[0].sattDir;
              break;
            case 'rectangleLogo':
              _this.merInfoForm.rectangleLogo = img[0].sattDir;
              break;
            case 'coverImage':
              _this.merInfoForm.coverImage = img[0].sattDir;
              break;
            default:
              _this.merInfoForm.streetBackImage = img[0].sattDir;
              break;
          }
          
        },
        tit,
        'content',
      );
      _this.merInfoForm.latitude='34.32908'
      _this.merInfoForm.longitude='108.70641'

          console.log(_this.merInfoForm)
    },
    // 选择经纬度
    selectAdderss(data) {
      this.merInfoForm.addressDetail = data.poiaddress + data.poiname;
      this.merInfoForm.latitude = data.latlng.lat;
      this.merInfoForm.longitude = data.latlng.lng;
    },
    changeSwitch() {
      const changeSwitch = this.merData.isSwitch ? '开启' : '关闭';
      this.$modalSure(`${changeSwitch}该商户吗`)
        .then(() => {
          merchantSwitchApi()
            .then((res) => {
              this.$modal.msgSuccess('修改成功');
            })
            .catch(() => {
              this.merData.isSwitch = !this.merData.isSwitch;
            });
        })
        .catch(() => {
          this.merData.isSwitch = !this.merData.isSwitch;
        });
    },
    handlerSubmit: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.merInfoForm.keywords = this.labelarr.join(',');
          merchantUpdateApi(this.merInfoForm).then((res) => {
            this.$message.success('操作成功');
            Cookies.set('merPrint', this.merInfoForm.receiptPrintingSwitch); // 打印机标识
            Cookies.set('merElectPrint', this.merInfoForm.electrPrintingSwitch); // 电子面单打印开关
            this.getConfigInfo();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }),
    transferhandlerSubmit: Debounce(function (formValue) {
      if (checkPermi(['merchant:settlement:info:edit'])) {
        merchantTransferEditApi({
          id: this.formId,
          settlementType: this.settlementForm.settlementType,
          alipayCode: formValue.alipayCode,
          alipayQrcodeUrl: formValue.alipayQrcodeUrl,
          bankAddress: formValue.bankAddress,
          bankCard: formValue.bankCard,
          bankName: formValue.bankName,
          bankUserName: formValue.bankUserName,
          wechatCode: formValue.wechatCode,
          wechatQrcodeUrl: formValue.wechatQrcodeUrl,
          realName: formValue.realName,
        }).then((res) => {
          this.$message.success('操作成功');
          this.getMerchantTransfer();
        });
      } else {
        this.$message.warning('暂无操作权限');
      }
    }),
    // 获取商户信息
    getInfo() {
      this.loading = true;
      getBaseInfoApi()
        .then((res) => {
          this.merData = res;
          localStorage.setItem('JavaMerchantBaseInfo', JSON.stringify(res));
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取商户配置信息
    getConfigInfo() {
      merchantConfigInfoApi().then((res) => {
        this.merInfoForm = res;
        this.keyUrl = `https://apis.map.qq.com/tools/locpicker?type=1&key=${this.merInfoForm.txMapKey}&referer=myapp`;
        localStorage.setItem('JavaMerchantConfigInfo', JSON.stringify(res));
        this.labelarr = res.keywords.split(',') || [];
      });
    },
    // 获取转账信息
    getMerchantTransfer() {
      merchantTransferApi().then((res) => {
        this.transferData = res;
        this.settlementForm = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.width100 {
  width: 700px;
}

.pictrue {
  width: 60px;
  height: 60px;
  border: 1px dotted rgba(0, 0, 0, 0.1);
  margin-right: 10px;
  position: relative;
  cursor: pointer;

  ::v-deep.el-image {
    width: 60px;
    height: 60px;
  }

  video {
    width: 100%;
    height: 100%;
  }
}

::v-deep.el-textarea__inner {
  height: 90px;
}

.information {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 25px 0 0 50px;

  /*align-items: center;*/
  h2 {
    text-align: center;
    color: #303133;
    font-weight: bold;
    font-size: 20px;
  }

  .lab-title {
    width: max-content;
    font-size: 14px;
    font-weight: bold;
    color: #303133;
    margin: 10px 10%;

    &::before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 13px;
      background-color: var(--prev-color-primary);
      margin-right: 6px;
      position: relative;
      top: 1px;
    }
  }

  .user-msg {
    padding: 0 20px;
    margin-top: 30px;
  }

  .basic-information {
    font-size: 13px;
    color: #303133;
    font-weight: 400;
    text-rendering: optimizeLegibility;

    .tips {
      color: #606266;
      width: 110px;
      text-align: right;
    }

    > div {
      margin-bottom: 16px;
      flex-wrap: nowrap;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
  }

  .trip {
    padding-left: 10px;
    color: #ffb027;
    font-weight: normal;
  }

  .selWidth {
    width: 100%;
  }

  .demo-ruleForm {
    overflow: hidden;

    .form-item {
      width: 48%;
      display: inline-block;
    }
  }

  .form-data {
    padding: 30px 8%;

    .map-sty {
      width: 90%;
      text-align: right;
      margin: 0 0 0 10%;
    }

    .pictrue img {
      border-radius: 4px;
      object-fit: cover;
    }

    .tip-form {
      display: flex;
      align-items: center;

      span {
        white-space: nowrap;
        padding-left: 10px;
        line-height: 20px;
      }
    }
  }

  .submit-button {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 20px;
    // left: 50%;
    width: 80%;
    padding: 10px 0;
    background-color: rgba(255, 255, 255, 0.7);
  }
}

.font_red {
  color: red;
  margin-right: 5px;
  font-weight: bold;
}

.margin_main {
  position: relative;

  .margin_price {
    cursor: pointer;
  }

  &:hover {
    .margin_modal {
      display: flex;
    }
  }

  .margin_modal {
    position: absolute;
    left: 0;
    top: 30px;
    border-radius: 8px;
    background: #fff;
    align-items: center;
    justify-content: center;
    z-index: 9;
    width: 250px;
    height: 320px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    display: none;

    .alic {
      text-align: center;
    }

    img {
      display: block;
      width: 150px;
      height: 116px;
      margin: 0 auto 50px;
    }

    span {
      margin-bottom: 10px;
      display: block;
      font-weight: normal;
      text-align: center;
    }

    .text_g {
      font-size: 16px;
      color: #303133;
    }

    .text_b {
      color: #606266;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 14px;

      &.b02 {
        color: #ef9b6f;
      }

      &.b01 {
        color: #57d1a0;
      }
    }

    .el-button {
      margin-top: 25px;
    }
  }

  .margin_refused {
    display: block;
    margin-bottom: 10px;
    text-align: center;
    color: #606266;

    span {
      display: inline;
      // color: red;
    }
  }
}

.margin_count {
  position: relative;
  display: inline-block;

  .pay_btn:hover + .erweima {
    display: block;
  }

  .erweima {
    position: absolute;
    left: 0;
    top: 30px;
    z-index: 9;
    display: none;
    width: 250px;
    height: 320px;
    text-align: center;
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    img {
      width: 160px;
      height: 160px;
      margin-top: 20px;
    }

    .pay_type {
      font-size: 16px;
      color: #303133;
      font-weight: normal;
    }

    .pay_price {
      font-size: 18px;
      color: #e57272;
      margin: 10px 0;
    }

    .pay_title {
      font-size: 16px;
      color: #303133;
      margin-top: 20px;
    }

    .pay_time {
      font-size: 12px;
      color: #6d7278;
    }
  }
}

::v-deep .el-upload--picture-card {
  width: 58px;
  height: 58px;
  line-height: 70px;
}

::v-deep.el-upload-list__item {
  width: 58px;
  height: 58px;
}

.upLoadPicBox_qualification {
  display: flex;
  flex-wrap: wrap;

  .uploadpicBox_list {
    position: relative;
    height: 58px;
    width: 58px;
    margin: 0 20px 20px 0;

    .uploadpicBox_list_image {
      position: absolute;
      top: 0;
      left: 0;
      width: 58px;
      height: 58px;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .uploadpicBox_list_method {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      opacity: 0;
      width: 100%;
      height: 100%;
      transition: 0.3s;
    }
  }
}

.uploadpicBox_list:hover .uploadpicBox_list_method {
  z-index: 11;
  opacity: 1;
}
</style>
