/**
 * 商品状态
 */
export const ProductTypeEnum = {
  OnSale: '1', //出售中
  InTheWarehouse: '2', //仓库中
  SoldOut: '3', //已售罄
  AlertInventory: '4', //警戒库存
  RecycleBin: '5', //回收站
  Audit: '6', //待审核
  ReviewFailed: '7', //审核失败
  PendingReview: '8', //待提审
};

/**
 * 订单二级类型
 */
export const OrderSecondTypeEnum = {
  Normal: 0, //基础商品
  Integral: 1, //积分
  Fictitious: 2, //虚拟,
  Video: 4, //视频号
  CloudDrive: 5, //云盘商品
  CardPassword: 6, //卡密商品
};
