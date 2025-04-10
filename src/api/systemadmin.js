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

export function adminDel(pram) {
  const data = {
    id: pram.id,
  };
  return request({
    url: '/admin/merchant/admin/delete',
    method: 'GET',
    params: data,
  });
}

export function adminInfo(pram) {
  const data = {
    id: pram.id,
  };
  return request({
    url: '/admin/merchant/admin/info',
    method: 'GET',
    params: data,
  });
}

export function adminList(params) {
  return request({
    url: '/admin/merchant/admin/list',
    method: 'GET',
    params,
  });
}

export function adminAdd(pram) {
  const data = {
    account: pram.account,
    level: pram.level,
    pwd: pram.pwd,
    realName: pram.realName,
    roles: pram.roles.join(','),
    status: pram.status,
    phone: pram.phone,
  };
  return request({
    url: '/admin/merchant/admin/save',
    method: 'POST',
    data: data,
  });
}

export function adminUpdate(pram) {
  const data = {
    account: pram.account,
    phone: pram.phone,
    pwd: pram.pwd,
    realName: pram.realName,
    id: pram.id,
    roles: pram.roles,
    status: pram.status,
  };
  return request({
    url: '/admin/merchant/admin/update',
    method: 'POST',
    data,
  });
}

/**
 * 修改状态
 * @param pram
 */
export function updateStatusApi(params) {
  return request({
    url: `/admin/merchant/admin/updateStatus`,
    method: 'get',
    params,
  });
}

/**
 * 修改后台管理员是否接收状态
 * @param pram
 */
export function updateIsSmsApi(params) {
  return request({
    url: `/admin/merchant/admin/update/isSms`,
    method: 'get',
    params,
  });
}

/**
 * 敏感操作日志分页列表
 * @param data
 */
export function sensitiveListApi(params) {
  return request({
    url: `/admin/merchant/log/sensitive/list`,
    method: 'get',
    params,
  });
}

/**
 * 修改登录用户信息
 * @param data
 */
export function adminAccountUpdate(pram) {
  const data = {
    realName: pram.realName,
  };
  return request({
    url: '/admin/merchant/login/admin/update',
    method: 'POST',
    data,
  });
}

/**
 * 修改登录用户密码
 * @param data
 */
export function adminPasswordUpdate(pram) {
  const data = {
    confirmPassword: pram.confirmPassword,
    password: pram.password,
    oldPassword: pram.oldPassword,
  };
  return request({
    url: '/admin/merchant/login/admin/update/password',
    method: 'POST',
    data,
  });
}

/**
 * 修改管理员密码
 * @param data
 */
export function editPassWordApi(data) {
  return request({
    url: '/admin/merchant/admin/update/password',
    method: 'POST',
    data,
  });
}

/**
 * 商户后台管理员短信开关
 * @param pram
 */
export function updateReceiveSmsApi(id) {
  return request({
    url: `/admin/merchant/admin/update/receive/sms/${id}`,
    method: 'post',
  });
}
