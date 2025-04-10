<template>
  <el-dialog :visible.sync="cloudDiskShow" title="设置云盘链接弹窗" width="590px" :append-to-body="true">
    <div class="carMywrapper">
      <div class="type-radio">
        <el-form label-width="80px" :model="CloudDiskValidateForm" ref="CloudDiskValidateForm" :inline="true">
          <el-form-item
            label="云盘链接"
            :rules="{
              required: true,
              message: '云盘链接不能为空',
              trigger: 'blur',
            }"
          >
            <el-input
              v-model="CloudDiskValidateForm.linkUrl"
              type="textarea"
              :rows="2"
              style="width: 460px"
              placeholder="请输入云盘链接及提取码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button class="btns" size="small" @click="cancel">取消</el-button>
        <el-button type="primary" class="btns" size="small" @click="submitForm('CloudDiskValidateForm')"
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
export default {
  name: 'addCarMy',
  props: {
    cloudDisk: {
      type: String,
      default: function () {
        return '';
      },
    },
  },
  data() {
    return {
      cloudDiskShow: false,
      CloudDiskValidateForm: {
        linkUrl: '',
      },
    };
  },
  created() {
    // this.getToken();
  },
  watch: {
    cloudDisk: {
      handler(nVal, oVal) {
        this.CloudDiskValidateForm.linkUrl = nVal;
      },
      deep: true,
    },
  },
  mounted() {
    this.CloudDiskValidateForm.linkUrl = this.cloudDisk;
  },
  methods: {
    //保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('handlerSubSuccess', this.CloudDiskValidateForm.linkUrl);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel() {
      this.$emit('closeCloudDisk');
    },
  },
};
</script>

<style lang="scss" scoped>
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
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    button {
      margin-left: 10px;
    }
  }
}
::v-deep .el-input-group--append .el-input__inner {
  padding-right: 0;
}
::v-deep .el-form-item {
  margin-right: 0 !important;
}
</style>
