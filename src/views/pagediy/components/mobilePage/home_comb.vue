<template>
  <div class="page-container" v-if="configObj">
    <div class="bg-img">
      <img :src="imgSrcList.length && imgSrcList[0].img" alt="" />
      <div class="mask" :style="maskStyle"></div>
    </div>
    <div class="search-box">
      <img src="../../images/leftMenu.png" alt="" mode="widthFix" />
      <div :style="contentStyle" class="box line1"><i class="el-icon-search" />{{ hotWord }}</div>
    </div>
    <!--店铺信息-->
    <div id="store" class="diyStore">
      <div class="pictrue overflow" :style="logoStyleRadius">
        <img :src="JavaMerchantConfigInfo.avatar" class="" />
      </div>
      <div class="text">
        <div class="acea-row row-middle">
          <div class="name">{{ JavaMerchantBaseInfo.name }}</div>
          <div class="iconfont icon-xuanze"></div>
        </div>
        <div class="merchantInfo flex mt5">
          <div class="mr6 self_min merType bg-color">自营</div>
          <div class="mr10 merType color-FAAD14">{{ JavaMerchantBaseInfo.merType }}</div>
          <div class="score">
            <div class="starsList flex">
              <div v-for="(itemn, indexn) in JavaMerchantBaseInfo.starLevel" :key="indexn">
                <span class="iconfont icon-pingfen textE93323"></span>
              </div>
              <div class="flex" v-show="Number(JavaMerchantBaseInfo.starLevel) < 5">
                <span v-for="(itemn, indexn) in noStarLevel" :key="indexn" class="iconfont icon-pingfen noCheck"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button hover-class="none" class="merCollect" :style="followColor">
        <span class="iconfont icon-guanzhu"></span>{{ JavaMerchantBaseInfo.isCollect ? '已关注' : '关注' }}
      </button>
    </div>
    <!--轮播图-->
    <div class="banner-two">
      <div class="img-box">
        <div class="img-item item-left" v-if="swiperType == 0">
          <img
            class="img-left"
            :style="contentStyleBanner"
            :src="imgSrcList.length > 1 && imgSrcList[1].img"
            alt=""
            v-if="imgSrcList.length > 1 && imgSrcList[1].img"
          />
          <div :style="contentStyleBanner" class="empty-box empty-left" v-else>
            <span class="iconfont iconfont icontupian"></span>
          </div>
        </div>
        <div class="img-item" :class="swiperType == 0 ? 'item-middle' : 'item-middle-2'">
          <img
            class="img-middle"
            :style="contentStyleBanner"
            :src="imgSrcList.length && imgSrcList[0].img"
            alt=""
            v-if="imgSrcList.length && imgSrcList[0].img"
          />
          <div :style="contentStyleBanner" class="empty-box empty-middle" v-else>
            <span class="iconfont iconfont icontupian"></span>
          </div>
          <div>
            <div class="dot more-dot" :style="dotStyle" v-if="docType === 0">
              <div
                class="dot-item"
                :style="{ background: themeStyle ? configObj.docColor.color[0].item : themeColor }"
              ></div>
              <div class="dot-item"></div>
              <div class="dot-item"></div>
            </div>
            <div class="dot more-dot line-dot" :style="dotStyle" v-if="docType === 1">
              <div
                class="line_dot-item"
                :style="{ background: themeStyle ? configObj.docColor.color[0].item : themeColor }"
              ></div>
              <div class="line_dot-item"></div>
              <div class="line_dot-item"></div>
            </div>
          </div>
        </div>
        <div class="img-item item-right" v-if="swiperType == 0">
          <img
            class="img-right"
            :style="contentStyleBanner"
            :src="imgSrcList.length > 2 && imgSrcList[2].img"
            alt=""
            v-if="imgSrcList.length > 2 && imgSrcList[2].img"
          />
          <div :style="contentStyleBanner" class="empty-box empty-right" v-else>
            <span class="iconfont iconfont icontupian"></span>
          </div>
        </div>
      </div>
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
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'home_comb',
  cname: '头部组件',
  icon: 't-icon-zujian-zuhezujian',
  configName: 'c_home_comb',
  type: 0, // 0 基础组件 1 营销组件 2工具组件
  defaultName: 'homeComb', // 外面匹配名称
  props: {
    index: {
      type: null,
    },
    num: {
      type: null,
    },
  },
  computed: {
    ...mapState('mobildConfig', ['defaultArray']),
    ...mapGetters(['mobileTheme']),
    //关注颜色
    followColor() {
      return [
        {
          color: this.configObj.followColor.color[0].item,
        },
        {
          border: `1px solid ${this.configObj.followColor.color[0].item}`,
        },
      ];
    },
    //指示器样式
    dotStyle() {
      return [
        { padding: '0 22px' },
        {
          'justify-content':
            this.configObj.txtStyle.tabVal === 1
              ? 'center'
              : this.configObj.txtStyle.tabVal === 2
              ? 'flex-end'
              : 'flex-start',
        },
      ];
    },
    maskStyle() {
      return {
        background: this.$store.state.mobildConfig.pageColor
          ? `linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, ${this.$store.state.mobildConfig.pageColorPicker} 100%)`
          : `linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #f5f5f5 100%)`,
      };
    },
    //搜索框样式
    contentStyle() {
      return [
        { 'border-radius': this.configObj.contentStyle.val ? this.configObj.contentStyle.val + 'px' : '0' },
        {
          background: this.configObj.borderColor.color[0].item,
        },
        {
          color: this.configObj.textColor.color[0].item,
        },
        {
          'text-align': this.configObj.textPosition.list[this.configObj.textPosition.tabVal].style,
        },
      ];
    },
    //轮播图圆角
    //内容圆角
    contentStyleBanner() {
      return [
        { 'border-radius': this.configObj.contentStyleBanner.val ? this.configObj.contentStyleBanner.val + 'px' : '0' },
      ];
    },
    //logo圆角
    logoStyleRadius() {
      return [
        { 'border-radius': this.configObj.logoStyleRadius.val ? this.configObj.logoStyleRadius.val + 'px' : '0' },
      ];
    },
  },
  watch: {
    pageData: {
      handler(nVal, oVal) {
        this.setConfig(nVal);
      },
      deep: true,
    },
    num: {
      handler(nVal, oVal) {
        let data = this.$store.state.mobildConfig.defaultArray[nVal];
        this.setConfig(data);
      },
      deep: true,
    },
    defaultArray: {
      handler(nVal, oVal) {
        let data = this.$store.state.mobildConfig.defaultArray[this.num];
        this.setConfig(data);
      },
      deep: true,
    },
    themeStyle: {
      handler(nVal, oVal) {
        this.configObj.docColor.isShow = this.configObj.themeStyleConfig.tabVal;
      },
      deep: true,
    },
  },
  data() {
    return {
      // 默认初始化数据禁止修改
      defaultConfig: {
        name: 'homeComb',
        timestamp: this.num,
        setUp: {
          cname: '头部组件',
        },
        tabConfig: {
          title: '选择组件',
          tabTitle: '设置内容',
          tabVal: 0,
          type: 0,
          isShow: 1,
          list: [
            {
              val: '搜索框',
              icon: 'icon-zuhe-sousuokuang',
              count: 1,
            },
            {
              val: '店铺信息',
              icon: 'icon-zuhe-fenlei',
              count: 2,
            },
            {
              val: '轮播图',
              icon: 'icon-zuhe-lunbotu',
              count: 3,
            },
          ],
        },
        hotWords: {
          title: '搜索热词',
          tabTitle: '搜索热词',
          tips: '最多可设置20个热词，鼠标拖拽左侧圆点可调整热词顺序',
          list: [
            {
              val: '兰蔻小黑瓶',
            },
          ],
        },
        placeWords: {
          title: '提示文字',
          tabTitle: '提示文字设置',
          value: '搜索商品名称',
          isShow: 1,
        },
        titleConfig: {
          title: '切换时间',
          val: 3,
          place: '设置搜索热词显示时间',
          max: 100,
          unit: '秒',
          isShow: 1,
        },
        textPosition: {
          title: '文本位置',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '居左',
              style: 'left',
              icon: 'icon-juzuo',
            },
            {
              val: '居中',
              style: 'center',
              icon: 'icon-juzhong',
            },
            {
              val: '居右',
              style: 'right',
              icon: 'icon-juyou',
            },
          ],
        },
        // 框体颜色
        borderColor: {
          title: '框体颜色',
          color: [
            {
              item: '#fff',
            },
          ],
          default: [
            {
              item: '#fff',
            },
          ],
        },
        textColor: {
          tabTitle: '样式设置',
          title: '文字颜色',
          default: [
            {
              item: '#303133',
            },
          ],
          color: [
            {
              item: '#303133',
            },
          ],
        },
        // 关注按钮颜色
        followColor: {
          tabTitle: '样式设置',
          title: '关注按钮颜色',
          default: [
            {
              item: '#303133',
            },
          ],
          color: [
            {
              item: '#303133',
            },
          ],
        },
        logoStyleRadius: {
          title: 'logo圆角',
          name: 'logoStyleRadius',
          val: 7,
          min: 0,
          max: 30,
        },
        contentStyle: {
          title: '内容圆角',
          name: 'contentStyle',
          val: 30,
          min: 0,
          max: 30,
        },
        contentStyleBanner: {
          title: '内容圆角',
          name: 'contentStyleBanner',
          val: 7,
          min: 0,
          max: 30,
        },
        // 轮播图 图片列表
        swiperConfig: {
          tabTitle: '内容设置',
          tips: '最多可添加10张图片，建议宽度750*332px；鼠标拖拽左侧圆点可调整图片顺序',
          title: '最多可添加10张图片，建议宽度750*332px；鼠标拖拽左侧圆点可调整图片顺序',
          maxList: 10,
          isSmall: true,
          list: [
            {
              img: '',
              info: [
                {
                  title: '标题',
                  value: '',
                  tips: '选填，不超过10个字',
                  max: 10,
                },
                {
                  title: '链接',
                  value: '',
                  tips: '请输入链接',
                  max: 100,
                },
              ],
            },
          ],
        },
        swiperStyleConfig: {
          title: '选择风格',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '样式1',
            },
            {
              val: '样式2',
            },
          ],
        },
        //色调
        themeStyleConfig: {
          title: '色调',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '跟随主题风格',
            },
            {
              val: '自定义',
            },
          ],
        },
        // 指示器颜色
        docColor: {
          title: '指示器颜色',
          name: 'docColor',
          isShow: 0,
          color: [
            {
              item: '#E93323',
            },
          ],
          default: [
            {
              item: '#E93323',
            },
          ],
        },
        // 轮播图点样式
        docConfig: {
          cname: 'swiper',
          title: '指示器样式',
          tabTitle: '样式设置',
          isShow: 1,
          tabVal: 0,
          list: [
            {
              val: '圆形',
              icon: 'icon-yuandian',
            },
            {
              val: '直线',
              icon: 'icon-xiantiao',
            },
            {
              val: '无指示器',
              icon: 'icon-buxianshi',
            },
          ],
        },
        txtStyle: {
          title: '指示器位置',
          tabVal: 0,
          isShow: 1,
          list: [
            {
              val: '居左',
              icon: 'icon-juzuo',
            },
            {
              val: '居中',
              icon: 'icon-juzhong',
            },
            {
              val: '居右',
              icon: 'icon-juyou',
            },
          ],
        },
      },
      // tabVal: '',
      pageData: {},
      logoUrl: '',
      hotWord: '',
      imgSrc: '',
      style: 0,
      list: [],
      curIndex: 0,
      bgUrl: '',
      docType: 0,
      configObj: null,
      JavaMerchantBaseInfo: {}, //商户信息
      JavaMerchantConfigInfo: {}, //商户头像、背景图信息
      noStarLevel: 0,
      imgSrcList: [],
      swiperType: 0,
      themeStyle: 0,
      themeColor: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.pageData = this.$store.state.mobildConfig.defaultArray[this.num];
      this.setConfig(this.pageData);
    });
    this.JavaMerchantBaseInfo = JSON.parse(localStorage.getItem('JavaMerchantBaseInfo'));
    this.JavaMerchantConfigInfo = JSON.parse(localStorage.getItem('JavaMerchantConfigInfo'));
    if (parseInt(this.JavaMerchantBaseInfo.starLevel) < 5)
      this.noStarLevel = 5 - parseInt(this.JavaMerchantBaseInfo.starLevel);
  },
  methods: {
    getConfig(data) {},
    setConfig(data) {
      if (!data) return;
      if (data) {
        this.configObj = data;
        // this.list = data.listConfig.list;
        this.logoUrl = localStorage.getItem('mediaDomain') + '/crmebimage/presets/shoplogo.png';
        this.docType = data.docConfig.tabVal;
        this.hotWord = data.hotWords.list.length > 0 ? data.hotWords.list[0].val : data.placeWords.val;
        this.imgSrcList = data.swiperConfig.list;
        //this.style = data.tabConfig.tabVal;
        this.swiperType = data.swiperStyleConfig.tabVal;
        this.themeStyle = data.themeStyleConfig.tabVal;
        this.themeColor = this.$options.filters.filterTheme(this.mobileTheme - 1);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.dot {
  position: absolute;
  left: 0;
  bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;

  &.number {
    bottom: 4px;
  }

  .num {
    width: 25px;
    height: 18px;
    line-height: 18px;
    background-color: #000;
    color: #fff;
    opacity: 0.3;
    border-radius: 8px;
    font-size: 12px;
    text-align: center;
  }

  .dot-item {
    width: 5px;
    height: 5px;
    background: #aaaaaa;
    border-radius: 50%;
    margin: 0 3px;
  }

  &.line-dot {
    bottom: 20px;

    .line_dot-item {
      width: 8px;
      height: 2px;
      background: #aaaaaa;
      margin: 0 3px;
    }
  }
}

.page-container {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  backdrop-filter: blur(95px);
  filter: blur(30rpx);
  padding-bottom: 10px;

  .bg-img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: -1;
    filter: blur(30rpx);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      transform: scale(1.2);
      filter: blur(30px);
    }
    .mask {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 68px;
      // background: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #f5f5f5 100%);
    }
  }
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  /*height: 27px;*/
  padding: 10px 10px 0;
  cursor: pointer;

  img {
    width: 66px;
    margin-right: 10px;
  }

  .iconfont {
    margin-left: 13px;
    font-size: 18px;
    position: relative;
    color: #fff;

    &::after {
      content: '8';
      width: 11px;
      height: 11px;
      background: #fff;
      color: #e93323;
      border-radius: 50%;
      text-align: center;
      position: absolute;
      top: -3px;
      right: -3px;
      font-size: 1px;
    }
  }

  .box {
    flex: 1;
    height: 30px;
    line-height: 30px;
    color: #999;
    font-size: 12px;
    // padding-left: 10px;
    background: #fff;
    border-radius: 15px;
    position: relative;
    padding: 0 10px 0 25px;

    i {
      font-size: 14px;
      margin-right: 6px;
    }
  }
}

.capsule {
  width: 80px;
  height: 30px;
  margin-left: 7px;
  opacity: 0.8;

  img {
    width: 80px;
    height: 30px;
  }
}

.banner-two {
  position: relative;
  z-index: 1;
  overflow: hidden;
  width: 100%;
  height: 150px;
  padding: 0 10px;

  &.on {
    margin-top: -160px;
  }

  img {
    width: 100%;
    border-radius: 10px;
    // object-fit: contain;

    &.doc {
      border-radius: 0;
    }
  }

  .img-middle {
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    background-position: center center;
    object-fit: cover;
  }

  .img-left {
    height: 140px;
  }

  .img-right {
    height: 140px;
  }

  .empty-box {
    height: 150px;
    background: #f3f9ff;
  }

  .empty-left {
    height: 140px;
  }

  .empty-middle {
    height: 150px;
  }

  .empty-right {
    height: 140px;
  }

  .img-item {
    position: absolute;
    display: inline-block;
    width: 69%;
  }

  .item-middle {
    left: 28px;
    width: 85%;
    height: 150px;
  }
  .item-middle-2 {
    left: 9px;
    width: 95%;
    height: 150px;
  }
  .img-box {
    width: 100%;
    height: 100%;
  }

  .item-left {
    top: 5px;
    left: -243px;
    height: 140px;
  }

  .item-right {
    top: 5px;
    left: 360px;
    height: 140px;
  }
}

.bg {
  width: 100%;
  height: 160px;
}
.pictrue {
  margin-right: 6px !important;
}
.mr6 {
  margin-right: 8px !important;
}
.icon-pingfen {
  font-size: 13px !important;
}
</style>
