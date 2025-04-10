<template>
  <div class="divBox">
    <pages-header
      ref="pageHeader"
      :title="$route.params.edit === 'edit' ? '优惠券编辑' : !$route.params.id ? '优惠券添加' : '优惠券复制'"
      backUrl="/coupon/list"
    ></pages-header>
    <el-card class="box-card mt14" shadow="never" :bordered="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
        @submit.native.prevent
      >
        <el-form-item label="优惠劵名称：" prop="name">
          <el-input
            v-model.trim="ruleForm.name"
            class="from-ipt-width"
            maxlength="20"
            placeholder="请输入优惠券名称"
            :disabled="$route.params.edit ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item label="优惠劵类别：">
          <el-radio-group v-model="ruleForm.category" :disabled="$route.params.edit ? true : false">
            <el-radio :label="1">商家券</el-radio>
            <el-radio :label="2">商品券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品：" v-if="ruleForm.category === 2" prop="checked">
          <div class="acea-row">
            <template v-if="ruleForm.checked.length">
              <div class="pictrue" v-for="(item, index) in ruleForm.checked" :key="index">
                <img :src="item.image" />
                <i class="el-icon-error btndel" @click="handleRemove(index)" />
              </div>
            </template>
            <div class="upLoadPicBox" @click="changeGood">
              <div class="upLoad">
                <i class="el-icon-camera cameraIconfont" />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="优惠券面值：" prop="money">
          <el-input-number
            v-model.trim="ruleForm.money"
            :min="1"
            :max="9999"
            step-strictly
            label="优惠券面值"
            :disabled="$route.params.edit ? true : false"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="使用门槛：">
          <el-radio-group v-model="threshold" :disabled="$route.params.edit ? true : false">
            <el-radio :label="false">无门槛</el-radio>
            <el-radio :label="true">有门槛</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券最低消费：" prop="minPrice" v-if="threshold">
          <el-input-number
            v-model.trim="ruleForm.minPrice"
            :step="1"
            step-strictly
            :min="1"
            :max="999999"
            label="描述文字"
            :disabled="$route.params.edit ? true : false"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="使用有效期：">
          <el-radio-group v-model="ruleForm.isFixedTime" :disabled="$route.params.edit ? true : false">
            <el-radio :label="false">天数</el-radio>
            <el-radio :label="true">时间段</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用有效期限（天）：" prop="day" v-if="!ruleForm.isFixedTime">
          <el-input-number
            v-model.trim="ruleForm.day"
            :min="1"
            :max="999"
            step-strictly
            label="使用有效期限（天）"
            :disabled="$route.params.edit ? true : false"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="使用有效期限：" prop="resource" v-if="ruleForm.isFixedTime">
          <el-date-picker
            :disabled="$route.params.edit ? true : false"
            v-model="termTime"
            type="datetimerange"
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            :picker-options="pickerOptions"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="领取是否限时：" prop="isTimeReceive">
          <el-radio-group v-model="ruleForm.isTimeReceive" :disabled="$route.params.edit ? true : false">
            <el-radio :label="true">限时</el-radio>
            <el-radio :label="false">不限时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="领取时间：" v-if="ruleForm.isTimeReceive">
          <el-date-picker
            :disabled="$route.params.edit ? true : false"
            v-model="isForeverTime"
            type="datetimerange"
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @blur="handleTimestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="领取方式：" prop="receiveType">
          <el-radio-group v-model="ruleForm.receiveType" :disabled="$route.params.edit ? true : false">
            <el-radio :label="1">手动领取</el-radio>
            <el-radio :label="2">商品买赠券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否限量：" prop="isLimited">
          <el-radio-group v-model="ruleForm.isLimited" :disabled="$route.params.edit ? true : false">
            <el-radio :label="true">限量</el-radio>
            <el-radio :label="false">不限量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布数量：" prop="total" v-if="ruleForm.isLimited">
          <el-input-number
            v-model.trim="ruleForm.total"
            :min="1"
            :max="9999"
            step-strictly
            :disabled="$route.params.edit ? true : false"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number
            v-model.trim="ruleForm.sort"
            :min="1"
            :max="9999"
            step-strictly
            label="排序"
            :disabled="$route.params.edit ? true : false"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="ruleForm.status" :disabled="$route.params.edit ? true : false">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="loading"
            v-hasPermi="['merchant:coupon:save', 'merchant:coupon:product:join:edit']"
            >立即提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
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

import { couponSaveApi, couponInfoApi, couponProductEditApi } from '@/api/product';
import { Debounce } from '@/utils/validate';
import { checkPermi } from '@/utils/permission';
export default {
  name: 'creatCoupon',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() < new Date().setTime(new Date().getTime() - 3600 * 1000 * 24); //不限制未来时间
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 600 * 8.64e7; //限制未来时间
        },
      },
      loading: false,
      threshold: false,
      termTime: [],
      props2: {
        children: 'child',
        label: 'name',
        value: 'id',
        checkStrictly: true,
        emitPath: false,
      },
      couponType: 0,
      term: 'termday',
      ruleForm: {
        category: 1,
        isFixedTime: false,
        name: '',
        money: 1,
        minPrice: 1,
        day: null,
        isTimeReceive: false,
        productIds: '',
        receiveType: 2,
        isLimited: false,
        useStartTime: '', // 使用
        useEndTime: '', // 结束
        receiveStartTime: '', //领取
        receiveEndTime: '',
        sort: 0,
        total: 1,
        status: false,
        checked: [],
      },
      isForeverTime: [],
      rules: {
        name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        day: [{ required: true, message: '请输入使用有效期限（天）', trigger: 'blur' }],
        money: [{ required: true, message: '请输入优惠券面值', trigger: 'blur' }],
        productIds: [{ required: true, message: '请选择品类', trigger: 'change' }],
        checked: [{ required: true, message: '请至少选择一个商品', trigger: 'change', type: 'array' }],
        isForeverTime: [{ required: true, message: '请选择领取时间', trigger: 'change', type: 'array' }],
        total: [{ required: true, message: '请输入发布数量', trigger: 'blur' }],
        minPrice: [{ required: true, message: '请输入最低消费', trigger: 'blur' }],
      },
      tempRoute: {},
    };
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
  },
  mounted() {
    if (this.$route.params.id) {
      this.setTagsViewTitle();
      this.getInfo();
    }
  },
  methods: {
    setTagsViewTitle() {
      const title =
        this.$route.params.edit === 'edit' ? '优惠券编辑' : !this.$route.params.id ? '优惠券添加' : '优惠券复制';
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.id}` });
      this.$store.dispatch('tagsView/updateVisitedView', route);
    },
    handleTimestamp() {},
    getInfo() {
      this.loading = true;
      couponInfoApi(this.$route.params.id)
        .then((res) => {
          const info = res;
          this.ruleForm = {
            category: info.category,
            isFixedTime: info.isFixedTime,
            isTimeReceive: info.receiveEndTime ? true : false, //复制优惠券如果没有限制结束时间
            name: info.name,
            money: info.money,
            minPrice: info.minPrice,
            day: info.day,
            receiveType: info.receiveType,
            isLimited: info.isLimited,
            sort: info.sort,
            total: info.total,
            status: info.status,
            productIds: Number(info.productIds),
            checked: res.productList || [],
          };
          info.minPrice == 0 ? (this.threshold = false) : (this.threshold = true);
          info.isTimeReceive
            ? (this.isForeverTime = [info.receiveStartTime, info.receiveEndTime])
            : (this.isForeverTime = []);
          info.isFixedTime && info.useStartTime && info.useEndTime
            ? (this.termTime = [info.useStartTime, info.useEndTime])
            : (this.termTime = []);
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    handleRemove(i) {
      this.ruleForm.checked.splice(i, 1);
    },
    changeGood() {
      const _this = this;
      this.$modalGoodList(
        function (row) {
          _this.ruleForm.checked = row;
        },
        'many',
        _this.ruleForm.checked,
      );
    },
    save(formName) {
      if ((this.ruleForm.isFixedTime && !this.termTime) || (this.ruleForm.isFixedTime && !this.termTime.length))
        return this.$message.warning('请选择使用有效期限');
      if (
        (this.ruleForm.isTimeReceive && !this.isForeverTime) ||
        (this.ruleForm.isTimeReceive && !this.isForeverTime.length)
      )
        return this.$message.warning('请选择请选择领取时间');
      if (!this.threshold) this.ruleForm.minPrice = 0;
      if (!this.ruleForm.isLimited) this.ruleForm.total = 0;
      this.ruleForm.isFixedTime && this.termTime.length
        ? ((this.ruleForm.useStartTime = this.termTime[0]), (this.ruleForm.day = null))
        : (this.ruleForm.useStartTime = '');
      this.ruleForm.isFixedTime && this.termTime.length
        ? ((this.ruleForm.useEndTime = this.termTime[1]), (this.ruleForm.day = null))
        : (this.ruleForm.useEndTime = '');
      this.ruleForm.isTimeReceive && this.isForeverTime.length
        ? (this.ruleForm.receiveStartTime = this.isForeverTime[0])
        : (this.ruleForm.receiveStartTime = '');
      this.ruleForm.isTimeReceive && this.isForeverTime.length
        ? (this.ruleForm.receiveEndTime = this.isForeverTime[1])
        : (this.ruleForm.receiveEndTime = '');
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          couponSaveApi(this.ruleForm)
            .then(() => {
              this.$message.success('新增成功');
              this.loading = false;
              setTimeout(() => {
                this.$router.push({ path: `/coupon/list` });
              }, 200);
              this.closeSelectedTag();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    submitForm: Debounce(function (formName) {
      if (this.ruleForm.category === 2)
        this.ruleForm.productIds = this.ruleForm.checked
          .map((item) => {
            return item.id;
          })
          .join(',');
      if (this.ruleForm.category === 1) this.ruleForm.productIds = '';
      if (!this.$route.params.edit) {
        this.save(formName);
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            couponProductEditApi({
              id: this.$route.params.id,
              productIds: this.ruleForm.productIds,
            })
              .then(() => {
                this.$message.success('编辑成功');
                this.loading = false;
                setTimeout(() => {
                  this.$router.push({ path: `/coupon/list` });
                }, 200);
                this.closeSelectedTag();
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.loading = false;
            return false;
          }
        });
      }
    }),
    closeSelectedTag() {
      let that = this;
      that.$store.dispatch('tagsView/delView', that.$route).then(({ visitedViews }) => {
        if (that.isActive(that.$route)) {
          that.toLastView(visitedViews, that.$route);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
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
.btndel {
  position: absolute;
  z-index: 1;
  width: 20px !important;
  height: 20px !important;
  left: 46px;
  top: -4px;
}
</style>
