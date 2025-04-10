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

const operationRouter = {
  path: '/operation',
  component: Layout,
  redirect: '/operation/modifyStoreInfo',
  name: 'Operation',
  meta: {
    title: '设置',
    icon: 'clipboard',
    roles: ['admin'],
  },
  children: [
    {
      path: 'modifyStoreInfo',
      name: 'modifyStoreInfo',
      component: () => import('@/views/systemSetting/modifyStoreInfo'),
      meta: {
        title: '商户基本设置',
        icon: 'clipboard',
      },
    },
    {
      path: 'roleManager',
      name: 'RoleManager',
      component: () => import('@/views/systemSetting/administratorAuthority'),
      meta: {
        title: '管理权限',
        icon: 'clipboard',
        roles: ['admin'],
      },
      children: [
        {
          path: 'identityManager',
          component: () => import('@/views/systemSetting/administratorAuthority/identityManager'),
          name: 'identityManager',
          meta: { title: '角色管理', icon: '' },
        },
        {
          path: 'adminList',
          component: () => import('@/views/systemSetting/administratorAuthority/adminList'),
          name: 'adminList',
          meta: { title: '管理员列表', icon: '' },
        },
      ],
    },
    {
      path: 'export',
      name: 'systemExport',
      component: () => import('@/views/systemSetting/systemExport'),
      meta: {
        title: '数据导出',
        icon: 'clipboard',
      },
      hidden: false,
    },
    {
      path: 'freightSet',
      component: () => import('@/views/systemSetting/deliverGoods/freightSet'),
      name: 'freightSet',
      meta: { title: '运费模板', noCache: true },
    },
    {
      path: 'deliveryPersonnel',
      component: () => import('@/views/systemSetting/deliveryPersonnel/index'),
      name: 'deliveryPersonnel',
      meta: { title: '配送员管理', noCache: true },
    },
    {
      path: 'printing',
      component: () => import('@/views/systemSetting/printing/index'),
      name: 'printing',
      meta: { title: '打印配置', noCache: true },
      children: [
        {
          path: 'printreceipt',
          component: () => import('@/views/systemSetting/printing/printReceipt/index'),
          name: 'printreceipt',
          meta: { title: '小票打印', noCache: true },
        },
        {
          //id:商品id，isDisabled：是否能编辑(1不能，2能)，isCopy：是否是采集商品(1是，2不是),productType:商品类型
          path: 'printreceipt/creatPrintreceipt/:id?',
          component: () => import('@/views/systemSetting/printing/printReceipt/creatPrintreceipt'),
          name: 'creatPrintreceipt',
          meta: { title: '小票配置', noCache: true, activeMenu: `/operation/printing/printreceipt` },
          hidden: true,
        },
        {
          path: 'electrsheet',
          component: () => import('@/views/systemSetting/printing/electrsheet/index'),
          name: 'electrsheet',
          meta: { title: '电子面单', noCache: true },
        },
      ],
    },

    {
      path: 'mallConfiguration',
      component: () => import('@/views/systemSetting/mallConfiguration'),
      name: 'mallConfiguration',
      meta: { title: 'PC商城设置', noCache: true },
    },
    {
      path: 'businessAddress',
      component: () => import('@/views/systemSetting/businessAddress'),
      name: 'businessAddress',
      meta: { title: '商家地址管理', noCache: true },
    },
    {
      path: 'logisticsManagement',
      component: () => import('@/views/systemSetting/logisticsManagement/index.vue'),
      name: 'LogisticsManagement',
      meta: { title: '物流管理', noCache: true },
    },
  ],
};

export default operationRouter; //collate
