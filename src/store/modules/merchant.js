// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import * as merchant from '@/api/merchant';

const state = {
  merchantClassify: JSON.parse(localStorage.getItem('merchantClassify')) || [] /** 商户分类 **/,
  merchantType: JSON.parse(localStorage.getItem('merchantType')) || [] /** 商户类型 **/,
};

const mutations = {
  SET_MerchantClassify: (state, merchantClassify) => {
    state.merchantClassify = merchantClassify;
    if (!merchantClassify.length) localStorage.removeItem('merchantClassify');
  },
  SET_MerchantType: (state, merchantType) => {
    state.merchantType = merchantType;
    if (!merchantType.length) localStorage.removeItem('merchantType');
  },
};

const actions = {
  /** 商户全部分类  **/
  getMerchantClassify({ commit }) {
    return new Promise((resolve, reject) => {
      merchant
        .merchantCategoryAllListApi()
        .then(async (res) => {
          commit('SET_MerchantClassify', res);
          localStorage.setItem('merchantClassify', JSON.stringify(res));
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  /** 商户全部类型 **/
  getMerchantType({ commit }) {
    return new Promise((resolve, reject) => {
      merchant
        .merchantTypeAllListApi()
        .then(async (res) => {
          commit('SET_MerchantType', res);
          localStorage.setItem('merchantType', JSON.stringify(res));
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

/** tree去除 childList=[] 的结构**/
const changeNodes = function (data) {
  if (data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      if (!data[i].childList || data[i].childList.length < 1) {
        data[i].childList = undefined;
      } else {
        changeNodes(data[i].childList);
      }
    }
  }
  return data;
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  changeNodes,
};
