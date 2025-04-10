// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from '@/utils/request';

/**
 * 新增商品
 * @param pram
 */
export function productCreateApi(data) {
  return request({
    url: '/admin/merchant/product/save',
    method: 'POST',
    data,
  });
}

/**
 * 编辑商品
 * @param pram
 */
export function productUpdateApi(data) {
  return request({
    url: '/admin/merchant/product/update',
    method: 'POST',
    data,
  });
}

/**
 * 商品详情
 * @param pram
 */
export function productDetailApi(id) {
  return request({
    url: `/admin/merchant/product/info/${id}`,
    method: 'GET',
  });
}

/**
 * 删除商品
 * @param pram
 */
export function productDeleteApi(data) {
  return request({
    url: `/admin/merchant/product/delete`,
    method: 'post',
    data,
  });
}

/**
 * 商品列表 表头数量
 */
export function productHeadersApi(params) {
  return request({
    url: '/admin/merchant/product/tabs/headers',
    method: 'GET',
    params,
  });
}

/**
 * 商品列表
 * @param pram
 */
export function productLstApi(params) {
  return request({
    url: '/admin/merchant/product/list',
    method: 'GET',
    params,
  });
}
/**
 * 平台端商品分类缓存树
 * @param pram
 */
export function categoryApi() {
  return request({
    url: '/admin/merchant/plat/product/category/cache/tree',
    method: 'GET',
  });
}
/**
 * 商户端商品分类缓存树
 * @param pram
 */
export function storeCategoryAllApi() {
  return request({
    url: '/admin/merchant/store/product/category/cache/tree',
    method: 'GET',
  });
}
/**
 * 商品上架
 * @param pram
 */
export function putOnShellApi(id) {
  return request({
    url: `/admin/merchant/product/up/${id}`,
    method: 'post',
  });
}
/**
 * 商品下架
 * @param pram
 */
export function offShellApi(id) {
  return request({
    url: `/admin/merchant/product/down/${id}`,
    method: 'post',
  });
}
/**
 * 商品规格 列表
 * @param pram
 */
export function templateListApi(params) {
  return request({
    url: '/admin/merchant/product/rule/list',
    method: 'GET',
    params,
  });
}
/**
 * 商品规格 删除
 * @param pram
 */
export function attrDeleteApi(id) {
  return request({
    url: `/admin/merchant/product/rule/delete/${id}`,
    method: 'post',
  });
}
/**
 * 商品规格 新增
 * @param pram
 */
export function attrCreatApi(data) {
  return request({
    url: '/admin/merchant/product/rule/save',
    method: 'POST',
    data,
  });
}
/**
 * 商品规格 编辑
 * @param pram
 */
export function attrEditApi(data) {
  return request({
    url: '/admin/merchant/product/rule/update',
    method: 'POST',
    data,
  });
}
/**
 * 商品规格 详情
 * @param pram
 */
export function attrInfoApi(id) {
  return request({
    url: `admin/merchant/product/rule/info/${id}`,
    method: 'GET',
  });
}
/**
 * 商品评论 列表
 * @param pram
 */
export function replyListApi(params) {
  return request({
    url: '/admin/merchant/product/reply/list',
    method: 'GET',
    params,
  });
}
/**
 * 商品评论 新增
 * @param pram
 */
export function replyCreatApi(data) {
  return request({
    url: '/admin/merchant/product/reply/virtual',
    method: 'POST',
    data,
  });
}
/**
 * 商品评论 编辑
 * @param pram
 */
export function replyEditApi(data) {
  return request({
    url: '/admin/store/product/reply/update',
    method: 'POST',
    data,
  });
}
/**
 * 商品评论 详情
 * @param pram
 */
export function replyInfoApi(id) {
  return request({
    url: `/admin/store/product/reply/info/${id}`,
    method: 'GET',
  });
}
/**
 * 商品评论 删除
 * @param pram
 */
export function replyDeleteApi(id) {
  return request({
    url: `/admin/merchant/product/reply/delete/${id}`,
    method: 'post',
  });
}

/**
 * 商品评论 回复
 * @param pram
 */
export function replyCommentApi(data) {
  return request({
    url: `/admin/merchant/product/reply/comment`,
    method: 'post',
    data,
  });
}

/**
 * 商品评论 导出
 * @param pram
 */
export function productExportApi(params) {
  return request({
    url: `/admin/export/excel/product`,
    method: 'get',
    params,
  });
}

/**
 * 商品复制 99Api
 * @param pram
 */
export function importProductApi(params) {
  return request({
    url: `/admin/merchant/product/importProduct`,
    method: 'post',
    params,
  });
}

/**
 * 商品复制 一号通
 * @param pram
 */
export function copyProductApi(data) {
  return request({
    url: `/admin/merchant/product/copy/product`,
    method: 'post',
    data,
  });
}

/**
 * 恢复
 * @param pram
 */
export function restoreApi(id) {
  return request({
    url: `/admin/merchant/product/restore/${id}`,
    method: 'post',
  });
}

/**
 * 商品列表 导出
 * @param pram
 */
export function productExcelApi(params) {
  return request({
    url: `/admin/export/excel/product`,
    method: 'get',
    params,
  });
}

/**
 * 商品列表 获取复制商品配置
 * @param pram
 */
export function copyConfigApi() {
  return request({
    url: `/admin/merchant/product/copy/config`,
    method: 'post',
  });
}

/**
 * 订单数据 导出
 * @param pram
 */
export function orderExcelApi(params) {
  return request({
    url: `/admin/export/excel/order`,
    method: 'get',
    params,
  });
}

/**
 * 商品分类 列表
 * @param pram
 */
export function productCategoryListApi(params) {
  return request({
    url: '/admin/merchant/store/product/category/list',
    method: 'GET',
    params,
  });
}
/**
 * 商品分类 新增
 * @param pram
 */
export function productCategoryAddApi(data) {
  return request({
    url: '/admin/merchant/store/product/category/add',
    method: 'post',
    data,
  });
}
/**
 * 商品分类 编辑
 * @param pram
 */
export function productCategoryUpdateApi(data) {
  return request({
    url: '/admin/merchant/store/product/category/update',
    method: 'post',
    data,
  });
}
/**
 * 商品分类 删除
 * @param pram
 */
export function productCategoryDeleteApi(id) {
  return request({
    url: `/admin/merchant/store/product/category/delete/${id}`,
    method: 'post',
  });
}
/**
 * 商品分类 修改分类显示状态
 * @param pram
 */
export function productCategoryShowApi(id) {
  return request({
    url: `/admin/merchant/store/product/category/update/show/${id}`,
    method: 'post',
  });
}
/**
 * 保障服务列表
 * @param pram
 */
export function productGuaranteeApi() {
  return request({
    url: `/admin/merchant/plat/product/guarantee/list`,
    method: 'get',
  });
}
/**
 * 品牌列表 全部
 * @param pram
 */
export function brandAllApi() {
  return request({
    url: `/admin/merchant/plat/product/brand/cache/list`,
    method: 'get',
  });
}

/**
 * 品牌列表
 * @param pram
 */
export function brandListApi(params) {
  return request({
    url: `/admin/merchant/plat/product/brand/list`,
    method: 'get',
    params,
  });
}

/**
 * 优惠券 列表
 * @param pram
 */
export function marketingListApi(params) {
  return request({
    url: '/admin/merchant/coupon/list',
    method: 'get',
    params,
  });
}

/**
 * 商品可用优惠券列表
 * @param pram
 */
export function productCouponListApi() {
  return request({
    url: '/admin/merchant/coupon/product/usable/list',
    method: 'get',
  });
}

/**
 * 优惠券 详情
 * @param pram
 */
export function couponInfoApi(id) {
  return request({
    url: `/admin/merchant/coupon/info/${id}`,
    method: 'get',
  });
}

/**
 * 优惠券 修改状态
 * @param pram
 */
export function couponIssueStatusApi(id) {
  return request({
    url: `/admin/merchant/coupon/update/status/${id}`,
    method: 'post',
  });
}

/**
 * 优惠券 删除
 * @param pram
 */
export function couponDeleteApi(id) {
  return request({
    url: `/admin/merchant/coupon/delete/${id}`,
    method: 'post',
  });
}

/**
 * 优惠券 新增
 * @param pram
 */
export function couponSaveApi(data) {
  return request({
    url: `/admin/merchant/coupon/save`,
    method: 'post',
    data,
  });
}

/**
 * 优惠券 商品券关联商品编辑
 * @param pram
 */
export function couponProductEditApi(data) {
  return request({
    url: `/admin/merchant/coupon/product/join/edit`,
    method: 'post',
    data,
  });
}

/**
 * 保障服务组合 列表
 * @param pram
 */
export function guaranteeListApi(params) {
  return request({
    url: `/admin/merchant/product/guarantee/group/list`,
    method: 'get',
    params,
  });
}

/**
 * 保障服务组合 新增
 * @param pram
 */
export function guaranteeAddApi(data) {
  return request({
    url: `/admin/merchant/product/guarantee/group/add`,
    method: 'post',
    data,
  });
}

/**
 * 保障服务组合 编辑
 * @param pram
 */
export function guaranteeUpdateApi(data) {
  return request({
    url: `/admin/merchant/product/guarantee/group/edit`,
    method: 'post',
    data,
  });
}

/**
 * 保障服务组合 删除
 * @param pram
 */
export function guaranteeDeleteApi(id) {
  return request({
    url: `/admin/merchant/product/guarantee/group/delete/${id}`,
    method: 'post',
  });
}

/**
 * 商品提审
 * @param pram
 */
export function productAuditApi(data) {
  return request({
    url: `/admin/merchant/product/submit/audit`,
    method: 'post',
    data,
  });
}

/**
 * 快捷添加库存
 * @param pram
 */
export function productStockAddApi(data) {
  return request({
    url: `/admin/merchant/product/quick/stock/add`,
    method: 'post',
    data,
  });
}

/**
 * 商品免审编辑
 * @param pram
 */
export function productFreeEditApi(data) {
  return request({
    url: `/admin/merchant/product/review/free/edit`,
    method: 'post',
    data,
  });
}

/**
 * 商品搜索分页列表（活动，diy、氛围图、除去营销活动的商品列表）
 * @param pram
 */
export function productActivityListApi(params) {
  return request({
    url: '/admin/merchant/product/activity/search/page',
    method: 'get',
    params,
  });
}

/**
 * 添加回馈券
 * @param data
 */
export function productAddCouponsApi(data) {
  return request({
    url: '/admin/merchant/product/add/feedback/coupons',
    method: 'post',
    data,
  });
}

/**
 * 批量添加回馈券
 * @param data
 */
export function productBatchAddCouponsApi(data) {
  return request({
    url: '/admin/merchant/product/batch/add/feedback/coupons',
    method: 'post',
    data,
  });
}

/**
 * 批量删除商品
 * @param data
 */
export function productBatchDeleteApi(data) {
  return request({
    url: '/admin/merchant/product/batch/delete',
    method: 'post',
    data,
  });
}

/**
 * 批量商品下架
 * @param data
 */
export function productBatchDownApi(data) {
  return request({
    url: '/admin/merchant/product/batch/down',
    method: 'post',
    data,
  });
}

/**
 * 批量加入回收站
 * @param data
 */
export function productBatchRecycleApi(data) {
  return request({
    url: '/admin/merchant/product/batch/recycle',
    method: 'post',
    data,
  });
}

/**
 * 批量恢复回收站商品
 * @param data
 */
export function productBatchRestoreApi(data) {
  return request({
    url: '/admin/merchant/product/batch/restore',
    method: 'post',
    data,
  });
}

/**
 * 批量设置佣金
 * @param data
 */
export function productBatchBrokerageApi(data) {
  return request({
    url: '/admin/merchant/product/batch/set/brokerage',
    method: 'post',
    data,
  });
}

/**
 * 批量设置运费模板
 * @param data
 */
export function productBatchFreightApi(data) {
  return request({
    url: '/admin/merchant/product/batch/set/freight/template',
    method: 'post',
    data,
  });
}

/**
 * 批量提审商品
 * @param data
 */
export function productBatchAuditApi(data) {
  return request({
    url: '/admin/merchant/product/batch/submit/audit',
    method: 'post',
    data,
  });
}

/**
 * 批量上架商品
 * @param data
 */
export function productBatchUpApi(data) {
  return request({
    url: '/admin/merchant/product/batch/up',
    method: 'post',
    data,
  });
}

/**
 * 设置佣金
 * @param data
 */
export function productBrokerageApi(data) {
  return request({
    url: '/admin/merchant/product/set/brokerage',
    method: 'post',
    data,
  });
}

/**
 * 设置运费模板
 * @param data
 */
export function productSetFreightApi(data) {
  return request({
    url: '/admin/merchant/product/set/freight/template',
    method: 'post',
    data,
  });
}

/**
 * 商品搜索分页列表（营销活动，现有秒杀与拼团中调用）
 * @param pram
 */
export function productMarketingListApi(params) {
  return request({
    url: '/admin/merchant/product/marketing/search/page',
    method: 'get',
    params,
  });
}
