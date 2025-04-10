import Cookies from 'js-cookie';
import { setToken } from '@/utils/auth';
import store from '@/store';
/**
 * @description 表格列表中删除最后一页中的唯一一个数据的操作
 */
export function handleDeleteTable(length, tableFrom) {
  if (length === 1 && tableFrom.page > 1) return (tableFrom.page = tableFrom.page - 1);
}

/**
 * @description 登录后的操作
 */
export function getLoginInfo(data) {
  store.commit('user/SET_TOKEN', data.token);
  Cookies.set('JavaMerInfo', JSON.stringify(data));
  setToken(data.token);
  store.commit('product/SET_AdminProductClassify', []);
  store.commit('product/SET_MerProductClassify', []);
  store.commit('merchant/SET_MerchantClassify', []);
  store.commit('merchant/SET_MerchantType', []);
  store.commit('product/SET_ShippingTemplates', []);
  store.commit('mobildConfig/SET_SystemForm', []);
}
