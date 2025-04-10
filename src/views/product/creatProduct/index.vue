<template>
  <div class="divBox">
    <pages-header
      ref="pageHeader"
      :title="$route.params.id !== '0' ? (isDisabled ? '商品详情' : '编辑商品') : '添加商品'"
      backUrl="/product/list"
    ></pages-header>
    <el-card v-if="isCopy" class="mt14" shadow="never" :bordered="false">
      <div class="line-ht mb15">
        生成的商品默认是没有上架的，请手动上架商品！
        <span v-if="copyConfig.copyType && copyConfig.copyType == 1"
          >您当前剩余{{ copyConfig.copyNum }}条采集次数。
        </span>
        <el-link
          v-if="copyConfig.copyType && copyConfig.copyType != 1"
          type="primary"
          :underline="false"
          href="https://help.crmeb.net/crmeb_java/2103903"
          target="_blank"
          >如何配置密钥
        </el-link>
        <br />
        商品采集设置：设置 > 系统设置 > 第三方接口设置 >
        采集商品配置（如配置一号通采集，请先登录一号通账号，无一号通，请选择99Api设置）
      </div>
      <div class="mb15" v-if="copyConfig.copyType && copyConfig.copyType != 1">
        <el-radio-group v-model="form">
          <el-radio :label="1">淘宝</el-radio>
          <el-radio :label="2">京东</el-radio>
          <el-radio :label="3">苏宁</el-radio>
          <el-radio :label="4">拼多多</el-radio>
          <el-radio :label="5">天猫</el-radio>
        </el-radio-group>
      </div>
      <div :span="24" v-if="copyConfig.copyType">
        <el-input v-model.trim="url" placeholder="请输入链接地址" class="selWidth100" size="small">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="addProduct"
            size="small"
            v-hasPermi="['merchant:product:copy:product', 'merchant:product:import:product']"
          />
        </el-input>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs class="list-tabs" v-model="currentTab">
        <el-tab-pane v-for="(item, index) in headTab" :key="index" :label="item.tit" :name="item.name"></el-tab-pane>
      </el-tabs>
      <el-form
        ref="formValidate"
        :key="currentTab"
        v-loading="fullscreenLoading"
        class="formValidate form-boder-padding"
        :rules="ruleValidate"
        :model="formValidate"
        label-width="108px"
        @submit.native.prevent
      >
        <el-row v-show="currentTab === '1'" :gutter="24">
          <!-- 商品信息-->
          <el-col v-bind="grid2">
            <el-form-item label="商品类型：" required>
              <div class="from-ipt-width el-input el-input--small" maxlength="249" disabled>
                <span class="el-input__inner">
                  {{ formValidate.type | productTpyeFilter }}
                </span>
              </div>
              <div class="from-tips">云盘商品、卡密商品不支持售后，一经出售，概不退换</div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商品名称：" prop="name">
              <el-input
                class="from-ipt-width"
                v-model.trim="formValidate.name"
                maxlength="50"
                show-word-limit
                placeholder="请输入商品名称"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商户商品分类：" prop="cateIds">
              <el-cascader
                class="from-ipt-width"
                v-model="formValidate.cateIds"
                :options="merProductClassify"
                :props="props2"
                clearable
                :show-all-levels="false"
                :disabled="isDisabled"
              />
              <el-button
                v-if="checkPermi(['merchant:product:category:add']) && !isDisabled"
                class="ml15"
                @click="handleAddMenu({ id: 0, name: '顶层目录' })"
                >添加分类</el-button
              >
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="平台商品分类：" prop="categoryId">
              <el-cascader
                class="from-ipt-width"
                @change="onChangeCategory"
                v-model="formValidate.categoryId"
                :options="productClassify"
                :props="props1"
                filterable
                clearable
                :show-all-levels="false"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="品牌：" prop="brandId">
              <el-select
                class="from-ipt-width"
                clearable
                filterable
                v-model="formValidate.brandId"
                v-selectLoadMore="selectLoadMore"
                :loading="loading"
                remote
                :disabled="isDisabled || !formValidate.categoryId"
                :remote-method="remoteMethod"
                placeholder="请选择品牌"
              >
                <el-option v-for="user in brandList" :key="user.id" :label="user.name" :value="user.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="单位：" prop="unitName">
              <el-input
                v-model.trim="formValidate.unitName"
                placeholder="请输入单位"
                class="from-ipt-width"
                :disabled="isDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formValidate.type == 0" :xs="18" :sm="18" :md="18" :lg="12" :xl="12">
            <el-form-item label="运费模板：" prop="tempId">
              <el-select
                v-model="formValidate.tempId"
                placeholder="请选择"
                :disabled="isDisabled"
                class="from-ipt-width mr20"
              >
                <el-option v-for="item in shippingTemplates" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商品关键字：">
              <keyword
                @getLabelarr="getLabelarr"
                :labelarr="labelarr"
                class="from-ipt-width"
                :isDisabled="isDisabled"
              ></keyword>
              <div class="from-tips">用户可以根据关键字进行商品搜索</div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商品简介：" prop="intro">
              <el-input
                class="from-ipt-width"
                v-model.trim="formValidate.intro"
                type="textarea"
                maxlength="100"
                :rows="3"
                placeholder="请输入商品简介"
                show-word-limit
                :disabled="isDisabled"
              />
              <div class="from-tips">通过公众号分享商品详情，会展示此简介信息</div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="商品封面图：" prop="image">
              <div class="upLoadPicBox acea-row" @click="modalPicTap('1')" :disabled="isDisabled">
                <div v-if="formValidate.image" class="pictrue"><img :src="formValidate.image" /></div>
                <div v-else class="upLoad">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
              </div>
              <div class="from-tips" v-show="!isDisabled">建议尺寸：800*800px，上传小于500kb的图片</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="商品轮播图：" prop="sliderImages">
              <div class="acea-row">
                <div
                  v-for="(item, index) in formValidate.sliderImages"
                  :key="index"
                  class="pictrue"
                  draggable="true"
                  @dragstart="handleDragStart($event, item)"
                  @dragover.prevent="handleDragOver($event, item)"
                  @dragenter="handleDragEnter($event, item)"
                  @dragend="handleDragEnd($event, item)"
                >
                  <img :src="item" />
                  <i v-show="!isDisabled" class="el-icon-error btndel" @click="handleRemove(index)" />
                </div>
                <div
                  v-if="formValidate.sliderImages.length < 10 && !isDisabled"
                  class="upLoadPicBox"
                  @click="modalPicTap('2')"
                >
                  <div class="upLoad">
                    <i class="el-icon-camera cameraIconfont" />
                  </div>
                </div>
              </div>
              <div class="from-tips">建议尺寸：800*800px，上传小于500kb的图片；最多可上传10张图片，拖动可调整顺序</div>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="保障服务：">
              <el-radio-group v-model="isShowGroup" @change="onchangeIsShow">
                <el-radio label="combination">使用保障服务组合</el-radio>
                <el-radio label="alone">单独设置保障服务</el-radio>
              </el-radio-group>
              <div class="acea-row row-middle mb5">
                <el-select
                  id="mySelect"
                  :key="multiples ? 'one' : 'two'"
                  class="from-ipt-width"
                  v-model="formValidate.guaranteeIdsList"
                  placeholder="请选择保障服务"
                  clearable
                  filterable
                  :multiple="multiples"
                  :disabled="isDisabled"
                  multiple
                  collapse-tags
                  @change="changeGuarantee"
                >
                  <el-option
                    :value="item.id"
                    v-for="(item, index) in guaranteeNew"
                    :key="item.id"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </div>
              <el-tag v-for="(item, index) in guaranteeName" :key="index" class="mr10">{{ item }}</el-tag>
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="主图视频：" prop="video_link">
              <div class="acea-row">
                <el-input
                  v-model="videoLink"
                  :disabled="isDisabled"
                  size="small"
                  class="from-ipt-width"
                  placeholder="请输入MP4格式的视频链接"
                >
                  <input ref="refid" type="file" style="display: none" />
                  <el-upload
                    class="upload-demo"
                    action
                    slot="append"
                    :http-request="handleUploadForm"
                    :before-upload="beforeAvatarUpload"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :disabled="isDisabled"
                    multiple
                  >
                    <el-button :disabled="isDisabled" size="small">
                      {{ videoLink ? '确认添加' : '上传视频' }}</el-button
                    >
                  </el-upload>
                </el-input>
              </div>
              <div class="from-tips">请上传小于20M的视频</div>
              <div v-if="videoLink" class="iview-video-style">
                <video
                  class="from-ipt-width"
                  style="height: 100% !important; border-radius: 10px"
                  :src="videoLink"
                  controls="controls"
                >
                  您的浏览器不支持 video 标签。
                </video>
                <div class="mark" />
                <i class="el-icon-delete iconv" @click="delVideo" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 商品规格-->
        <creatAttr
          v-if="isShowAttr"
          v-show="currentTab === '2'"
          v-model="formValidate"
          :oneFormBatch="oneFormBatch"
          :isDisabled="isDisabled"
          :formThead="formThead"
          :manyTabDate="manyTabDate"
          :ManyAttrValue="ManyAttrValue"
          :OneattrValue="OneattrValue"
          :manyTabTit="manyTabTit"
          @changeManyAttrValue="changeManyAttrValue"
          @handleBatchDel="handleBatchDel"
          @changeIsEditVal="changeIsEditVal"
          @changeDefault="changeDefault"
        ></creatAttr>
        <!-- 商品详情-->
        <el-row v-show="currentTab === '3' && !isDisabled">
          <el-col :span="24">
            <el-form-item label="商品详情：">
              <Tinymce v-model.trim="formValidate.content" :key="htmlKey"></Tinymce>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="currentTab === '3' && isDisabled">
          <el-col :span="24">
            <el-form-item label="商品详情：">
              <div class="contentPic" v-html="formValidate.content || '无'"></div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 其他设置-->
        <el-row v-show="currentTab === '4'">
          <el-form-item label="关联表单：">
            <el-select
              :disabled="isDisabled"
              class="from-ipt-width"
              v-model="formValidate.systemFormId"
              placeholder="请选择关联表单"
              clearable
              filterable
            >
              <el-option
                :value="item.id"
                v-for="(item, index) in systemFormList"
                :key="index.id"
                :label="item.formName"
              ></el-option>
            </el-select>
            <el-button
              size="small"
              class="ml15"
              v-if="checkPermi(['merchant:system:form:add']) && !isDisabled"
              @click="handlerCreatFrom(0, 'add')"
              >添加表单</el-button
            >
            <el-button
              size="small"
              class="ml15"
              v-if="checkPermi(['merchant:system:form:add']) && !isDisabled"
              @click="getSystemFormList"
              >刷新</el-button
            >
            <div class="from-tips mb5">
              用户购买此商品时，必须填写关联表单中设置的字段内容才能够进行订单支付，例如：部分商品购买必须填写身份证号、预约时间等
            </div>
            <div class="from-tips mb15 colorPrompt">注：关联系统表单之后，该商品则不可进行「加入购物车」操作</div>
            <div class="item" v-if="formValidate.systemFormId">
              <div class="acea-row row-middle">
                <div>
                  <iframe
                    :src="`${$selfUtil.getFrontDomainUrl()}/pages/goods/systemIframe/index?id=${
                      formValidate.systemFormId
                    }`"
                    style="width: 350px; height: 500px"
                    frameborder="0"
                  />
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="formValidate.type == 2" label="用户申请退款：">
            <el-switch
              :disabled="isDisabled"
              v-model="formValidate.refundSwitch"
              :active-value="true"
              :inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              :width="35"
            >
            </el-switch>
            <div class="from-tips">开启之后用户可进行退款申请；关闭之后仅支持商家直接退款，用户不能申请退款</div>
          </el-form-item>
          <el-form-item label="配送方式：" v-if="formValidate.type == 0" prop="deliveryMethodList">
            <el-checkbox-group v-model="formValidate.deliveryMethodList" :disabled="isDisabled">
              <el-checkbox label="1">商家配送</el-checkbox>
              <el-checkbox label="2">到店自提</el-checkbox>
            </el-checkbox-group>
            <div class="from-tips mb5">
              请先配置店铺地址之后，再开启到店自提；若店铺统一关闭到店自提功能，商品配送方式选中到店自提，用户购买不支持到店自提！
            </div>
            <div class="from-tips mb5 colorPrompt">注：店铺统一关闭到店自提功能，该商品必须选中「商家配送」</div>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input-number
              v-model.trim="formValidate.sort"
              :min="1"
              :max="9999"
              placeholder="请输入排序"
              @keyup.native="proving1"
              :disabled="isDisabled"
            />
          </el-form-item>
          <div class="acea-row">
            <el-form-item label="赠送优惠券：" class="proCoupon">
              <div class="from-tips mb14">用户购买商品后赠送的优惠券</div>
              <div class="acea-row">
                <el-tag
                  v-for="(tag, index) in formValidate.coupons"
                  :key="index"
                  class="mr10 mb10"
                  :closable="!isDisabled"
                  :disable-transitions="false"
                  @close="handleCloseCoupon(tag)"
                >
                  {{ tag.name }}
                </el-tag>
                <span class="mr15" v-if="formValidate.couponIds == null">无</span>
                <el-button v-if="!isDisabled" size="small" class="mr15" @click="addCoupon">选择优惠券</el-button>
              </div>
            </el-form-item>
          </div>
        </el-row>
        <el-form-item>
          <el-button v-if="Number(currentTab) > 1" class="submission priamry_border" @click="handleSubmitUp"
            >上一步</el-button
          >
          <el-button v-show="Number(currentTab) < 4" class="priamry_border" @click="handleSubmitNest('formValidate')"
            >下一步</el-button
          >
          <el-button
            v-show="(currentTab === '3' || $route.params.id) && !isDisabled"
            type="primary"
            class="submission"
            @click="handleSubmit('formValidate')"
            :loading="loadingBtn"
            v-if="checkPermi(['merchant:product:update'])"
            >保存</el-button
          >
          <el-button
            v-show="
              !isDisabled &&
              this.productSwitch &&
              (($route.params.id > 0 && this.formValidate.auditStatus > 0) || $route.params.id == 0)
            "
            type="primary"
            class="submission"
            @click="handleSubmitAndAudit('formValidate')"
            :loading="loadingBtn"
            v-if="checkPermi(['merchant:product:update'])"
            >保存并提审</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 添加商品分类-->
    <el-dialog
      title="创建商品分类"
      :visible.sync="editDialogConfig.visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="540px"
      class="dialog-bottom"
    >
      <edit
        v-if="editDialogConfig.visible"
        :prent="editDialogConfig.prent"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.data"
        :biztype="editDialogConfig.biztype"
        :all-tree-list="merProductClassify"
        @hideEditDialog="hideEditDialog"
      />
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
import {
  brandListApi,
  productGuaranteeApi,
  templateListApi,
  productCreateApi,
  productDetailApi,
  productUpdateApi,
  productCouponListApi,
  guaranteeListApi,
  copyConfigApi,
  copyProductApi,
  importProductApi,
} from '@/api/product';
import { Debounce } from '@/utils/validate';
import { mapGetters, mapState } from 'vuex';
import { checkPermi } from '@/utils/permission'; // 权限判断函数

import creatAttr from '../components/creatAttr';

import { uploadImage } from '@/utils/ZBKJIutil';
import { getToken } from '@/utils/auth';
import edit from '@/components/Category/edit.vue';
import { productAuditSwitchInfoApi } from '@/api/merchant';
import { systemFormPageApi } from '@/api/systemForm';
import { useProduct } from '@/hooks/use-product';
const { handlerCreatFromUse } = useProduct();
import product from '@/mixins/product';
import { defaultObj, objTitle } from './default';
export default {
  name: 'ProductProductAdd',
  directives: {
    // 计算是否滚动到最下面
    selectLoadMore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  mixins: [product], //此js存放商品的部分函数方法
  components: { edit, Tinymce, creatAttr },
  data() {
    return {
      //批量添加规格的值
      oneFormBatch: [
        {
          image: '',
          price: void 0.01,
          cost: void 0.01,
          otPrice: void 0.01,
          stock: void 0,
          barCode: '',
          itemNumber: '',
          weight: void 0,
          volume: void 0,
          brokerage: void 0,
          brokerageTwo: void 0,
          cdkeyId: null,
          cdkeyLibraryName: '',
          expand: '',
          vipPrice: void 0,
        },
      ],
      frontDomain: localStorage.getItem('frontDomain'),
      htmlKey: 0,
      formThead: Object.assign({}, objTitle),
      form: 2,
      url: '',
      copyConfig: {},
      labelarr: [],
      isDisabled: this.$route.params.isDisabled === '1' ? true : false,
      isCopy: this.$route.params.isCopy === '1' ? true : false, //是否是采集
      props2: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: true,
        emitPath: false,
        checkStrictly: true,
      },
      props1: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: false,
        emitPath: false,
      },
      tabs: [],
      fullscreenLoading: false,
      props: { multiple: true },
      active: 0,
      OneattrValue: [Object.assign({}, defaultObj.attrValueList[0])], // 单规格
      ManyAttrValue: [Object.assign({}, defaultObj.attrValueList[0])], // 多规格
      manyTabTit: {},
      manyTabDate: {}, // 生成规格表格中的头部标题
      grid2: {
        xl: 24,
        lg: 24,
        md: 24,
        sm: 24,
        xs: 24,
      },

      isBtn: false,
      manyFormValidate: [],
      currentTab: '1',
      isChoice: '',
      grid: {
        xl: 24,
        lg: 24,
        md: 24,
        sm: 24,
        xs: 24,
      },
      ruleValidate: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择平台商品分类', trigger: 'change' }],
        cateIds: [{ required: true, message: '请选择商户商品分类', trigger: 'change', type: 'array', min: '1' }],
        unitName: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入商品简介', trigger: 'blur' }],
        tempId: [{ required: true, message: '请选择运费模板', trigger: 'change' }],
        image: [{ required: true, message: '请上传商品图', trigger: 'change' }],
        sliderImages: [{ required: true, message: '请上传商品轮播图', type: 'array', trigger: 'change' }],
        specType: [{ required: true, message: '请选择商品规格', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }],
        deliveryMethodList: [{ required: true, message: '请选择配送方式', type: 'array', trigger: 'change' }],
      },
      tempRoute: {},
      keyNum: 0,
      isShowAttr: false,
      guaranteeList: [],
      brandList: [],
      search: {
        limit: this.$constants.page.limit[0],
        page: 1,
        cid: '',
        brandName: '',
      },
      totalPage: 0,
      total: 0,
      loading: false,
      loadingBtn: false,
      isShowGroup: 'alone',
      guaranteeGroupList: [],
      guaranteeNew: [],
      guaranteeName: [],
      multiples: true,
      productClassify: [], //平台商品分类
      productType: [
        { tit: '普通商品', id: 0, tit2: '实体货物' },
        { tit: '云盘商品', id: 5, tit2: '同一链接发货' },
        { tit: '卡密商品', id: 6, tit2: '不同充值码发货' },
      ],
      upload: {
        videoIng: false, // 是否显示进度条；
      },
      videoLink: '', //视频地址
      progress: 10, // 进度条默认0
      myHeaders: { 'X-Token': getToken() },
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=创建，1=编辑
        prent: {}, // 父级对象
        data: {},
        biztype: { name: '产品分类', value: 1, shortName: '产品' }, // 统一主业务中的目录类型
      }, //商品分类
      isSwitch: false, //商户开关
      productSwitch: false, //商品是否需要审核 true需要审核，false免审
      canSel: true, // 规格图片添加判断
      // 规格数据
      formDynamic: {
        attrsName: '',
        attrsVal: '',
      },
      formDynamics: {
        ruleName: '',
        ruleValue: [],
      },
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.bus.$emit('onTagsViewRefreshRouterView', this.$route.path);
    next();
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    ...mapState({
      systemFormList: (state) => state.mobildConfig.systemFormList,
    }),
    ...mapGetters(['merPlatProductClassify', 'merProductClassify', 'productBrand', 'shippingTemplates']),
  },
  created() {
    this.formValidate.type = Number(this.$route.params.productType); //商品类型
    this.tempRoute = Object.assign({}, this.$route);
  },
  mounted() {
    this.formValidate.attrs = [];
    this.formValidate.sliderImages = [];
    if (checkPermi(['merchant:plat:product:category:cache:tree']))
      this.$store.dispatch('product/getAdminProductClassify');
    if (!localStorage.getItem('merProductClassify') && checkPermi(['merchant:product:category:cache:tree']))
      this.$store.dispatch('product/getMerProductClassify');
    if (checkPermi(['merchant:plat:product:brand:cache:list'])) this.$store.dispatch('product/getMerProductBrand');
    if (!localStorage.getItem('shippingTemplates')) this.$store.dispatch('product/getShippingTemplates');
    if (checkPermi(['merchant:plat:product:guarantee:list'])) this.getProductGuarantee();
    if (checkPermi(['merchant:product:guarantee:group:list'])) this.getGuaranteeGroupList();
    if (!localStorage.getItem('systemFormList') && checkPermi(['merchant:system:form:page'])) this.getSystemFormList();
    this.setTagsViewTitle();
    if (this.$route.params.id && this.$route.params.id != 0) {
      if (checkPermi(['merchant:product:info'])) this.getInfo();
    } else {
      this.isShowAttr = true;
    }
    if (this.isCopy && checkPermi(['merchant:plat:product:brand:cache:list'])) this.getCopyConfig();
    this.productClassify = this.addDisabled(this.merPlatProductClassify);
    this.getProductAuditSwitchInfo();
  },
  methods: {
    checkPermi,
    // 切换默认选中规格
    changeDefault(e, index) {
      // 一个开启 其他关闭
      this.ManyAttrValue.map((item, i) => {
        if (i !== index) {
          item.isDefault = false;
        }
      });
      if (e) this.ManyAttrValue[index].isShow = true;
    },
    // 回调规格生成表格数据
    changeManyAttrValue(e) {
      // rows数组第一项 新增默认数据 oneFormBatch
      this.ManyAttrValue = e;
    },
    changeIsEditVal() {
      this.isEditAttrVal = false;
    },
    //批量清空规格中的批量数据
    handleBatchDel() {
      this.oneFormBatch = [
        {
          image: '',
          price: void 0.01,
          cost: void 0.01,
          otPrice: void 0.01,
          stock: void 0,
          weight: void 0,
          volume: void 0,
          brokerage: void 0,
          brokerageTwo: void 0,
          cdkeyId: null,
          cdkeyLibraryName: '',
          barCode: '',
          itemNumber: '',
          expand: '',
          vipPrice: void 0,
        },
      ];
    },
    //创建、编辑表单
    handlerCreatFrom(id, type) {
      handlerCreatFromUse(id, type);
    },
    //系统表单数据
    async getSystemFormList() {
      const { list } = await systemFormPageApi({ page: 1, limit: 999 });
      this.$store.commit('mobildConfig/SET_SystemForm', list);
      localStorage.setItem('systemFormList', JSON.stringify(list));
    },
    //获取商户端商户商品审核开关信息
    getProductAuditSwitchInfo() {
      productAuditSwitchInfoApi().then(async (res) => {
        this.isSwitch = res.isSwitch;
        this.productSwitch = res.productSwitch;
      });
    },
    //添加商品分类
    handleAddMenu(rowData) {
      this.editDialogConfig.isCreate = 0;
      this.editDialogConfig.prent = rowData;
      this.editDialogConfig.data = {};
      this.editDialogConfig.visible = true;
    },
    hideEditDialog() {
      this.editDialogConfig.prent = {};
      this.editDialogConfig.type = 0;
      this.editDialogConfig.visible = false;
      setTimeout(() => {
        this.$store.dispatch('product/getMerProductClassify');
      }, 200);
    },
    //视频上传前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'video/mp4';
      const isLt2M = file.size / 10240 / 10240 < 2;

      if (!isJPG) {
        this.$message.error('上传视频只能是 mp4 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传视频不能超过 20MB!');
      }
      return isJPG && isLt2M;
    },
    // 上传
    async handleUploadForm(param) {
      const formData = new FormData();
      const data = {
        model: 'product',
        pid: 0,
      };
      let loading = this.$loading({
        lock: true,
        text: '上传中，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      });
      formData.append('multipart', param.file);
      try {
        let res = await uploadImage(formData, data);
        this.upload.videoIng = true;
        this.videoLink = res.url;
        this.progress = 100;
        loading.close();
      } catch (e) {
        loading.close();
      }
    },
    // 删除视频；
    delVideo() {
      this.$set(this, 'videoLink', '');
    },
    //限制平台商品分类只能选择第三级
    addDisabled(dropdownList) {
      const list = [];
      try {
        dropdownList.forEach((e, index) => {
          let e_new = {
            id: e.id,
            name: e.name,
            level: e.level,
            pid: e.pid,
            isShow: e.isShow,
          };
          if (!e.childList && (e.level === 1 || e.level === 2)) {
            e_new = { ...e_new, disabled: true };
          }
          if (e.childList) {
            const childList = this.addDisabled(e.childList);
            e_new = { ...e_new, childList: childList };
          }
          list.push(e_new);
        });
      } catch (error) {
        return [];
      }
      return list;
    },
    // 生成商品表单
    addProduct() {
      if (this.url) {
        this.formValidate.content = '';
        this.loading = true;
        this.fullscreenLoading = true;
        this.copyConfig.copyType == 1
          ? copyProductApi({ url: this.url })
              .then((res) => {
                this.getData(res, 'copy');
                this.isShowAttr = true;
                this.loading = false;
                this.fullscreenLoading = false;
              })
              .catch(() => {
                this.loading = false;
                this.fullscreenLoading = false;
              })
          : importProductApi({ url: this.url, form: this.form })
              .then((res) => {
                this.getData(res, 'copy');
                this.isShowAttr = true;
                this.loading = false;
                this.fullscreenLoading = false;
              })
              .catch(() => {
                this.loading = false;
                this.fullscreenLoading = false;
              });
      } else {
        this.$message.warning('请输入链接地址！');
      }
    },
    /**
     * 复制商品转图片路径
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
     * 复制商品图片路径请求接口
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
    getCopyConfig() {
      copyConfigApi().then((res) => {
        this.copyConfig = res;
      });
    },
    changeGuarantee(val) {
      if (val) {
        this.guaranteeName = [];
        if (this.isShowGroup === 'combination') {
          let guaranteeGroupids = [];
          let data = this.guaranteeGroupList.filter((item) => val.includes(item.id));
          if (data.length) {
            data[0].guaranteeList.map((item) => item.isShow && guaranteeGroupids.push(item.gid));
          }
          this.formValidate.guaranteeIds = guaranteeGroupids.toString();
          this.guaranteeList.map((item) => {
            guaranteeGroupids.map((j) => {
              if (item.id === j) this.guaranteeName.push(item.name);
            });
          });
        }
      } else {
        this.guaranteeName = [];
        this.$set(this.formValidate, 'guaranteeIdsList', null);
      }
    },
    //选择保障服务模式
    onchangeIsShow() {
      this.multiples = !this.multiples;
      this.guaranteeName = [];
      this.formValidate.guaranteeIds = '';
      if (this.isShowGroup === 'combination') {
        this.guaranteeNew = this.guaranteeGroupList;
        this.$set(this.formValidate, 'guaranteeIdsList', '');
      } else {
        this.$set(this.formValidate, 'guaranteeIdsList', []);
        this.guaranteeNew = this.guaranteeList;
      }
    },
    // 服务组合列表
    getGuaranteeGroupList() {
      guaranteeListApi().then((res) => {
        this.guaranteeGroupList = res;
      });
    },
    getLabelarr(attr) {
      this.labelarr = attr;
    },
    changeNodes(data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (!data[i].childList || data[i].childList.length < 1) {
            data[i].childList = undefined;
          } else {
            this.changeNodes(data[i].childList);
          }
        }
      }
      return data;
    },
    // 保障服务列表
    getProductGuarantee() {
      productGuaranteeApi().then((res) => {
        this.guaranteeList = res.filter((item) => item.isShow);
        this.guaranteeNew = this.guaranteeList;
      });
    },

    onChangeCategory() {
      this.formValidate.brandId = '';
      this.brandList = [];
      this.getbrandList();
      this.brandList.push({ name: '其他', id: 0 });
    },
    // 下拉加载更多
    selectLoadMore() {
      this.search.page = this.search.page + 1;
      if (this.search.page > this.totalPage) return;
      this.getbrandList(); // 请求接口
    },
    // 远程搜索
    remoteMethod(query) {
      this.loading = true;
      this.search.brandName = query;
      this.search.page = 1;
      setTimeout(() => {
        this.loading = false;
        this.getbrandList(); // 请求接口
      }, 200);
    },
    // 品牌列表
    getbrandList() {
      this.search.cid = this.formValidate.categoryId;
      brandListApi(this.search).then((res) => {
        this.totalPage = res.totalPage;
        this.total = res.total;
        this.brandList = this.brandList.concat(res.list);
      });
    },

    proving1(e) {
      this.formValidate.sort = e.target.value.replace(/[^\.\d]/g, '');
      this.formValidate.sort = e.target.value.replace('.', '');
    },
    handleCloseCoupon(tag) {
      this.formValidate.coupons.splice(this.formValidate.coupons.indexOf(tag), 1);
      this.formValidate.couponIds.splice(this.formValidate.couponIds.indexOf(tag.id), 1);
    },
    addCoupon() {
      const _this = this;
      this.$modalCoupon(
        'wu',
        (this.keyNum += 1),
        this.formValidate.coupons,
        function (row) {
          _this.formValidate.couponIds = [];
          _this.formValidate.coupons = row;
          row.map((item) => {
            _this.formValidate.couponIds.push(item.id);
          });
        },
        '',
      );
    },
    setTagsViewTitle() {
      if (this.$route.params.id && this.$route.params.id != 0) {
        const title = this.isDisabled ? '商品详情' : '编辑商品';
        const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
        this.$store.dispatch('tagsView/updateVisitedView', route);
      } else {
        if (this.isCopy) {
          const title = '采集商品';
          const route = Object.assign({}, this.tempRoute, { title: `${title}` });
          this.$store.dispatch('tagsView/updateVisitedView', route);
        }
      }
    },
    // 详情
    getInfo() {
      this.fullscreenLoading = true;
      productDetailApi(this.$route.params.id)
        .then(async (res) => {
          await this.getData(res, 'add');
          this.isShowAttr = true;
          this.fullscreenLoading = false;
        })
        .catch((res) => {
          this.fullscreenLoading = false;
        });
    },
    handleRemove(i) {
      this.formValidate.sliderImages.splice(i, 1);
    },
    // 上一步
    handleSubmitUp() {
      this.currentTab = (Number(this.currentTab) - 1).toString();
    },
    // 下一步
    handleSubmitNest(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.currentTab = (Number(this.currentTab) + 1).toString();
        } else {
          if (
            !this.formValidate.name ||
            !this.formValidate.categoryId ||
            !this.formValidate.keyword ||
            !this.formValidate.unitName ||
            !this.formValidate.intro ||
            !this.formValidate.image ||
            !this.formValidate.sliderImages ||
            !this.formValidate.deliveryMethodList.length
          ) {
            this.$message.warning('请填写完整商品信息！');
          }
        }
      });
    },
    //保存接口数据更新
    getFromData() {
      if (this.formValidate.specType && this.formValidate.attrs.length < 1)
        return this.$message.warning('请填写多规格属性！');
      if (this.videoLink) {
        //如果有视频主图，将视频链接插入到轮播图第一的位置
        this.formValidate.sliderImages.unshift(this.videoLink);
      }
      if (this.isShowGroup === 'alone') this.formValidate.guaranteeIds = this.formValidate.guaranteeIdsList.join(',');

      let attrValueListData = [];
      if (this.formValidate.specType) {
        //规格值
        this.formValidate.attrList = this.formValidate.attrs.map((item, index) => {
          return {
            attributeName: item.value,
            isShowImage: item.add_pic == 1 ? true : false,
            id: 0,
            sort: index + 1,
            optionList: item.detail.map((arr, idx) => {
              return {
                image: arr.image,
                optionName: arr.value,
                sort: idx + 1,
              };
            }),
          };
        });
        //表格数据
        let ManyAttrValues = [...this.ManyAttrValue];
        attrValueListData = ManyAttrValues;
        attrValueListData.shift();
        for (var i = 0; i < attrValueListData.length; i++) {
          let attrValues = { ...attrValueListData[i].attrValueShow };
          this.$set(attrValueListData[i], 'attrValue', JSON.stringify(attrValues)); //
        }
      } else {
        this.formValidate.attrList = [
          {
            attributeName: '规格',
            attrValues: '默认',
            isShowImage: false,
            optionList: [
              {
                optionName: '默认',
                id: 0,
                image: '',
                sort: 1,
              },
            ],
          },
        ];
        this.OneattrValue.map((item) => {
          this.$set(item, 'attrValue', JSON.stringify({ 规格: '默认' }));
        });
      }
      let data = {
        ...this.formValidate,
        cateId: this.formValidate.cateIds.join(','),
        keyword: this.labelarr.join(','),
        sliderImage: JSON.stringify(this.formValidate.sliderImages),
        deliveryMethod: this.formValidate.deliveryMethodList.join(','),
        systemFormId: this.formValidate.systemFormId ? this.formValidate.systemFormId : 0,
        attrValueList: this.formValidate.specType ? attrValueListData : this.OneattrValue,
        tempId: this.formValidate.type != 0 ? 0 : this.formValidate.tempId,
      };
      return data;
    },
    //是否自动上架
    automaticListing() {
      this.$confirm(this.productSwitch ? '审核通过之后是否自动上架？' : '操作之后是否自动上架？', '提示', {
        confirmButtonText: '上架',
        cancelButtonText: '不用了',
        type: 'warning',
        closeOnClickModal: false,
        distinguishCancelAndClose: true,
        customClass: 'deleteConfirm',
      })
        .then(() => {
          this.formValidate.isAutoUp = true;
          this.postData();
        })
        .catch((action) => {
          if (action === 'cancel') {
            this.formValidate.isAutoUp = false;
            this.postData();
            // 调用取消按钮的方法
          } else if (action === 'close') {
            // 调用关闭按钮的方法
          }
        });
    },
    //保存并审核
    handleSubmitAndAudit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          //  this.getFromData();
          this.formValidate.isAutoSubmitAudit = true;
          this.automaticListing();
        } else {
          if (
            !this.formValidate.name ||
            !this.formValidate.cateId ||
            !this.formValidate.keyword ||
            !this.formValidate.unitName ||
            !this.formValidate.intro ||
            !this.formValidate.image ||
            !this.formValidate.sliderImages
          ) {
            this.$message.warning('请填写完整商品信息！');
          }
        }
      });
    },
    // 保存
    handleSubmit(name) {
      let data = this.getFromData();
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.getFromData();
          //免审商品，保存的时候弹出上架弹窗，条件：店铺开启 && 店铺免审
          if (this.isSwitch && !this.productSwitch) {
            this.formValidate.isAutoSubmitAudit = false;
            this.automaticListing();
          } else {
            this.formValidate.isAutoUp = false;
            this.formValidate.isAutoSubmitAudit = false;
            this.postData();
          }
        } else {
          if (
            !this.formValidate.name ||
            !this.formValidate.cateId ||
            !this.formValidate.keyword ||
            !this.formValidate.unitName ||
            !this.formValidate.intro ||
            !this.formValidate.image ||
            !this.formValidate.sliderImages
          ) {
            this.$message.warning('请填写完整商品信息！');
          }
        }
      });
    },
    // 新增保存数据
    postData() {
      this.loadingBtn = true;
      let data = this.getFromData();
      parseFloat(this.$route.params.id) > 0
        ? productUpdateApi(data)
            .then(async (res) => {
              this.$message.success('编辑成功');
              setTimeout(() => {
                this.$router.push({ path: '/product/list' });
              }, 500);
              this.closeSelectedTag();
              this.loadingBtn = false;
            })
            .catch((res) => {
              this.loadingBtn = false;
            })
        : productCreateApi(data)
            .then(async (res) => {
              this.$message.success('新增成功');
              setTimeout(() => {
                this.$router.push({ path: '/product/list' });
              }, 500);
              this.closeSelectedTag();
              this.loadingBtn = false;
            })
            .catch((res) => {
              this.loadingBtn = false;
            });
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    closeSelectedTag() {
      let that = this;
      that.$store.dispatch('tagsView/delView', that.$route).then(({ visitedViews }) => {
        if (that.isActive(that.$route)) {
          that.toLastView(visitedViews, that.$route);
        }
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath });
        } else {
          this.$router.push('/');
        }
      }
    },
    // 表单验证
    validate(prop, status, error) {
      if (status === false) {
        this.$message.warning(error);
      }
    },

    getFileType(fileName) {
      // 后缀获取
      let suffix = '';
      // 获取类型结果
      let result = '';
      try {
        const flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = '';
      }
      // fileName无后缀返回 false
      if (!suffix) {
        return false;
      }
      suffix = suffix.toLocaleLowerCase();
      // 图片格式
      const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
      // 进行图片匹配
      result = imglist.find((item) => item === suffix);
      if (result) {
        return 'image';
      }
      // 匹配 视频
      const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
      result = videolist.find((item) => item === suffix);
      if (result) {
        return 'video';
      }
      // 其他 文件类型
      return 'other';
    },
  },
};
</script>
<style scoped lang="scss">
.contentPic {
  ::v-deep img {
    max-width: 100% !important;
    height: auto;
  }
}
.perW50 {
  width: 80%;
}
.line-ht {
  line-height: 28px;
}
.el-icon-warning {
  position: relative;
  top: 9px;
  left: 17px;
}
.disLabel {
  ::v-deep .el-form-item__label {
    margin-left: 36px !important;
  }
}
.disLabelmoren {
  ::v-deep .el-form-item__label {
    margin-left: 120px !important;
  }
}
.color-item {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  color: #fff;
  margin-right: 10px;
}
.color-list .color-item.blue {
  background-color: #1e9fff;
}
.color-list .color-item.yellow {
  background-color: rgb(254, 185, 0);
}
.color-list .color-item.green {
  background-color: #009688;
}
.color-list .color-item.red {
  background-color: #ed4014;
}

.noLeft {
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }
}
.tabNumWidth {
  ::v-deep .el-input-number--medium {
    width: 121px !important;
  }
  ::v-deep .el-input-number__increase {
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
.selWidth100 {
  width: 100%;
}
.selWidthd {
  width: 300px;
}
.input-new-tag {
  width: 150px;
  margin-left: 10px;
  vertical-align: bottom;
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
  video {
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
.labeltop {
  ::v-deep .el-form-item__label {
    float: none !important;
    display: inline-block !important;
    width: auto !important;
  }
}
.iview-video-style {
  width: 460px;
  height: 180px;
  border-radius: 10px;
  background-color: #707070;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.iview-video-style .iconv {
  color: #fff;
  line-height: 180px;
  width: 50px;
  height: 50px;
  display: inherit;
  font-size: 26px;
  position: absolute;
  top: -74px;
  left: 50%;
  margin-left: -25px;
}

.iview-video-style .mark {
  position: absolute;
  width: 100%;
  height: 30px;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}
</style>
