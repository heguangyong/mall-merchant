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
 * 新增分类
 * @param pram
 */
export function addCategroy(pram) {
  const data = {
    extra: pram.extra,
    name: pram.name,
    pid: pram.pid,
    sort: pram.sort,
    status: pram.status,
    type: pram.type,
    url: pram.url,
    owner: pram.owner,
  };
  return request({
    url: '/admin/merchant/category/save',
    method: 'POST',
    data: data,
  });
}

/**
 * 分类详情
 * @param pram
 */
export function infoCategroy(pram) {
  return request({
    url: `/admin/merchant/category/info/${pram}`,
    method: 'GET',
  });
}

/**
 * 删除分类
 * @param pram
 */
export function deleteCategroy(pram) {
  return request({
    url: `/admin/merchant/category/delete/${pram}`,
    method: 'post',
  });
}

/**
 * 分类列表
 * @param pram
 */
export function listCategroy(pram) {
  const data = {
    limit: pram.limit,
    name: pram.name,
    page: pram.page,
    pid: pram.pid,
    status: pram.status,
    type: pram.type,
  };
  return request({
    url: '/admin/category/list',
    method: 'GET',
    params: data,
  });
}

/**
 * 分类数据tree数据
 * @param pram
 */
export function treeCategroy(pram) {
  const data = {
    type: pram.type,
    status: pram.status,
    name: pram.name,
    owner: pram.owner,
  };
  return request({
    url: '/admin/merchant/category/list/tree',
    method: 'GET',
    params: data,
  });
}

/**
 * 更新分类
 * @param pram
 */
export function updateCategroy(pram) {
  const data = {
    extra: pram.extra,
    name: pram.name,
    pid: pram.pid,
    sort: pram.sort,
    status: pram.status,
    type: pram.type,
    url: pram.url,
    id: pram.id,
    owner: pram.owner,
  };
  return request({
    url: `/admin/merchant/category/update/${pram.id}`,
    method: 'POST',
    params: data,
  });
}

/**
 * 根据id集合查询对应分类列表
 * @param pram
 */
export function categroyByIds(pram) {
  const data = {
    ids: pram.ids,
  };
  return request({
    url: '/admin/merchant/category/list/ids',
    method: 'GET',
    params: data,
  });
}

/**
 * 修改 显示关闭状态
 * @param pram
 */
export function categroyUpdateStatus(id) {
  return request({
    url: `/admin/merchant/category/updateStatus/${id}`,
    method: 'GET',
  });
}

/**
 * 文章详情
 * @param pram
 */
export function articleInfoApi(params) {
  return request({
    url: `/admin/article/info`,
    method: 'GET',
    params,
  });
}
