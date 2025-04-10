<template>
  <div>
    <pages-header ref="pageHeader" title="小票配置" backUrl="/operation/printing/printreceipt"></pages-header>
    <el-card :bordered="false" shadow="never" class="ivu-mt mt14" :body-style="{ padding: '40px 50px' }">
      <div class="acea-row row-between warpper">
        <el-form :model="formItem" label-width="120px">
          <el-form-item label="小票头部：">
            <el-checkbox v-model="formItem.smallTickerHeader" :true-label="1" :false-label="0">商家名称</el-checkbox>
          </el-form-item>
          <el-form-item label="配送信息：">
            <el-checkbox v-model="formItem.deliveryInfo" :true-label="1" :false-label="0">配送信息</el-checkbox>
          </el-form-item>
          <el-form-item label="买家备注：">
            <el-checkbox v-model="formItem.buyerRemark" :true-label="1" :false-label="0">买家备注</el-checkbox>
          </el-form-item>
          <el-form-item label="商品信息：">
            <el-checkbox v-model="formItem.productInfo" :true-label="1" :false-label="0">商品基础信息</el-checkbox>
          </el-form-item>
          <el-form-item label="运费信息：">
            <el-checkbox v-model="formItem.freightInfo" :true-label="1" :false-label="0">运费</el-checkbox>
          </el-form-item>
          <el-form-item label="优惠信息：">
            <el-checkbox v-model="formItem.discountInfo" :true-label="1" :false-label="0">优惠总计</el-checkbox>
          </el-form-item>
          <el-form-item label="支付信息：">
            <el-checkbox-group v-model="formItem.payInfo">
              <el-checkbox :label="1">支付方式</el-checkbox>
              <el-checkbox :label="2">实收金额</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="其他订单信息：">
            <el-checkbox-group v-model="formItem.orderInfo">
              <el-checkbox :label="1">订单编号</el-checkbox>
              <el-checkbox :label="2">下单时间</el-checkbox>
              <el-checkbox :label="3">支付时间</el-checkbox>
              <el-checkbox :label="4">打印时间</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="推广二维码：">
            <el-checkbox v-model="formItem.codeUrlSwitch" :true-label="1" :false-label="0">选择系统链接</el-checkbox>
            <div v-show="formItem.codeUrlSwitch === 1" class="link">
              <div class="select-link">
                链接：{{ formItem.codeUrl }}
                <span class="change" @click="getLink">{{ formItem.codeUrl ? '修改' : '选择' }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="底部公告：">
            <el-checkbox v-model="formItem.bottomNoticeSwitch" :true-label="1" :false-label="0">底部公告</el-checkbox>
            <div v-show="formItem.bottomNoticeSwitch === 1">
              <el-input
                v-model="formItem.bottomNotice"
                maxlength="50"
                show-word-limit
                type="textarea"
                placeholder="请输入公告内容"
                style="width: 500px"
              />
            </div>
          </el-form-item>
        </el-form>
        <div class="ticket-preview">
          <div class="out-line"></div>
          <div class="ticket-content">
            <div v-show="formItem.smallTickerHeader === 1" class="ticket-header">商家名称</div>
            <!-- 配送方式 -->
            <div v-show="formItem.deliveryInfo == 1" class="delivery btn-line">
              <div class="form-box">
                <div class="label">配送方式：</div>
                <div class="content">商家配送</div>
              </div>
              <div class="form-box">
                <div class="label">客户姓名：</div>
                <div class="content">收货人姓名</div>
              </div>
              <div class="form-box">
                <div class="label">客户电话：</div>
                <div class="content">13023354455</div>
              </div>
              <div class="form-box">
                <div class="label">收货地址：</div>
                <div class="content">上海市浦东新区世界大道25号B座309室</div>
              </div>
            </div>
            <!-- 备注 -->
            <div v-show="formItem.buyerRemark == 1" class="buyer-remarks btn-line">
              <div class="form-box">
                <div class="label">买家备注：</div>
                <div class="content">请在收货时向商家留言，谢谢！</div>
              </div>
            </div>
            <!-- 商品 -->
            <div v-show="formItem.productInfo === 1">
              <div class="goods btn-line">
                <div class="star-line">商品</div>
                <div class="flex justify-between">
                  <span>商品</span>
                  <span>单价</span>
                  <span>数量</span>
                  <span>金额</span>
                </div>
              </div>
              <div class="goods-msg btn-line">
                <div class="flex justify-between">
                  <span>商品1</span>
                  <span>100.0</span>
                  <span>2</span>
                  <span>200.0</span>
                </div>
                <div class="flex justify-between">
                  <span>(规格1)</span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="goods-msg pb-10 pt-10">
                <div class="flex justify-between">
                  <span>商品2</span>
                  <span>100.0</span>
                  <span>2</span>
                  <span>200.0</span>
                </div>
                <div class="flex justify-between">
                  <span>(规格2)</span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="star-line">********</div>
            </div>
            <div class="pay flex flex-col align-end btn-line">
              <div v-show="formItem.freightInfo == 1">运费：10.00元</div>
              <div v-show="formItem.discountInfo == 1">
                <div>优惠：-80.00元</div>
                <div>抵扣：-20.00元</div>
              </div>
            </div>
            <!-- 支付信息 -->
            <div v-show="formItem.payInfo.length > 0" class="pay flex flex-col align-end btn-line">
              <div v-show="formItem.payInfo.includes(1)">支付方式：微信支付</div>
              <div v-show="formItem.payInfo.includes(2)" class="fw-500">实际支付：310.00元</div>
            </div>
            <!-- 订单信息 -->
            <div v-show="formItem.orderInfo.length > 0" class="order pt-10 btn-line">
              <div v-show="formItem.orderInfo.includes(1)">订单编号：wx1234567890</div>
              <div v-show="formItem.orderInfo.includes(2)">下单时间：2022/06/18 12:00:00</div>
              <div v-show="formItem.orderInfo.includes(3)">支付时间：2022/06/18 12:00:00</div>
              <div v-show="formItem.orderInfo.includes(4)">打印时间：2022/06/18 14:20:00</div>
            </div>
            <!-- 二维码 -->
            <div class="code">
              <div v-show="formItem.codeUrlSwitch === 1" id="qrcode"></div>
              <div class="mt20" v-show="formItem.bottomNoticeSwitch === 1">
                {{ formItem.bottomNotice }}
              </div>
            </div>
          </div>
          <div class="bottom-notice">
            <img class="image" src="@/assets/imgs/p-btn.png" alt="" />
          </div>
        </div>
      </div>
    </el-card>
    <el-card
      :bordered="false"
      dis-hover
      class="fixed-card"
      :style="{ left: `${collapseShow && !sideBar1 ? '78px' : collapseShow && sideBar1 ? '54px' : '130px'}` }"
    >
      <el-button type="primary" class="submission" @click="save">保存</el-button>
    </el-card>
    <linkaddress :isHotSpot="true" ref="linkaddres" fromType="printreceipt" @linkUrl="linkUrl"></linkaddress>
  </div>
</template>

<script>
import { savePrintContentApi, getPrintContentApi } from '@/api/systemSetting';
import linkaddress from '@/components/linkaddress';
import pagesHeader from '@/components/base/pagesHeader';
import QRCode from 'qrcodejs2';
export default {
  name: 'content',
  components: { linkaddress, pagesHeader },
  data() {
    return {
      formItem: {
        smallTickerHeader: 1,
        deliveryInfo: 1,
        buyerRemark: 1,
        productInfo: 1,
        freightInfo: 1,
        discountInfo: 1,
        payInfo: [1, 2],
        orderInfo: [1, 2],
        codeUrlSwitch: 0,
        codeUrl: '',
        bottomNoticeSwitch: 0,
        bottomNotice: '',
        id: Number(this.$route.params.id),
      },
      codeUrl: '',
      id: Number(this.$route.params.id),
      sideBar1: this.$store.state.themeConfig.themeConfig.isCollapse,
    };
  },
  computed: {
    collapseShow() {
      return ['defaults', 'columns'].includes(this.$store.state.themeConfig.themeConfig.layout);
    },
  },
  created() {
    // this.getMerId();
    if (this.id) this.getPrintContent();
  },
  methods: {
    getPrintContent() {
      getPrintContentApi(this.id).then((res) => {
        if (!res) return;
        this.formItem = res;
        if (res.codeUrl) {
          this.codeUrl =  res.codeUrl;
          this.$nextTick((e) => {
            this.drawCode(this.codeUrl);
          });
        }
      });
    },
    save() {
      this.formItem.id = this.id;
      savePrintContentApi(this.formItem, this.formItem.id)
        .then((res) => {
          this.$message.success('保存成功');
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    getLink() {
      this.$refs.linkaddres.dialogVisible = true;
      this.$refs.linkaddres.currenType = 'link';
    },
    linkUrl(e, op) {
      let url = '';
      if (op != '自定义链接') {
        url = this.$selfUtil.getFrontDomainUrl() + e;
      }else{
        url = e;
      }
      this.drawCode(url);
      this.formItem.codeUrl = url; // 大粽子 这里直接给后段全路径 提交和渲染同步修改 并且约定 自定义链接 文本不能随意更改
    },
    drawCode(url) {
      let qrcode = '';
      let obj = document.getElementById('qrcode');
      obj.innerHTML = '';
      qrcode = new QRCode(obj, {
        text: url, // 需要转换为二维码的内容
        width: 128,
        height: 128,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .ivu-checkbox-wrapper {
  font-size: 12px;
  margin-right: 30px;
}
::v-deep .el-checkbox__input {
  margin-right: 6px;
}
::v-deep .el-checkbox__input {
  width: 14px;
  height: 14px;
  font-size: 12px;
}
.warpper {
  max-width: 1200px;
}
.fixed-card {
  position: fixed;
  right: 0;
  bottom: 0;
  text-align: center;
  z-index: 45;
  box-shadow: 0 -1px 2px rgb(240, 240, 240);
}
.link {
  background: #f6f7f9;
  border-radius: 2px;
  padding: 15px;
}
.select-link {
  font-size: 12px;
}
.change {
  color: #2d8cf0;
  cursor: pointer;
}
// 隐藏滚动条
.ticket-content::-webkit-scrollbar {
  display: none;
}
.ticket-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.out-line {
  width: 271px;
  height: 7px;
  background: #eeeeee;
  border-radius: 4px;
}
// 动画高度从0变为100%
@keyframes show {
  0% {
    margin-top: -70vh;
  }
  100% {
    margin-top: 0;
  }
}
.ticket-preview {
  overflow: hidden;
  height: 70vh;
}
.ticket-content {
  position: relative;
  top: -3px;
  animation: show 2s ease-in-out forwards;
  width: 260px;
  max-height: 70vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #fff;
  padding: 20px 15px 15px 15px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 1px 1px 1px 1px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  line-height: 18px;
  .form-box {
    display: flex;
    .label {
      white-space: nowrap;
    }
  }
  .ticket-header {
    font-weight: 500;
    font-size: 18px;
    text-align: center;
    margin-bottom: 20px;
  }
  // 下划线虚线
  .btn-line {
    border-bottom: 1px dashed #eee;
    padding: 10px 0;
    word-break: break-all;
  }
  .star-line {
    position: relative;
    text-align: center;
    letter-spacing: 1px;
  }
  .star-line::before {
    content: '****************';
    display: inline-block;
    width: 40%;
    position: absolute;
    left: 0;
  }
  .star-line::after {
    content: '****************';
    display: inline-block;
    width: 40%;
    position: absolute;
    right: 0;
  }
  .fw-500 {
    font-weight: 500;
  }
  .code {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    #qrcode {
      margin: 25px 0 0px;
    }
  }
}
.bottom-notice {
  width: 260px;
  margin-left: 1px;
  height: 13px;
  position: relative;
}
.image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: -6px;
}
.justify-between {
  justify-content: space-between;
}
.flex-col {
  flex-direction: column;
}
.align-end {
  text-align: end;
}
</style>
