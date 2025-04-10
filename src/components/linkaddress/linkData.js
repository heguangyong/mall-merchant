import Cookies from 'js-cookie';
import { getServiceInfo } from '@/utils/ZBKJIutil';

const JavaMerchantId = Cookies.get('JavaMerchantId');

export const linkData = {
  list: [
    {
      id: 1,
      type: 1,
      name: '商品分类',
      url: `/pages/merchant/classify_coupon/index?id=${JavaMerchantId}&tabActive=1`,
    },
    {
      id: 2,
      type: 1,
      name: '商品列表',
      url: `/pages/goods/goods_list/index?merid=${JavaMerchantId}`,
    },
    {
      id: 3,
      type: 1,
      name: '优惠券列表',
      url: `/pages/merchant/classify_coupon/index?id=${JavaMerchantId}&tabActive=2`,
    },
    {
      id: 4,
      type: 1,
      name: '商户详情',
      url: `/pages/merchant/detail/index?merId=${JavaMerchantId}`,
    },
    {
      id: 5,
      type: 1,
      name: '联系客服',
      url: getServiceInfo(),
    },
  ],
  merchantList:[
    {
      id: 1,
      type: 1,
      name: '店铺主页',
      url: `/pages/merchant/home/index?merId=${JavaMerchantId}`,
    },
    {
      id: 2,
      type: 1,
      name: '商品列表',
      url: `/pages/goods/goods_list/index?merid=${JavaMerchantId}`,
    },
  ]
};
