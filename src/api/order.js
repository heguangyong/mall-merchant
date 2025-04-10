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
 * 订单 列表
 * @param prams
 */
export function orderListApi(params) {
  return request({
    url: '/admin/merchant/order/list',
    method: 'get',
    params,
  });
}

/**
 * 订单 列表 获取各状态数量
 * @param params
 */
export function orderStatusNumApi(params) {
  return request({
    url: '/admin/merchant/order/status/num',
    method: 'get',
    params,
  });
}

/**
 * 订单 删除
 * @param params
 */
export function orderDeleteApi(orderNo) {
  return request({
    url: `/admin/merchant/order/delete/${orderNo}`,
    method: 'post',
  });
}

/**
 * 订单 记录
 * @param prams
 */
export function orderLogApi(params) {
  return request({
    url: '/admin/store/order/status/list',
    method: 'get',
    params,
  });
}

/**
 * 订单 详情
 * @param prams
 */
export function orderDetailApi(orderNo) {
  return request({
    url: `/admin/merchant/order/info/${orderNo}`,
    method: 'get',
  });
}

/**
 * 订单 备注
 * @param prams
 */
export function orderMarkApi(data) {
  return request({
    url: '/admin/merchant/order/mark',
    method: 'post',
    data,
  });
}

/**
 * 订单 发货
 * @param prams
 */
export function orderSendApi(data) {
  return request({
    url: '/admin/merchant/order/send',
    method: 'post',
    data,
  });
}

export function orderPrintReceiptApi(orderno) {
  return request({
    url: '/admin/merchant/order/printreceipt/' + orderno,
    method: 'get',
  });
}

/**
 * 订单 拒绝退款
 * @param prams
 */
export function orderRefuseApi(params) {
  return request({
    url: '/admin/merchant/refund/order/refund/refuse',
    method: 'get',
    params,
  });
}

/**
 * 订单 立即退款
 * @param prams
 */
export function orderRefundApi(params) {
  return request({
    url: '/admin/merchant/refund/order/refund',
    method: 'get',
    params,
  });
}

/**
 * 订单 统计 头部数据
 */
export function orderStatisticsApi() {
  return request({
    url: `/admin/store/order/statistics`,
    method: 'get',
  });
}

/**
 * 核销订单 月列表数据
 */
export function statisticsDataApi(params) {
  return request({
    url: `/admin/store/order/statisticsData`,
    method: 'get',
    params,
  });
}

/**
 * 一键改价
 */
export function updatePriceApi(data) {
  return request({
    url: `admin/store/order/update/price`,
    method: 'post',
    data,
  });
}

/**
 *订单统计详情
 */
export function orderTimeApi(params) {
  return request({
    url: `/admin/store/order/time`,
    method: 'get',
    params,
  });
}

/**
 *面单默认配置信息
 */
export function sheetInfoApi() {
  return request({
    url: `/admin/store/order/sheet/info`,
    method: 'get',
  });
}

/**
 *面单默认配置信息
 */
export function getLogisticsInfoApi(invoiceId) {
  return request({
    url: `/admin/merchant/order/get/${invoiceId}/logistics/info`,
    method: 'get',
  });
}

/**
 *视频号物流公司
 */
export function companyGetListApi() {
  return request({
    url: `/admin/pay/component/delivery/company/get/list`,
    method: 'get',
  });
}

/**
 *视频号物流公司
 */
export function videoSendApi(data) {
  return request({
    url: `/admin/store/order/video/send`,
    method: 'post',
    data,
  });
}

/**
 *打印小票
 */
export function orderPrint(id) {
  return request({
    url: `/admin/yly/print/${id}`,
    method: 'get',
  });
}

/**
 *退款列表
 */
export function refundListApi(params) {
  return request({
    url: `/admin/merchant/refund/order/list`,
    method: 'get',
    params,
  });
}

/**
 *退商户备注退款订单
 */
export function refundMarkApi(data) {
  return request({
    url: `/admin/merchant/refund/order/mark`,
    method: 'post',
    data,
  });
}

/**
 *获取退款订单各状态数量
 */
export function refundStatusNumApi(params) {
  return request({
    url: `/admin/merchant/refund/order/status/num`,
    method: 'GET',
    params,
  });
}

/**
 * 订单 核销订单
 * @param data
 */
export function writeUpdateApi(data) {
  return request({
    url: `/admin/merchant/order/verification`,
    method: 'post',
    data,
  });
}

/**
 * 订单细节详情列表（发货使用）
 * @param orderNo 订单号
 */
export function orderProDetailApi(orderNo) {
  return request({
    url: `/admin/merchant/order/${orderNo}/detail/list`,
    method: 'get',
  });
}

/**
 * 获取订单发货单列表
 * @param orderNo 订单号
 */
export function orderInvoiceListApi(orderNo) {
  return request({
    url: `/admin/merchant/order/${orderNo}/invoice/list`,
    method: 'get',
  });
}

/**
 * 平台端退款订单详情
 * @param refundOrderNo 订单号
 */
export function refundOrderDetailApi(refundOrderNo) {
  return request({
    url: `/admin/merchant/refund/order/detail/${refundOrderNo}`,
    method: 'get',
  });
}

/**
 * 平台端退款订单详情
 * @param params 对象
 */
export function orderExcelApi(params) {
  return request({
    url: `/admin/merchant/export/order/excel`,
    method: 'get',
    params,
  });
}

/**
 * 退款单审核
 * @param data 对象
 */
export function orderAuditApi(data) {
  return request({
    url: `/admin/merchant/refund/order/audit`,
    method: 'post',
    data,
  });
}

/**
 * 退款单收到退货
 * @param refundOrderNo 退款单号
 */
export function refundOrderReceivingApi(refundOrderNo) {
  return request({
    url: `/admin/merchant/refund/order/receiving/${refundOrderNo}`,
    method: 'post',
  });
}

/**
 * 退款单拒绝收货
 * @param data
 */
export function refundOrderReceivingRejectApi(data) {
  return request({
    url: `/admin/merchant/refund/order/receiving/reject`,
    method: 'post',
    data,
  });
}

/**
 * 商户直接退款
 * @param data
 */
export function orderDirectRefundApi(data) {
  return request({
    url: `/admin/merchant/order/direct/refund`,
    method: 'post',
    data,
  });
}

/**
 * 修改发货单配送信息
 * @param data
 */
export function orderInvoiceUpdateApi(data) {
  return request({
    url: `/admin/merchant/order/invoice/update`,
    method: 'post',
    data,
  });
}
