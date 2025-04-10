<template>
  <div>
    <!-- 商品添加选择-->
    <el-dialog
      :visible.sync="proTypedialogVisible"
      title="选择商品类型"
      destroy-on-close
      :close-on-click-modal="false"
      width="700px"
    >
      <el-form
        ref="formValidate"
        class="formValidate mt20"
        :model="formValidate"
        label-width="120px"
        @submit.native.prevent
      >
        <el-form-item label="商品类型：" required>
          <div class="acea-row">
            <div
              v-for="(item, index) in productType"
              :key="index"
              class="virtual"
              :class="formValidate.type == item.id ? 'virtual_boder' : 'virtual_boder2'"
              @click="handleChangeProductType(item.id, 2)"
            >
              <div class="virtual_top">{{ item.tit }}</div>
              <div class="virtual_bottom">({{ item.tips }})</div>
              <div v-if="formValidate.type == item.id" class="virtual_san" />
              <div v-if="formValidate.type == item.id" class="virtual_dui">✓</div>
            </div>
          </div>
          <div class="font12 add-product-title">云盘商品、卡密商品不支持用户申请售后。</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proTypedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSureType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formValidate: {
        type: 0,
      },
      productType: [
        { tit: '普通商品', id: 0, tips: '实体货物' },
        { tit: '云盘商品', id: 5, tips: '同一链接发货' },
        { tit: '卡密商品', id: 6, tips: '不同充值码发货' },
        { tit: '虚拟商品', id: 2, tips: '虚拟发货' },
      ], //商品类型
      proTypedialogVisible: false, //选择商品类型弹窗
    };
  },
  props: {
    addType: {
      type: String,
      default: function () {
        return 'isAdd';
      },
    },
  },
  methods: {
    //选择商品类型确定
    handleSureType() {
      this.proTypedialogVisible = false;
      let addType = this.addType === 'isAdd' ? 2 : 1;
      //id:商品id，isDisabled：是否能编辑(1不能，2能)，isCopy：是否是采集商品(1是，2不是)
      this.$router.push({ path: `/product/list/creatProduct/0/2/${addType}/${this.formValidate.type}` });
    },
    //选择商品类型
    handleChangeProductType(id) {
      this.formValidate.type = id;
    },
  },
};
</script>

<style scoped lang="scss">
.virtual {
  width: 120px;
  height: 60px;
  background: #ffffff;
  border-radius: 3px;
  text-align: center;
  padding-top: 8px;
  position: relative;
  cursor: pointer;
  line-height: 23px;
  .virtual_top {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .virtual_bottom {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
  }
}
.virtual_san {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-bottom: 26px solid var(--prev-color-primary);
  border-left: 26px solid transparent;
}
.virtual_dui {
  position: absolute;
  bottom: -2px;
  right: 2px;
  color: #ffffff;
  font-family: system-ui;
}
.virtual:nth-child(2n) {
  margin: 0 12px;
}
.virtual_boder {
  border: 1px solid var(--prev-color-primary);
}
.virtual_boder2 {
  border: 1px solid #e7e7e7;
}
</style>
