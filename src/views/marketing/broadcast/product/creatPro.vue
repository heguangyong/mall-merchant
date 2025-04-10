<template>
  <div class="divBox">
    <div class="container_box">
      <pages-header ref="pageHeader" title="添加直播商品" backUrl="/marketing/broadcast/product"></pages-header>
    </div>
    <el-card class="box-card box-body mt14" shadow="never" :bordered="false">
      <el-form ref="form" :model="form" label-width="120px" size="small" class="demo-ruleForm">
        <div v-if="!isEdit" class="acea-row row-between-wrapper">
          <div class="acea-row mb20">
            <el-button size="small" type="primary" @click="addGoods()">添加商品</el-button>
            <el-button size="small" @click="batchDel" :disabled="isShowCheck">批量删除</el-button>
          </div>
        </div>
        <el-table
          ref="tableList"
          row-key="id"
          :data="proData"
          v-loading="listLoading"
          size="small"
          class="tableSelection"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="!isEdit" type="selection" width="55"></el-table-column>
          <el-table-column prop="name" min-width="150" label="商品名称">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.name"
                maxlength="14"
                @keyup.native="keyupEvent(scope.$index, scope.row.name)"
                placeholder="最长14个汉字"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品图" min-width="80">
            <template slot-scope="scope">
              <div class="upLoadPicBox line-heightOne" @click="modalPicTap('1', 'duo', scope.$index)">
                <div v-if="scope.row.image" class="pictrue tabPic"><img :src="scope.row.image" /></div>
                <div v-else class="upLoad tabPic">
                  <i class="el-icon-camera cameraIconfont" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格类型" min-width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.priceType" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="直播价" min-width="160">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.price"
                type="number"
                :precision="2"
                :min="0.01"
                :max="99999"
                :controls="false"
                class="input_width"
              >
              </el-input-number>
              <span v-if="scope.row.priceType === 2 || scope.row.priceType === 3"></span>
              <el-input-number
                v-if="scope.row.priceType === 2 || scope.row.priceType === 3"
                v-model="scope.row.price2"
                type="number"
                :precision="2"
                :min="0.01"
                :max="99999"
                :controls="false"
                class="input_width"
              >
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column v-if="!isEdit" label="操作" width="70" fixed="right">
            <template slot-scope="scope">
              <a v-if="!scope.row.sku" @click="handleDelete(scope.$index, scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
    <el-card dis-hover class="fixed-card" shadow="never" :bordered="false">
      <div class="acea-row row-center-wrapper">
        <el-button
          v-hasPermi="['merchant:seckill:product:add']"
          type="primary"
          v-debounceClick="
            () => {
              submitForm();
            }
          "
          size="small"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { liveGoodsSaveApi, liveGoodsInfoApi, liveMediaUploadlocalApi, liveGoodsuUpdateApi } from '@/api/marketing';
import * as selfUtil from '@/utils/ZBKJIutil.js';
import { mapGetters } from 'vuex';
export default {
  name: 'creatPro',
  data() {
    return {
      options: [
        {
          value: 1,
          label: '一口价',
        },
        {
          value: 2,
          label: '价格区间（左边不能大于右边）',
        },
        {
          value: 3,
          label: '折扣价（左边为原价，右边为现价）',
        },
      ],
      form: {
        // coverImgUrl: '',
        // name: '',
        // price: '',
        // priceType: '',
      },
      multipleSelection: [],
      proData: [],
      listLoading: false,
      loading: false,
      keyNum: 0,
      isShowCheck: false,
      attrValue: [], //普通商品sku数组
      productId: 0, //普通商品id
      multipleSelectionAll: [],
    };
  },
  mounted() {
    if (this.$route.params.liveId !== '0') {
      this.getInfo();
    }
  },
  computed: {
    //判断是否是编辑
    isEdit() {
      return this.$route.params.liveId !== '0' ? true : false;
    },
  },
  methods: {
    //价格名称
    keyupEvent(i, key) {
      this.proData[i].name = key.substring(0, 14);
    },
    // 点击商品图
    modalPicTap(tit, num, i, status) {
      const _this = this;
      if (_this.isDisabled) return;
      this.$modalUpload(
        async function (img) {
          if (!img) return;
          if (tit === '1' && num === 'duo') {
            _this.proData[i].image = img[0].sattDir;
            _this.proData[i].coverImgUrl = await _this.getImgData(img[0].sattDir);
          }
        },
        tit,
        'content',
      );
    },
    //选择
    handleSelectionChange(val) {
      this.multipleSelectionAll = val;
      this.multipleSelectionAll.forEach((item) => {
        this.$set(item, 'checked', true);
      });
      // this.$set(row, 'checked', val);
      if (val.length > 0) {
        this.isShowCheck = false;
      } else {
        this.isShowCheck = true;
      }
    },
    //详情
    getInfo() {
      this.listLoading = true;
      liveGoodsInfoApi(this.$route.params.liveId)
        .then(async (res) => {
          if (res) {
            this.proData = [res];
            this.proData.map((item) => {
              this.$set(item, 'image', res.coverImgUrlLocal);
              this.$set(item, 'price', Number(res.price));
              this.$set(item, 'price2', Number(res.price2));
              this.$set(item, 'price3', Number(res.price3));
            });
          }
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    back() {
      this.$router.push({ path: `/marketing/broadcast/product` });
    },
    //行删除
    handleDelete(index, row) {
      this.$modalSure('删除该直播商品吗？').then(() => {
        let i = this.proData.findIndex((item) => item == row);
        this.proData.splice(i, 1);
      });
    },
    batchDel() {
      this.$modalSure(`批量删除直播商品吗？`).then(() => {
        this.proData.forEach((itemA, indexA) => {
          this.multipleSelectionAll.forEach((itemB) => {
            if (itemA.id === itemB.id) {
              this.proData.splice(indexA, 1);
            }
          });
        });
        this.proData = this.proData.filter((item) => !item.checked);
      });
    },
    //添加商品
    addGoods() {
      const _this = this;
      this.$modalGoodList(
        function (row) {
          _this.listLoading = false;
          row.map((item) => {
            this.$set(item, 'priceType', 1);
            this.$set(item, 'name', item.name.substring(0, 14));
          });
          _this.proData = row;
          _this.getShopImgUpload(row);
        },
        'many',
        _this.proData,
        Number(_this.form.id),
      );
    },
    // 获取微信mediaId码
    async getShopImgUpload(attrs) {
      for (const key in attrs) {
        attrs[key].coverImgUrl = await this.getImgData(attrs[key].image);
      }
      return attrs;
    },
    // 传入图片地址调接口，获取到微信mediaId码
    getImgData(file) {
      this.listLoading = true;
      return new Promise((resolve, reject) => {
        liveMediaUploadlocalApi({ imagePath: file, type: 'image' })
          .then((res) => {
            resolve(res.mediaId);
            this.listLoading = false;
          })
          .catch((res) => {
            this.listLoading = false;
          });
      });
    },
    // 提交
    submitForm() {
      let price2 = 0;
      let price = 0;
      let priceType = '';
      let name = '';
      let list = [];
      this.proData.map((item) => {
        priceType = item.priceType;
        price2 = item.price2;
        price = item.price;
        name = item.name;
      });
      if (this.proData.length === 0) return this.$message.warning('请至少添加一个商品');
      if (!name) return this.$message.warning('商品名称不能为空');
      if (!priceType) return this.$message.warning('价格类型不能为空');
      if ((priceType === 2 || priceType === 3) && !price2 && !price) return this.$message.warning('两个价格不能为空');
      if (priceType === 2 && price2 < price) return this.$message.warning('左边价格不能大于右边价格');
      let proData = [...this.proData];
      proData.map((item) => {
        list.push({
          coverImgUrl: item.coverImgUrl,
          name: item.name,
          price: item.price,
          price2: item.price2,
          priceType: item.priceType,
          productId: this.$route.params.liveId === '0' ? item.id : item.productId,
          coverImgUrlLocal: item.image,
          url:
            this.$route.params.liveId === '0'
              ? `pages/goods/goods_details/index?id=${item.id}`
              : `pages/goods/goods_details/index?id=${item.productId}`,
          id: this.$route.params.liveId === '0' ? null : Number(this.$route.params.liveId),
        });
      });
      // this.form.id = this.$route.params.activityId ? this.$route.params.activityId : this.form.id;
      this.$route.params.liveId !== '0'
        ? liveGoodsuUpdateApi(list[0])
            .then((res) => {
              this.$message.success('编辑成功');
              this.$router.push({ path: `/marketing/broadcast/product` });
            })
            .catch((res) => {})
        : liveGoodsSaveApi(list)
            .then((res) => {
              this.$message.success('添加成功');
              this.$router.push({ path: `/marketing/broadcast/product` });
            })
            .catch((res) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.add_title {
  position: relative;
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
</style>
