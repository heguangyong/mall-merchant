<template>
  <div class="divBox">
    <el-row :gutter="14">
      <el-col :xs="24" :sm="24" :md="24" :lg="12">
        <el-card class="box-card" :bordered="false" dis-hover shadow="never">
          <div class="header_title_line">快捷入口</div>
          <div class="nav_grid">
            <div class="nav_grid_item" v-for="(item, index) in permList" :key="index" @click="navigatorTo(item.url)">
              <div class="pic_badge" :style="{ backgroundColor: item.bgColor }">
                <span class="iconfont" :class="item.icon"></span>
              </div>
              <p>{{ item.title }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" v-hasPermi="['merchant:statistics:home:operating:data']">
        <el-card class="box-card" shadow="never" :bordered="false">
          <div class="header_title_line">经营数据</div>
          <div class="nav_grid">
            <div
              class="nav_grid_item"
              v-for="(item, index) in businessList"
              :key="index"
              @click="navigatorTo(item.path)"
            >
              <p class="num_data">{{ item.num || 0 }}</p>
              <p class="label">{{ item.title }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
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

import echartsNew from '@/components/echartsNew/index';
import { businessData } from '@/api/dashboard';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
export default {
  components: {
    echartsNew,
  },
  data() {
    return {
      grid: {
        xl: 3,
        lg: 3,
        md: 6,
        sm: 8,
        xs: 8,
      },
      nav_list: [
        {
          bgColor: '#E8B500',
          icon: 'icon-youhuiquan',
          title: '优惠券',
          url: '/coupon/list',
          perms: ['merchant:coupon:page:list'],
        },
        {
          bgColor: '#4BCAD5',
          icon: 'icon-shangpinguanli',
          title: '商品管理',
          url: '/product/list',
          perms: ['merchant:product:page:list'],
        },
        {
          bgColor: '#A277FF',
          icon: 'icon-a-dingdanguanli1',
          title: '订单管理',
          url: '/order/list',
          perms: ['merchant:order:page:list'],
        },
        {
          bgColor: '#1890FF',
          icon: 'icon-xitongshezhi',
          title: '系统设置',
          url: '/operation/modifyStoreInfo',
          perms: ['merchant:base:info'],
        },
        {
          bgColor: '#EF9C20',
          icon: 'icon-caiwuguanli',
          title: '财务管理',
          url: '/finance/capitalFlow',
          perms: ['merchant:finance:page:capitalFlow'],
        },
      ],
      statisticData: [
        { title: '在售商品', num: 0, path: '/product/list', perms: ['merchant:product:page:list'] },
        { title: '待审核商品', num: 0, path: '/product/list', perms: ['merchant:product:page:list'] },
        { title: '待发货', num: 0, path: '/order/list', perms: ['merchant:order:page:list'] },
        { title: '待核销', num: 0, path: '/order/list', perms: ['merchant:order:page:list'] },
        { title: '待退款', num: 0, path: '/order/refund', perms: ['merchant:order:page:refund'] },
      ],
      optionData: {},
      applyNum: 0,
      style: { height: '250px' },
    };
  },
  computed: {
    //鉴权处理
    permList: function () {
      let arr = [];
      this.nav_list.forEach((item) => {
        if (this.checkPermi(item.perms)) {
          arr.push(item);
        }
      });
      return arr;
    },
    businessList: function () {
      let arr = [];
      this.statisticData.forEach((item) => {
        if (this.checkPermi(item.perms)) {
          arr.push(item);
        }
      });
      return arr;
    },
  },
  mounted() {
    if (checkPermi(['merchant:statistics:home:operating:data'])) this.getbusinessData();
  },
  methods: {
    checkPermi,
    navigatorTo(path) {
      this.$router.push(path);
    },
    getbusinessData() {
      businessData().then((res) => {
        this.statisticData[0].num = res.onSaleProductNum; //在售商品数量
        this.statisticData[1].num = res.awaitAuditProductNum; //待审核商品数量
        this.statisticData[2].num = res.notShippingOrderNum; //待发货订单数量
        this.statisticData[3].num = res.awaitVerificationOrderNum; //待核销订单数量
        this.statisticData[4].num = res.refundingOrderNum; //待退款订单数量
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.dashboard-console-grid {
  text-align: center;
  .ivu-card-body {
    padding: 0;
  }
  i {
    font-size: 32px;
  }
  a {
    display: block;
    color: inherit;
  }
  p {
    margin-top: 8px;
  }
}
.nav_grid {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
}
.nav_grid_item {
  width: 20%;
  height: 90px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 58px;
    height: 58px;
  }
  .pic_badge {
    width: 58px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 4px;
    .iconfont {
      font-size: 30px;
    }
  }
  p {
    height: 17px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000000;
    line-height: 17px;
    margin-top: 12px;
  }
  .num_data {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 18px;
  }
  .label {
    font-size: 14px;
    color: #666666;
    text-align: center;
  }
}
</style>
