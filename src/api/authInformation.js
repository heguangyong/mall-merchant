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
 * 获取版权信息
 */
export function copyrightInfoApi() {
  return request({
    url: '/admin/merchant/copyright/get/company/info',
    method: 'get',
  });
}

/**
 * @description 账号登录检测
 */
export function accountDetectionApi(data) {
  return request({
    url: '/admin/merchant/login/account/detection',
    method: 'post',
    data,
  });
}

/**
 * 获取移动端域名
 */
export function frontDomainApi() {
  return request({
    url: '/publicly/config/get/front/domain',
    method: 'get',
  });
}

/**
 * 获取移动端主题色
 */
export function getSystemColorApi() {
  return request({
    url: '/publicly/config/get/change/color',
    method: 'get',
  });
}
