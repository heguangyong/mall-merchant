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

const maintainRouter = {
  path: '/maintain',
  component: Layout,
  redirect: '/maintain/picture',
  name: 'maintain',
  meta: {
    title: '维护',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'user/:type?',
      name: 'MaintainUser',
      component: () => import('@/views/maintain/user'),
      meta: {
        title: '个人中心',
        icon: 'clipboard',
      },
      hidden: true,
    },
    {
      path: 'picture',
      name: 'picture',
      component: () => import('@/views/maintain/picture'),
      meta: {
        title: '素材管理',
        icon: 'clipboard',
      },
      hidden: false,
    },
    {
      path: 'logistics',
      name: 'Logistics',
      alwaysShow: true,
      redirect: '/logistics/cityList',
      component: () => import('@/views/maintain'),
      meta: {
        title: '物流管理',
        icon: 'clipboard',
        roles: ['admin'],
      },
      children: [
        {
          path: 'companyList',
          component: () => import('@/views/maintain/logistics/companyList'),
          name: 'companyList',
          meta: { title: '物流公司', icon: '' },
        },
      ],
    },
    {
      path: 'sensitiveLog',
      name: 'sensitiveLog',
      component: () => import('@/views/maintain/sensitiveList'),
      meta: {
        title: '敏感操作日志',
        icon: 'clipboard',
      },
      hidden: false,
    },
    {
      path: 'systemForm',
      component: () => import('@/views/maintain/systemForm'),
      name: 'systemForm',
      meta: { title: '系统表单', noCache: true },
    },
  ],
};

export default maintainRouter;
