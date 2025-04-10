<template>
  <div>
    <el-form
      :model="formValidate"
      :rules="rules"
      ref="formValidate"
      label-width="90px"
      class="demo-formValidate"
      v-loading="loading"
    >
      <el-form-item label="商品：" prop="productId">
        <div class="upLoadPicBox" @click="changeGood" v-hasPermi="['merchant:product:page:list']">
          <div v-if="formValidate.productId" class="pictrue"><img :src="image" /></div>
          <div v-else class="upLoad">
            <i class="el-icon-camera cameraIconfont" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品属性：" class="labeltop" required>
        <el-table ref="multipleTable" :data="ManyAttrValue" tooltip-effect="dark" style="width: 100%" size="mini">
          <el-table-column label="选择" width="50">
            <template slot-scope="scope">
              <el-radio v-model="formValidate.attrValueId" :label="scope.row.id" @change.native="changeType(scope.row)"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <template v-if="manyTabDate">
            <el-table-column
              v-for="(item, iii) in manyTabDate"
              :key="iii"
              :label="manyTabTit[iii].title"
              min-width="80"
            >
              <template slot-scope="scope">
                <span class="priceBox" v-text="scope.row[iii]" />
              </template>
            </el-table-column>
          </template>
          <el-table-column label="图片" min-width="80">
            <template slot-scope="scope">
              <div class="upLoadPicBox">
                <el-image class="tabPic" :src="scope.row.image" :preview-src-list="[scope.row.image]" />
              </div>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, iii) in attrValue" :key="iii" :label="formThead[iii].title" min-width="140">
            <template slot-scope="{ row, $index }">
              <span v-text="row[iii]" class="priceBox" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="用户昵称：" prop="nickname">
        <el-input type="text" v-model.trim="formValidate.nickname"></el-input>
      </el-form-item>
      <el-form-item label="评价文字：" prop="comment">
        <el-input type="textarea" v-model.trim="formValidate.comment"></el-input>
      </el-form-item>
      <el-form-item label="评价星级：" prop="star" class="productScore">
        <el-rate v-model="formValidate.star" @change="handleChange"></el-rate>
      </el-form-item>
      <el-form-item label="用户头像：" prop="avatar">
        <div
          class="upLoadPicBox"
          @click="modalPicTap('1')"
          v-hasPermi="['merchant:category:list:tree', 'merchant:product:page:list']"
        >
          <div v-if="formValidate.avatar" class="pictrue"><img :src="formValidate.avatar" /></div>
          <div v-else class="upLoad">
            <i class="el-icon-camera cameraIconfont" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="评价图片：">
        <div class="acea-row">
          <div
            v-for="(item, index) in formValidate.pics"
            :key="index"
            class="pictrue"
            draggable="false"
            @dragstart="handleDragStart($event, item)"
            @dragover.prevent="handleDragOver($event, item)"
            @dragenter="handleDragEnter($event, item)"
            @dragend="handleDragEnd($event, item)"
          >
            <img :src="item" />
            <i class="el-icon-error btndel" @click="handleRemove(index)" />
            <!--<Button shape="circle" icon="md-close" class="btndel" @click.native="handleRemove(index)" />-->
          </div>
          <div
            v-if="formValidate.pics < 10"
            class="upLoadPicBox"
            @click="modalPicTap('2')"
            v-hasPermi="['merchant:category:list:tree', 'merchant:product:page:list']"
          >
            <div class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button size="mini" @click="resetForm('formValidate')">重置</el-button>
      <el-button
        v-hasPermi="['merchant:product:update']"
        size="mini"
        type="primary"
        @click="submitForm('formValidate')"
        :loading="loadingbtn"
        >提交</el-button
      >
    </div>
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

import { replyCreatApi, replyEditApi, replyInfoApi, productDetailApi } from '@/api/product';
import { Debounce } from '@/utils/validate';
const defaultObj = {
  avatar: '',
  comment: '',
  nickname: '',
  pics: [],
  productId: '',
  star: null,
  attrValueId: 0,
};
let attrValue = [
  {
    image: '',
    price: 0,
    cost: 0,
    otPrice: 0,
    stock: 0,
  },
];
const objTitle = {
  price: {
    title: '售价（元）',
  },
  cost: {
    title: '成本价（元）',
  },
  otPrice: {
    title: '划线价（元）',
  },
  stock: {
    title: '库存',
  },
};
export default {
  name: 'creatComment',
  props: {
    num: {
      type: Number,
      required: 0,
    },
  },
  data() {
    var checkProductScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('评价星级不能为空'));
      } else {
        callback();
      }
    };
    return {
      ManyAttrValue: [],
      loadingbtn: false,
      loading: false,
      image: '',
      formValidate: {
        avatar: '',
        productId: '',
        comment: '',
        nickname: '',
        pics: [],
        star: null,
        attrValueId: 0,
      },

      rules: {
        avatar: [{ required: true, message: '请选择用户头像', trigger: 'change' }],
        productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
        comment: [{ required: true, message: '请填写评价内容', trigger: 'blur' }],
        nickname: [{ required: true, message: '请填写用户昵称', trigger: 'blur' }],
        pics: [{ required: true, message: '请选择评价图片', trigger: 'change' }],
        star: [{ required: true, validator: checkProductScore, trigger: 'change' }],
      },
      formThead: Object.assign({}, objTitle),
      manyTabTit: {},
      manyTabDate: {},
    };
  },
  computed: {
    attrValue() {
      const obj = Object.assign({}, attrValue[0]);
      delete obj.image;
      delete obj.brokerage;
      delete obj.brokerageTwo;
      return obj;
    },
  },
  watch: {
    num: {
      handler: function (val) {
        this.resetForm('formValidate');
      },
      deep: true,
    },
  },
  methods: {
    handleChange() {
      this.$refs.formValidate.clearValidate('star');
    },
    changeGood() {
      const _this = this;
      this.$modalGoodList(function (row) {
        _this.image = row.image;
        _this.formValidate.productId = row.id;
        _this.getInfo(row.id);
        _this.$refs.formValidate.clearValidate('productId');
      });
    },
    changeType(row, index) {
      row.checked = true;
      this.formValidate.attrValueId = row.id;
    },
    // 详情
    getInfo(id) {
      productDetailApi(id).then(async (res) => {
        let info = res;
        info.attrValueList.forEach((val) => {
          val.attrValue = JSON.parse(val.attrValue);
        });

        const tmp = {};
        const tmpTab = {};
        info.attrList.forEach((o, i) => {
          tmp[o.attributeName] = { title: o.attributeName };
          tmpTab[o.attributeName] = '';
        });
        // 此处手动实现后台原本value0 value1的逻辑
        info.attrValueList.forEach((item) => {
          for (let attrValueKey in item.attrValue) {
            item[attrValueKey] = item.attrValue[attrValueKey];
          }
        });
        this.manyTabTit = tmp;
        this.manyTabDate = tmpTab;
        this.ManyAttrValue = info.attrValueList;
      });
    },
    // 点击商品图
    modalPicTap(tit) {
      const _this = this;
      _this.$modalUpload(
        function (img) {
          if (img) {
            tit === '1'
              ? (_this.formValidate.avatar = img[0].sattDir)
              : img.map((item) => {
                  _this.formValidate.pics.push(item.sattDir);
                });
            _this.$refs.formValidate.clearValidate('avatar'); //
          }
        },
        tit,
        'store',
      );
    },
    handleRemove(i) {
      this.formValidate.pics.splice(i, 1);
    },
    submitForm: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formValidate.attrValueId === 0) return this.$message.warning('请选择商品属性');
          this.loadingbtn = true;
          replyCreatApi(this.formValidate)
            .then(() => {
              this.$message.success('新增成功');
              this.$emit('getList');
              this.loadingbtn = false;
            })
            .catch(() => {
              this.loadingbtn = false;
            });
        } else {
          return false;
        }
      });
    }),
    resetForm(formName) {
      this.formValidate.pics = [];
      this.formValidate.avatar = '';
      this.ManyAttrValue = [];
      this.$refs[formName].resetFields();
    },
    info() {
      this.loading = true;
      replyInfoApi(this.formValidate)
        .then(() => {
          this.formValidate = res;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 移动
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      this.dragging = null;
    },
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'move';
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = 'move';
      if (item === this.dragging) {
        return;
      }
      const newItems = [...this.formValidate.pics];
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);
      newItems.splice(dst, 0, ...newItems.splice(src, 1));
      this.formValidate.pics = newItems;
    },
  },
};
</script>

<style scoped lang="scss">
.productScore {
  ::v-deep .el-rate {
    line-height: 2.4 !important;
  }
}
.pictrue {
  width: 60px;
  height: 60px;
  border: 1px dotted rgba(0, 0, 0, 0.1);
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
.btndel {
  position: absolute;
  z-index: 1;
  width: 20px !important;
  height: 20px !important;
  left: 46px;
  top: -4px;
}
</style>
