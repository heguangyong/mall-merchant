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

// ------------------------拼团活动----------------------------------------

/**
 * 新增
 * @param
 */
export function groupBuySave(pram) {
  return request({
    url: '/admin/merchant/groupbuy/activity/save',
    method: 'POST',
    data: pram,
  });
}

/**
 * 分页列表
 * @param
 */
export function groupBuyList(pram) {
  const data = {
    page: pram.page,
    limit: pram.limit,
    groupName: pram.groupName,
    groupProcess: pram.groupProcess,
    activityStatus: pram.activityStatus,
    groupStatus: pram.groupStatus,
    startTime: pram.startTime,
  };
  return request({
    url: '/admin/merchant/groupbuy/activity/list',
    method: 'get',
    params: data,
  });
}
/**
 * 修改
 * @param
 */
export function groupBuyUpdate(pram) {
  return request({
    url: '/admin/merchant/groupbuy/activity/update',
    method: 'post',
    data: pram,
  });
}
/**
 * 删除
 * @param
 */
export function groupBuyDelete(id) {
  const data = {
    id: id,
  };
  return request({
    url: '/admin/merchant/groupbuy/activity/delete',
    method: 'get',
    params: data,
  });
}
/**
 * 详情
 * @param
 */
export function groupBuyInfo(id) {
  const data = {
    id: id,
  };
  return request({
    url: `/admin/merchant/groupbuy/activity/info`,
    method: 'get',
    params: data,
  });
}
/**
 * 拼团头部
 * @param
 */
export function groupBuyListCount(data) {
  return request({
    url: '/admin/merchant/groupbuy/activity/list/count',
    method: 'get',
    params: data,
  });
}
/**
 * 状态变更
 * @param
 */
export function groupActivityStatus(pram) {
  return request({
    url: '/admin/merchant/groupbuy/activity/status',
    method: 'post',
    data: pram,
  });
}
/**
 * 撤回审核
 * @param
 */
export function groupbuyActivityRollback(id) {
  const data = {
    id: id,
  };
  return request({
    url: '/admin/merchant/groupbuy/activity/activity/rollback',
    method: 'get',
    params: data,
  });
}
// ------------------------拼团记录----------------------------------------
/**
 * 分页列表
 * @param
 */
export function groupBuyRecordList(data) {
  return request({
    url: '/admin/merchant/groupbuy/record/list',
    method: 'get',
    params: data,
  });
}
/**
 * 详情
 * @param
 */
export function groupRecordInfo(id) {
  return request({
    url: `/admin/merchant/groupbuy/record/info/${id}`,
    method: 'get',
  });
}
/**
 * 头部
 * @param
 */
export function groupBuyRecordCount(data) {
  return request({
    url: '/admin/merchant/groupbuy/record/list/count',
    method: 'get',
    params: data,
  });
}
