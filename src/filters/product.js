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
 * @description 直播商品审核状态
 */
export function liveReviewStatusFilter(status) {
  const statusMap = {
    0: '商户创建/撤回',
    1: '平台待审核/商户重新提交审核',
    2: '平台审核通过/微信审核中',
    3: '平台审核失败',
    4: '微信审核成功',
    5: '微信审核失败',
  };
  return statusMap[status];
}

/**
 * @description 直播状态
 */
export function broadcastStatusFilter(status) {
  const statusMap = {
    101: '直播中',
    102: '未开始',
    103: '已结束',
    104: '禁播',
    105: '暂停',
    106: '异常',
    107: '已过期',
  };
  return statusMap[status];
}

/**
 * @description 直播间审核状态
 */
export function roomReviewStatusFilter(status) {
  const statusMap = {
    0: '平台待审核',
    1: '平台审核失败',
    2: '微信审核失败',
    3: '微信审核成功',
  };
  return statusMap[status];
}

/**
 * @description 直播间开启关闭状态
 */
export function roomShowFilter(status) {
  const statusMap = {
    0: '开启',
    1: '关闭',
  };
  return statusMap[status];
}

/**
 * @description 直播商品价格类型
 */
export function priceTypeFilter(status) {
  const statusMap = {
    1: '一口价',
    2: '价格区间',
    3: '折扣价',
  };
  return statusMap[status];
}

/**
 * @description 商品类型
 */
export function productTpyeFilter(status) {
  const statusMap = {
    0: '普通商品',
    1: '积分商品',
    2: '虚拟商品',
    4: '视频号',
    5: '云盘商品',
    6: '卡密商品',
  };
  return statusMap[status];
}
