<template>
  <div>
    <!--头部-->
    <base-info ref="baseInfo" v-if="checkPermi(['merchant:statistics:home:index'])" />
    <!--小方块-->
    <grid-menu class="mb14" />
    <!-- 商品浏览量排行榜 -->
    <ranking ref="ranking"></ranking>
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

import baseInfo from './components/baseInfo';
import ranking from './components/ranking';
import gridMenu from './components/gridMenu';
import { checkPermi } from '@/utils/permission'; // 权限判断函数
import { mediadomainApi } from '@/api/systemSetting';
export default {
  name: 'Dashboard',
  components: { baseInfo, gridMenu, ranking },
  mounted() {
    this.getMediadomain();
  },
  methods: {
    checkPermi,
    //图片域名
    getMediadomain() {
      mediadomainApi().then((res) => {
        localStorage.setItem('mediaDomain', res);
        this.$store.commit('settings/SET_mediaDomain', res);
      });
    },
  },
};
</script>
