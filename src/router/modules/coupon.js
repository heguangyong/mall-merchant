// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import Layout from '@/layout';

const couponRouter = {
  path: '/coupon',
  component: Layout,
  redirect: '/coupon/list',
  name: 'Coupon',
  meta: {
    title: '优惠券',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'list/save',
      name: 'couponAdd',
      meta: {
        title: '优惠劵添加',
        noCache: true,
        activeMenu: `/coupon/list`,
      },
      hidden: true,
      component: () => import('@/views/coupon/list/creatCoupon'),
    },
    {
      path: 'list/save/:id?',
      name: 'couponEdit',
      meta: {
        title: '优惠劵复制',
        noCache: true,
        activeMenu: `/coupon/list`,
      },
      hidden: true,
      component: () => import('@/views/coupon/list/creatCoupon'),
    },
    {
      path: 'list/save/:id?/:edit?',
      name: 'couponEdit',
      meta: {
        title: '优惠劵编辑',
        noCache: true,
        activeMenu: `/coupon/list`,
      },
      hidden: true,
      component: () => import('@/views/coupon/list/creatCoupon'),
    },
    {
      path: 'list',
      component: () => import('@/views/coupon/list/index'),
      name: 'List',
      meta: { title: '优惠券列表', icon: '' },
    },
    {
      path: 'record',
      component: () => import('@/views/coupon/record/index'),
      name: 'Record',
      meta: { title: '领取记录', icon: '' },
    },
  ],
};

export default couponRouter;
