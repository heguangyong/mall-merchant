// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

//商户过滤器

/**
 * 商户创建类型
 */
export function merCreateTypeFilter(status) {
  const statusMap = {
    admin: '管理员创建',
    apply: '商户入驻申请',
  };
  return statusMap[status];
}

/**
 * 商户类别
 */
export function selfTypeFilter(status) {
  const statusMap = {
    true: '自营',
    false: '非自营',
  };
  return statusMap[status];
}
