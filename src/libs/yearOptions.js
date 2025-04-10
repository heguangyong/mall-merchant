// +---------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +---------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +---------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +---------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +---------------------------------------------------------------------

export default {
  shortcuts: [
    {
      text: '本月',
      onClick(picker) {
        picker.$emit('pick', [new Date(), new Date()]);
      },
    },
    {
      text: '今年至今',
      onClick(picker) {
        const end = new Date();
        const start = new Date(new Date().getFullYear(), 0);
        picker.$emit('pick', [start, end]);
      },
    },
    {
      text: '最近六个月',
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 6);
        picker.$emit('pick', [start, end]);
      },
    },
  ],
};
