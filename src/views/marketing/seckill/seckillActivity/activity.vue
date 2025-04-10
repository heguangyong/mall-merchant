<template>
  <el-dialog
    :before-close="onClose"
    :close-on-click-modal="false"
    :title="type == 1 ? '设置活动价' : '设置限量'"
    :visible.sync="showStatus"
    width="470px"
  >
    <el-form ref="form" size="small" :model="form" label-width="75px">
      <template v-if="type == 1">
        <el-form-item label="活动方式：" required>
          <el-radio-group v-model="form.type">
            <el-radio label="0">活动价</el-radio>
            <el-radio label="1">活动折扣(%)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.type == 0">
          <el-input-number
            v-model="form.price"
            type="number"
            :precision="2"
            :min="0"
            :max="99999"
            :controls="false"
            class="input_width"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item v-if="form.type == 1">
          <el-input-number
            v-model="form.discount"
            type="number"
            :step="1"
            step-strictly
            :min="0"
            :max="100"
            :controls="false"
            class="input_width"
          >
          </el-input-number>
        </el-form-item>
      </template>
      <template v-if="type == 2">
        <el-form-item label="设置限量：" required>
          <el-input-number
            v-model="form.activity_stock"
            :step="1"
            step-strictly
            type="number"
            :min="1"
            :max="99999"
            class="input_width"
          >
          </el-input-number>
        </el-form-item>
      </template>
    </el-form>
    <div class="acea-row row-right bottomPadding">
      <el-button size="small" @click="onClose">取 消</el-button>
      <el-button size="small" type="primary" @click="confirmSet">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      showStatus: false,
      type: 1,
      form: {
        type: '0',
        price: '',
        discount: '',
        activity_stock: '',
      },
    };
  },
  methods: {
    onClose() {
      this.showStatus = false;
      setTimeout(
        (this.form = {
          type: '0',
          price: '',
          discount: '',
          activity_stock: '',
        }),
        500,
      );
    },
    confirmSet() {
      this.$emit('onChange', this.form, this.type);
      this.onClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.input_width {
  width: 330px;
}
.bottomPadding {
  padding-bottom: 20px;
  padding-top: 10px;
}
</style>
