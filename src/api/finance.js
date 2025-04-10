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
import req from './req';

/**
 * @description 财务对账 -- 对账单列表
 */
export function reconciliationListApi(data) {
  return request.get(`store/order/reconciliation/lst`, data);
}

/**
 * @description 财务对账 -- 确认打款
 */
export function reconciliationStatusApi(id, data) {
  return request.post(`store/order/reconciliation/status/${id}`, data);
}

/**
 * @description 财务对账 -- 查看订单
 */
export function reconciliationOrderApi(id, data) {
  return request.get(`store/order/reconciliation/${id}/order`, data);
}

/**
 * @description 财务对账 -- 退款订单
 */
export function reconciliationRefundApi(id, data) {
  return request.get(`store/order/reconciliation/${id}/refund`, data);
}

/**
 * @description 财务对账 -- 备注
 */
export function reconciliationMarkApi(id) {
  return request.get(`store/order/reconciliation/mark/${id}/form`);
}
/**
 * @description 资金流水 -- 列表
 */
export function capitalFlowLstApi(params) {
  return request({
    url: `admin/merchant/finance/funds/flow`,
    method: 'get',
    params,
  });
}
/**
 * @description 资金流水 -- 导出
 */
export function capitalFlowExportApi(data) {
  return request.get(`financial_record/export`, data);
}
/**
 * @description 转账记录 -- 导出
 */
export function transferRecordsExportApi(data) {
  return request.get(`financial/export`, data);
}
/**
 * @description 结算申请
 */
export function closingApplyApi(data) {
  return request({
    url: 'admin/merchant/finance/closing/apply',
    method: 'post',
    data,
  });
}
/**
 * @description 结算记录分页列表
 */
export function closingRecordListApi(params) {
  return request({
    url: 'admin/merchant/finance/closing/record/list',
    method: 'GET',
    params,
  });
}
/**
 * @description 获取结算申请基础信息
 */
export function closingBaseInfoApi() {
  return request({
    url: `admin/merchant/finance/closing/base/info`,
    method: 'GET',
  });
}

/**
 * @description 结算记录详情
 */
export function closingDetailApi(id) {
  return request({
    url: `admin/merchant/finance/closing/record/detail/${id}`,
    method: 'GET',
  });
}

/**
 * @description 账单管理 日帐单管理分页列表
 */
export function dayStatementApi(params) {
  return request({
    url: `admin/merchant/finance/daily/statement/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 账单管理 月帐单管理分页列表
 */
export function monthStatementApi(params) {
  return request({
    url: `admin/merchant/finance/month/statement/list`,
    method: 'get',
    params,
  });
}

/**
 * @description 申请转账 -- 备注
 */
export function transferMarkApi(id) {
  return request.get(`financial/mark/${id}/form`);
}
/**
 * @description 财务账单 -- 列表
 */
export function financialLstApi(data) {
  return request.get(`financial_record/lst`, data);
}
/**
 * @description 财务账单 -- 详情
 */
export function financialDetailApi(type, data) {
  return request.get(`financial_record/detail/${type}`, data);
}
/**
 * @description 财务账单 -- 头部数据
 */
export function finaHeaderDataApi(data) {
  return request.get(`financial_record/title`, data);
}
/**
 * @description 财务账单 -- 下载账单
 */
export function downloadFinancialApi(type, data) {
  return request.get(`financial_record/detail_export/${type}`, data);
}
/**
 * @description 资金流水 -- 统计数据
 */
export function getStatisticsApi(data) {
  return request.get(`financial_record/count`, data);
}
