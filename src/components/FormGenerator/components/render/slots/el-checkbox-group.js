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
  options(h, conf, key) {
    const list = [];
    conf.__slot__.options.forEach((item) => {
      if (conf.__config__.optionType === 'button') {
        list.push(<el-checkbox-button label={item.value}>{item.label}</el-checkbox-button>);
      } else {
        list.push(
          <el-checkbox label={item.value} border={conf.border}>
            {item.label}
          </el-checkbox>,
        );
      }
    });
    return list;
  },
};
