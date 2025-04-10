<template></template>
<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

export default {
  name: 'AuthRedirect',
  created() {
    const hash = window.location.search.slice(1);
    if (window.localStorage) {
      window.localStorage.setItem('x-admin-oauth-code', hash);
      window.close();
    }
  },
  render: function (h) {
    return h(); // avoid warning message
  },
};
</script>
