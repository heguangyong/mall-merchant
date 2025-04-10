<template>
  <div class="divBox">
    <div class="container_box">
      <pages-header
        ref="pageHeader"
        :title="`${type == 1 ? '编辑' : '添加'}拼团活动`"
        :backUrl="'/marketing/group/activity'"
      ></pages-header>
      <el-card class="box-card box-body mt14 list-tabs" shadow="never" :bordered="false">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础设置" name="first"></el-tab-pane>
          <el-tab-pane label="添加商品" name="second"></el-tab-pane>
        </el-tabs>
        <el-form :model="formData" :rules="rules" ref="form" size="small" class="demo-ruleForm">
          <div v-show="activeName == 'first'">
            <div class="detailSection">
              <div class="title">基础信息</div>
              <el-form-item label="活动名称：" label-width="100px" prop="groupName">
                <el-input
                  class="from-ipt-width"
                  v-model="formData.groupName"
                  placeholder="请输入活动名称"
                  :maxlength="20"
                ></el-input>
                <div class="from-tips">用于管理员区分活动，用户端不展示，最多输入20个字</div>
              </el-form-item>
              <el-form-item label="活动时间：" label-width="100px" prop="startTime">
                <el-date-picker
                  v-model="time"
                  class="selWidth"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="timeChange"
                  @blur="$forceUpdate()"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="成团人数：" label-width="100px" class="group-num-box" prop="buyCount">
                <el-input-number
                  :min="2"
                  :max="10000"
                  type="number"
                  :controls="false"
                  class="from-ipt-width group-num-box"
                  v-model="formData.buyCount"
                  :precision="0"
                ></el-input-number>
                <div class="from-tips">请填写2～10000的整数</div>
                <span class="span">人</span>
              </el-form-item>
              <el-form-item label="成团有效期：" label-width="100px" class="group-num-box" prop="validHour">
                <el-input-number
                  type="number"
                  :controls="false"
                  :min="1"
                  :max="240"
                  class="from-ipt-width"
                  v-model="formData.validHour"
                  :precision="0"
                ></el-input-number>
                <div class="from-tips">
                  设置拼团的有效时间（请输入1～240的整数），用户开团后，需要在设置的时间内拼购指定人数，否则拼团失败，拼团失败系统自动退款。
                </div>
                <span class="span time">小时</span>
              </el-form-item>
              <el-form-item label="活动限购：" label-width="100px" prop="allQuota">
                <el-input-number
                  :min="0"
                  :max="9999"
                  type="number"
                  :controls="false"
                  class="from-ipt-width"
                  v-model="formData.allQuota"
                  :precision="0"
                ></el-input-number>
                <div class="from-tips">
                  请填写0～9999的整数，填0代表不限购；例如设置为4，表示本活动每个商品，每个用户最多可购买4件。
                </div>
              </el-form-item>
              <el-form-item label="单次限购：" label-width="100px" prop="oncQuota">
                <el-input-number
                  :min="0"
                  :max="9999"
                  type="number"
                  :controls="false"
                  class="from-ipt-width"
                  v-model="formData.oncQuota"
                  :precision="0"
                ></el-input-number>
                <div class="from-tips">
                  请填写0～9999的整数，填0代表不限购；例如设置为2，表示每次参与拼团时，用户一次购买数量最大可选择2件。
                </div>
              </el-form-item>
              <div class="title">高级设置</div>
              <el-form-item label="凑团：" label-width="100px">
                <el-switch
                  active-text="开启"
                  inactive-text="关闭"
                  v-model="showGroupSwitch"
                  :width="35"
                  @change="showGroup"
                >
                </el-switch>
                <div class="from-tips">
                  开启凑团后，活动商品详情页会显示待成团的团列表，买家可以直接任选一个参团，提升成团率。
                </div>
              </el-form-item>
              <el-form-item label="虚拟成团：" label-width="100px" v-show="showGroupSwitch">
                <el-switch
                  active-text="开启"
                  inactive-text="关闭"
                  v-model="fictiStatusSwitch"
                  :width="35"
                  @change="fictiStatus"
                >
                </el-switch>
                <div class="from-tips">
                  开启虚拟成团后，该团有效期结束时，人数未满的团，系统将会虚拟“匿名买家”凑满人数，使该团成团。只有已付款参团的真实买家才会获得商品，建议合理开启，以提高成团率.
                </div>
              </el-form-item>
            </div>
          </div>
          <div v-show="activeName == 'second'">
            <el-button type="primary" @click="addGoods">添加活动商品</el-button>
            <div class="table-box" v-for="(item, index) in productList" :key="index">
              <div class="red-delete" @click="deleteGoods(index)">
                <span class="iconfont icon-shanchu"></span>
              </div>
              <div class="detailHead">
                <div class="full">
                  <i
                    class="iconfont iconChange"
                    :class="item.visible ? 'icon-xuanze' : 'icon-xiala1'"
                    @click="openClose(item)"
                  ></i>
                  <img :src="item.image" alt="" />
                  <div class="text">
                    <div class="title line1" :title="item.name">
                      {{ item.name }}
                    </div>
                  </div>
                  <div>
                    <el-popover
                      :append-to-body="false"
                      placement="bottom"
                      trigger="click"
                      v-model="item.priceVisible"
                      width="300"
                    >
                      <div class="acea-row row-middle">
                        <el-input
                          type="number"
                          style="width: 120px"
                          v-model="item.inputPrice"
                          placeholder="请输入拼团价"
                        ></el-input>
                        <el-button
                          class="ml14"
                          size="mini"
                          @click="
                            colosePrice(item);
                            item.priceVisible = false;
                          "
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          size="mini"
                          @click="
                            setActivePrice(item, item.inputPrice);
                            item.priceVisible = false;
                          "
                          >确定</el-button
                        >
                      </div>
                      <el-button slot="reference" size="small" class="mr10">设置拼团价</el-button>
                    </el-popover>
                  </div>
                  <div>
                    <el-popover :append-to-body="false" width="375" placement="bottom" v-model="item.numVisible">
                      <div class="acea-row row-middle">
                        <el-input
                          type="number"
                          style="width: 120px"
                          v-model="item.inputNum"
                          placeholder="请输入拼团限量"
                        ></el-input>
                        <el-button
                          class="ml14"
                          size="mini"
                          @click="
                            coloseNum(item);
                            item.numVisible = false;
                          "
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          size="mini"
                          @click="
                            setQuotaShow(item, item.inputNum);
                            item.numVisible = false;
                          "
                          >确定</el-button
                        >
                      </div>
                      <el-button slot="reference" size="small" class="mr10">设置拼团限量</el-button>
                    </el-popover>
                  </div>
                </div>
              </div>
              <div class="tablelHead" v-if="!item.visible">
                <el-table
                  ref="tableList"
                  row-key="id"
                  :data="item.attrValue"
                  size="small"
                  default-expand-all
                  style="width: 100%"
                >
                  <el-table-column width="30"></el-table-column>
                  <el-table-column label="图片">
                    <template slot-scope="scope">
                      <img :src="scope.row.image" alt="" />
                    </template>
                  </el-table-column>
                  <el-table-column label="规格" prop="sku"></el-table-column>
                  <el-table-column label="商品编码" prop="barCode"></el-table-column>
                  <el-table-column label="售价（元）" prop="price"></el-table-column>
                  <el-table-column label="剩余库存" prop="stock"></el-table-column>
                  <el-table-column label="拼团价（元）">
                    <template slot-scope="scope" v-if="scope.row.sku">
                      <el-input-number
                        type="number"
                        :min="0.01"
                        :max="999999.99"
                        :controls="false"
                        v-model="scope.row.activePrice"
                        :precision="2"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="拼团限量">
                    <template slot-scope="scope" v-if="scope.row.sku">
                      <el-input-number
                        :min="0"
                        :max="scope.row.stock"
                        type="number"
                        :controls="false"
                        v-model="scope.row.quotaShow"
                        :precision="0"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-form>
      </el-card>
      <el-card dis-hover class="fixed-card" shadow="never" :bordered="false">
        <div class="acea-row row-center-wrapper">
          <el-button v-show="activeName == 'second'" size="small" @click="activeName = 'first'">上一步</el-button>
          <el-button v-show="activeName == 'first'" type="primary" size="small" @click="toGo('form')">下一步</el-button>
          <el-button
            v-show="activeName == 'second'"
            type="primary"
            size="small"
            v-debounceClick="
              () => {
                submitForm('form');
              }
            "
            >提交</el-button
          >
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { groupBuySave, groupBuyInfo, groupBuyUpdate } from '@/api/group';
export default {
  data() {
    return {
      isAdd: true,
      activeName: 'first',
      formData: {
        id: '',
        //团名
        groupName: '',
        //成团人数
        buyCount: '',
        //有效期
        validHour: '',
        //活动限购
        allQuota: '',
        //单次限购
        oncQuota: '',
        //凑团
        showGroup: 0,
        //模拟成团
        fictiStatus: 0,
        //开始时间
        startTime: '',
        //结束时间
        endTime: '',
        //sku
        groupBuySkuRequest: [],
      },
      productList: [],
      //凑团
      showGroupSwitch: 0,
      //模拟成团
      fictiStatusSwitch: 0,
      time: '',
      rules: {
        groupName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        buyCount: [{ required: true, message: '请输入成团人数', trigger: 'blur' }],
        validHour: [{ required: true, message: '请输入有效时间', trigger: 'blur' }],
        allQuota: [{ required: true, message: '请输入活动限购数量', trigger: 'blur' }],
        oncQuota: [{ required: true, message: '请输入单次限购数量', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
      },
      activityId: '',
      type: '',
      visible: false,
    };
  },
  created() {
    if (this.$route.params.activityId) {
      this.type = this.$route.params.type;
      this.getInfo(this.$route.params.activityId);
      if (this.$route.params.type == 1) {
        this.activityId = this.$route.params.activityId;
        this.formData.id = this.$route.params.activityId;
      }
    }
  },
  methods: {
    openClose(item) {
      if (item.visible) {
        this.$set(item, 'visible', false);
      } else {
        this.$set(item, 'visible', true);
      }
    },
    //编辑复制-数据回显
    getInfo(id) {
      groupBuyInfo(id).then((res) => {
        this.formData = res;
        this.time = [res.startTime, res.endTime];
        this.showGroupSwitch = res.showGroup == 0 ? false : true;
        this.fictiStatusSwitch = res.fictiStatus == 0 ? false : true;
        let editArr = [];
        res.groupBuyActivityProductResponseList.forEach((item) => {
          if (item.groupBuyActivitySkuResponses.length) {
            let obj = {
              id: item.productId,
              name: item.productName,
              image: item.image,
              attrValue: [],
            };
            item.groupBuyActivitySkuResponses.forEach((citem) => {
              if (citem.attrValue.length) {
                obj.attrValue.push({
                  activePrice: citem.activePrice,
                  groupActivityId: citem.groupActivityId,
                  id: citem.id,
                  productId: citem.productId,
                  quotaShow: citem.quotaShow,
                  skuId: citem.skuId,
                  sku: citem.attrValue[0].sku,
                  image: citem.attrValue[0].image,
                  price: citem.attrValue[0].price,
                  stock: citem.attrValue[0].stock,
                });
              }
            });
            editArr.push(obj);
          }
        });
        // this.formData.groupBuySkuRequest = editArr;
        this.productList = editArr;
      });
    },
    toGo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.activeName = 'second';
        } else {
          return false;
        }
      });
    },
    timeChange(e) {
      if (e) {
        this.formData.startTime = e[0];
        this.formData.endTime = e[1];
      } else {
        this.formData.startTime = '';
        this.formData.endTime = '';
      }
    },
    //模拟成团开关
    fictiStatus(e) {
      e ? (this.formData.fictiStatus = 1) : (this.formData.fictiStatus = 0);
    },
    //凑团开关
    showGroup(e) {
      if (e) {
        this.formData.showGroup = 1;
      } else {
        this.formData.fictiStatus = 0;
        this.formData.showGroup = 0;
        this.fictiStatusSwitch = 0;
      }
    },
    //添加商品
    addGoods() {
      const _this = this;
      this.$modalActivityProduct(
        function (row) {
          _this.listLoading = false;
          _this.getAttrValue(row);
        },
        'many',
        _this.productList,
        0,
        2,
        // Number(_this.form.id),
      );
    },
    //删除商品
    deleteGoods(index) {
      this.$modalSure('要删除此商品吗？').then(() => {
        this.productList.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      });
    },
    //获取商品
    getAttrValue(row) {
      let procuctList = row;
      row.forEach((item) => {
        item.attrValue.forEach((citem) => {
          if (!citem.activePrice) {
            this.$set(citem, 'activePrice', 0.01);
          }
          if (!citem.quotaShow) {
            this.$set(citem, 'quotaShow', 0);
          }
        });
      });
      this.productList = row;
    },
    setActivePrice(item, V) {
      item.attrValue.forEach((item) => {
        this.$set(item, 'activePrice', V);
      });
      this.$set(item, 'inputPrice', '');
    },
    colosePrice(item) {
      this.$set(item, 'inputPrice', '');
    },
    setQuotaShow(item, V) {
      item.attrValue.forEach((item) => {
        this.$set(item, 'quotaShow', V);
      });
      this.$set(item, 'inputNum', '');
    },
    coloseNum(item) {
      this.$set(item, 'inputNum', '');
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let total = 0;
          let price = 0;
          this.productList.map((item) => {
            item.attrValue.forEach((i) => {
              total += i.quotaShow;
              price += i.activePrice;
            });
          });
          if (!total && total !== 0) return this.$message.warning('商品限量不能为空');
          if (!price) return this.$message.warning('商品拼团价格不能为空');
          if (total < this.productList.length) return this.$message.warning('商品限量总和不能小于0');
          if (this.productList.length > 10) return this.$message.warning('最多添加10个商品');
          let arr = [];
          this.productList.forEach((item) => {
            item.attrValue.forEach((val) => {
              arr.push({
                activePrice: val.activePrice,
                productId: val.productId,
                quotaShow: val.quotaShow,
                skuId: val.skuId ? val.skuId : val.id,
                id: this.type == 1 ? val.id : '',
                groupActivityId: this.$route.params.activityId ? this.$route.params.activityId : '',
              });
            });
          });
          this.formData.groupBuySkuRequest = arr;
          this.formData.productCount = this.productList.length;
          if (this.type == 1) {
            groupBuyUpdate(this.formData)
              .then((res) => {
                this.$message.success('修改成功');
                this.$router.push({ path: '/marketing/group/activity/3' });
              })
              .catch((err) => {
                this.$message.error(err);
              });
          } else {
            groupBuySave(this.formData)
              .then((res) => {
                this.$message.success('添加成功');
                this.$router.push({ path: '/marketing/group/activity/3' });
              })
              .catch((err) => {
                this.$message.error(err);
              });
          }
        } else {
          this.$message.warning('请填写基础设置');
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add_title {
  position: relative;
}
.box-body {
  ::v-deep.el-card__body {
    padding-top: 0px;
  }
}

.f-w-500 {
  font-weight: 500;
}
.f-s-18 {
  font-size: 18px;
}
.ml32 {
  margin-left: 32px;
}
.row_title {
  min-width: 200px !important;
}
.input_width {
  width: 100px;
}
.pictrue {
  width: 58px;
  height: 58px;
  margin-right: 10px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .del {
    position: absolute;
    top: 0;
    right: 0;
  }
}
::v-deep .right-align {
  padding-bottom: 20px !important;
}
.detailSection {
  border-top: none;
  .title {
    margin-bottom: 20px;
  }
}
.group-num-box {
  position: relative;
  .span {
    position: absolute;
    top: 0;
    left: 430px;
    font-size: 13px;
  }
  .span.time {
    left: 420px;
  }
}
.table-box {
  position: relative;
  margin-top: 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  .detailHead {
    padding: 15px 25px 5px 20px !important;
  }
  .tablelHead {
    padding: 0 20px 15px;
  }
  .full {
    img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
  }
  .title.line1 {
    width: 600px;
  }
}
.selWidth {
  width: 460px !important;
}
::v-deep.el-input-number .el-input__inner {
  text-align: left;
}
// .red-delete {
//   width: 50px;
//   height: 50px;
//   border-radius: 0 6px 0 0;
//   position: absolute;
//   top: 0;
//   right: 0;
//   background: red;
// }
.red-delete {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  &::before {
    border: 20px solid red;
    border-left: 20px solid transparent;
    border-top: 20px solid transparent;
    border-bottom-right-radius: 6px;
    content: '';
    position: relative;
    width: 0;
    transform: rotate(-90deg);
    position: absolute;
    right: 0;
    top: 0;
  }
  .icon-shanchu {
    font-size: 16px;
    color: #fff;
    position: absolute;
    right: 2.5px;
    top: 2.5px;
    z-index: 999;
  }
}
.ml14 {
  margin-left: 14px;
}
.iconChange {
  font-size: 16px !important;
  color: #999 !important;
  cursor: pointer;
}
::v-deep .list-tabs .el-card__body {
  padding-bottom: 60px !important;
}
</style>
