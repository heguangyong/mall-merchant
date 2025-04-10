// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import { saveAs } from 'file-saver';
import axios from 'axios';
import { getToken } from '@/utils/auth';
import { Message } from 'element-ui';

const baseURL = process.env.VUE_APP_BASE_API;

export default {
  name(name, isDelete = true) {
    var url = baseURL + '/common/download?fileName=' + encodeURI(name) + '&delete=' + isDelete;
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + getToken() },
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data]);
        this.saveAs(blob, decodeURI(res.headers['download-filename']));
      } else {
        Message.error('无效的会话，或者会话已过期，请重新登录。');
      }
    });
  },
  resource(resource) {
    var url = baseURL + '/common/download/resource?resource=' + encodeURI(resource);
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + getToken() },
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data]);
        this.saveAs(blob, decodeURI(res.headers['download-filename']));
      } else {
        Message.error('无效的会话，或者会话已过期，请重新登录。');
      }
    });
  },
  zip(url, name) {
    var url = baseURL + url;
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + getToken() },
    }).then(async (res) => {
      const isLogin = await this.blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data], { type: 'application/zip' });
        this.saveAs(blob, name);
      } else {
        Message.error('无效的会话，或者会话已过期，请重新登录。');
      }
    });
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts);
  },
  async blobValidate(data) {
    try {
      const text = await data.text();
      JSON.parse(text);
      return false;
    } catch (error) {
      return true;
    }
  },
};
