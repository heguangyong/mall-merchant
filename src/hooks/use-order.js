import { expressAllApi, expressPageApi } from '@/api/logistics';

/**
 * 配置的物流公司
 * @param param
 * @returns {Promise<*>}
 */
export async function useLogistics(param) {
  const res = await expressPageApi(param);
  const express = res.list.filter((item) => item.isOpen);
  return express;
}

/**
 * 全部物流公司
 * @param param
 * @returns {Promise<*>}
 */
export async function useLogisticsAllList(param) {
  const express = await expressAllApi({ type: 'normal' });
  localStorage.setItem('expressAllList', JSON.stringify(express));
  return express;
}
