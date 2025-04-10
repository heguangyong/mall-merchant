// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import { login, logout, getAdminInfoByTokenApi } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import Cookies from 'js-cookie';
import { Loading } from 'element-ui';
import * as roleApi from '@/api/roleApi.js';
import { formatFlatteningRoutes } from '@/utils/system.js';
import { getLoginInfo } from '@/libs/public';
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: [],
  captcha: {
    captchaVerification: '',
    secretKey: '',
    token: '',
  }, //滑块验证token
  // 菜单数据
  menuList: localStorage.getItem('MerMerAdmin_MenuList')
    ? JSON.parse(localStorage.getItem('MerMerAdmin_MenuList'))
    : [],
  oneLvMenus: [],
  oneLvRoutes: localStorage.getItem('MerMerAdmin_oneLvRoutes')
    ? JSON.parse(localStorage.getItem('MerMerAdmin_oneLvRoutes'))
    : [],
  childMenuList: [],
  account: '',
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
  SET_CAPTCHA: (state, captcha) => {
    state.captcha = captcha;
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList;
  },
  setOneLvMenus(state, oneLvMenus) {
    state.oneLvMenus = oneLvMenus;
  },
  setOneLvRoute(state, oneLvRoutes) {
    state.oneLvRoutes = oneLvRoutes;
  },
  childMenuList(state, list) {
    state.childMenuList = list;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, pwd, key, code, wxCode } = userInfo;
    Loading.service();
    return new Promise((resolve, reject) => {
      login(userInfo)
        .then((data) => {
          let loadingInstance = Loading.service();
          loadingInstance.close();
          getLoginInfo(data);
          // window.localStorage.clear();
          commit('SET_TOKEN', data.token);
          // Cookies.set('JavaMerInfo', JSON.stringify(data));
          // setToken(data.token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAdminInfoByTokenApi(state.token)
        .then((data) => {
          if (!data) {
            reject();
          }
          // if (!roles || roles.length <= 0) {
          //   reject('getInfo: roles must be a non-null array!');
          // }

          const { roles, account, realName, permissionsList, merStarLevel, merReceiptPrintingSwitch,
            merId, electrPrintingSwitch } = data;
          commit('SET_ROLES', roles);
          commit('SET_NAME', realName); //商户名称
          commit('SET_ACCOUNT', account); //账号
          commit('SET_PERMISSIONS', permissionsList); //权限标识
          Cookies.set('JavaMerchantId', merId); //商户id
          Cookies.set('merStarLevel', merStarLevel);
          Cookies.set('merPrint', merReceiptPrintingSwitch); // 打印机标识
          Cookies.set('merElectPrint', electrPrintingSwitch); // 电子面单打印开关
          commit('SET_AVATAR', 'http://kaifa.crmeb.net/system/images/admin_logo.png');
          commit('SET_INTRODUCTION', 'CRMEB admin');

          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    Loading.service();
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          window.localStorage.clear();
          let loadingInstance = Loading.service();
          loadingInstance.close();
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          commit('SET_PERMISSIONS', []);
          removeToken();
          resetRouter();
          //
          Cookies.remove('storeStaffList');
          Cookies.remove('JavaMerInfo');
          Cookies.remove('JavaMerchantId');
          sessionStorage.removeItem('token');
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true });

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      removeToken();
      resolve();
    });
  },
  // 设置token
  setToken({ commit }, state) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', state.token);
      Cookies.set('JavaMerInfo', JSON.stringify(state));
      setToken(data.token);
      resolve();
    });
  },
  getMenus({ commit }) {
    function formatTwoStageRoutes(arr) {
      if (arr.length <= 0) return false;
      const newArr = [];
      const cacheList = [];
      arr.forEach((v) => {
        if (v && v.meta && v.meta.keepAlive) {
          newArr.push({ ...v });
          cacheList.push(v.name);
          this.$store.dispatch('keepAliveNames/setCacheKeepAlive', cacheList);
        }
      });
      return newArr;
    }

    return new Promise(async (resolve, reject) => {
      let accessRoutes = await roleApi.menuListApi();

      // let accessRoutes = formatRoutes(menusAll);
      // const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true });
      commit('SET_MENU_LIST', accessRoutes);
      localStorage.setItem('MerMerAdmin_MenuList', accessRoutes ? JSON.stringify(accessRoutes) : []);
      let arr = formatFlatteningRoutes(router.options.routes);
      formatTwoStageRoutes(arr);
      let routes = formatFlatteningRoutes(accessRoutes);
      localStorage.setItem('MerMerAdmin_oneLvRoutes', routes ? JSON.stringify(routes) : []);
      commit('setOneLvMenus', arr);
      commit('setOneLvRoute', routes);
      resolve(resolve);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
