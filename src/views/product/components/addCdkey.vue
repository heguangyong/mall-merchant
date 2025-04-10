<template>
  <el-dialog
    :visible.sync="cdkeyShow"
    title="添加卡密"
    width="950px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    class="dialog-bottom"
  >
    <div class="carMywrapper">
      <div class="type-radio">
        <el-form label-width="80px" :model="carMyValidateForm" ref="carMyValidateForm" :inline="true">
          <div v-for="(domain, index) in carMyValidateForm.carMyList" :key="domain.key" class="sheet-item">
            <el-form-item
              :label="'卡号' + (index + 1)"
              :prop="'carMyList.' + index + '.cardNumber'"
              :rules="{
                required: true,
                message: '卡号不能为空',
                trigger: 'blur',
              }"
            >
              <el-input
                v-model.trim="domain.cardNumber"
                class="mr15 selWidth"
                placeholder="请输入卡号"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="'卡密' + (index + 1)"
              :prop="'carMyList.' + index + '.secretNum'"
              :rules="{
                required: true,
                message: '卡密不能为空',
                trigger: 'blur',
              }"
            >
              <el-input
                v-model.trim="domain.secretNum"
                class="mr15 selWidth"
                placeholder="请输入卡密"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-button @click.prevent="removeCard(domain)">删除</el-button>
          </div>
          <el-form-item label=" "><el-button @click="handleAddCard">添加行</el-button></el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer-inner btnTop">
        <el-button class="btns" size="small" @click="handleClose">取消</el-button>
        <el-button
          :loading="btnloading"
          type="primary"
          class="btns"
          size="small"
          :disabled="carMyValidateForm.carMyList.length === 0"
          @click="submitForm('carMyValidateForm')"
          >保存</el-button
        >
      </div>
    </div>
  </el-dialog>
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
import { getToken } from '@/utils/auth';
// import exportExcel from '@/utils/newToExcel.js';
import { importCard, exportProductCard } from '@/api/product';
import { cardSecretSaveApi } from '@/api/productCdkey';
import { Debounce } from '@/utils/validate';
export default {
  name: 'addCarMy',
  props: {
    virtualList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    libraryId: {
      type: Number,
      default: function () {
        return 0;
      },
    },
  },
  data() {
    return {
      cdkeyShow: false,
      header: {}, //请求头部信息
      carMyValidateForm: {
        carMyList: [
          {
            cardNumber: '',
            secretNum: '',
          },
          {
            cardNumber: '',
            secretNum: '',
          },
        ],
      },
      btnloading: false,
    };
  },
  mounted() {},
  methods: {
    //取消
    handleClose() {
      this.cdkeyShow = false;
      this.carMyValidateForm = {
        carMyList: [
          {
            cardNumber: '',
            secretNum: '',
          },
          {
            cardNumber: '',
            secretNum: '',
          },
        ],
      };
    },
    //添加行
    handleAddCard() {
      this.carMyValidateForm.carMyList.push({
        cardNumber: '',
        secretNum: '',
        key: Date.now(),
      });
    },
    removeCard(item) {
      var index = this.carMyValidateForm.carMyList.indexOf(item);
      if (index !== -1) {
        this.carMyValidateForm.carMyList.splice(index, 1);
      }
    },
    //保存
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnloading = true;
          cardSecretSaveApi({ csList: this.carMyValidateForm.carMyList, libraryId: this.libraryId })
            .then((res) => {
              this.$message.success('新增成功');
              this.btnloading = false;
              this.$emit('handlerSubSuccess', this.carMyValidateForm.carMyList);
              this.handleClose();
            })
            .catch((res) => {
              this.btnloading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }),
  },
};
</script>

<style lang="scss" scoped>
::v-deep.el-form--inline .el-form-item {
  margin-right: 0 !important;
}
.lable {
  text-align: right;
  margin-right: 12px;
}
.width15 {
  width: 150px;
}
::v-deep .el-radio__label {
  font-size: 13px;
}
.carMywrapper {
  .download {
    margin-left: 10px;
  }
  .stock-disk {
    margin: 10px 0 15px 0;
  }
  .scroll-virtual {
    max-height: 320px;
    overflow-y: auto;
    margin-top: 10px;
  }
  .virtual-title {
    width: 50px;
  }
  .deteal-btn {
    color: #5179ea;
    cursor: pointer;
  }
  .add-more {
    margin-top: 20px;
    line-height: 32px;
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 40px;
    button {
      margin-left: 10px;
    }
  }
}
::v-deep .el-input-group--append .el-input__inner {
  padding-right: 0;
}
.btnTop {
  padding-top: 30px;
}
</style>
