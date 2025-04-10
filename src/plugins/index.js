// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import auth from './auth';
import cache from './cache';
import modal from './modal';
import download from './download';

export default {
  install(Vue) {
    // 认证对象
    Vue.prototype.$auth = auth;
    // 缓存对象
    Vue.prototype.$cache = cache;
    // 模态框对象
    Vue.prototype.$modal = modal;
    // 下载文件
    Vue.prototype.$download = download;
  },
};
