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
const financeRouter = {
  path: `/finance`,
  name: 'finance',
  meta: {
    icon: '',
    title: '财务',
  },
  alwaysShow: true,
  redirect: '/finance/capitalFlow',
  component: Layout,
  children: [
    {
      path: 'statement',
      name: 'FinanceStatement',
      meta: {
        title: '账单管理',
        noCache: true,
      },
      component: () => import('@/views/finance/statement/index'),
    },
    {
      path: 'capitalFlow',
      name: 'FinanceCapitalFlow',
      meta: {
        title: '资金流水',
        noCache: true,
      },
      component: () => import('@/views/finance/capitalFlow/index'),
    },
    {
      path: 'closingRecord',
      name: 'FinanceClosingRecord',
      meta: {
        title: '结算记录 ',
        noCache: true,
      },
      component: () => import('@/views/finance/closingRecord/index'),
    },
  ],
};
export default financeRouter;
