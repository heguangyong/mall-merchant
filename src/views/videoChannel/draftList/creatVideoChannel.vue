<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <div v-if="!isDisabled" slot="header" class="clearfix">
        <el-steps :active="currentTab" align-center finish-status="success">
          <el-step title="选择视频号商品" />
          <el-step title="填写基础信息" />
          <el-step title="修改商品详情" />
        </el-steps>
      </div>
      <el-form
        ref="formValidate"
        v-loading="fullscreenLoading"
        class="formValidate mt20"
        :rules="ruleValidate"
        :model="formValidate"
        label-width="150px"
        @submit.native.prevent
      >
        <!-- 视频号商品-->
        <div v-show="currentTab === 0">
          <el-form-item label="选择商品：" prop="image">
            <div class="upLoadPicBox" @click="changeGood" v-hasPermi="['merchant:pay:component:product:draft:update']">
              <div v-if="formValidate.image" class="pictrue"><img :src="formValidate.image" /></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont" />
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- 商品信息-->
        <div v-show="currentTab === 1">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="商品轮播图：" prop="images">
                <div class="acea-row">
                  <template v-if="!isDisabled">
                    <div
                      v-for="(item, index) in formValidate.images"
                      :key="index"
                      class="pictrue"
                      draggable="true"
                      @dragstart="handleDragStart($event, item, 'images')"
                      @dragover.prevent="handleDragOver($event, item, 'images')"
                      @dragenter="handleDragEnter($event, item, 'images')"
                      @dragend="handleDragEnd($event, item, 'images')"
                    >
                      <img :src="item" />
                      <i class="el-icon-error btndel" @click="handleRemove(index, 'images')" />
                    </div>
                  </template>
                  <template v-else>
                    <div v-for="(item, index) in formValidate.images" :key="index" class="pictrue">
                      <el-image style="width: 100%; height: 100%" :src="item" :preview-src-list="[item]"> </el-image>
                    </div>
                  </template>
                  <div
                    v-if="formValidate.images.length < 5 && !isDisabled"
                    class="upLoadPicBox"
                    @click="modalPicTap('2')"
                  >
                    <div class="upLoad">
                      <i class="el-icon-camera cameraIconfont" />
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="商品标题：" prop="title">
                <el-input
                  :disabled="isDisabled"
                  v-model="formValidate.title"
                  maxlength="249"
                  placeholder="请输入商品名称"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="grid2">
              <el-form-item label="单位：" prop="unitName">
                <el-input
                  :disabled="isDisabled"
                  v-model="formValidate.unitName"
                  placeholder="请输入单位"
                  class="selWidth"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="grid2">
              <el-form-item label="运费模板：" prop="tempId">
                <div class="acea-row">
                  <el-select :disabled="isDisabled" v-model="formValidate.tempId" placeholder="请选择" class="selWidth">
                    <el-option v-for="item in shippingList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col v-bind="grid2">
              <el-form-item label="微信商品类目：" prop="thirdCatIdList">
                <div class="selWidth thirdCatIdList" @click="handleChanges"></div>
                <el-cascader
                  :disabled="isDisabled"
                  class="selWidth"
                  filterable
                  v-model="formValidate.thirdCatIdList"
                  :options="options"
                  :props="propsCatId"
                  ref="demoCascader"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col v-bind="grid2">
              <el-form-item label="商品品牌：">
                <el-select
                  class="selWidth"
                  :disabled="isDisabled"
                  v-model="formValidate.brandId"
                  placeholder="请选择"
                  clearable
                >
                  <el-option v-for="item in brandIdList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="productQualificationType > 0">
              <el-form-item label="商品资质图：">
                <div class="acea-row">
                  <template v-if="!isDisabled">
                    <div
                      v-for="(item, index) in formValidate.qualificationPicsList"
                      :key="index"
                      class="pictrue"
                      draggable="true"
                      @dragstart="handleDragStart($event, item, 'qualificationPics')"
                      @dragover.prevent="handleDragOver($event, item, 'qualificationPics')"
                      @dragenter="handleDragEnter($event, item, 'qualificationPics')"
                      @dragend="handleDragEnd($event, item, 'qualificationPics')"
                    >
                      <img :src="item" />
                      <i class="el-icon-error btndel" @click="handleRemove(index, 'qualificationPics')" />
                    </div>
                  </template>
                  <template v-else>
                    <div v-for="(item, index) in formValidate.qualificationPicsList" :key="index" class="pictrue">
                      <el-image style="width: 100%; height: 100%" :src="item" :preview-src-list="[item]"> </el-image>
                    </div>
                  </template>

                  <div
                    v-if="formValidate.qualificationPicsList.length < 5 && !isDisabled"
                    class="upLoadPicBox"
                    @click="modalPicTap('3')"
                  >
                    <div class="upLoad">
                      <i class="el-icon-camera cameraIconfont" />
                    </div>
                  </div>
                </div>
                <div class="textE93323">
                  资质类型说明：{{ productQualification }}。{{
                    productQualificationType === 1 ? '必填项！' : '选填项！'
                  }}
                </div>
              </el-form-item>
            </el-col>
            <!-- 规格表格-->
            <el-col :span="24">
              <el-form-item label="商品属性：" class="labeltop" required>
                <el-table
                  ref="multipleTable"
                  :data="ManyAttrValue"
                  tooltip-effect="dark"
                  style="width: 100%"
                  class="tableSelection"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" key="1" width="55"> </el-table-column>
                  <template v-if="manyTabDate && formValidate.specType">
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
                      <div class="upLoadPicBox" @click="modalPicTap('1', 'duo', scope.$index)">
                        <div v-if="scope.row.image" class="pictrue tabPic"><img :src="scope.row.image" /></div>
                        <div v-else class="upLoad tabPic">
                          <i class="el-icon-camera cameraIconfont" />
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="(item, iii) in attrValue"
                    :key="iii"
                    :label="formThead[iii].title"
                    min-width="140"
                  >
                    <template slot-scope="scope">
                      <el-input-number
                        size="small"
                        :disabled="isDisabled"
                        v-if="formThead[iii].title === '商品价'"
                        v-model="scope.row[iii]"
                        :min="0"
                        :precision="2"
                        :step="0.1"
                        class="priceBox"
                      />
                      <span v-else v-text="scope.row[iii]" class="priceBox" />
                      <!--<el-input v-model="scope.row[iii]" :type="formThead[iii].title==='商品编码'?'text':'number'" class="priceBox" />-->
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 商品详情-->
        <div v-show="currentTab === 2 && !isDisabled">
          <el-form-item label="商品详情：">
            <Tinymce v-model="formValidate.descInfo"></Tinymce>
          </el-form-item>
        </div>
        <el-row v-show="currentTab === 2 && isDisabled">
          <el-col :span="24">
            <el-form-item label="商品详情：">
              <span v-html="formValidate.descInfo || '无'"></span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-top: 30px">
          <el-button
            v-show="(!$route.params.id && currentTab > 0) || ($route.params.id && currentTab === 2)"
            type="primary"
            class="submission priamry_border"
            size="small"
            @click="handleSubmitUp"
            >上一步</el-button
          >
          <el-button
            v-show="currentTab === 0"
            type="primary"
            class="submission"
            size="small"
            @click="handleSubmitNest1('formValidate')"
            >下一步</el-button
          >
          <el-button
            v-show="currentTab === 1"
            type="primary"
            class="submission"
            size="small"
            @click="handleSubmitNest2('formValidate')"
            >下一步</el-button
          >
          <el-button
            v-show="(currentTab === 2 || $route.params.id) && !isDisabled"
            :loading="loading"
            type="primary"
            class="submission"
            size="small"
            @click="handleSubmit('formValidate')"
            v-hasPermi="['merchant:pay:component:product:draft:update', 'merchant:pay:component:product:draft:add']"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="微信商品类目"
      :visible.sync="dialogVisible"
      width="900px"
      class="modalBox"
      top="0vh"
      :before-close="handleClose"
    >
      <el-cascader-panel
        class="modalBox"
        style="height: 745px"
        filterable
        v-model="formValidate.thirdCatIdList"
        :options="options"
        :props="propsCatId"
        ref="demoCascader"
        :popper-append-to-body="false"
        popper-class="eloption"
        @change="handleChangesModel"
      ></el-cascader-panel>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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

import Tinymce from '@/components/Tinymce/index';
import { productDetailApi } from '@/api/product';
import { shippingTemplatesList } from '@/api/logistics';
import {
  draftUpdateApi,
  draftInfoApi,
  catListApi,
  videoAddApi,
  shopImgUploadApi,
  draftBrandlistApi,
} from '@/api/marketing';
//import CreatTemplates from '@/views/systemSetting/logistics/shippingTemplates/creatTemplates';
import { Debounce } from '@/utils/validate';
const defaultObj = {
  image: '',
  images: [],
  headImg: '',
  title: '',
  ficti: 0,
  unitName: '',
  sort: 0,
  tempId: '',
  attrValue: [
    {
      image: '',
      price: 0,
      cost: 0,
      otPrice: 0,
      stock: 0,
      barCode: '',
      weight: 0,
      volume: 0,
    },
  ],
  attr: [],
  selectRule: '',
  descInfo: '',
  specType: false,
  id: 0,
  thirdCatId: '',
  thirdCatIdList: [],
  brandId: 0,
  qualificationPics: '',
  qualificationPicsList: [],
};
const objTitle = {
  price: {
    title: '商品价',
  },
  cost: {
    title: '成本价',
  },
  otPrice: {
    title: '划线价',
  },
  stock: {
    title: '库存',
  },
  barCode: {
    title: '商品编码',
  },
  weight: {
    title: '重量（KG）',
  },
  volume: {
    title: '体积(m³)',
  },
};
export default {
  name: 'creatSeckill',
  components: { Tinymce },
  data() {
    return {
      props: {
        children: 'secondCatList',
        label: 'secondCatName',
        value: 'secondCatId',
        multiple: true,
        emitPath: false,
      },
      propsCatId: {
        emitPath: true,
      },
      options: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().setTime(new Date().getTime() - 3600 * 1000 * 24);
        },
      },
      props2: {
        children: 'child',
        label: 'name',
        value: 'id',
        multiple: true,
        emitPath: false,
      },
      grid2: {
        xl: 8,
        lg: 10,
        md: 12,
        sm: 24,
        xs: 24,
      },
      currentTab: 0,
      formThead: Object.assign({}, objTitle),
      formValidate: Object.assign({}, defaultObj),
      loading: false,
      fullscreenLoading: false,
      shippingList: [], // 运费模板
      ruleValidate: {
        primaryProductId: [{ required: true, message: '请选择商品', trigger: 'change' }],
        title: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
        attrValue: [{ required: true, message: '请选择商品属相', trigger: 'change', type: 'array', min: '1' }],
        ficti: [{ required: true, message: '请输入已售数量', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        tempId: [{ required: true, message: '请选择运费模板', trigger: 'change' }],
        images: [{ required: true, message: '请上传商品轮播图', type: 'array', trigger: 'change' }],
        specType: [{ required: true, message: '请选择商品规格', trigger: 'change' }],
        thirdCatIdList: [{ required: true, message: '请选择商品类目', trigger: 'change' }],
      },
      manyTabDate: {},
      manyTabTit: {},
      attrInfo: {},
      tempRoute: {},
      multipleSelection: [],
      primaryProductId: 0,
      productQualificationType: 0, //商品资质类型，0不需要，1必填，2选填
      productQualification: '', // 资质说明
      ManyAttrValue: [Object.assign({}, defaultObj.attrValue[0])], // 多规格
      brandIdList: [],
      dialogVisible: false,
      isDisabled: this.$route.params.isDisabled === '1' ? true : false,
    };
  },
  computed: {
    attrValue() {
      const obj = Object.assign({}, defaultObj.attrValue[0]);
      delete obj.image;
      return obj;
    },
  },
  created() {
    this.$watch('formValidate.attr', this.watCh);
    this.tempRoute = Object.assign({}, this.$route);
    if (!JSON.parse(sessionStorage.getItem('videoCategory'))) this.getCatList();
    if (!JSON.parse(sessionStorage.getItem('draftBrand'))) this.getDraftBrandlist();
  },
  mounted() {
    this.formValidate.images = [];
    if (this.$route.params.id) {
      this.currentTab = 1;
      this.setTagsViewTitle();
      this.getInfo();
    }
    this.getShippingList();
    this.options = JSON.parse(sessionStorage.getItem('videoCategory'));
    this.brandIdList = JSON.parse(sessionStorage.getItem('draftBrand'));
  },
  methods: {
    handleChangesModel(e) {
      const obj = this.$refs['demoCascader'].getCheckedNodes();
      this.productQualificationType = obj.length > 0 ? obj[0].data.productQualificationType : 0;
      this.productQualification = obj.length > 0 ? obj[0].data.productQualification : '';
      this.dialogVisible = false;
    },
    handleChanges(e) {
      if (!this.isDisabled) this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 类目；
    getCatList() {
      catListApi().then((res) => {
        this.options = res;
        sessionStorage.setItem('videoCategory', JSON.stringify(res));
      });
    },
    // 类目；
    getDraftBrandlist() {
      draftBrandlistApi().then((res) => {
        this.brandIdList = res;
        sessionStorage.setItem('draftBrand', JSON.stringify(res));
      });
    },
    watCh(val) {
      const tmp = {};
      const tmpTab = {};
      this.formValidate.attr.forEach((o, i) => {
        // tmp['value' + i] = { title: o.attrName }
        // tmpTab['value' + i] = ''
        tmp[o.attrName] = { title: o.attrName };
        tmpTab[o.attrName] = '';
      });
      this.manyTabTit = tmp;
      this.manyTabDate = tmpTab;
      this.formThead = Object.assign({}, this.formThead, tmp);
    },
    handleRemove(i, val) {
      if (val === 'images') {
        this.formValidate.images.splice(i, 1);
      } else {
        this.formValidate.qualificationPicsList.splice(i, 1);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击商品图
    modalPicTap(tit, num, i) {
      const _this = this;
      if (_this.isDisabled) return;
      if (tit === '3') return this.$message.warning('正在建造');
      this.fullscreenLoading = true;
      // productDetailApi(id).then(async res => {
      this.$modalUpload(
        async function (img) {
          if (img == false) return (_this.fullscreenLoading = false);
          if (tit === '1' && !num) {
            _this.formValidate.image = img[0].sattDir;
            _this.ManyAttrValue[0].image = img[0].sattDir;
          }
          if (tit === '2' && !num) {
            if (img.length > 5 || img.length + _this.formValidate.images.length > 5)
              return this.$message.warning('最多选择5张图片！');
            let result = await _this.getShopImgUpload(img, []);
            result.map((item) => {
              _this.formValidate.images.push(item.img);
            });
            _this.fullscreenLoading = false;
          }
          if (tit === '1' && num === 'duo') {
            let result = await _this.getImgData(img[0].sattDir);
            _this.ManyAttrValue[i].image = result;
            _this.fullscreenLoading = false;
          }
          if (tit === '3') {
            if (img.length > 5 || img.length + _this.formValidate.qualificationPicsList.length > 5)
              return this.$message.warning('最多选择5张图片！');
            let result = await _this.getShopImgUpload(img, []);
            result.map((item) => {
              _this.formValidate.qualificationPicsList.push(item.img);
            });
            _this.fullscreenLoading = false;
          }
        },
        tit,
        'content',
      );
    },
    changeGood() {
      const _this = this;
      this.$modalGoodList(function (row) {
        _this.formValidate.image = row.image;
        _this.primaryProductId = row.id;
      });
    },
    handleSubmitNest1() {
      if (!this.formValidate.image) {
        return this.$message.warning('请选择商品！');
      } else {
        this.currentTab++;
        if (!this.$route.params.id) this.getProdect(this.primaryProductId);
      }
    },
    filerMerCateList(treeData) {
      return treeData.map((item) => {
        if (!item.child) {
          item.disabled = true;
        }
        item.label = item.name;
        return item;
      });
    },
    // 运费模板；
    getShippingList() {
      shippingTemplatesList(this.tempData).then((res) => {
        this.shippingList = res.list;
      });
    },
    // 运费模板
    addTem() {
      this.$refs.addTemplates.dialogVisible = true;
      this.$refs.addTemplates.getCityList();
    },
    // 商品详情
    getInfo() {
      if (!this.$route.params.id) {
        this.getProdect(this.primaryProductId);
      } else {
        this.getDraftProdect(this.$route.params.id);
      }
    },
    getProdect(id) {
      this.fullscreenLoading = true;
      productDetailApi(id)
        .then(async (res) => {
          let info = res;
          this.formValidate = {
            image: this.$selfUtil.setDomain(info.image),
            images: JSON.parse(info.sliderImage),
            title: info.name,
            sort: info.sort,
            tempId: info.tempId,
            attr: info.attr,
            attrValue: info.attrValue,
            unitName: info.unitName,
            // selectRule: info.selectRule,
            descInfo: info.content,
            specType: info.specType,
            primaryProductId: info.id,
            ficti: info.ficti,
            qualificationPicsList: [],
            thirdCatIdList: [],
            thirdCatId: 0,
            brandId: '',
            id: 0,
          };
          if (info.specType) {
            info.attrValue.forEach((row) => {
              row.attrValue = JSON.parse(row.attrValue);
              for (let attrValueKey in row.attrValue) {
                row[attrValueKey] = row.attrValue[attrValueKey];
              }
            });
            this.$nextTick(() => {
              info.attrValue.forEach((row) => {
                row.image = this.$selfUtil.setDomain(row.image);
                this.$refs.multipleTable.toggleRowSelection(row, true);
                this.$set(row, 'checked', true);
              });
            });
            this.ManyAttrValue = info.attrValue;
            this.multipleSelection = info.attrValue;
          } else {
            this.ManyAttrValue = info.attrValue;
            this.formValidate.attr = [];
          }
          this.getShopImg(info.sliderImage, info.attrValue);
        })
        .catch((res) => {
          this.fullscreenLoading = false;
        });
    },
    /**
     * 视频号转图片路径
     * @param sliderImage轮播图, attrValue规格
     */
    async getShopImg(sliderImage, attrValue) {
      let imgList = [...JSON.parse(sliderImage)];
      attrValue.map((item) => imgList.push(item.image));
      let attrs = [...new Set(imgList)];
      let ShopImg = [];
      attrs.map((item) => {
        ShopImg.push({
          key: item,
          img: item,
        });
      });
      let result = await this.getShopImgUpload(ShopImg, []);
      this.formValidate.images = this.formValidate.images.map((item, index) => {
        if (result[index].key && item === result[index].key) {
          return result[index].img;
        } else {
          this.formValidate.images.splice(index, 1);
        }
      });
      this.ManyAttrValue.map((item, index) => {
        result.map((items, index) => {
          if (items.key && item.image === items.key) {
            return (item.image = items.img);
          }
          // else {
          //   this.ManyAttrValue.splice(index, 1);
          // }
        });
      });
      this.fullscreenLoading = false;
    },
    async getShopImgUpload(attrs, arr) {
      for (const key in attrs) {
        let res = await this.getImgData(attrs[key].img || attrs[key].sattDir);
        arr.push({
          key: attrs[key].img || attrs[key].imgsattDir,
          img: res,
        });
      }
      return arr;
    },
    /**
     * 视频号转图片路径请求接口
     * @param imgUrl
     * @returns {Promise<any>}
     */
    getImgData(imgUrl) {
      return new Promise((resolve, reject) => {
        shopImgUploadApi({
          imgUrl: imgUrl,
          respType: 1,
          uploadType: 1,
        }).then((res) => {
          if (res.errcode > 0) {
            this.fullscreenLoading = false;
            this.$message.error(res.errmsg);
            resolve('');
          } else {
            resolve(res.img_info.temp_img_url);
          }
        });
      });
    },
    getDraftProdect(id) {
      this.fullscreenLoading = true;
      draftInfoApi(id)
        .then(async (res) => {
          let info = res;
          this.formValidate = {
            images: JSON.parse(info.headImg),
            title: info.title,
            unitName: info.unitName,
            tempId: info.tempId,
            attr: JSON.parse(info.attr),
            descInfo: info.descInfo,
            specType: info.specType,
            primaryProductId: info.primaryProductId,
            ficti: info.ficti,
            thirdCatIdList: [info.catInfo.firstCatId, info.catInfo.secondCatId, info.catInfo.thirdCatId],
            thirdCatId: info.thirdCatId,
            brandId: info.brandId,
            qualificationPicsList: JSON.parse(info.qualificationPics) || [],
            id: info.id,
            productId: info.productId,
          };
          if (info.specType) {
            this.ManyAttrValue = JSON.parse(info.attrValue);
            this.$nextTick(() => {
              this.ManyAttrValue.forEach((item, index) => {
                item.attrValue = JSON.parse(item.attrValue);
                for (let attrValueKey in item.attrValue) {
                  item[attrValueKey] = item.attrValue[attrValueKey];
                }
                if (item.id) {
                  this.$set(item, 'price', item.price);
                  this.$nextTick(() => {
                    this.$refs.multipleTable.toggleRowSelection(item, true);
                  });
                }
              });
            });
          } else {
            this.ManyAttrValue = JSON.parse(info.attrValue);
            this.formValidate.attr = [];
          }
          this.fullscreenLoading = false;
        })
        .catch((res) => {
          this.fullscreenLoading = false;
        });
    },
    handleSubmitNest2(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formValidate.specType && this.multipleSelection.length === 0)
            return this.$message.warning('请填选择至少一个商品属性！');
          if (this.productQualificationType === 1 && this.formValidate.qualificationPicsList.length === 0)
            return this.$message.warning('该类目必须上传商品资质图片，请上传！');
          this.currentTab++;
        } else {
          return false;
        }
      });
    },
    // 提交
    handleSubmit: Debounce(function (name) {
      if (!this.formValidate.specType) {
        // this.formValidate.attr = []
        this.formValidate.attrValue = this.ManyAttrValue;
      } else {
        // this.multipleSelection.forEach((row) => {
        //   this.$set(row, 'checked', true)
        // });
        this.formValidate.attrValue = this.multipleSelection;
        this.formValidate.attrValue.forEach((item) => {
          item.attrValue = JSON.stringify(item.attrValue);
        });
      }
      this.formValidate.thirdCatId = this.formValidate.thirdCatIdList[2];
      this.formValidate.headImg = JSON.stringify(this.formValidate.images);
      this.formValidate.qualificationPics = JSON.stringify(this.formValidate.qualificationPicsList);
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.fullscreenLoading = true;
          this.loading = true;
          this.$route.params.id
            ? draftUpdateApi(this.formValidate)
                .then(async () => {
                  this.fullscreenLoading = false;
                  this.$message.success('编辑成功');
                  this.$router.push({
                    path: '/videoChannel/draftList',
                  });
                  this.$refs[name].resetFields();
                  this.formValidate.images = [];
                  this.formValidate.qualificationPics = [];
                  this.loading = false;
                })
                .catch(() => {
                  this.fullscreenLoading = false;
                  this.loading = false;
                })
            : videoAddApi(this.formValidate)
                .then(async (res) => {
                  this.fullscreenLoading = false;
                  this.$message.success('新增成功');
                  this.$router.push({
                    path: '/videoChannel/draftList',
                  });
                  this.$refs[name].resetFields();
                  this.formValidate.images = [];
                  this.formValidate.qualificationPics = [];
                  this.loading = false;
                })
                .catch(() => {
                  this.fullscreenLoading = false;
                  this.loading = false;
                });
        } else {
          if (
            !this.formValidate.storeName ||
            !this.formValidate.unitName ||
            !this.formValidate.store_info ||
            !this.formValidate.image ||
            !this.formValidate.images
          ) {
            this.$message.warning('请填写完整商品信息！');
          }
        }
      });
    }),
    handleSubmitUp() {
      this.productQualificationType = 0;
      //this.formValidate.thirdCatIdList = [];
      if (this.currentTab-- < 0) this.currentTab = 0;
    },
    setTagsViewTitle() {
      const title = this.isDisabled ? '查看视频号商品' : '编辑视频号商品';
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
      this.$store.dispatch('tagsView/updateVisitedView', route);
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
    handleDragEnter(e, item, val) {
      e.dataTransfer.effectAllowed = 'move';
      if (item === this.dragging) {
        return;
      }
      let newItems = [];
      if (val === 'images') {
        newItems = [...this.formValidate.images];
      } else {
        newItems = [...this.formValidate.qualificationPicsList];
      }
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);
      newItems.splice(dst, 0, ...newItems.splice(src, 1));
      if (val === 'images') {
        this.formValidate.images = newItems;
      } else {
        this.formValidate.qualificationPicsList = newItems;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.modalBox {
  ::v-deep .el-cascader-menu__wrap {
    height: 747px;
  }
  ::v-deep.el-cascader-menu {
    border-right: solid 1px #dfe4ed;
  }
}
.thirdCatIdList {
  height: 36px;
  position: absolute;
  z-index: 111;
}
.btndel {
  position: absolute;
  z-index: 1;
  width: 20px !important;
  height: 20px !important;
  left: 46px;
  top: -4px;
}
.labeltop {
  ::v-deep.el-input-number--small {
    /*width: 172px !important;*/
    min-width: 132px !important;
  }
}

.proCoupon {
  ::v-deep.el-form-item__content {
    margin-top: 5px;
  }
}
.noLeft {
  ::v-deep.el-form-item__content {
    margin-left: 0 !important;
  }
}
.tabNumWidth {
  ::v-deep.el-input-number--medium {
    width: 121px !important;
  }
  ::v-deep.el-input-number__increase {
    width: 20px !important;
    font-size: 12px !important;
  }
  ::v-deep .el-input-number__decrease {
    width: 20px !important;
    font-size: 12px !important;
  }
  ::v-deep .el-input-number--medium .el-input__inner {
    padding-left: 25px !important;
    padding-right: 25px !important;
  }
  ::v-deep thead {
    line-height: normal !important;
  }
  ::v-deep .el-table .cell {
    line-height: normal !important;
  }
}
.selWidth {
  width: 80%;
}
.selWidthd {
  width: 300px;
}
.button-new-tag {
  height: 28px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.labeltop {
  ::v-deep .el-form-item__label {
  }
}
</style>
