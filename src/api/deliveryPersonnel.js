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
 * @description 商户配送人员分页列表
 */
export function personnelListApi(params) {
  return request({
    url: '/admin/merchant/delivery/personnel/page',
    method: 'get',
    params,
  });
}

/**
 * @description 新增商户配送人员
 */
export function personnelSaveApi(data) {
  return request({
    url: '/admin/merchant/delivery/personnel/save',
    method: 'post',
    data,
  });
}

/**
 * @description 编辑商户配送人员
 */
export function personnelEditApi(data) {
  return request({
    url: '/admin/merchant/delivery/personnel/edit',
    method: 'post',
    data,
  });
}

/**
 * @description 删除商户配送人员
 */
export function personnelDeleteApi(id) {
  return request({
    url: `admin/merchant/delivery/personnel/delete/${id}`,
    method: 'post',
  });
}
