<template>
  <div class="divBox">
    <div class="container_box">
      <pages-header ref="pageHeader" title="添加直播间" backUrl="/marketing/broadcast/room"></pages-header>
    </div>
    <el-card class="box-card mt14" v-loading="listLoading" shadow="never" :bordered="false">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="150px" class="demo-ruleForm">
        <el-form-item label="直播间名字" prop="roomName">
          <el-input
            :disabled="isDetail"
            v-model.trim="formData.roomName"
            placeholder="最短3个汉字，最长17个汉字"
          ></el-input>
        </el-form-item>
        <el-form-item label="主播昵称" prop="anchorName">
          <el-input
            :disabled="isDetail"
            v-model.trim="formData.anchorName"
            placeholder="最短2个汉字，最长15个汉字"
          ></el-input>
        </el-form-item>
        <el-form-item label="主播微信号" prop="anchorWechat">
          <el-input :disabled="isDetail" v-model.trim="formData.anchorWechat"></el-input>
        </el-form-item>
        <el-form-item label="主播副号微信号">
          <el-input :disabled="isDetail" v-model.trim="formData.subAnchorWechat"></el-input>
        </el-form-item>
        <el-form-item label="创建者微信号">
          <el-input :disabled="isDetail" v-model.trim="formData.createrWechat"></el-input>
        </el-form-item>
        <el-form-item label="背景图：" prop="coverImgLocal">
          <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'coverImgLocal')">
            <div v-if="formData.coverImgLocal" class="pictrue">
              <img v-if="formData.coverImgLocal && !isDetail" :src="formData.coverImgLocal" />
              <el-image
                v-else
                style="width: 60px; height: 60px"
                :src="formData.coverImgLocal"
                :preview-src-list="[formData.coverImgLocal]"
              />
            </div>
            <div v-else class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
            <span class="from-tips">建议像素1080*1920，大小不超过2M</span>
          </div>
        </el-form-item>
        <el-form-item label="分享图：" prop="shareImgLocal">
          <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'shareImgLocal')">
            <div v-if="formData.shareImgLocal" class="pictrue">
              <img v-if="formData.shareImgLocal && !isDetail" :src="formData.shareImgLocal" />
              <el-image
                v-else
                style="width: 60px; height: 60px"
                :src="formData.shareImgLocal"
                :preview-src-list="[formData.shareImgLocal]"
              />
            </div>
            <div v-else class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
            <span class="from-tips">建议像素800*640，大小不超过1M</span>
          </div>
        </el-form-item>
        <el-form-item label="直播频道封面图：" prop="feedsImgLocal">
          <div class="upLoadPicBox acea-row" @click="modalPicTap('1', 'feedsImgLocal')">
            <div v-if="formData.feedsImgLocal" class="pictrue">
              <img v-if="formData.feedsImgLocal && !isDetail" :src="formData.feedsImgLocal" />
              <el-image
                v-else
                style="width: 60px; height: 60px"
                :src="formData.feedsImgLocal"
                :preview-src-list="[formData.feedsImgLocal]"
              />
            </div>
            <div v-else class="upLoad">
              <i class="el-icon-camera cameraIconfont" />
            </div>
            <span class="from-tips">建议像素800*800，大小不超过100KB</span>
          </div>
        </el-form-item>
        <el-form-item label="直播时间：" prop="timeVal">
          <el-date-picker
            :disabled="isDetail"
            style="width: 550px"
            v-model="formData.timeVal"
            type="datetimerange"
            range-separator="-"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions0"
            @change="onchangeTime"
            @blur="$forceUpdate()"
          >
          </el-date-picker>
          <p class="from-tips">
            开播时间需要在当前时间的10分钟后，并且开始时间不能在6个月之后。开播时间和结束时间间隔不得短于30分钟，不得超过24小时
          </p>
        </el-form-item>
        <el-form-item label="直播间类型：" prop="type">
          <el-radio-group :disabled="isDetail" v-model="formData.type">
            <el-radio :label="1">推流</el-radio>
            <el-radio :label="0">手机直播</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="直播间点赞：" prop="closeLike">
          <el-radio-group :disabled="isDetail" v-model="formData.closeLike">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="from-tips">若关闭，观众端将隐藏点赞按钮，直播开始后不允许开启</p>
        </el-form-item>
        <el-form-item label="直播间货架：" prop="closeLike">
          <el-radio-group :disabled="isDetail" v-model="formData.closeGoods">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="from-tips">若关闭，观众端将隐藏商品货架，直播开始后不允许开启</p>
        </el-form-item>
        <el-form-item label="直播间评论：" prop="closeLike">
          <el-radio-group :disabled="isDetail" v-model="formData.closeComment">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="from-tips">若关闭，观众端将隐藏评论入口，直播开始后不允许开启</p>
        </el-form-item>
        <el-form-item label="直播间收录：">
          <el-radio-group :disabled="isDetail" v-model="formData.isFeedsPublic">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="from-tips">默认开启收录</p>
        </el-form-item>
        <el-form-item label="直播间回放：">
          <el-radio-group :disabled="isDetail" v-model="formData.closeReplay">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="from-tips">直播开始后允许开启</p>
        </el-form-item>
        <el-form-item label="直播间分享：">
          <el-radio-group :disabled="isDetail" v-model="formData.closeShare">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="from-tips">直播开始后不允许修改</p>
        </el-form-item>
        <el-form-item label="直播间客服：">
          <el-radio-group :disabled="isDetail" v-model="formData.closeKf">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <p class="from-tips">直播开始后允许开启</p>
        </el-form-item>
        <el-form-item v-if="isDetail" label="已导入的直播商品：">
          <el-table ref="table" :data="tableData.data" style="width: 100%" size="samll" highlight-current-row>
            <el-table-column prop="id" label="ID" min-width="50" />
            <el-table-column label="商品图" min-width="100">
              <template slot-scope="scope">
                <div class="demo-image__preview line-heightOne">
                  <el-image :src="scope.row.coverImgUrlLocal" :preview-src-list="[scope.row.coverImgUrlLocal]" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" min-width="120" />
            <el-table-column label="价格类型" min-width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.priceType | priceTypeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="价格" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.priceType === 1">{{ scope.row.price }}</span>
                <span v-else>{{ scope.row.price + '~' + scope.row.price2 }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="goods.pay_num" label="销售数量" min-width="50" />-->
            <!--<el-table-column label="上下架" min-width="80">-->
            <!--<template slot-scope="scope">-->
            <!--<el-switch-->
            <!--v-model="scope.row.onSale"-->
            <!--:active-value="1"-->
            <!--:inactive-value="0"-->
            <!--active-text="上架"-->
            <!--inactive-text="下架"-->
            <!--@change="onchangeIsShow(scope.row)"-->
            <!--/>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column v-hasPermi="['merchant:mp:live:room:deletegoods']" label="操作" width="70" fixed="right">
              <template slot-scope="scope">
                <a @click="handleDelete(scope.row, scope.$index)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="!isDetail">
          <el-button
            v-hasPermi="['merchant:mp:live:room:create', 'merchant:mp:live:room:edit']"
            type="primary"
            v-debounceClick="
              () => {
                submitForm('formData');
              }
            "
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
import {
  liveMediaUploadlocalApi,
  liveRoomCreateApi,
  liveRoomInfoApi,
  liveRoomGoodslistApi,
  liveRoomGoodsonsaleApi,
  liveRoomDeletegoodsinroomApi,
  liveRoomEditApi,
} from '@/api/marketing';
export default {
  name: 'CreatCoupon',
  data() {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 180 * 24 * 3600 * 1000;
          let threeMonths = curDate - three;
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        },
      },
      tableData: {
        data: [],
        total: 0,
      },
      formData: {
        roomName: '',
        coverImg: '',
        startTime: '',
        endTime: '',
        anchorName: '',
        anchorWechat: '',
        subAnchorWechat: '',
        createrWechat: '',
        shareImg: '',
        feedsImg: '',
        isFeedsPublic: 1,
        type: 0,
        closeLike: 0,
        closeGoods: 0,
        closeComment: 0,
        closeReplay: 1,
        closeShare: 0,
        closeKf: 1,
        timeVal: [],
        coverImgLocal: '',
        feedsImgLocal: '',
        shareImgLocal: '',
        id: null,
      },
      listLoading: false,
      rules: {
        roomName: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' },
          { min: 3, max: 17, message: '最短3个汉字，最长17个汉字，1个汉字相当于2个字符', trigger: 'blur' },
        ],
        anchorName: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' },
          { min: 2, max: 15, message: '最短2个汉字，最长15个汉字，1个汉字相当于2个字符', trigger: 'blur' },
        ],
        anchorWechat: [{ required: true, message: '请输入主播微信号', trigger: 'blur' }],
        coverImgLocal: [{ required: true, message: '请选择上传背景图', trigger: 'change' }],
        feedsImgLocal: [{ required: true, message: '请上传频道封面图', trigger: 'change' }],
        shareImgLocal: [{ required: true, message: '请上传分享图', trigger: 'change' }],
        timeVal: [{ type: 'array', required: true, message: '请选择时间', trigger: 'change' }],
        tempRoute: {},
      },
    };
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route);
  },
  computed: {
    //判断是否是详情
    isDetail() {
      return this.$route.params.type ? true : false;
    },
  },
  mounted() {
    this.setTagsViewTitle();
    if (this.$route.params.roomId) {
      this.getInfo();
    }
  },
  methods: {
    setTagsViewTitle() {
      const title = this.$route.params.roomId ? (this.isDetail ? '直播间详情' : '编辑直播间') : '添加直播间';
      const route = Object.assign({}, this.tempRoute, {
        title: this.$route.params.roomId ? `${title}-${this.$route.params.roomId}` : `${title}`,
      });
      this.$store.dispatch('tagsView/updateVisitedView', route);
    },
    // 上下架 goodsId, roomId 取的是微信返回的id
    onchangeIsShow(row) {
      liveRoomGoodsonsaleApi({ goodsId: row.goodsId, roomId: this.formData.roomId, onSale: row.onSale }).then(() => {
        this.$message.success('操作成功');
        if (this.isDetail) this.getList();
      });
    },
    // 删除goodsId取的是微信返回的id
    handleDelete(item, idx) {
      this.$modalSure('删除该直播商品吗？').then(() => {
        liveRoomDeletegoodsinroomApi(this.$route.params.roomId, item.goodsId).then(() => {
          this.$message.success('删除成功');
          if (this.isDetail) this.getList();
        });
      });
    },
    //详情
    getInfo() {
      this.listLoading = true;
      liveRoomInfoApi(this.$route.params.roomId)
        .then(async (res) => {
          if (res) {
            let info = JSON.parse(JSON.stringify(res));
            this.formData = info;
            this.formData.startTime = info.startTime;
            this.formData.endTime = info.endTime;
            this.formData.timeVal = [info.startTime, info.endTime];
            if (this.isDetail) this.getList();
          }
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    // 点击商品图
    modalPicTap(num, tit) {
      const _this = this;
      if (_this.isDetail) return;
      this.$modalUpload(
        async function (img) {
          if (img) {
            _this.formData[tit] = img[0].sattDir;
            switch (tit) {
              case 'coverImgLocal':
                _this.formData.coverImg = await _this.getImgData(_this.formData[tit]);
                break;
              case 'feedsImgLocal':
                _this.formData.feedsImg = await _this.getImgData(_this.formData[tit]);
                break;
              default:
                _this.formData.shareImg = await _this.getImgData(_this.formData[tit]);
            }
          }
        },
        num,
        'content',
      );
    },
    // 传入图片地址调接口，获取到微信mediaId码
    getImgData(file) {
      return new Promise((resolve, reject) => {
        liveMediaUploadlocalApi({ imagePath: file, type: 'image' }).then((res) => {
          resolve(res.mediaId);
        });
      });
    },
    // 具体日期
    onchangeTime(e) {
      this.$set(this.formData, 'timeVal', e);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formData.startTime = this.formData.timeVal ? this.formData.timeVal[0] : '';
          this.formData.endTime = this.formData.timeVal ? this.formData.timeVal[1] : '';
          if (this.$route.params.roomId) this.formData.id = this.$route.params.roomId;
          this.$route.params.roomId
            ? liveRoomEditApi(this.formData)
                .then((res) => {
                  this.$message.success('编辑成功');
                  this.$router.push({ path: `/marketing/broadcast/room` });
                })
                .catch(() => {
                  this.btnLoading = false;
                })
            : liveRoomCreateApi(this.formData)
                .then((res) => {
                  this.$message.success('添加成功');
                  this.$router.push({ path: `/marketing/broadcast/room` });
                })
                .catch(() => {
                  this.btnLoading = false;
                });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 直播间商品列表
    getList() {
      liveRoomGoodslistApi(this.$route.params.roomId).then((res) => {
        this.tableData.data = res;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
