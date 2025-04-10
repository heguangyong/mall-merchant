// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

/**
 * 商品规格弹窗形式组件
 * @param val 值
 * @param callback 回调函数
 * @param keyNum 重置组件key值
 * @returns {Promise<any>}
 */
export default function modalAttr(val, callback, keyNum) {
  const h = this.$createElement;
  return new Promise((resolve, reject) => {
    this.$msgbox({
      title: '属性规格',
      customClass: 'upload-form',
      closeOnClickModal: false,
      showClose: true,
      appendToBody: false,
      message: h('div', { class: 'common-form-upload' }, [
        h('attrFrom', {
          props: {
            currentRow: val,
            keyNum: keyNum,
          },
          on: {
            getList() {
              callback();
            },
          },
        }),
      ]),
      showCancelButton: false,
      showConfirmButton: false,
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
        this.$message({
          type: 'info',
          message: '已取消',
        });
      });
  });
}
