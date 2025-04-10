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

export function systemConfigCheck(pram) {
  const data = {
    name: pram.name,
  };
  return request({
    url: '/admin/system/config/check',
    method: 'GET',
    params: data,
  });
}

export function systemConfigInfo(pram) {
  const data = {
    formId: pram.id,
  };
  return request({
    url: '/admin/system/config/info',
    method: 'GET',
    params: data,
  });
}

export function systemConfigSave(pram) {
  return request({
    url: '/admin/system/config/save/form',
    method: 'POST',
    data: pram,
  });
}

/**
 * 文件上传
 * @param data
 */
export function fileFileApi(data, params) {
  return request({
    url: '/admin/merchant/upload/file',
    method: 'POST',
    params,
    data,
  });
}

/**
 * 图片上传
 * @param data
 */
export function fileImageApi(data, params) {
  return request({
    url: '/admin/merchant/upload/image',
    method: 'POST',
    params,
    data,
  });
}

/**
 * 图片列表
 * @param data
 */
export function fileListApi(params) {
  return request({
    url: '/admin/merchant/attachment/list',
    method: 'get',
    params,
  });
}

/**
 * 图片列表 删除图片
 * @param data
 */
export function fileDeleteApi(id) {
  return request({
    url: `/admin/merchant/attachment/delete`,
    method: 'post',
    data: { ids: id },
  });
}

/**
 * 图片列表 移動分類
 * @param data
 */
export function attachmentMoveApi(data) {
  return request({
    url: `/admin/merchant/attachment/move`,
    method: 'post',
    data,
  });
}

/**
 *  商家小票打印配置列表
 * @param pram
 * @returns {*}
 */
export function merchantPrintList(pram) {
  return request({
    url: '/admin/merchant/print/list',
    method: 'GET',
    params: pram,
  });
}

/**
 * 商家小票打印配置删除
 * @param id
 * @returns {*}
 */
export function merchantPrintDelete(id) {
  return request({
    url: '/admin/merchant/print/delete/' + id,
    method: 'GET',
  });
}

/**
 * 商家小票打印配置详情
 * @param pram
 * @returns {*}
 */
export function merchantPrintInfo(pram) {
  const data = {
    key: pram.key,
  };
  return request({
    url: '/admin/merchant/print/info/{id}',
    method: 'GET',
    params: data,
  });
}

/**
 * 商家小票打印配置新增
 * @param data
 * @returns {*}
 */
export function merchantPrintSave(data) {
  return request({
    url: `/admin/merchant/print/save`,
    method: 'post',
    data,
  });
}

/**
 * 商家小票打印配置更新状态
 * @param data
 * @returns {*}
 */
export function merchantPrintStatus(data) {
  return request({
    url: `/admin/merchant/print/status`,
    method: 'post',
    data,
  });
}

/**
 * 商家小票打印配置编辑
 * @param data
 * @returns {*}
 */
export function merchantPrintEdit(data) {
  return request({
    url: `/admin/merchant/print/update`,
    method: 'post',
    data,
  });
}

/**
 * 商家电子面单编辑
 * @param data
 * @returns {*}
 */
export function merchantElectrSheetEdit(data) {
  return request({
    url: `/admin/merchant/elect/update`,
    method: 'post',
    data,
  });
}

/**
 * 商家电子面单新增
 * @param data
 * @returns {*}
 */
export function merchantElectrSheetAdd(data) {
  return request({
    url: `/admin/merchant/elect/save`,
    method: 'post',
    data,
  });
}

/**
 * 商家电子面单详情
 * @returns {*}
 */
export function merchantElectrSheetInfo() {
  return request({
    url: `/admin/merchant/elect/info`,
    method: 'get',
  });
}

/**
 * 商家电子面单删除
 * @param id
 * @returns {*}
 */
export function merchantElectrSheetDelete(id) {
  return request({
    url: `/admin/merchant/elect/delete/${id}`,
    method: 'get',
  });
}


/**
 * 商户地址分页列表
 * @param data
 * @returns {*}
 */
export function merchantAddressListApi() {
  return request({
    url: `/admin/merchant/address/list`,
    method: 'get',
  });
}

/**
 * 删除商户地址
 * @param data
 * @returns {*}
 */
export function merchantAddressDeleteApi(id) {
  return request({
    url: `/admin/merchant/address/delete/${id}`,
    method: 'get',
  });
}

/**
 * 新增商户地址
 * @param data
 * @returns {*}
 */
export function merchantAddressSaveApi(data) {
  return request({
    url: `/admin/merchant/address/save`,
    method: 'post',
    data,
  });
}

/**
 * 修改商户地址
 * @param data
 * @returns {*}
 */
export function merchantAddressUpdateApi(data) {
  return request({
    url: `/admin/merchant/address/update`,
    method: 'post',
    data,
  });
}

/**
 * 设置商户默认地址
 * @param data
 * @returns {*}
 */
export function merchantAddressSetDefaultApi(id) {
  return request({
    url: `/admin/merchant/address/set/default/${id}`,
    method: 'post',
  });
}

/**
 * 设置商户地址开启状态
 * @param data
 * @returns {*}
 */
export function merchantAddressUpdateShowApi(id) {
  return request({
    url: `/admin/merchant/address/update/show/${id}`,
    method: 'post',
  });
}

/**
 * 获取平台当前的素材地址
 */
export function mediadomainApi() {
  return request({
    url: '/publicly/config/get/admin/mediadomain',
    method: 'get',
  });
}

/**
 * 获取打印内容配置
 */
export function getPrintContentApi(id) {
  return request({
    url: `/admin/merchant/print/get/content/${id}`,
    method: 'get',
  });
}

/**
 * 保存打印内容配置
 */
export function savePrintContentApi(data, id) {
  return request({
    url: `/admin/merchant/print/save/content/${id}`,
    method: 'post',
    data,
  });
}
