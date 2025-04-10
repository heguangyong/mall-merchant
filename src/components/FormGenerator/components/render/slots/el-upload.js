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
  'list-type': (h, conf, key) => {
    const list = [];
    const config = conf.__config__;
    if (conf['list-type'] === 'picture-card') {
      list.push(<i class="el-icon-plus"></i>);
    } else {
      list.push(
        <el-button size="small" type="primary" icon="el-icon-upload">
          {config.buttonText}
        </el-button>,
      );
    }
    if (config.showTip) {
      list.push(
        <div slot="tip" class="el-upload__tip">
          只能上传不超过 {config.fileSize}
          {config.sizeUnit} 的{conf.accept}文件
        </div>,
      );
    }
    return list;
  },
};
