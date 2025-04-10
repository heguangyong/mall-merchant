<template>
  <div class="c_radio mb15 borderPadding" v-if="configData">
    <div class="acea-row" :class="{ on: configData.type == 'ranges' }">
      <div class="c_label labelwidth">
        {{ configData.title }}
      </div>
      <div class="color-box ml22">
        <div class="mb10">
          <el-radio-group v-model="configData.tabVal" @on-change="radioChange($event)">
            <el-radio :label="key" v-for="(radio, key) in configData.tabList" :key="key">
              <span>{{ radio.name }}</span>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="mb10">
          <el-radio-group
            v-model="configData.tabData"
            @on-change="radioDataChange($event)"
            v-if="configData.tabVal == 0"
          >
            <el-radio :label="key" v-for="(radio, key) in configData.dataList" :key="key + 'data'">
              <span>{{ radio.name }}</span>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="width100">
          <el-date-picker
            type="date"
            class="width100"
            v-model="configData.specifyDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="请选择"
            size="small"
            style="margin-top: 6px"
            v-if="configData.tabData == 1 && configData.tabVal == 0 && configData.type == 'data'"
          />
          <el-time-picker
            class="width100"
            type="datetime"
            value-format="HH:mm"
            format="HH:mm"
            v-model="configData.specifyDate"
            placeholder="请选择"
            size="small"
            style="margin-top: 6px"
            v-else-if="configData.tabData == 1 && configData.tabVal == 0 && configData.type == 'time'"
          />
          <el-date-picker
            class="width100"
            type="daterange"
            placement="bottom-end"
            v-model="configData.specifyDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="请选择"
            size="small"
            style="margin-top: 6px"
            v-else-if="configData.tabData == 1 && configData.tabVal == 0 && configData.type == 'daterange'"
            @change="getDaterange"
          />
          <el-time-picker
            class="width100"
            is-range
            value-format="HH:mm"
            format="HH:mm"
            type="datetimerange"
            v-model="configData.specifyDate"
            placement="bottom-end"
            placeholder="请选择"
            size="small"
            style="margin-top: 6px"
            v-else-if="configData.tabData == 1 && configData.tabVal == 0 && configData.type == 'timerange'"
          />
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
  name: 'c_comb_data',
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
    };
  },
  created() {
    this.defaults = this.configObj;
    this.configData = this.configObj[this.configNme];
  },
  watch: {
    configObj: {
      handler(nVal, oVal) {
        this.defaults = nVal;
        this.configData = nVal[this.configNme];
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getDaterange(e) {
      this.$emit('getConfig', { type: 2, val: e });
    },
    radioChange(e) {
      this.$emit('getConfig', { type: 0, val: e });
    },
    radioDataChange(e) {
      this.$emit('getConfig', { type: 1, val: e });
    },
  },
};
</script>

<style scoped lang="scss">
.color-box {
  width: 77%;
}
.c_radio {
  .c_row-item {
    align-items: unset;
    &.on {
      display: block;
    }
  }
}
::v-deep .el-date-editor {
  width: 100%;
}
::v-deep .c_radio .el-radio {
  margin: 5px 25px 5px 0;
}
</style>
