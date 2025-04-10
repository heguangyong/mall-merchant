<template>
  <div class="mobile-config pro">
    <div v-for="(item, key) in rCom" :key="key">
      <component
        :is="item.components.name"
        :configObj="configObj"
        ref="childData"
        :configNme="item.configNme"
        :key="key"
        @getConfig="getConfig"
        :index="activeIndex"
        :number="num"
        :num="item.num"
      ></component>
    </div>
    <rightBtn :activeIndex="activeIndex" :configObj="configObj"></rightBtn>
  </div>
</template>
<script>
// +---------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +---------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +---------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +---------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +---------------------------------------------------------------------
import { productActivityListApi } from '@/api/product';
import toolCom from '@/components/PageDiy/mobileConfigRight/index.js';
import rightBtn from '@/components/PageDiy/rightBtn/index.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'c_home_tab',
  componentsName: 'home_tab',
  cname: '选项卡',
  props: {
    activeIndex: {
      type: null,
    },
    num: {
      type: null,
    },
    index: {
      type: null,
    },
  },
  components: {
    ...toolCom,
    rightBtn,
  },
  computed: {
    ...mapGetters(['merProductClassify']),
    //商品排序
    goodsSort() {
      return this.configObj.goodsSort.tabVal;
    },
    //选择方式,0,指定商品,1指定品牌，2指定分类，3指定商户
    tabConfig() {
      return this.configObj.tabConfig.tabVal;
    },
  },
  data() {
    return {
      configObj: {},
      rCom: [
        {
          components: toolCom.c_checked_tab,
          configNme: 'setUp',
        },
      ],
      automatic: [
        {
          components: toolCom.c_title,
          configNme: 'tabItemConfig',
        },
        {
          components: toolCom.c_tab_input,
          configNme: 'tabItemConfig',
        },
        {
          components: toolCom.c_tab_radio,
          configNme: 'tabConfig',
        },
        {
          components: toolCom.c_goods,
          configNme: 'goodsList',
        },
        {
          components: toolCom.c_cascader,
          configNme: 'selectConfig',
        },
        {
          components: toolCom.c_input_number,
          configNme: 'numConfig',
        },
        {
          components: toolCom.c_txt_tab,
          configNme: 'goodsSort',
        },
        {
          components: toolCom.c_title,
          configNme: 'itemStyle',
        },
        {
          components: toolCom.c_txt_tab,
          configNme: 'itemStyle',
        },
        {
          components: toolCom.c_title,
          configNme: 'typeConfig',
        },
        {
          components: toolCom.c_checkbox_group,
          configNme: 'typeConfig',
        },
      ],
      setUp: 0,
      type: 0,
      lockStatus: false,
      goodsList: [], //指定商品列表
    };
  },
  watch: {
    num(nVal) {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[nVal]));
      this.configObj = value;
    },
    configObj: {
      handler(nVal, oVal) {
        this.$store.commit('mobildConfig/UPDATEARR', { num: this.num, val: nVal });
      },
      deep: true,
    },
    'configObj.setUp.tabVal': {
      handler(nVal, oVal) {
        this.setUp = nVal;
        var arr = [this.rCom[0]];
        if (nVal == 0) {
          this.rCom = arr.concat(this.automatic);
        } else {
          let tempArr = [
            {
              components: toolCom.c_title,
              configNme: 'fontColor',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'tabBgColor',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'fontColor',
            },
            {
              components: toolCom.c_radio,
              configNme: 'checkThemeStyleConfig',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'checkColor',
            },
            {
              components: toolCom.c_title,
              configNme: 'labelColor',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'bgColor',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'titleColor',
            },
            {
              components: toolCom.c_radio,
              configNme: 'priceThemeStyleConfig',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'priceColor',
            },
            {
              components: toolCom.c_bg_color,
              configNme: 'soldColor',
            },
            {
              components: toolCom.c_title,
              configNme: 'upConfig',
            },
            {
              components: toolCom.c_slider,
              configNme: 'upConfig',
            },
            {
              components: toolCom.c_slider,
              configNme: 'downConfig',
            },
            {
              components: toolCom.c_slider,
              configNme: 'topConfig',
            },
            {
              components: toolCom.c_slider,
              configNme: 'lrConfig',
            },
            {
              components: toolCom.c_slider,
              configNme: 'contentConfig',
            },
            {
              components: toolCom.c_slider,
              configNme: 'mbConfig',
            },
            {
              components: toolCom.c_title,
              configNme: 'bgStyle',
            },
            {
              components: toolCom.c_slider,
              configNme: 'bgStyle',
            },
            {
              components: toolCom.c_slider,
              configNme: 'contentStyle',
            },
          ];
          this.rCom = arr.concat(tempArr);
        }
      },
      deep: true,
    },
    //选择方式选择，0指定商品，1指定品牌，2指定分类，3指定商户
    'configObj.tabConfig.tabVal': {
      handler(nVal, oVal) {
        this.type = nVal;
        switch (this.type) {
          case 0:
            this.$set(this.configObj.selectConfig, 'list', this.merProductClassify);
            this.$set(this.configObj.numConfig, 'isShow', 0); //是否显示inputnumber框
            this.$set(this.configObj.goodsList, 'isShow', 1); //选择商品
            this.$set(this.configObj.selectConfig, 'isShow', 0); //选择分类
            this.$set(this.configObj.goodsSort, 'isShow', 0); //商品排序
            break;
          case 1:
            this.$set(this.configObj.numConfig, 'isShow', 1);
            this.$set(this.configObj.goodsList, 'isShow', 0); //选择商品
            this.$set(this.configObj.selectConfig, 'isShow', 1); //选择分类
            this.$set(this.configObj.goodsSort, 'isShow', 1); //商品排序
            break;
          // case 2:
          //   this.$set(this.configObj.selectConfig, 'list', this.merPlatProductClassify);
          //   this.$set(this.configObj.numConfig, 'isShow', 1);
          //    this.$set(this.configObj.goodsList, 'isShow', 0); //选择商品
          //   // this.$set(this.configObj.activeValueBrand, 'isShow', 0); //选择品牌
          //   this.$set(this.configObj.selectConfig, 'isShow', 1); //选择分类
          //   this.$set(this.configObj.goodsSort, 'isShow', 1); //商品排序
          //   break;
          // case 3:
          //   this.$set(this.configObj.numConfig, 'isShow', 1);
          //   this.$set(this.configObj.goodsList, 'isShow', 0); //选择商品
          //   // this.$set(this.configObj.activeValueBrand, 'isShow', 0); //选择品牌
          //   this.$set(this.configObj.selectConfig, 'isShow', 0); //选择分类
          //   this.$set(this.configObj.goodsSort, 'isShow', 1); //商品排序
          //   break;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      let value = JSON.parse(JSON.stringify(this.$store.state.mobildConfig.defaultArray[this.num]));
      this.configObj = value;
      if (!localStorage.getItem('merProductClassify')) this.$store.dispatch('product/getMerProductClassify');
      this.$nextTick(() => {
        this.$set(this.configObj.selectConfig, 'list', this.merProductClassify);
      });
    });
  },
  methods: {
    getConfig(data) {
      // 添加选项卡,清空选中的值
      if (data.name && data.name === 'add_tab') {
        this.configObj.tabConfig.tabVal = 0; //默认选中商品列表
        this.configObj.tabItemConfig.tabVal += 1; //默认选中新填的tab
        this.configObj.goodsList.list = [];
        this.configObj.selectConfig.activeValue = [];
        this.configObj.typeConfig.activeValue = [0, 1, 2];
      }
      //选择tab获取商品列表.0指定商品
      if (data.name && data.name === 'goods') {
        this.configObj.goodsList.list = data.values;
        this.setProConfig();
      }
      //删除事件
      if (data.name === 'del_tab') {
        this.configObj.tabItemConfig.tabVal = 0;
      }
      //商品列表选择方式
      if (data.name && data.name === 'tab_radio') {
        this.configObj.tabConfig.tabVal = data.values;
        this.setProConfig();
      }
      if (data.name && data.name === 'radio') this.setProConfig();
      //选择tab获取商品列表,1指定品牌，2指定分类，3指定商户
      if (this.configObj.tabConfig.tabVal > 0) this.getProList(data);
      //选择选项卡tab切换
      this.changeTab(data);
    },
    //选择选项卡tab切换
    changeTab(data) {
      if (data.name && data.name === 'tab_input') {
        this.configObj.tabItemConfig.tabVal = data.values; //选项卡选中的值
        this.onTabConfig(data);
        this.onGoodsSort(data);
        this.setProConfig();
      }
      // 选择展示内容
      if (data.name && data.name === 'checkbox_group') {
        this.configObj.tabItemConfig.list[this.configObj.tabItemConfig.tabVal].activeList.showContent = data.values;
      }
    },
    //选项卡选择后指定选择商品列表
    onTabConfig(data) {
      this.configObj.tabConfig.tabVal = this.configObj.tabItemConfig.list[data.values].activeList
        ? this.configObj.tabItemConfig.list[data.values].activeList.activeProTabIndex
        : 0;
      //未选商品分类回显
      this.configObj.selectConfig.activeValue = this.configObj.tabItemConfig.list[data.values].activeList
        ? this.configObj.tabItemConfig.list[data.values].activeList.activeValue.split(',').map(Number)
        : [];
      switch (this.configObj.tabConfig.tabVal) {
        case 0:
          this.configObj.goodsList.list = this.configObj.tabItemConfig.list[data.values].activeList
            ? this.configObj.tabItemConfig.list[data.values].activeList.goods
            : [];
          break;
        // case 1:
        //   //商品品牌选中的值
        //   this.configObj.activeValueBrand.activeValue =
        //     this.configObj.tabItemConfig.list[data.values].activeList &&
        //     this.configObj.tabItemConfig.list[data.values].activeList.activeValue.length
        //       ? this.configObj.tabItemConfig.list[data.values].activeList.activeValue.split(',').map(Number)
        //       : [];
        //   break;
        case 1:
          //商品分类选中的值
          this.configObj.selectConfig.activeValue = this.configObj.tabItemConfig.list[data.values].activeList
            ? this.configObj.tabItemConfig.list[data.values].activeList.activeValue.split(',').map(Number)
            : [];
          break;
        // case 3:
        //   //商户选中的值
        //   this.configObj.activeValueMer.activeValue = this.configObj.tabItemConfig.list[data.values].activeList
        //     ? this.configObj.tabItemConfig.list[data.values].activeList.activeValue.split(',')
        //     : [];
        //   break;
      }
    },
    //选项卡选择后排序/数量/样式/展示内容
    onGoodsSort(data) {
      this.configObj.goodsSort.tabVal = this.configObj.tabItemConfig.list[data.values].activeList
        ? this.configObj.tabItemConfig.list[data.values].activeList.goodsSort
        : 0; // 商品排序
      this.configObj.numConfig.val = this.configObj.tabItemConfig.list[data.values].activeList
        ? this.configObj.tabItemConfig.list[data.values].activeList.num
        : 6;
      this.configObj.itemStyle.tabVal = this.configObj.tabItemConfig.list[data.values].activeList
        ? this.configObj.tabItemConfig.list[data.values].activeList.styleType
        : 0; // 展现形式
      this.configObj.typeConfig.activeValue = this.configObj.tabItemConfig.list[data.values].activeList
        ? this.configObj.tabItemConfig.list[data.values].activeList.showContent
        : [0, 1, 2]; //展示内容
    },
    //选择tab获取商品列表
    getProList(data) {
      if (
        data.name &&
        (data.name === 'merchantName' ||
          data.name === 'select' ||
          data.name === 'cascader' ||
          data.name === 'radio' ||
          data.name === 'number')
      ) {
        let activeValue = '';
        let priceOrder = '';
        let salesOrder = '';
        switch (this.configObj.tabConfig.tabVal) {
          case 0:
            break;
          // case 1:
          //   activeValue = this.configObj.activeValueBrand.activeValue.join(',');
          //   break;
          case 1:
            activeValue = this.configObj.selectConfig.activeValue.join(',');
            break;
          // case 3:
          //   activeValue = this.configObj.activeValueMer.activeValue.join(',');
          //   break;
        }
        if (this.goodsSort === 0) {
          priceOrder = '';
          salesOrder = '';
        } else if (this.goodsSort === 1) {
          priceOrder = '';
          salesOrder = 'desc';
        } else {
          priceOrder = 'desc';
          salesOrder = '';
        }
        productActivityListApi({
          cateIds: this.configObj.tabConfig.tabVal === 1 ? activeValue : null,
          page: 1,
          limit: this.configObj.numConfig.val,
          priceOrder: priceOrder,
          salesOrder: salesOrder,
        }).then((res) => {
          //选择tab获取商品列表,1指定品牌，2指定分类，3指定商户
          switch (this.configObj.tabConfig.tabVal) {
            // case 1:
            //   this.configObj.tabItemConfig.list[this.configObj.tabItemConfig.tabVal].brandGoodsList = res.list;
            //   break;
            case 1:
              this.configObj.tabItemConfig.list[this.configObj.tabItemConfig.tabVal].selectConfigList = res.list;
              break;
            // case 3:
            //   this.configObj.tabItemConfig.list[this.configObj.tabItemConfig.tabVal].merList = res.list;
            //   break;
          }
          this.setProConfig();
        });
      }
    },
    //设置数据对象
    setProConfig() {
      let activeValue = '';
      switch (this.configObj.tabConfig.tabVal) {
        case 0:
          break;
        // case 1:
        //   activeValue = this.configObj.activeValueBrand.activeValue.length
        //     ? this.configObj.activeValueBrand.activeValue.join(',')
        //     : [];
        //   break;
        case 1:
          activeValue = this.configObj.selectConfig.activeValue.join(',');
          break;
        // case 3:
        //   activeValue = this.configObj.activeValueMer.activeValue.join(',');
        //   break;
      }
      this.configObj.tabItemConfig.list[this.configObj.tabItemConfig.tabVal].activeList = {
        goods: this.configObj.goodsList.list || [], //商品列表，只有指定商品使用
        activeProTabIndex: this.configObj.tabConfig.tabVal, //商品列表类型，商品、品牌、分类、商户
        activeValue: activeValue, //品牌、分类、商户选中的值（分别）
        styleType: this.configObj.itemStyle.tabVal, //样式选项
        num: this.configObj.numConfig.val, //商品数量
        goodsSort: this.configObj.goodsSort.tabVal, //商品排序
        showContent: this.configObj.typeConfig.activeValue, // 展示信息
      };
      this.configObj.tabItemConfig.list[this.configObj.tabItemConfig.tabVal].activeTabIndex =
        this.configObj.tabItemConfig.tabVal;
    },
  },
};
</script>

<style scoped lang="scss">
.pro {
  //padding: 15px 15px 0;
  .tips {
    height: 50px;
    line-height: 50px;
    color: #999;
    font-size: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .btn-box {
    padding-bottom: 20px;
  }
}
</style>
