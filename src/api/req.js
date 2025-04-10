// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import axios from 'axios';

const service = axios.create({
  timeout: 40000,
});
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response;
    if (res.status !== 200 && res.status !== 401) {
      Message({
        message: res.data.msg || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject();
    } else {
      return res.data;
    }
  },
  (error) => {},
);
export default service;
