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
 * 商户分类 全部列表
 */
export function merchantCategoryAllListApi() {
  return request({
    url: '/admin/merchant/category/all/list',
    method: 'get',
  });
}

/**
 * 店铺类型 全部列表
 */
export function merchantTypeAllListApi() {
  return request({
    url: '/admin/merchant/type/all/list',
    method: 'get',
  });
}

/**
 * @description 商户基本设置 -- 商户详情
 */
export function getBaseInfoApi() {
  return request({
    url: '/admin/merchant/base/info',
    method: 'get',
  });
}

/**
 * @description 商户基本设置 -- 提交
 */
export function merchantUpdateApi(data) {
  return request({
    url: '/admin/merchant/config/info/edit',
    method: 'post',
    data,
  });
}

/**
 * @description 商户基本设置 -- 配置信息
 */
export function merchantConfigInfoApi() {
  return request({
    url: '/admin/merchant/config/info',
    method: 'get',
  });
}

/**
 * @description 商户基本设置 -- 商户开关
 */
export function merchantSwitchApi() {
  return request({
    url: '/admin/merchant/switch/update',
    method: 'post',
  });
}

/**
 * @description 商户基本设置 -- 转账信息
 */
export function merchantTransferApi() {
  return request({
    url: '/admin/merchant/settlement/info',
    method: 'GET',
  });
}

/**
 * @description 商户基本设置 -- 转账信息编辑
 */
export function merchantTransferEditApi(data) {
  return request({
    url: '/admin/merchant/settlement/info/edit',
    method: 'post',
    data,
  });
}

/**
 * @description 获取商户端商户商品审核开关信息
 */
export function productAuditSwitchInfoApi() {
  return request({
    url: '/admin/merchant/product/audit/switch/info',
    method: 'get',
  });
}
