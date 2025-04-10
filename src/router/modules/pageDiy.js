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

const pageDiyRouter = {
  path: '/design',
  component: Layout,
  redirect: '/design/index',
  name: 'PageDiy',
  meta: {
    title: '装修',
    icon: 'clipboard',
  },
  children: [
    {
      path: 'index',
      name: 'designIndex',
      alwaysShow: true,
      component: () => import('@/views/pagediy/devise/index'),
      meta: {
        title: '店铺装修',
        roles: ['admin'],
      },
    },
  ],
};

export default pageDiyRouter;
