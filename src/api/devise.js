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
 * @description 新增商户装修模板
 */
export function pagediySaveApi(data) {
  return request({
    url: '/admin/merchant/page/diy/save',
    method: 'post',
    data,
  });
}

/**
 * @description 商户装修模板分页列表
 */
export function pagediyListApi(params) {
  return request({
    url: '/admin/merchant/page/diy/page',
    method: 'get',
    params,
  });
}

/**
 * @description diy 详情
 */
export function pagediyInfoApi(id) {
  return request({
    url: `/admin/merchant/page/diy/info/${id}`,
    method: 'get',
  });
}

/**
 * @description 编辑商户装修模板
 */
export function pagediyUpdateApi(data) {
  return request({
    url: `/admin/merchant/page/diy/update`,
    method: 'post',
    data,
  });
}

/**
 * @description 设置商户装修默认首页
 */
export function pagediySetdefaultApi(id) {
  return request({
    url: `/admin/merchant/page/diy/set/default/${id}`,
    method: 'post',
  });
}

/**
 * @description 删除商户装修模板
 */
export function pagediyDeleteApi(id) {
  return request({
    url: `/admin/merchant/page/diy/delete/${id}`,
    method: 'post',
  });
}

/**
 * 获取商户装修默认首页ID
 * @returns {*}
 */
export function pagediyGetSetHome() {
  return request({
    url: `/admin/merchant/page/diy/get/default/id`,
    method: 'get',
  });
}

/**
 * 获取小程序二维码
 * @returns {*}
 */
export function wechatQrcodeApi(data) {
  return request({
    url: `/publicly/wechat/mini/get/qrcode`,
    method: 'post',
    data,
  });
}

/**
 * 编辑商户装修模板名称
 * @returns {*}
 */
export function pagediyUpdatenameApi(data) {
  return request({
    url: `/admin/merchant/page/diy/update/name`,
    method: 'post',
    data,
  });
}
