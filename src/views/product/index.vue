<template>
  <div class="divBox relative">
    <el-card
      v-if="checkPermi(['merchant:product:page:list'])"
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
    >
      <div class="padding-add">
        <el-form inline size="small" label-position="right" @submit.native.prevent>
          <el-form-item label="商品搜索：">
            <el-input
              v-model.trim="keywords"
              placeholder="请输入商品名称关键字"
              class="form_content_width"
              size="small"
              @keyup.enter.native="handleSeachList"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="平台分类：">
            <el-cascader
              v-model="tableFrom.categoryId"
              :options="merPlatProductClassify"
              :props="propsPlant"
              clearable
              class="form_content_width"
              @change="handleSeachList"
              size="small"
              placeholder="请输入平台商品分类"
            />
          </el-form-item>
          <el-form-item label="商户分类：">
            <el-cascader
              v-model="tableFrom.cateId"
              :options="merProductClassify"
              :props="propsMer"
              clearable
              class="form_content_width"
              @change="handleSeachList"
              size="small"
              placeholder="请输入商户商品分类"
            />
          </el-form-item>
          <el-form-item label="会员商品：">
            <el-select
              v-model="tableFrom.isPaidMember"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="handleSeachList"
            >
              <el-option label="是" value="true" />
              <el-option label="否" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品类型：">
            <el-select
              v-model="tableFrom.productType"
              clearable
              size="small"
              placeholder="请选择"
              class="selWidth"
              @change="handleSeachList"
            >
              <el-option
                v-for="(item, index) in productTypeList"
                :label="item.label"
                :value="item.value"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSeachList">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <div class="clearfix" ref="headerBox" v-if="checkPermi(['merchant:product:page:list'])">
        <el-tabs class="list-tabs mb5" v-model="tableFrom.type" @tab-click="handleSeachList">
          <el-tab-pane
            :label="item.name + '(' + item.count + ')'"
            :name="item.type.toString()"
            v-for="(item, index) in headeNum"
            :key="index"
          />
        </el-tabs>
      </div>
      <el-button size="small" type="primary" v-hasPermi="['merchant:product:save']" @click="handleAdd('isAdd')"
        >添加商品</el-button
      >
      <el-button
        class="mr14"
        @click="handleAdd('isCopy')"
        size="small"
        type="success"
        v-hasPermi="['merchant:product:import:product']"
        >商品采集</el-button
      >
      <el-dropdown size="small">
        <el-button :class="checkedIds.length > 0 ? '' : 'active'" :disabled="checkedIds.length > 0 ? false : true">
          批量设置<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <template v-if="checkedIds.length > 0 ? true : false">
            <el-dropdown-item
              v-if="
                tableFrom.type == ProductTypeEnum.InTheWarehouse &&
                checkPermi(['merchant:product:batch:set:freight:template'])
              "
              @click.native="handleSetFreight()"
              >设置运费</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                tableFrom.type == ProductTypeEnum.InTheWarehouse && checkPermi(['merchant:product:batch:set:brokerage'])
              "
              @click.native="handleSetCommission()"
              >设置佣金</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                checkPermi(['merchant:product:batch:down']) &&
                (tableFrom.type == ProductTypeEnum.OnSale || SoldOutAndAlertInventory)
              "
              @click.native="batchDelisting('down')"
              >批量下架</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                checkPermi(['merchant:product:batch:up']) &&
                (tableFrom.type == ProductTypeEnum.InTheWarehouse || SoldOutAndAlertInventory)
              "
              @click.native="batchDelisting('up')"
              >批量上架</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermi(['merchant:product:batch:restore']) && tableFrom.type == ProductTypeEnum.RecycleBin"
              @click.native="handleRestore()"
              >批量恢复</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermi(['merchant:product:batch:delete']) && tableFrom.type == ProductTypeEnum.RecycleBin"
              @click.native="handleRecycleBin(tableFrom.type)"
              >批量删除</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                tableFrom.type === ProductTypeEnum.PendingReview && checkPermi(['merchant:product:batch:submit:audit'])
              "
              @click.native="handlePendingReview()"
              >提交审核</el-dropdown-item
            >
            <el-dropdown-item
              v-if="
                tableFrom.type == ProductTypeEnum.InTheWarehouse &&
                checkPermi(['merchant:product:batch:add:feedback:coupons'])
              "
              @click.native="handleAddCoupon()"
              >添加回馈券</el-dropdown-item
            >
            <el-dropdown-item
              v-if="checkPermi(['merchant:product:batch:recycle']) && RecycleBin"
              @click.native="handleRecycleBin(tableFrom.type)"
              >加入回收站</el-dropdown-item
            >
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        class="mt20"
        :highlight-current-row="true"
        highlight-current-row
        @selection-change="handleSelectionChange"
        @select-all="selectAll"
        @select="selectOne"
      >
        <el-table-column type="expand" width="40">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="收藏：">
                <span>{{ props.row.collectCount }}</span>
              </el-form-item>
              <el-form-item label="初始销量：">
                <span>{{ props.row.ficti }}</span>
              </el-form-item>
              <el-form-item label="拒绝原因：" v-if="tableFrom.type == 7">
                <span>{{ props.row.reason }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" min-width="50" v-if="checkedCities.includes('ID')" />
        <el-table-column label="商品图" min-width="80" v-if="checkedCities.includes('商品图')">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="200"
          v-if="checkedCities.includes('商品名称')"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div>
              <span class="tags_name" :class="'name' + scope.row.specType">{{
                scope.row.specType ? '[多规格]' : '[单规格]'
              }}</span
              >{{ scope.row.name || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="商品售价" min-width="90" v-if="checkedCities.includes('商品售价')" />
        <el-table-column prop="sales" label="销量" min-width="90" v-if="checkedCities.includes('销量')" />
        <el-table-column prop="stock" label="库存" min-width="90" v-if="checkedCities.includes('库存')" />
        <el-table-column label="失败原因" min-width="150" v-if="tableFrom.type === '7'" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span class="textE93323">{{ scope.row.reason }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="80" fixed="right" v-if="checkedCities.includes('状态')">
          <template slot-scope="scope">
            <el-switch
              v-if="checkPermi(['merchant:product:up', 'merchant:product:down'])"
              :disabled="IsShow"
              v-model="scope.row.isShow"
              :active-value="true"
              :inactive-value="false"
              active-text="上架"
              inactive-text="下架"
              @change="onchangeIsShow(scope.row)"
            />
            <div v-else>{{ scope.row.isShow ? '上架' : '下架' }}</div>
          </template>
        </el-table-column>
        <el-table-column width="190" fixed="right">
          <template slot="header">
            <p>
              <span style="padding-right: 5px">操作</span>
              <i class="el-icon-setting" @click="handleAddItem"></i>
            </p>
          </template>
          <template slot-scope="scope">
            <!--id:商品id，isDisabled：是否能编辑(1不能，2能)，isCopy：是否是采集商品(1是，2不是)-->
            <template
              v-if="
                tableFrom.type !== ProductTypeEnum.InTheWarehouse &&
                tableFrom.type !== ProductTypeEnum.AlertInventory &&
                tableFrom.type !== ProductTypeEnum.PendingReview &&
                checkPermi(['merchant:product:info'])
              "
            >
              <router-link :to="{ path: `/product/list/creatProduct/${scope.row.id}/1/2/${scope.row.type}` }">
                详情
              </router-link>
            </template>
            <template
              v-if="checkPermi(['merchant:product:submit:audit']) && tableFrom.type === ProductTypeEnum.PendingReview"
            >
              <a @click="handlePendingReview(scope.row)">提交审核</a>
            </template>
            <template
              v-if="tableFrom.type !== '5' && tableFrom.type !== '6' && checkPermi(['merchant:product:update'])"
            >
              <el-divider v-if="tableFrom.type !== '2' && tableFrom.type !== '4'" direction="vertical"></el-divider>
              <a @click="onEdit(scope.row)">编辑</a>
            </template>
            <template v-if="tableFrom.type === '5' && checkPermi(['merchant:product:restor'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleRestore(scope.row, scope.$index)">恢复商品</a>
            </template>
            <template
              v-if="
                (tableFrom.type === ProductTypeEnum.OnSale ||
                  (tableFrom.type === ProductTypeEnum.AlertInventory && scope.row.isShow) ||
                  (tableFrom.type === ProductTypeEnum.SoldOut && scope.row.isShow)) &&
                checkPermi(['merchant:product:quick:stock:add'])
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleEdit(scope.row, true)">编辑库存</a>
            </template>
            <template
              v-if="
                (tableFrom.type === ProductTypeEnum.InTheWarehouse ||
                  (tableFrom.type === ProductTypeEnum.SoldOut && !scope.row.isShow) ||
                  (tableFrom.type === ProductTypeEnum.AlertInventory && !scope.row.isShow)) &&
                checkPermi(['merchant:product:review:free:edit'])
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleEdit(scope.row, false)">免审编辑</a>
            </template>
            <template
              v-if="
                (tableFrom.type === ProductTypeEnum.Audit ||
                  tableFrom.type === ProductTypeEnum.ReviewFailed ||
                  tableFrom.type === ProductTypeEnum.RecycleBin) &&
                checkPermi(['merchant:product:delete'])
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleDelete(scope.row.id, tableFrom.type)">{{
                tableFrom.type === '5' ? '删除' : '加入回收站'
              }}</a>
            </template>
            <!-- 待提审-->
            <template v-if="tableFrom.type === ProductTypeEnum.PendingReview">
              <el-divider direction="vertical"></el-divider>
              <el-dropdown size="small" trigger="click">
                <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="infoItem"
                    @click.native="handleInfo(scope.row.id, scope.row.type)"
                    v-if="checkPermi(['merchant:product:info'])"
                    >详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkPermi(['merchant:product:delete'])"
                    @click.native="handleDelete(scope.row.id, tableFrom.type)"
                    >{{ tableFrom.type === '5' ? '删除' : '加入回收站' }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>

            <template
              v-if="
                tableFrom.type === ProductTypeEnum.InTheWarehouse ||
                tableFrom.type === ProductTypeEnum.AlertInventory ||
                (operation && !scope.row.isShow)
              "
            >
              <el-divider direction="vertical"></el-divider>
              <el-dropdown size="small" trigger="click">
                <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="infoItem"
                    @click.native="handleInfo(scope.row.id, scope.row.type)"
                    v-if="(tableFrom.type === '2' || tableFrom.type === '4') && checkPermi(['merchant:product:info'])"
                    >详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="handleSetFreight(scope.row)"
                    v-if="
                      checkPermi(['merchant:product:set:freight:template']) &&
                      scope.row.type !== 5 &&
                      scope.row.type !== 6
                    "
                    >设置运费</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="checkPermi(['merchant:product:set:brokerage'])"
                    @click.native="handleSetCommission(scope.row)"
                    >设置佣金</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="checkPermi(['merchant:product:add:feedback:coupons'])"
                    @click.native="handleAddCoupon(scope.row)"
                    >添加回馈券</el-dropdown-item
                  >

                  <el-dropdown-item
                    v-if="checkPermi(['merchant:product:delete'])"
                    @click.native="handleDelete(scope.row.id, tableFrom.type)"
                    >{{ tableFrom.type === '5' ? '删除' : '加入回收站' }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
      <div class="card_abs" v-show="card_select_show">
        <template>
          <div class="cell_ht">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <el-button type="text" @click="checkSave()">保存</el-button>
          </div>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in columnData" :label="item" :key="item" class="check_cell">{{
              item
            }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </div>
    </el-card>

    <!--编辑库存-->
    <el-drawer
      :title="!stockEdit ? '免审编辑' : '编辑库存'"
      :visible.sync="drawer"
      :direction="direction"
      :size="1500"
      class="showHeader"
      :before-close="handleCloseEdit"
    >
      <store-edit
        :productId="productId"
        v-if="drawer && productId"
        :productType="productType"
        @subSuccess="subSuccess"
        :stockEdit="stockEdit"
        :isSub="isSub"
      ></store-edit>
    </el-drawer>

    <!-- 设置运费模板-->
    <el-dialog
      :visible.sync="dialogVisible"
      title="设置运费"
      destroy-on-close
      :close-on-click-modal="false"
      width="600px"
      class="dialog-top"
    >
      <el-form
        ref="formValidate"
        class="formValidate"
        :rules="ruleValidate"
        :model="formValidate"
        label-width="75px"
        @submit.native.prevent
      >
        <el-form-item label="运费模板：" prop="tempId">
          <el-select v-model="formValidate.tempId" placeholder="请选择" class="mr20" style="width: 100%">
            <el-option v-for="item in shippingTemplates" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="dialog-footer-inner">
            <el-button class="btns" size="small" @click="handleClose">取消</el-button>
            <el-button
              type="primary"
              class="submission"
              @click="handleSubmit('formValidate')"
              :loading="loadingBtn"
              v-if="checkPermi(['merchant:product:update'])"
              >确定</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--批量设置佣金弹窗-->
    <el-dialog v-if="dialogCommision" title="设置佣金" :visible.sync="dialogCommision" width="600px">
      <el-form ref="commisionForm" :model="commisionForm" :rules="commisionRule" @submit.native.prevent>
        <el-form-item label="一级佣金比例：" prop="extension_one">
          <el-input-number
            v-model="commisionForm.brokerage"
            :step="1"
            step-strictly
            :min="0"
            :max="100"
            class="priceBox"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="二级佣金比例：" prop="extension_two">
          <el-input-number
            v-model="commisionForm.brokerageTwo"
            :step="1"
            :min="0"
            step-strictly
            :max="100"
            class="priceBox"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item>
          <span>备注：订单交易成功后给推广员返佣的比例，例:一级佣金比例设置5，则返订单金额的5%</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCommision = false">取消</el-button>
        <el-button type="primary" @click="submitCommisionForm('commisionForm')">提交</el-button>
      </span>
    </el-dialog>

    <!-- 选择商品类型弹窗-->
    <product-tpye ref="productTpye" :addType="addType"></product-tpye>
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
  productLstApi,
  productDeleteApi,
  putOnShellApi,
  offShellApi,
  productHeadersApi,
  restoreApi,
  productExcelApi,
  productAuditApi,
  productBatchDownApi,
  productBatchUpApi,
  productSetFreightApi,
  productBatchFreightApi,
  productBrokerageApi,
  productBatchBrokerageApi,
  productBatchAddCouponsApi,
  productAddCouponsApi,
  productBatchDeleteApi,
  productBatchRecycleApi,
  productBatchRestoreApi,
  productBatchAuditApi,
} from '@/api/product';
import { getToken } from '@/utils/auth';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { mapGetters } from 'vuex';
import storeEdit from './components/storeEdit';
import productTpye from './components/productTpye.vue';
import { ProductTypeEnum } from '@/enums/productEnums';
import * as $constants from '@/utils/constants';
import { useProduct } from '@/hooks/use-product';
import { handleDeleteTable } from '@/libs/public';
const { productTypeList } = useProduct();
const objTitle = ['出售中', '仓库中', '已售罄', '警戒库存', '回收站', '待审核', '审核失败', '待提审'];
const tableFroms = {
  page: 1,
  limit: $constants.page.limit[0],
  cateId: '',
  keywords: '',
  type: '1',
  categoryId: null,
  isPaidMember: null,
  productType: null,
};
export default {
  name: 'ProductList',
  directives: {
    // 计算是否滚动到最下面
    selectLoadMore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          if (this.scrollHeight - this.scrollTop < this.clientHeight + 1) {
            binding.value();
          }
        });
      },
    },
  },
  components: { storeEdit, productTpye },
  data() {
    return {
      productTypeList: productTypeList, //商品类型
      drawer: false,
      direction: 'rtl',
      propsPlant: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: false,
        emitPath: false,
      },
      propsMer: {
        children: 'childList',
        label: 'name',
        value: 'id',
        multiple: false,
        emitPath: false,
        checkStrictly: true,
      },
      headeNum: [],
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      tableFrom: Object.assign({}, tableFroms),
      keywords: '',
      categoryList: [],
      objectUrl: process.env.VUE_APP_BASE_API,
      card_select_show: false,
      checkAll: false,
      checkedCities: ['ID', '商品图', '商品名称', '商品售价', '销量', '库存', '状态'],
      columnData: ['ID', '商品图', '商品名称', '商品售价', '销量', '库存', '状态'],
      isIndeterminate: true,
      productId: 0,
      stockEdit: false,
      multipleSelectionAll: [],
      checkedIds: [], //选中的id
      ruleValidate: {
        tempId: [{ required: true, message: '请选择运费模板', trigger: 'change' }],
      },
      formValidate: {
        tempId: '',
      },
      loadingBtn: false,
      dialogVisible: false,
      dialogCommision: false, //佣金弹窗
      commisionForm: { brokerage: 0, brokerageTwo: 0, id: 0, idList: [] }, //设置佣金表单
      commisionRule: {
        brokerage: [{ required: true, message: '请输入一级佣金', trigger: 'change' }],
        brokerageTwo: [{ required: true, message: '请输入二级佣金', trigger: 'change' }],
      },
      keyNum: 0,
      couponIds: [], //优惠券集合
      productInfo: null, //商品详情
      productType: 0, //商品类型
      isSub: false, //佣金设置是否单独设置
      addType: 'isAdd',
    };
  },
  computed: {
    ProductTypeEnum() {
      return ProductTypeEnum;
    },
    //操作上下架禁用
    IsShow() {
      return (
        this.tableFrom.type == ProductTypeEnum.RecycleBin ||
        this.tableFrom.type == ProductTypeEnum.Audit ||
        this.tableFrom.type == ProductTypeEnum.ReviewFailed ||
        this.tableFrom.type == ProductTypeEnum.PendingReview
      );
    },
    //已售罄或者警戒库存
    SoldOutAndAlertInventory() {
      return (
        this.tableFrom.type == this.ProductTypeEnum.SoldOut ||
        this.tableFrom.type == this.ProductTypeEnum.AlertInventory
      );
    },
    //已售罄、警戒库存操作判断
    operation() {
      return (
        this.tableFrom.type == this.ProductTypeEnum.SoldOut ||
        this.tableFrom.type == this.ProductTypeEnum.AlertInventory
      );
    },
    //加入回收站 操作
    RecycleBin() {
      return (
        this.tableFrom.type == this.ProductTypeEnum.Audit ||
        this.tableFrom.type == this.ProductTypeEnum.ReviewFailed ||
        this.tableFrom.type === ProductTypeEnum.InTheWarehouse ||
        this.tableFrom.type === ProductTypeEnum.PendingReview
      );
    },
    ...mapGetters(['merPlatProductClassify', 'merProductClassify', 'productBrand', 'shippingTemplates']),
  },
  activated() {
    this.goodHeade();
    this.getList(1);
  },
  mounted() {
    if (checkPermi(['merchant:product:tabs:headers'])) this.goodHeade();
    if (checkPermi(['merchant:product:page:list'])) this.getList();
    if (!localStorage.getItem('shippingTemplates')) this.$store.dispatch('product/getShippingTemplates');
    this.checkedCities = this.$cache.local.has('goods_stroge')
      ? this.$cache.local.getJSON('goods_stroge')
      : this.checkedCities;
    //this.$store.dispatch('product/getAdminProductClassify');
    this.$store.dispatch('product/getAdminProductClassify');
    if (!localStorage.getItem('merProductClassify')) this.$store.dispatch('product/getMerProductClassify');
    this.$store.dispatch('product/getMerProductBrand');
  },
  methods: {
    checkPermi,
    //提交审核
    handlePendingReview(row) {
      if (!row && this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      if (!row) {
        this.$modalSure(`确定要将此商品提交平台审核吗？`).then(() => {
          productBatchAuditApi({
            idList: this.checkedIds,
          }).then(() => {
            this.$message.success('批量提交审核成功');
            this.getList('');
            this.goodHeade();
          });
        });
      } else {
        this.$confirm('提审之后是否自动上架？', '提示', {
          confirmButtonText: '上架',
          cancelButtonText: '不用了',
          type: 'warning',
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          customClass: 'deleteConfirm',
        })
          .then(() => {
            this.productAudit({ id: row.id, isAutoUp: true });
          })
          .catch((action) => {
            if (action === 'cancel') {
              this.productAudit({ id: row.id, isAutoUp: false });
              // 调用取消按钮的方法
            } else if (action === 'close') {
              console.log('Closed');
              // 调用关闭按钮的方法
            }
          });
      }
    },
    //提审提交
    productAudit(data) {
      productAuditApi(data).then((res) => {
        this.goodHeade();
        this.getList();
      });
    },
    //批量加入回收站
    handleRecycleBin(type) {
      if (this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      this.$modalSure(type == 5 ? `确定批量删除商品吗？` : `确定批量加入回收站吗？`).then(() => {
        if (type == 5) {
          this.onBatchDelete();
        } else {
          this.onBatchRecycle();
        }
      });
    },
    //批量删除
    onBatchDelete() {
      productBatchDeleteApi({
        idList: this.checkedIds,
      }).then(() => {
        this.$message.success('批量删除成功');
        this.tableFrom.page = this.tableFrom.page - 1;
        this.delSuccess();
      });
    },
    //批量加入回收站
    onBatchRecycle() {
      productBatchRecycleApi({
        idList: this.checkedIds,
      }).then(() => {
        this.$message.success('批量加入回收站成功');
        this.tableFrom.page = this.tableFrom.page - 1;
        this.delSuccess();
      });
    },
    // 删除成功
    delSuccess() {
      handleDeleteTable(this.tableData.data.length, this.tableFrom);
      this.getList();
      this.goodHeade();
    },
    //添加回馈券
    handleAddCoupon(row) {
      this.productInfo = row;
      if (!row && this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      const _this = this;
      this.$modalCoupon(
        'wu',
        (_this.keyNum += 1),
        [],
        function (row) {
          row.map((item) => {
            _this.couponIds.push(item.id);
          });
          _this.onSetCoupons(_this.couponIds);
        },
        '',
      );
    },
    //设置优惠券提交
    onSetCoupons(couponIds) {
      if (this.productInfo) {
        productAddCouponsApi({ id: this.productInfo.id, couponIds: couponIds }).then(() => {
          this.$message.success('添加回馈券成功');
        });
      } else {
        productBatchAddCouponsApi({ idList: this.checkedIds, couponIds: couponIds }).then(() => {
          this.$message.success('批量添加回馈券成功');
        });
      }
    },
    // 设置运费
    async handleSetFreight(row) {
      this.productInfo = row;
      if (!row && this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      this.dialogVisible = true;
      if (row) this.formValidate.tempId = row.tempId;
    },
    //设置运费提交
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          if (this.productInfo) {
            productSetFreightApi({ id: this.productInfo.id, templateId: this.formValidate.tempId })
              .then(() => {
                this.loadingBtn = false;
                this.$message.success('设置运费模板成功');
                this.dialogVisible = false;
              })
              .catch(() => {
                this.loadingBtn = false;
              });
          } else {
            productBatchFreightApi({ idList: this.checkedIds, templateId: this.formValidate.tempId })
              .then(() => {
                this.loadingBtn = false;
                this.$message.success('批量设置运费模板成功');
                this.dialogVisible = false;
              })
              .catch(() => {
                this.loadingBtn = false;
              });
          }
        }
      });
    },
    //取消运费
    handleClose() {
      this.dialogVisible = false;
      this.formValidate.tempId = '';
    },
    //设置佣金
    handleSetCommission(row) {
      this.productInfo = row;
      if (!row && this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      this.dialogCommision = true;
    },
    //设置佣金提交
    submitCommisionForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.productInfo) {
            this.commisionForm.id = this.productInfo.id;
            productBrokerageApi(this.commisionForm).then(() => {
              this.$message.success('设置佣金成功');
              this.dialogCommision = false;
            });
          } else {
            this.commisionForm.idList = this.checkedIds;
            productBatchBrokerageApi(this.commisionForm).then(() => {
              this.$message.success('批量设置佣金成功');
              this.dialogCommision = false;
            });
          }
        } else {
          return;
        }
      });
    },
    //添加商品
    handleAdd(type) {
      this.addType = type;
      this.$refs.productTpye.proTypedialogVisible = true;
    },
    //批量下架
    batchDelisting(type) {
      if (this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      if (type === 'down') {
        this.$modalSure('确定要将选中商品批量下架吗?').then(() => {
          productBatchDownApi({ idList: this.checkedIds }).then(() => {
            this.$message.success('批量下架成功');
            this.getList(1);
            this.goodHeade();
          });
        });
      } else {
        this.$modalSure('确定要将选中商品批量上架吗?').then(() => {
          productBatchUpApi({ idList: this.checkedIds }).then(() => {
            this.$message.success('批量上架成功');
            this.getList(1);
            this.goodHeade();
          });
        });
      }
    },
    // 设置选中的方法
    handleSelectionChange(val) {
      this.multipleSelectionAll = val;
      const data = [];
      this.multipleSelectionAll.map((item) => {
        data.push(item.id);
      });
      this.checkedIds = data;
    },
    selectAll(data) {
      let id = data.map((i, index) => {
        return i.id;
      });
      this.checkedIds = Array.from(new Set([...this.checkedIds, ...id]));
    },
    selectOne(data, row) {
      let id = data.map((i, index) => {
        return i.id;
      });
      let index = this.checkedIds.findIndex((e) => {
        return e == row.id;
      });
      this.checkedIds.splice(index, 1);
      this.checkedIds = Array.from(new Set([...this.checkedIds, ...id]));
    },
    //编辑商品
    onEdit(row) {
      //id:商品id，isDisabled：是否能编辑(1不能，2能)，isCopy：是否是采集商品(1是，2不是)
      if (this.tableFrom.type === '1') {
        this.$modalSure('下架该商品吗？出售商品需下架之后可编辑。').then(() => {
          offShellApi(row.id).then(() => {
            this.$router.push({ path: `/product/list/creatProduct/${row.id}/2/2/${row.type}` });
          });
        });
      } else {
        this.$router.push({ path: `/product/list/creatProduct/${row.id}/2/2/${row.type}` });
      }
    },
    //编辑库存成功回调
    subSuccess() {
      this.drawer = false;
      this.handleSeachList();
    },
    handleEdit(row, stockEdit) {
      this.productId = row.id;
      this.productType = row.type;
      this.isSub = row.isSub;
      this.drawer = true;
      this.stockEdit = stockEdit;
    },
    handleCloseEdit() {
      this.drawer = false;
    },
    handleAudit(id) {
      // this.$modalSure('提审商品吗').then(() => {
      //   productAuditApi(id).then((res) => {
      //     this.goodHeade();
      //     this.getList();
      //   });
      // });
      this.$confirm('提审之后是否自动上架？', '提示', {
        confirmButtonText: '上架',
        cancelButtonText: '不用了',
        type: 'warning',
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          this.productAudit({ id: id, isAutoUp: true });
        })
        .catch(() => {
          this.productAudit({ id: id, isAutoUp: false });
        });
    },
    //恢复商品
    handleRestore(row) {
      if (!row && this.checkedIds.length === 0) return this.$message.warning('请至少选择一个商品');
      this.$modalSure(!row ? '确定批量恢复商品吗？' : '确定恢复商品吗？').then(() => {
        if (row) {
          restoreApi(row.id).then((res) => {
            this.$message.success('恢复商品成功');
            this.goodHeade();
            this.getList(1);
          });
        } else {
          productBatchRestoreApi({ idList: this.checkedIds }).then((res) => {
            this.$message.success('批量恢复商品成功');
            this.goodHeade();
            this.getList(1);
          });
        }
      });
    },
    handleSeachList() {
      this.getList(1);
      this.goodHeade();
    },
    //重置
    handleReset() {
      this.tableFrom.cateId = '';
      this.tableFrom.keywords = '';
      this.tableFrom.categoryId = '';
      this.tableFrom.isPaidMember = null;
      this.tableFrom.productType = null;
      this.keywords = '';
      this.handleSeachList();
    },
    // 导出
    exports() {
      productExcelApi({
        cateId: this.tableFrom.cateId,
        keywords: this.tableFrom.keywords,
        type: this.tableFrom.type,
      }).then((res) => {
        window.location.href = res.fileName;
      });
    },
    // 获取商品表单头数量
    goodHeade() {
      let data = Object.assign({}, this.tableFrom);
      delete data.page;
      delete data.limit;
      delete data.type;
      productHeadersApi(data)
        .then((res) => {
          res.map((item) => {
            item.name = objTitle[Number(item.type) - 1];
          });
          this.headeNum = res;
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
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
    // 列表
    getList(num) {
      this.listLoading = true;
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.keywords = encodeURIComponent(this.keywords);
      productLstApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    //详情
    handleInfo(id, type) {
      this.$router.push({ path: `/product/list/creatProduct/${id}/2/2/${type}` });
    },
    // 删除
    handleDelete(id, type) {
      this.$modalSure(type == 5 ? `删除 id 为 ${id} 的商品` : `id为${id}的商品加入回收站吗`).then(() => {
        const deleteFlag = type == 5 ? 'delete' : 'recycle';
        productDeleteApi({
          id: id,
          type: deleteFlag,
        }).then(() => {
          this.$message.success('删除成功');
          this.delSuccess();
        });
      });
    },
    onchangeIsShow(row) {
      row.isShow
        ? putOnShellApi(row.id)
            .then(() => {
              this.$message.success('上架成功');
              this.getList(1);
              this.goodHeade();
            })
            .catch(() => {
              row.isShow = !row.isShow;
            })
        : offShellApi(row.id)
            .then(() => {
              this.$message.success('下架成功');
              this.getList(1);
              this.goodHeade();
            })
            .catch(() => {
              row.isShow = !row.isShow;
            });
    },
    handleAddItem() {
      if (this.card_select_show) {
        this.$set(this, 'card_select_show', false);
      } else if (!this.card_select_show) {
        this.$set(this, 'card_select_show', true);
      }
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.columnData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnData.length;
    },
    checkSave() {
      this.$set(this, 'card_select_show', false);
      this.$modal.loading('正在保存到本地，请稍候...');
      this.$cache.local.setJSON('goods_stroge', this.checkedCities);
      setTimeout(this.$modal.closeLoading(), 1000);
    },
  },
};
</script>

<style scoped lang="scss">
.tags_name {
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  padding: 0 2px;
  margin-right: 2px;
  &.namefalse {
    color: var(--prev-color-primary);
  }
  &.nametrue {
    color: #ff8a4d;
  }
}
::v-deep .el-table__cell:nth-child(2) .cell {
  padding-left: 14px;
  padding-right: 14px;
}
.infoItem {
  ::v-deep a {
    color: #606266 !important;
  }
}
.el-table__body {
  width: 100%;
  table-layout: fixed !important;
}
.taoBaoModal {
  //  z-index: 3333 !important;
}
.demo-table-expand {
  ::v-deep label {
    width: 82px;
  }
}
.demo-table-expand {
  ::v-deep .el-form-item__content {
    width: 77%;
  }
}
.seachTiele {
  line-height: 30px;
}
.relative {
  position: relative;
}
.card_abs {
  position: absolute;
  padding-bottom: 15px;
  top: 260px;
  right: 40px;
  width: 200px;
  background: #fff;
  z-index: 99999;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
}
.cell_ht {
  height: 50px;
  padding: 15px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check_cell {
  width: 100%;
  padding: 15px 20px 0;
}
.mt-1 {
  margin-top: 6px;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
::v-deep .el-drawer__header {
  font-size: 20px;
}
::v-deep .el-drawer__close-btn {
  font-size: 20px;
}
::v-deep .el-dialog__footer {
  padding: 0 24px 20px !important;
}
</style>
