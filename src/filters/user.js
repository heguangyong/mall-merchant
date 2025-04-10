// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

//会员过滤器

/**
 * 等级
 */
export function levelFilter(status) {
  if (!status) {
    return '';
  }
  let arrayList = JSON.parse(localStorage.getItem('levelKey'));
  let array = arrayList.filter((item) => status === item.id);
  if (array.length) {
    return array[0].name;
  } else {
    return '';
  }
}

/**
 * 用户注册类型
 */
export function registerTypeFilter(status) {
  const statusMap = {
    wechat: '公众号',
    routine: '小程序',
    h5: 'H5',
    iosWx: '微信ios',
    androidWx: '微信安卓',
    ios: 'ios',
  };
  return statusMap[status];
}

/**
 * 用户类型
 */
export function filterIsPromoter(status) {
  const statusMap = {
    true: '推广员',
    false: '普通用户',
  };
  return statusMap[status];
}
/**
 * 移动端主题色
 */
export function filterTheme(status) {
  const statusMap = {
    0: '#e93323',
    1: '#fe5c2d',
    2: '#42ca4d',
    3: '#1ca5e9',
    4: '#ff448f',
  };
  return statusMap[status];
}
