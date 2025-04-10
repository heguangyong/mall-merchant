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
 * 删除卡密库
 * @param id
 */
export function productCdkeyDeleteApi(id) {
  return request({
    url: `/admin/merchant/cdkey/library/delete/${id}`,
    method: 'post',
  });
}

/**
 * 卡密库分页列表
 * @param params
 */
export function productCdkeyListApi(params) {
  return request({
    url: `/admin/merchant/cdkey/library/page/list`,
    method: 'get',
    params,
  });
}

/**
 * 新增卡密库
 * @param data
 */
export function productCdkeysaveApi(data) {
  return request({
    url: `/admin/merchant/cdkey/library/save`,
    method: 'post',
    data,
  });
}

/**
 * 未关联卡密库列表
 * @param params
 */
export function productUnrelatedListApi(params) {
  return request({
    url: `/admin/merchant/cdkey/library/unrelated/list`,
    method: 'get',
    params,
  });
}

/**
 * 修改卡密库
 * @param data
 */
export function productUnrelatedUpdateApi(data) {
  return request({
    url: `/admin/merchant/cdkey/library/update`,
    method: 'post',
    data,
  });
}

/**
 * 删除卡密
 * @param id
 */
export function cardSecretDeleteApi(id) {
  return request({
    url: `/admin/merchant/card/secret/delete/${id}`,
    method: 'post',
  });
}

/**
 * 导入卡密
 * @param data
 */
export function cardSecretImportExcelApi(data, params) {
  return request({
    url: `/admin/merchant/card/secret/import/excel`,
    method: 'post',
    data,
    params,
  });
}

/**
 * 卡密分页列表
 * @param params
 */
export function cardSecretPageListApi(params) {
  return request({
    url: `/admin/merchant/card/secret/page/list`,
    method: 'get',
    params,
  });
}

/**
 * 新增卡密
 * @param data
 */
export function cardSecretSaveApi(data) {
  return request({
    url: `/admin/merchant/card/secret/save`,
    method: 'post',
    data,
  });
}

/**
 * 修改卡密
 * @param data
 */
export function cardSecretUpdateApi(data) {
  return request({
    url: `/admin/merchant/card/secret/update`,
    method: 'post',
    data,
  });
}

/**
 * 批量删除卡密
 * @param data
 */
export function cardSecretBatchDeleteApi(data) {
  return request({
    url: `/admin/merchant/card/secret/batch/delete`,
    method: 'post',
    data,
  });
}
