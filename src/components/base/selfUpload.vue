<template>
  <div>
    <div class="acea-row" v-if="multiple">
      <div
        v-for="(item, index) in imageList"
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
      </div>
      <div class="upLoadPicBox" @click="modalPicTap('2')" v-show="imageList.length < 20">
        <div class="upLoad">
          <i class="el-icon-camera cameraIconfont" />
        </div>
      </div>
    </div>
    <div class="upLoadPicBox" @click="modalPicTap('1')" v-else>
      <div v-if="image" class="pictrue"><img :src="image" /></div>
      <div v-else class="upLoad">
        <i class="el-icon-camera cameraIconfont" />
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

import UploadIndex from './uploadPicture.vue';
export default {
  name: 'selfUpload',
  components: { UploadIndex },
  props: {
    value: {},
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      image: '',
      callback: function () {},
      isMore: '',
      imageList: [],
    };
  },
  beforeMount() {
    if (this.multiple) {
      // 接收 v-model 数据
      if (this.value) {
        this.imageList = JSON.parse(this.value);
      }
    } else {
      // 接收 v-model 数据
      if (this.value) {
        this.image = this.value;
      }
    }
    // 处理多选
    this.isMore = this.multiple ? '2' : '1';
  },
  methods: {
    getImage(img) {
      if (this.multiple) {
        let obj = {};
        let imgList = [];
        imgList = img.reduce((cur, next) => {
          obj[next.attId] ? '' : (obj[next.attId] = true && cur.push(next));
          return cur;
        }, []);
        imgList.map((item) => {
          this.imageList.push(item.sattDir);
        });
        this.$emit('input', JSON.stringify(this.imageList));
      } else {
        this.image = img[0].sattDir;
        this.$emit('input', this.image);
      }
    },
    // 点击商品图
    modalPicTap(tit, num, i) {
      const _this = this;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          _this.getImage(img);
        },
        tit,
        'selfUpload',
      );
    },
    handleRemove(i) {
      this.imageList.splice(i, 1);
      this.$emit('input', JSON.stringify(this.imageList));
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
      const newItems = [...this.imageList];
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);
      newItems.splice(dst, 0, ...newItems.splice(src, 1));
      this.imageList = newItems;
    },
  },
};
</script>

<style scoped lang="scss">
.btndel {
  position: absolute;
  z-index: 1;
  width: 20px !important;
  height: 20px !important;
  left: 46px;
  top: -4px;
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
</style>
