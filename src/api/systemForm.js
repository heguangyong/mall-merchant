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
 * 添加系统表单
 * @param data
 * @returns {AxiosPromise}
 */
export function systemFormAddApi(data) {
  return request({
    url: '/admin/merchant/system/form/add',
    method: 'post',
    data,
  });
}

/**
 * 删除系统表单
 * @param id
 * @returns {AxiosPromise}
 */
export function systemFormDeleteApi(id) {
  return request({
    url: `/admin/merchant/system/form/delete/${id}`,
    method: 'post',
  });
}

/**
 * 系统表单详情
 * @param id
 * @returns {AxiosPromise}
 */
export function systemFormDetailApi(id) {
  return request({
    url: `/admin/merchant/system/form/detail/${id}`,
    method: 'get',
  });
}

/**
 * 系统表单分页列表
 * @param params
 * @returns {AxiosPromise}
 */
export function systemFormPageApi(params) {
  return request({
    url: `/admin/merchant/system/form/page`,
    method: 'get',
    params,
  });
}

/**
 * 修改系统表单
 * @param data
 * @returns {AxiosPromise}
 */
export function systemFormUpdateApi(data) {
  return request({
    url: `/admin/merchant/system/form/update`,
    method: 'post',
    data,
  });
}
