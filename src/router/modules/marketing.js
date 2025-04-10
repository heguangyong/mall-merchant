// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const marketingRouter = {
  path: '/marketing',
  component: Layout,
  redirect: '/coupon/list',
  name: 'Marketing',
  meta: {
    title: '营销',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'seckill',
      component: () => import('@/views/marketing/seckill/index'),
      name: 'Seckill',
      meta: { title: '秒杀', icon: '' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/marketing/seckill/seckillList/index'),
          name: 'SeckillList',
          meta: { title: '秒杀商品', icon: '' },
        },
        {
          path: 'seckillActivity',
          component: () => import('@/views/marketing/seckill/seckillActivity/index'),
          name: 'SeckillActivity',
          meta: { title: '秒杀活动', icon: '' },
        },
        {
          path: 'creatActivity/:activityId?',
          component: () => import('@/views/marketing/seckill/seckillActivity/creatSeckill'),
          name: 'creatActivity',
          meta: { title: '参加秒杀活动', icon: '', noCache: true, activeMenu: `/marketing/seckill/seckillActivity` },
        },
        {
          path: 'creatSeckill/:activityId?',
          component: () => import('@/views/marketing/seckill/seckillActivity/creatSeckill'),
          name: 'CreatSeckill',
          meta: { title: '添加秒杀商品', icon: '', noCache: true, activeMenu: `/marketing/seckill/list` },
        },
      ],
    },
    {
      path: 'group',
      component: () => import('@/views/marketing/group/index'),
      name: 'Group',
      meta: { title: '拼团', icon: '' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/marketing/group/groupList/index'),
          name: 'GroupList',
          meta: { title: '开团记录', icon: '' },
        },
        {
          path: 'activity/:type?',
          component: () => import('@/views/marketing/group/groupActivity/index'),
          name: 'GroupActivity',
          meta: { title: '拼团活动', icon: '' },
        },
        {
          path: 'createGroup/:activityId?/:type?',
          component: () => import('@/views/marketing/group/groupActivity/createActivity'),
          name: 'CreateActivity',
          meta: { title: '拼团活动管理', icon: '', noCache: true, activeMenu: `/marketing/group/activity` },
        },
      ],
    },
    {
      path: 'broadcast',
      name: 'Broadcast',
      meta: {
        title: '直播',
        noCache: true,
      },
      redirect: 'noRedirect',
      component: () => import('@/views/marketing/broadcast/index'),
      children: [
        {
          path: 'product',
          name: 'BroadcastProduct',
          meta: {
            title: '直播商品列表',
            noCache: true,
          },
          component: () => import('@/views/marketing/broadcast/product/index'),
        },
        {
          path: 'creatPro/:liveId?',
          component: () => import('@/views/marketing/broadcast/product/creatPro'),
          name: 'CreatPro',
          meta: { title: '添加直播商品', icon: '', noCache: true, activeMenu: `/marketing/broadcast/product` },
        },
        {
          path: 'assistant',
          name: 'BroadcastAssistant',
          meta: {
            title: '直播助手',
            noCache: true,
          },
          component: () => import('@/views/marketing/broadcast/assistant/index'),
        },
        {
          path: 'room',
          name: 'BroadcastRoom',
          meta: {
            title: '直播间管理',
            noCache: true,
          },
          component: () => import('@/views/marketing/broadcast/room/index'),
        },
        {
          path: 'creatRoom/:roomId?/:type?',
          component: () => import('@/views/marketing/broadcast/room/creatRoom'),
          name: 'CreatRoom',
          meta: { title: '添加直播间', icon: '', noCache: true, activeMenu: `/marketing/broadcast/room` },
        },
      ],
    },
  ],
};

export default marketingRouter;
