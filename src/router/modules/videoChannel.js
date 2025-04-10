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

const videoChannelRouter = {
  path: '/videoChannel',
  component: Layout,
  redirect: '/draftList/list',
  name: 'VideoChannel',
  meta: {
    title: '视频号',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'productList',
      component: () => import('@/views/videoChannel/videoList/index'),
      name: 'VideoChannelproductList',
      meta: { title: '过审商品', icon: '', noCache: true },
    },
    {
      path: 'creatVideoChannel/:id?/:isDisabled?',
      component: () => import('@/views/videoChannel/draftList/creatVideoChannel'),
      name: 'CreatVideoChannel',
      meta: { title: '添加视频号商品', icon: '', noCache: true, activeMenu: `/videoChannel/draftList` },
    },
    {
      path: 'draftList',
      component: () => import('@/views/videoChannel/draftList/index'),
      name: 'draftList',
      meta: { title: '草稿列表', icon: '', noCache: true },
    },
    {
      path: 'apply',
      component: () => import('@/views/videoChannel/apply/index'),
      name: 'videoApply',
      meta: { title: '申请接入', icon: '', noCache: true },
    },
  ],
};

export default videoChannelRouter;
