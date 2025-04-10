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
 * 获取商户PC商城设置
 * @param pram
 */
export function getPcConfigApi() {
  return request({
    url: '/admin/merchant/config/get/pc/shopping/config',
    method: 'GET',
  });
}

/**
 * 保存商户PC商城设置
 * @param pram
 */
export function savePcConfigApi(data) {
  return request({
    url: '/admin/merchant/config/save/pc/shopping/config',
    method: 'post',
    data,
  });
}
