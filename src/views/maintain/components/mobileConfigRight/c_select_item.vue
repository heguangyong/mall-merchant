<template>
  <div class="select-word borderPadding" v-if="configData">
    <div class="c_row-item">
      <div class="c_label labelwidth">
        {{ configData.title }}
      </div>
      <div class="slider-box ml22">
        <div class="inputs" v-for="(item, index) in configData.list" :key="index">
          <el-input size="small" v-model="item.val" maxlength="10" placeholder="选填，不超过十个字">
            <i v-if="index > 1" slot="suffix" class="el-icon-delete" @click="bindDelete(index)"></i>
          </el-input>
        </div>
        <div class="button acea-row row-between-wrapper" :class="configData.list.length == 0 ? 'on' : ''">
          <div class="bnt acea-row row-center-wrapper" @click="addHotTxt">
            <span class="iconfont iconjia"></span>
            添加单个选项
          </div>
          <div class="bnt acea-row row-center-wrapper" @click="visible = true">
            <span class="iconfont iconjia"></span>
            批量添加选项
          </div>
          <div class="batchCount" v-if="visible">
            <div class="batchItem on">
              <div class="title">批量添加选项</div>
              <div class="tips">可按回车键添加多个选项</div>
              <el-input v-model="batchWord" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
              <div class="batchBnt acea-row row-right">
                <el-button @click.stop="cancel(1)" size="small">取消</el-button>
                <el-button type="primary" size="small" class="ml10" @click.stop="cancel(2)">确定</el-button>
              </div>
            </div>
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
  name: 'c_select_item',
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
      batchWord: '',
      visible: false,
    };
  },
  created() {
    this.defaults = this.configObj;
    this.configData = this.configObj[this.configNme];
  },
  watch: {
    configObj: {
      handler(nVal, oVal) {
        this.configData = nVal[this.configNme];
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleConfirm() {
      // 执行确认操作
    },
    handleCancel() {
      // 执行取消操作
    },
    cancel(num) {
      this.visible = false;
      if (num == 2) {
        let arr = this.batchWord.split('\n');
        let arrNew = [];
        arr.forEach((item) => {
          let obj = {};
          obj['val'] = item;
          arrNew.push(obj);
        });
        this.configData.list = this.configData.list.concat(arrNew);
      }
      this.batchWord = '';
    },
    addHotTxt() {
      let obj = {
        val: '',
      };
      this.configData.list.push(obj);
    },
    // 删除数组
    bindDelete(index) {
      this.configData.list.splice(index, 1);
    },
  },
};
</script>

<style scoped lang="scss">
.poptipOn {
  display: none;
}
::v-deep textarea.ivu-input {
  resize: none;
}
::v-deep .el-input__suffix {
  line-height: 32px;
}
.batchCount {
  text-align: left;
  padding: 8px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 21, 41, 0.16);
  position: absolute;
  right: 10px;
  top: 50px;
  z-index: 50;
  &::before {
    content: '';
    border: 9px solid transparent;
    border-bottom-color: #ffffff;
    position: absolute;
    top: -16px;
    right: 60px;
    z-index: 60;
  }
}
.batchItem {
  padding-left: 2px;
  padding-right: 2px;
  .title {
    font-size: 13px;
    color: #333;
    font-weight: 400;
    margin-top: 6px;
  }
  .tips {
    font-size: 12px;
    color: #999999;
    font-weight: 400;
    margin-top: 3px;
    margin-bottom: 10px;
  }
  .batchBnt {
    margin-top: 12px;
  }
}
.select-word {
  margin-bottom: 20px;
  .c_row-item {
    align-items: baseline !important;
    color: #666;
    .button {
      margin-top: 20px;
      position: relative;
      &.on {
        margin-top: 0;
      }
      .bnt {
        width: 150px;
        height: 32px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        font-size: 13px;
        cursor: pointer;
        .iconfont {
          font-size: 12px;
          color: var(--prev-color-primary);
          margin-right: 5px;
        }
      }
    }
    .inputs {
      margin-bottom: 10px;
    }
  }
}
::v-deep .select-word .c_row-item .ivu-input-suffix i {
  color: #999;
  font-size: 18px;
}
.el-icon-delete {
  cursor: pointer;
}
</style>
