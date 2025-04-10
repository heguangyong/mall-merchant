<template>
  <!--图片魔方、热区添加图片-->
  <div class="mobile-page borderPadding">
    <div v-if="isUpdate">
      <template v-if="configData.isHotspot != 1">
        <div class="divider"></div>
        <div class="title mb10">布局</div>
      </template>
      <div class="tip mb20">选定布局区域，在下方添加图片，建议添加比例一致的图片</div>
      <div class="advert">
        <div v-if="style === 0">
          <div class="advertItem01 acea-row" v-for="(item, index) in configData.picList" :key="index">
            <img :src="item.image" v-if="item.image" class="img-style" />
            <div class="empty-box" v-else>尺寸不限</div>
          </div>
        </div>
        <div v-if="style === 1" class="advertItem02 acea-row" :style="gapStyle">
          <div
            class="item"
            :class="currentIndex === index ? 'on' : ''"
            @click="currentTab(index, configData)"
            v-for="(item, index) in configData.picList"
            :style="spaceStyleTwo"
            :key="index"
          >
            <img
              :src="item.image"
              v-if="item.image"
              :class="item.radioVal === '0' ? 'stretch' : item.radioVal === '1' ? 'scale' : 'fill'"
              class="img-style"
              :style="radiusStyle"
            />
            <div class="empty-box" v-else>
              <div>
                <div>宽375像素</div>
                <div>高度不限</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="style === 2" class="advertItem02 advertItem03 acea-row" :style="gapStyle">
          <div
            class="item"
            :class="currentIndex === index ? 'on' : ''"
            @click="currentTab(index, configData)"
            v-for="(item, index) in configData.picList"
            :style="spaceStyleThree"
            :key="index"
          >
            <img
              :src="item.image"
              v-if="item.image"
              :class="item.radioVal === '0' ? 'stretch' : item.radioVal === '1' ? 'scale' : 'fill'"
              class="img-style"
              :style="radiusStyle"
            />
            <div class="empty-box" v-else>
              <div>
                <div>宽250像素</div>
                <div>高度不限</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="style === 3" class="advertItem04 acea-row" :style="gapStyle">
          <div
            class="item"
            :class="currentIndex === 0 ? 'on' : ''"
            @click="currentTab(0, configData)"
            :style="spaceStyleTwo"
          >
            <img
              :src="configData.picList[0].image"
              v-if="configData.picList[0].image"
              :class="
                configData.picList[0].radioVal === '0'
                  ? 'stretch'
                  : configData.picList[0].radioVal === '1'
                  ? 'scale'
                  : 'fill'
              "
              class="img-style img-left"
              :style="radiusStyle"
            />
            <div class="empty-box" v-else>375*375像素或同比例</div>
          </div>
          <div class="item pic-four" :style="spaceStyleFour">
            <div class="pic" :class="currentIndex === 1 ? 'on' : ''" @click="currentTab(1, configData)">
              <img
                :src="configData.picList[1].image"
                v-if="configData.picList[1].image"
                :class="
                  configData.picList[1].radioVal === '0'
                    ? 'stretch'
                    : configData.picList[1].radioVal === '1'
                    ? 'scale'
                    : 'fill'
                "
                class="img-style"
                :style="radiusStyle"
              />
              <div class="empty-box" v-else>375*188像素或同比例</div>
            </div>
            <div class="pic" :class="currentIndex === 2 ? 'on' : ''" @click="currentTab(2, configData)">
              <img
                :src="configData.picList[2].image"
                v-if="configData.picList[2].image"
                :class="
                  configData.picList[2].radioVal === '0'
                    ? 'stretch'
                    : configData.picList[2].radioVal === '1'
                    ? 'scale'
                    : 'fill'
                "
                class="img-style"
                :style="radiusStyle"
              />
              <div class="empty-box" v-else>375*188像素或同比例</div>
            </div>
          </div>
        </div>
        <div v-if="style === 4" class="advertItem02 advertItem05 acea-row" :style="gapStyle">
          <div
            class="item"
            :class="currentIndex === index ? 'on' : ''"
            @click="currentTab(index, configData)"
            v-for="(item, index) in configData.picList"
            :style="spaceStyleFive"
            :key="index"
          >
            <img
              :src="item.image"
              v-if="item.image"
              :class="item.radioVal === '0' ? 'stretch' : item.radioVal === '1' ? 'scale' : 'fill'"
              class="img-style"
              :style="radiusStyle"
            />
            <div class="empty-box" v-else>宽188像素高度不限</div>
          </div>
        </div>
        <div v-if="style === 5" class="advertItem06 acea-row" :style="gapStyle">
          <div
            class="item"
            :class="currentIndex === index ? 'on' : ''"
            @click="currentTab(index, configData)"
            v-for="(item, index) in configData.picList"
            :style="spaceStyleTwo"
            :key="index"
          >
            <img
              :src="item.image"
              v-if="item.image"
              :class="item.radioVal === '0' ? 'stretch' : item.radioVal === '1' ? 'scale' : 'fill'"
              class="img-style"
              :style="radiusStyle"
            />
            <div class="empty-box" v-else>375*188像素或同比例</div>
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
export default {
  name: 'c_pictrue',
  props: {
    configObj: {
      type: Object,
    },
    configNme: {
      type: String,
    },
  },
  data() {
    return {
      defaults: {},
      configData: {},
      isUpdate: false, // 重新渲染
      currentIndex: 0,
      arrayObj: {
        image: '',
        link: '',
      },
    };
  },
  computed: {
    style() {
      return this.configObj.tabConfig.tabVal;
    },
    //最外层盒子的样式
    boxStyle() {
      return [
        { 'border-radius': this.configObj.bgStyle.val ? this.configObj.bgStyle.val + 'px' : '0' },
        {
          background: `linear-gradient(${this.configObj.bgColor.color[0].item}, ${this.configObj.bgColor.color[1].item})`,
        },
        { margin: this.configObj.mbConfig.val + 'px' + ' ' + this.configObj.lrConfig.val + 'px' + ' ' + 0 },
        { padding: this.configObj.upConfig.val + 'px' + ' ' + 0 + ' ' + this.configObj.downConfig.val + 'px' },
      ];
    },
    radiusStyle() {
      return [{ 'border-radius': this.configObj.contantStyle.val ? this.configObj.contantStyle.val + 'px' : '0' }];
    },
    //因后台页面宽度379---正常应375
    spaceStyleTwo() {
      return [{ width: (379 - this.configObj.lrConfig.val * 2 - this.configObj.spaceConfig.val) / 2 + 'px' }];
    },
    spaceStyleThree() {
      return [{ width: (379 - this.configObj.lrConfig.val * 2 - this.configObj.spaceConfig.val * 2) / 3 + 'px' }];
    },
    spaceStyleFour() {
      return [
        { width: (379 - this.configObj.lrConfig.val * 2 - this.configObj.spaceConfig.val) / 2 + 'px' },
        { gap: this.configObj.spaceConfig.val + 'px' },
        { height: (188 - this.configObj.spaceConfig.val) / 2 + 'px' },
      ];
    },
    spaceStyleFive() {
      return [{ width: (379 - this.configObj.lrConfig.val * 2 - this.configObj.spaceConfig.val * 3) / 4 + 'px' }];
    },
    gapStyle() {
      return [{ gap: this.configObj.spaceConfig.val + 'px' }];
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.defaults = this.configObj;
      if (this.configObj.hasOwnProperty('timestamp')) {
        this.isUpdate = true;
      } else {
        this.isUpdate = false;
      }
      this.$set(this, 'configData', this.configObj[this.configNme]);
    });
  },
  watch: {
    configObj: {
      handler(nVal, oVal) {
        this.defaults = nVal;
        this.$set(this, 'configData', nVal[this.configNme]);
        this.isUpdate = true;
        this.$set(this, 'isUpdate', true);
      },
      deep: true,
    },
    'configObj.tabConfig.tabVal': {
      handler(nVal, oVal) {
        this.count = this.defaults.tabConfig.list[nVal].count;
        this.picArrayConcat(this.count);
        this.configData.picList.splice(nVal + 1);
        this.currentIndex = 0;
        let list = this.defaults.menuConfig.list[0];
        if (this.configData.picList[0]) {
          list.img = this.configData.picList[0].image;
          list.info[0].value = this.configData.picList[0].link;
        }
      },
      deep: true,
    },
  },
  methods: {
    currentTab(e, data) {
      this.currentIndex = e;
      this.configData.tabVal = e;
      if (this.defaults.menuConfig.isCube) {
        let list = this.defaults.menuConfig.list[0];
        if (data.picList[e] && data.picList[e].image) {
          list.img = data.picList[e].image;
          list.info[0].value = data.picList[e].link;
          list.info[0].radioVal = data.picList[e].radioVal;
        } else {
          list.img = '';
          list.info[0].value = '';
          list.info[0].radioVal = '0';
        }
      }
    },
    picArrayConcat(count) {
      for (let i = this.configData.picList.length; i < count; i++) {
        this.configData.picList.push(this.arrayObj);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.divider {
  margin: 20px 0;
  border: 1px dashed #eeeeee;
}
::v-deep .ivu-divider-horizontal {
  margin: 12px 0;
}
.empty-box {
  color: #999999;
  font-size: 12px;
  border-radius: 0;
  background-color: #eee;
  width: 100%;
  border: 1px solid #ddd;
  text-align: center;
}

.mobile-page {
  .advert {
    .advertItem01 {
      width: 100%;
      height: 100%;
      .empty-box {
        width: 100%;
        height: 379px;
        border-radius: 0;
        .icon-tu {
          font-size: 50px;
          color: #999;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .advertItem02 {
      width: 100%;
      .item {
        width: 50%;
        height: auto;
        img {
          width: 100%;
          height: 100%;
        }
        .empty-box {
          width: 100%;
          height: 189.5px;
          border-radius: 0;
        }
      }
    }
    .advertItem03 {
      .item {
        width: 33.3333%;
        .empty-box {
          width: 100%;
          height: 126.4px;
          border-radius: 0;
        }
      }
    }
    .advertItem04 {
      .item {
        width: 50%;
        height: 189.5px;
        .empty-box {
          width: 100%;
          height: 100%;
          border-radius: 0;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .pic {
          width: 100%;
          height: 100%;
          .empty-box {
            width: 100%;
            height: 94.75px;
            border-radius: 0;
          }
        }
      }
    }
    .advertItem05 {
      .item {
        width: 25%;
        .empty-box {
          width: 100%;
          height: 94.75px;
          border-radius: 0;
        }
      }
    }
    .advertItem06 {
      .item {
        width: 50%;
        height: 95px;
        img {
          width: 100%;
          height: 100%;
        }
        .empty-box {
          width: 100%;
          height: 100%;
          border-radius: 0;
        }
      }
    }
  }
}
.pic-four {
  display: flex;
  flex-direction: column;
}
.img-style {
  background-repeat: no-repeat;
  // width: 100%;
  // height: 100%;
  background-position: center center;
}
.stretch {
  background-size: 100% 100%;
}
.scale {
  object-fit: contain !important;
}
.fill {
  object-fit: cover !important;
}
.on {
  img {
    border: 1px solid #1890ff !important;
  }

  .empty-box {
    border: 1px solid #1890ff !important;
    color: #1890ff;
  }
}
</style>
