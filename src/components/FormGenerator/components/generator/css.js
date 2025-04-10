// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

const styles = {
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}',
};

function addCss(cssList, el) {
  const css = styles[el.__config__.tag];
  css && cssList.indexOf(css) === -1 && cssList.push(css);
  if (el.__config__.children) {
    el.__config__.children.forEach((el2) => addCss(cssList, el2));
  }
}

export function makeUpCss(conf) {
  const cssList = [];
  conf.fields.forEach((el) => addCss(cssList, el));
  return cssList.join('\n');
}
