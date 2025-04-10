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

export function getFormConfigInfo(pram) {
  const data = {
    id: pram.id,
  };
  return request({
    url: '/admin/merchant/form/temp/info',
    method: 'GET',
    params: data,
  });
}

/**
 * 通过名称查询详情
 * @param pram
 */
export function formTempNameInfoApi(params) {
  return request({
    url: `/admin/merchant/form/temp/name/info`,
    method: 'get',
    params,
  });
}

/**
 * @description 验证行为验证码
 */
export function knowUserSmsCaptchaApi(data) {
  return request({
    url: '/publicly/safety/check',
    method: 'post',
    data,
  });
}

/**
 * @description 获取行为验证码
 */
export function knowUserCaptchaApi(data) {
  return request({
    url: '/publicly/safety/get',
    method: 'post',
    data,
  });
}
