<template>
  <div>
    <router-view />
  </div>
</template>

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
  mounted() {
    // 取消开始的loading动画
    const preLoader = document.querySelector('#pre-loader');
    preLoader.style.display = 'none';

    // fix: firefox 下 拖拽 会新打卡一个选项卡
    // https://github.com/JakHuang/form-generator/issues/15
    document.body.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
  },
};
</script>
