// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from '@/utils/request';

/**
 * 会员领取记录 列表
 * @param pram
 */
export function couponUserListApi(params) {
  return request({
    url: '/admin/merchant/coupon/user/list',
    method: 'get',
    params,
  });
}

/**
 * 视频号 草稿列表
 */
export function draftListApi(params) {
  return request({
    url: `/admin/merchant/pay/component/draftproduct/draft/list`,
    method: 'get',
    params,
  });
}

/**
 * 视频号 过审商品列表
 */
export function videoProductListApi(params) {
  return request({
    url: `/admin/merchant/pay/component/product/list`,
    method: 'get',
    params,
  });
}

/**
 * 视频号 类目
 */
export function catListApi(params) {
  return request({
    url: `/admin/merchant/pay/component/cat/get/list`,
    method: 'get',
  });
}

/**
 * 视频号 草稿商品添加
 */
export function videoAddApi(data) {
  return request({
    url: `/admin/merchant/pay/component/draftproduct/add`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 过审商品上架
 */
export function videoUpApi(proId) {
  return request({
    url: `/admin/merchant/pay/component/product/puton/${proId}`,
    method: 'post',
  });
}

/**
 * 视频号 过审商品下架
 */
export function videoDownApi(proId) {
  return request({
    url: `/admin/merchant/pay/component/product/putdown/${proId}`,
    method: 'post',
  });
}

/**
 * 视频号 草稿商品删除
 */
export function draftDelApi(id) {
  return request({
    url: `/admin/merchant/pay/component/draftproduct/delete/${id}`,
    method: 'get',
  });
}

/**
 * 视频号 草稿商品详情
 */
export function draftInfoApi(id) {
  return request({
    url: `/admin/merchant/pay/component/draftproduct/draft/get/${id}`,
    method: 'get',
  });
}

/**
 * 视频号 草稿商品编辑
 */
export function draftUpdateApi(data) {
  return request({
    url: `/admin/merchant/pay/component/draftproduct/update`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 草稿商品图片上传至微信
 */
export function shopImgUploadApi(data) {
  return request({
    url: `/admin/merchant/pay/component/shop/img/upload`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 商家审核草稿商品
 */
export function draftReviewApi(data) {
  return request({
    url: `/admin/merchant/pay/component/draftproduct/review`,
    method: 'post',
    data,
  });
}

/**
 * 视频号 品牌列表
 */
export function draftBrandlistApi() {
  return request({
    url: `/admin/merchant/pay/component/shop/brand/usable/list`,
    method: 'get',
  });
}

/**
 * 视频号 过审商品删除
 */
export function payProductDeleteApi(proId) {
  return request({
    url: `/admin/merchant/pay/component/product/delete/${proId}`,
    method: 'get',
  });
}

/**
 * 视频号 过审商品详情
 */
export function payProductGetApi(id) {
  return request({
    url: `/admin/merchant/pay/component/product/get/${id}`,
    method: 'get',
  });
}

/**
 * 秒杀 秒杀活动详情
 */
export function seckillActivityDetailApi(id) {
  return request({
    url: `/admin/merchant/seckill/activity/detail/${id}`,
    method: 'get',
  });
}

/**
 * 秒杀 秒杀活动分页列表
 */
export function seckillActivityListApi(params) {
  return request({
    url: `/admin/merchant/seckill/activity/page`,
    method: 'get',
    params,
  });
}

/**
 * 秒杀 秒杀商品列表
 */
export function seckillProListApi(params) {
  return request({
    url: `/admin/merchant/seckill/product/page`,
    method: 'get',
    params,
  });
}

/**
 * 秒杀 秒杀商品删除
 */
export function seckillProDelApi(data) {
  return request({
    url: `/admin/merchant/seckill/product/delete`,
    method: 'POST',
    data,
  });
}

/**
 * 秒杀 秒杀商品添加
 */
export function seckillProAddApi(data) {
  return request({
    url: `/admin/merchant/seckill/product/add`,
    method: 'POST',
    data,
  });
}

/**
 * 秒杀 秒杀商品下架
 */
export function seckillProDownApi(data) {
  return request({
    url: `/admin/merchant/seckill/product/down`,
    method: 'post',
    data,
  });
}

/**
 * 秒杀 秒杀商品上架
 */
export function seckillProUpApi(data) {
  return request({
    url: `/admin/merchant/seckill/product/up`,
    method: 'post',
    data,
  });
}

/**
 * 秒杀 秒杀商品设置活动价
 */
export function seckillProSetPriceApi(data) {
  return request({
    url: `/admin/merchant/seckill/product/set/price`,
    method: 'post',
    data,
  });
}

/**
 * 秒杀 秒杀商品撤回审核
 */
export function seckillProWithdrawApi(id) {
  return request({
    url: `/admin/merchant/seckill/product/withdraw/${id}`,
    method: 'post',
  });
}

/**
 * 直播 商品撤回审核
 */
export function liveGoodsAuditResetApi(id) {
  return request({
    url: `/admin/merchant/mp/live/goods/audit/reset/${id}`,
    method: 'get',
  });
}

/**
 * 直播 重新提交申请
 */
export function liveGoodsAuditApi(id) {
  return request({
    url: `/admin/merchant/mp/live/goods/audit/${id}`,
    method: 'get',
  });
}

/**
 * 直播 商品 删除
 */
export function liveGoodsDelApi(id) {
  return request({
    url: `/admin/merchant/mp/live/goods/delete/${id}`,
    method: 'get',
  });
}

/**
 * 直播 商品 详情
 */
export function liveGoodsInfoApi(id) {
  return request({
    url: `/admin/merchant/mp/live/goods/info/${id}`,
    method: 'get',
  });
}

/**
 * 直播 商品 分页列表
 */
export function liveGoodsListApi(params) {
  return request({
    url: `/admin/merchant/mp/live/goods/list`,
    method: 'get',
    params,
  });
}

/**
 * 直播 商品 新增并提审
 */
export function liveGoodsSaveApi(data) {
  return request({
    url: `/admin/merchant/mp/live/goods/save`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 商品 修改
 */
export function liveGoodsuUpdateApi(data) {
  return request({
    url: `/admin/merchant/mp/live/goods/update`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 商品 微信 - 素材上传
 */
export function mediaUploadApi(data, params) {
  return request({
    url: `/admin/merchant/mp/media/upload`,
    method: 'POST',
    params,
    data,
  });
}

/**
 * 直播 商品 修改
 */
export function liveGoodsUpdateApi(data) {
  return request({
    url: `/admin/merchant/mp/live/goods/update`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 小助手 删除
 */
export function liveAssistantDelApi(id) {
  return request({
    url: `/admin/merchant/mp/live/assistant/delete/${id}`,
    method: 'get',
  });
}

/**
 * 直播 小助手 详情
 */
export function liveAssistantInfoApi(id) {
  return request({
    url: `/admin/merchant/mp/live/assistant/info/${id}`,
    method: 'get',
  });
}

/**
 * 直播 小助手 分页列表
 */
export function liveAssistantListApi(params) {
  return request({
    url: `/admin/merchant/mp/live/assistant/list`,
    method: 'get',
    params,
  });
}

/**
 * 直播 小助手 新增
 */
export function liveAssistantSaveApi(data) {
  return request({
    url: `/admin/merchant/mp/live/assistant/save`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 小助手 修改
 */
export function liveAssistantUpdateApi(data) {
  return request({
    url: `/admin/merchant/mp/live/assistant/update`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 直播间 新增直播间小助手 到直播间
 */
export function liveRoomAddasstoroomeApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/addasstoroome`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 直播间 新增直播间小助手 到直播间
 */
export function liveRoomEditasstoroomeApi(id, assid) {
  return request({
    url: `/admin/merchant/mp/live/room/modifyass/${id}/${assid}`,
    method: 'POST',
  });
}

/**
 * 直播 直播间  删除直播间小助手
 */
export function liveRoomRemoveasstoroomeApi(id, assid) {
  return request({
    url: `/admin/merchant/mp/live/room/removeass/${id}/${assid}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 导入商品
 */
export function liveRoomAddgoodsApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/addgoods`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 直播间 新增直播间主播副号
 */
export function liveRoomAddsubanchorApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/addsubanchor`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 直播间 创建直播室
 */
export function liveRoomCreateApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/create`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 直播间 删除直播室
 */
export function liveRoomDeleteApi(roomId) {
  return request({
    url: `/admin/merchant/mp/live/room/delete/${roomId}`,
    method: 'GET',
  });
}

/**
 * 直播 直播间 删除直播间商品
 */
export function liveRoomDeletegoodsinroomApi(roomId, goodsId) {
  return request({
    url: `/admin/merchant/mp/live/room/deletegoodsinroom/${roomId}/${goodsId}`,
    method: 'GET',
  });
}

/**
 * 直播 直播间 删除直播间主播副号
 */
export function liveRoomDeletesubanchorApi(roomId) {
  return request({
    url: `/admin/merchant/mp/live/room/deletesubanchor/${roomId}`,
    method: 'GET',
  });
}

/**
 * 直播 直播间 编辑直播室
 */
export function liveRoomEditApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/edit`,
    method: 'POST',
    data,
  });
}

/**
 * 直播 直播间 获取直播间分享二维码
 */
export function liveRoomGetsharecodeApi(roomId) {
  return request({
    url: `/admin/merchant/mp/live/room/getsharecode/${roomId}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 获取直播间主播副号
 */
export function liveRoomGetsubanchorApi(roomId) {
  return request({
    url: `/admin/merchant/mp/live/room/getsubanchor/${roomId}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 下载讲解视频
 */
export function liveRoomGetvideoApi(id, roomId) {
  return request({
    url: `/admin/merchant/mp/live/room/getvideo/${id}/${goodsId}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 商品上下架
 */
export function liveRoomGoodsonsaleApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/goodsonsale`,
    method: 'post',
    data,
  });
}

/**
 * 直播 直播间 商品排序
 */
export function liveRoomGoodsortApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/goodsort`,
    method: 'post',
    data,
  });
}

/**
 * 直播 直播间 查询直播间小助手
 */
export function liveRoomModifyassApi(id) {
  return request({
    url: `/admin/merchant/mp/live/room/modifyass/${id}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 修改直播间小助手
 */
export function liveRoomModifyassUpdateApi(id, assid) {
  return request({
    url: `/admin/merchant/mp/live/room/modifyass/${id}/${assid}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 修改直播间主播副号
 */
export function liveRoomModifysubanchorApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/modifysubanchor`,
    method: 'post',
    data,
  });
}

/**
 * 直播 直播间 推送商品
 */
export function liveRoomPushgoodsApi(roomId, goodsId) {
  return request({
    url: `/admin/merchant/mp/live/room/pushgoods/${roomId}/${goodsId}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 删除直播间小助手
 */
export function liveRoomRemoveassApi(id, assid) {
  return request({
    url: `/admin/merchant/mp/live/room/removeass/${id}/${assid}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 禁言管理
 */
export function liveRoomUpdatecommentApi(id, banComment) {
  return request({
    url: `/admin/merchant/mp/live/room/updatecomment/${id}/${banComment}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 官方收录管理
 */
export function liveRoomIsFeedsPublicApi(id, isFeedsPublic) {
  return request({
    url: `/admin/merchant/mp/live/room/updatefeedpublic/${id}/${isFeedsPublic}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 开启回放
 */
export function liveRoomUpdatereplayApi(id, closeReplay) {
  return request({
    url: `/admin/merchant/mp/live/room/updatereplay/${id}/${closeReplay}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 直播室列表和回放
 */
export function liveRoomListApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/list`,
    method: 'post',
    data: {
      pageParamRequest: {
        limit: data.limit,
        page: data.page,
      },
      searchRequest: {
        reviewStatus: data.reviewStatus,
        liveStatus: data.liveStatus,
        keywords: data.keywords,
        storeShow: data.storeShow,
        star: data.star,
      },
    },
  });
}

/**
 * 直播 直播间 素材上传本地
 */
export function liveMediaUploadlocalApi(data) {
  return request({
    url: `/admin/merchant/mp/media/uploadlocal`,
    method: 'post',
    data,
  });
}

/**
 * 直播 直播间 直播间商品列表
 */
export function liveRoomGoodslistApi(id) {
  return request({
    url: `/admin/merchant/mp/live/room/goodslist/${id}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 直播间商品列表
 */
export function liveRoomInfoApi(id) {
  return request({
    url: `/admin/merchant/mp/live/room/info/${id}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 直播间商品列表
 */
export function liveRoomGetassApi(id) {
  return request({
    url: `/admin/merchant/mp/live/room/getass/${id}`,
    method: 'get',
  });
}

/**
 * 直播 直播间 管理直播间小助手
 */
export function liveRoomMangerassApi(data) {
  return request({
    url: `/admin/merchant/mp/live/room/mangerass`,
    method: 'post',
    data,
  });
}

/**
 * 直播 直播间 客服管理
 */
export function liveRoomUpdateclosekfApi(id, closeKf) {
  return request({
    url: `/admin/merchant/mp/live/room/updateclosekf/${id}/${closeKf}`,
    method: 'get',
  });
}

/**
 * @description 直播-商品-修改排序
 */
export function liveGoodsSortApi(id, sort) {
  return request({
    url: `/admin/merchant/mp/live/goods/sort/${id}/${sort}`,
    method: 'GET',
  });
}
