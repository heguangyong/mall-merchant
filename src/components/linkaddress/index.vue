<template>
  <div>
    <el-dialog
      :destroy-on-close="true"
      lock-scroll
      show-close
      title="选择链接"
      :close-on-click-modal="false"
      :data="categoryData"
      @close="dialogVisible = false"
      @open="onOpen()"
      width="860"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <div class="table_box">
        <div class="left_box">
          <el-tree
            :data="categoryData"
            :props="defaultProps"
            :default-expanded-keys="[1, 2, 3, 4]"
            :current-node-key="5"
            :highlight-current="true"
            node-key="id"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div class="right_box" v-if="currenType == 'link'">
          <div v-if="basicsList.length">
            <div class="cont">店铺页面</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id && currenUrl == item.url ? 'on' : ''"
                v-for="(item, index) in basicsList"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="userList.length">
            <div class="cont">个人中心</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in userList"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="distributionList.length">
            <div class="cont">分销</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in distributionList"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="right_box" v-if="currenType == 'marketing_link'">
          <div v-if="coupon.length">
            <div class="cont">优惠券</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in coupon"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="integral.length">
            <div class="cont">积分</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in integral"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-if="group.length">
            <div class="cont">拼团</div>
            <div class="Box">
              <div
                class="cont_box"
                :class="currenId == item.id ? 'on' : ''"
                v-for="(item, index) in group"
                :key="index"
                @click="getUrl(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="right_box"
          v-if="
            currenType === 'special' ||
            currenType === 'product_category' ||
            currenType === 'product' ||
            currenType === 'seckill' ||
            currenType === 'bargain' ||
            currenType === 'combination' ||
            currenType === 'news' ||
            currenType === 'micro' ||
            currenType === 'integral'
          "
        >
          <el-form ref="formValidate" :model="formValidate" class="tabform" v-if="currenType == 'product'">
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <el-input
                    placeholder="请输入商品名称,关键字"
                    v-model.trim="formValidate.keywords"
                    style="width: 260px; margin-right: 20px"
                  />
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            row-key="id"
            ref="table"
            size="small"
            v-loading="lodingList"
            :data="tableList.list"
            @row-click="singleElection"
            :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
            :max-height="
              currenType == 'product_category'
                ? '410'
                : currenType === 'product' ||
                  currenType === 'seckill' ||
                  currenType === 'bargain' ||
                  currenType === 'combination' ||
                  currenType === 'news' ||
                  currenType === 'micro' ||
                  currenType === 'integral'
                ? '400'
                : ''
            "
          >
            <el-table-column label="" width="30">
              <template slot-scope="scope">
                <el-radio class="radio" v-model="radioData" :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column v-if="currenType !== 'micro'" label="图片" width="80">
              <template slot-scope="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  lazy
                  :src="scope.row.imageInput"
                  fit="fill"
                  v-if="currenType == 'news'"
                ></el-image>
                <el-image
                  style="width: 50px; height: 50px"
                  lazy
                  :src="scope.row.extra"
                  fit="fill"
                  v-else-if="currenType == 'product_category'"
                ></el-image>
                <el-image style="width: 50px; height: 50px" lazy :src="scope.row.image" fit="fill" v-else></el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              :label="currenType === 'product' ? '商品名称' : '标题名称'"
              :show-overflow-tooltip="true"
              max-width="250"
              v-if="currenType === 'product' || currenType === 'micro'"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="分类名称"
              :show-overflow-tooltip="true"
              max-width="250"
              v-else-if="currenType == 'product_category'"
            ></el-table-column>
            <el-table-column
              prop="title"
              :label="currenType == 'news' ? '文章名称' : '商品名称'"
              :show-overflow-tooltip="true"
              max-width="250"
              v-else
            ></el-table-column>
          </el-table>
          <el-pagination
            class="mt20"
            :current-page="params.page"
            :page-sizes="[10, 20, 30, 40]"
            :layout="constants.page.layout"
            :total="tableList.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-if="currenType !== 'product_category'"
          />
        </div>
        <div class="right_box" v-if="currenType == 'custom'">
          <div style="width: 440px; margin: 50px 0 0 0">
            <el-form ref="customDate" :model="customDate" label-width="100px">
              <el-form-item label="跳转路径：" prop="url">
                <el-input v-model.trim="customDate.url" placeholder="请输入跳转路径" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()">确定</el-button>
      </div>
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
import { productLstApi } from '@/api/product';
import { pagediyListApi } from '@/api/devise';
import listData from './list.json';
import { linkData } from './linkData';
import Cookies from 'js-cookie';
//import marketing from './marketing.json';

export default {
  name: 'linkaddress',
  data() {
    return {
      group: [],
      linkData: linkData,
      constants: this.$constants,
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      basicsList: [],
      userList: [],
      distributionList: [],
      coupon: [],
      integral: [],
      lodingList: false,
      currenType: 'link',
      currenId: '',
      currenUrl: '',
      currenName: '',
      formValidate: {
        page: 1,
        limit: 10,
        keywords: '',
        type: 1,
      },
      customDate: {
        url: '',
      },
      radioData: '',
      linkId: 0,
      tableList: {},
      params: {
        page: 1,
        limit: 10,
        keywords: '',
        type: 1,
        name: '',
      },
      columns: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '页面名称', key: 'name', width: 150 },
        { title: '页面链接', key: 'url' },
      ],
      columns7: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '分类名称', key: 'cate_name', tree: true },
        { title: '分类图标', slot: 'pic' },
      ],
      columns8: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '商品图片', slot: 'image', width: 90 },
        { title: '商品名称', key: 'store_name' },
      ],
      bargain: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '商品图片', slot: 'image', width: 90 },
        { title: '商品名称', key: 'title' },
      ],
      news: [
        { title: 'ID', key: 'id', width: 60 },
        { title: '文章图片', slot: 'image_input', width: 90 },
        { title: '文章名称', key: 'title' },
      ],
      merchantId: 0, //商户id
    };
  },
  props: {
    //使用组件的页面
    fromType: {
      type: String,
      default: '',
    },
    // 是否是热区组件
    isHotSpot: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    categoryData() {
      if(this.fromType === 'printreceipt'){
        return [...listData.data].slice(0, -1);
      }else{
        return [...listData.data];
      }

    },
  },
  mounted() {
    this.merchantId = Cookies.get('JavaMerchantId');
  },
  methods: {
    //关闭弹窗
    onOpen() {
      this.currenId = '';
      this.mockData('link');
    },
    handleSearch() {
      this.params = this.formValidate;
      this.mockData('product');
    },
    handleNodeClick(data) {
      this.params.page = 1;
      this.tableList.list = [];
      this.linkId = null;
      this.radioData = null;
      this.$set(this, 'currenType', data.type);
      this.mockData(data.type);
    },
    mockData(type) {
      let data = [];
      if (type == 'link') {
        this.basicsList = this.fromType === 'printreceipt' ? this.linkData.merchantList :this.linkData.list;
      } else if (type == 'product') {
        this.lodingList = true;
        productLstApi(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      } else if (type == 'micro') {
        this.lodingList = true;
        pagediyListApi(this.params).then((res) => {
          this.tableList = res;
          this.lodingList = false;
        });
      }
    },
    getUrl(item) {
      this.currenId = item.id;
      this.currenUrl = item.url;
      this.currenName = item.name;
    },
    singleElection(row) {
      this.linkId = row.id;
    },
    handleSubmit(name) {
      switch (this.currenType) {
        case 'product':
          if (this.isHotSpot) {
            this.$emit('linkUrl', `/pages/goods/goods_details/index?id=${this.linkId}&mt=0`, '商品详情');
          } else {
            this.$emit('linkUrl', `/pages/goods/goods_details/index?id=${this.linkId}&mt=0`);
          }
          break;
        case 'seckill':
          if (this.isHotSpot) {
            this.$emit('linkUrl', `/pages/goods/goods_details/index?id=${this.linkId}&mt=1`, '秒杀商品');
          } else {
            this.$emit('linkUrl', `/pages/goods/goods_details/index?id=${this.linkId}&mt=1`);
          }
          break;
        case 'bargain':
          if (this.isHotSpot) {
            this.$emit(
              'linkUrl',
              '/pages/activity/goods_bargain_details/index?id=' + this.linkId + '&mt=2',
              '砍价商品',
            );
          } else {
            this.$emit('linkUrl', '/pages/activity/goods_bargain_details/index?id=' + this.linkId + '&mt=2');
          }
          break;
        case 'combination':
          if (this.isHotSpot) {
            this.$emit('linkUrl', '/pages/activity/goods_combination_details/index?id=' + this.linkId, '拼团商品');
          } else {
            this.$emit('linkUrl', '/pages/activity/goods_combination_details/index?id=' + this.linkId);
          }
          break;
        case 'news':
          if (this.isHotSpot) {
            this.$emit('linkUrl', '/pages/goods/news_details/index?id=' + this.linkId, '文章详情');
          } else {
            this.$emit('linkUrl', '/pages/goods/news_details/index?id=' + this.linkId);
          }
          break;
        case 'product_category':
          if (this.isHotSpot) {
            this.$emit('linkUrl', '/pages/goods/goods_cate/index', '商品分类');
          } else {
            this.$emit('linkUrl', '/pages/goods/goods_cate/index');
          }
          break;
        case 'custom':
          if (this.isHotSpot) {
            this.$emit('linkUrl', this.customDate.url, '自定义链接');
          } else {
            this.$emit('linkUrl', this.customDate.url);
          }
          break;
        case 'micro':
          if (this.isHotSpot) {
            this.$emit(
              'linkUrl',
              `/pages/activity/small_page/index?id=${this.linkId}&&merId=${this.merchantId}`,
              '微页面',
            );
          } else {
            this.$emit('linkUrl', `/pages/activity/small_page/index?id=${this.linkId}&&merId=${this.merchantId}`);
          }
          break;
        default:
          if (this.isHotSpot) {
            this.$emit('linkUrl', this.currenUrl, this.currenName);
          } else {
            this.$emit('linkUrl', this.currenUrl);
          }
          break;
      }
      this.dialogVisible = false;
      this.currenId = '';
      this.currenType = 'link';
    },
    handleSizeChange(val) {
      this.params.limit = val;
      this.radioData = null;
      this.mockData(this.currenType);
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.radioData = null;
      this.mockData(this.currenType);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  width: 860px !important;
}

.tabBox_img {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #ddd;
}

::-webkit-scrollbar {
  width: 4px !important;
  /*对垂直流动条有效*/
}

.on {
  background-color: #2d8cf0 !important;
  color: #fff !important;
}

.menu-item {
  position: relative;

  display flex justify-content space-between word-break break-all .icon-box {
    z-index: 3 position absolute right 20px top 50% transform translateY(-50%) display none;
  }

  &:hover .icon-box {
    display: block;
  }

  .right-menu {
    z-index: 10;
    position: absolute;
    right: -106px;
    top: -11px;
    width: auto;
    min-width: 121px;
  }
}

.table_box {
  margin-top: 14px;
  display: flex;
  position: relative;

  .left_box {
    width: 160px;
    height: 470px;
    border-right: 1px solid #eeeeee;
    overflow-x: hidden;
    overflow-y: auto;

    .left_cont {
      margin-bottom: 12px;
      cursor: pointer;
    }
  }

  .right_box {
    margin-left: 23px;
    font-size: 13px;
    font-family: PingFang SC;
    width: 645px;
    height: 470px;
    overflow-x: hidden;
    overflow-y: auto;

    .cont {
      font-weight: 500;
      color: #000000;
      font-weight: bold;
    }

    .Box {
      margin-top: 19px;
      display: flex;
      flex-wrap: wrap;

      .cont_box {
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        background: #fafafa;
        border-radius: 3px;
        text-align: center;
        padding: 7px 30px;
        margin-right: 10px;
        margin-bottom: 18px;
        cursor: pointer;

        &:hover {
          background-color: #eee;
          color: #333;
        }
      }

      .item {
        position: relative;

        .iconfont {
          display: none;
        }

        &:hover {
          .iconfont {
            display: block;
          }
        }
      }

      .iconfont {
        position: absolute;
        right: 9px;
        top: -8px;
        font-size: 18px;
        color: #333;
      }
    }
  }

  .Button {
    position: absolute;
    bottom: 15px;
    right: 15px;
    font-family: PingFangSC-Regular;

    text-align center .cancel {
      width: 70px;
      height: 32px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.14901960784313725);
      border-radius: 2px;
      font-size: 14px;
      color: #000000;
      line-height: 32px;
      float: left;
      margin-right: 10px;
      cursor: pointer;
    }

    .ok {
      width: 70px;
      height: 32px;
      background: var(--prev-color-primary);
      border-radius: 2px;
      font-size: 14px;
      color: #ffffff;
      line-height: 32px;
      float: left;
      cursor: pointer;
    }
  }
}

::v-deep .el-tree-node:focus > .el-tree-node__content {
  color: #409eff; //节点的字体颜色
}
</style>
