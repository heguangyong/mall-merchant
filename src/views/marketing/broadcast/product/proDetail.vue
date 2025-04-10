<template>
  <div class="divBox">
    <el-dialog v-if="dialogVisible" title="商品信息" :visible.sync="dialogVisible" width="540px" class="dialog-bottom">
      <div v-loading="loading">
        <div class="box-container">
          <div v-if="isEdit" class="list">
            <label class="name">排序：</label>
            <el-input
              v-model.number="FormData.sort"
              type="number"
              placeholder="请输入序号"
              class="selWidth"
              size="small"
              style="padding-right: 0"
            />
          </div>
          <div v-else class="list sp">
            <label class="name">排序：</label>
            <span class="info">{{ FormData.sort }}</span>
          </div>
          <div class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
            <el-button size="small" type="primary" @click="handleSort">确定</el-button>
          </div>
        </div>
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
import { liveGoodsInfoApi, liveGoodsSortApi } from '@/api/marketing';

export default {
  name: 'BroadcastProDetail',
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      option: {
        form: {
          labelWidth: '150px',
        },
      },
      FormData: {
        sort: 0,
      },
      loading: false,
    };
  },
  mounted() {},
  methods: {
    getData(id) {
      this.loading = true;
      liveGoodsInfoApi(id)
        .then((res) => {
          this.FormData = res;
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    // 排序
    handleSort() {
      liveGoodsSortApi(this.FormData.id, this.FormData.sort).then((res) => {
        this.dialogVisible = false;
        this.$emit('getList');
        this.$message.success('操作成功');
      });
    },
  },
};
</script>

<style scoped>
.box-container .list {
  line-height: 40px;
}
.selWidth {
  width: 87% !important;
}
.box-container .sp {
  width: 50%;
}
.box-container .sp3 {
  width: 33.3333%;
}
.box-container .sp100 {
  width: 100%;
}
.box-container .list .name {
  display: inline-block;
  width: 60px;
  text-align: right;
  color: #606266;
}
.box-container .list .blue {
  color: #1890ff;
}
.box-container .list.image {
  margin-bottom: 40px;
}
.box-container .list.image img {
  position: relative;
  top: 40px;
}
.el-textarea {
  width: 400px;
}
::v-deep .el-input__inner {
  padding-right: 0;
  width: 100%;
}
.dialog-footer {
  text-align: right !important;
  padding-bottom: 20px !important;
  padding-top: 30px;
}
</style>
