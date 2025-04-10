// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import router from '@/router';

export function useProduct() {
  //商品类型
  const productTypeList = [
    {
      label: '普通商品',
      value: 0,
    },
    {
      label: '虚拟商品',
      value: 2,
    },
    {
      label: '云盘商品',
      value: 5,
    },
    {
      label: '卡密商品',
      value: 6,
    },
  ];

  //创建、编辑表单
  const handlerCreatFromUse = (id, type) => {
    const { href } = router.resolve({
      path: `/page/maintain/creatSystemFrom/${id}/${type}`,
    });
    window.open(href);
  };
  return {
    productTypeList,
    handlerCreatFromUse,
  };
}
