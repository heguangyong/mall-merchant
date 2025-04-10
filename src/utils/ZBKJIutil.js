// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import store from '@/store';
import { fileImageApi } from '@/api/systemSetting';
import { Message } from 'element-ui';

/**
 * 根据需求过滤掉treeData中的child.length === 0的数据
 * @param treeData
 * @returns {Uint8Array | BigInt64Array | any[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
 */
export function clearTreeData(treeData) {
  return treeData.map((item) => {
    if (item.child.length === 0) {
      delete item.child;
    } else {
      clearTreeData(item.child);
    }
    return item;
  });
}

export function addTreeListLabel(treeData) {
  // 因树形控件在slot-scope模式下显示字段只能为label为此自定义添加label字段和child=children
  return treeData.map((item) => {
    if (
      (item.name === '设置' ||
        item.name === '管理员列表' ||
        item.name === '身份管理' ||
        item.name === '管理权限' ||
        item.name === '管理员列表' ||
        item.name === '权限规则') &&
      store.getters.name !== 'admin'
    ) {
      item.disabled = true;
    }
    item.label = item.name;
    return item;
  });
}

export function addTreeListLabelForCasCard(treeData, child) {
  treeData.map((item) => {
    if (
      (item.name === '设置' ||
        item.name === '管理员列表' ||
        item.name === '身份管理' ||
        item.name === '管理权限' ||
        item.name === '管理员列表' ||
        item.name === '权限规则') &&
      store.getters.name !== 'admin'
    ) {
      item.disabled = true;
    }
    item.label = item.name;
    return item;
  });
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：$h.Add(arg1,arg2)
//返回值：arg1加上arg2的精确结果
export function Add(arg1, arg2) {
  arg2 = parseFloat(arg2);
  var r1, r2, m;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(100, Math.max(r1, r2));
  return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：$h.Mul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
export function Mul(arg1, arg2) {
  arg1 = parseFloat(arg1);
  arg2 = parseFloat(arg2);
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}

/**
 * 除法函数，用来得到精确的除法结果
 * 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 * @param arg1
 * @param arg2
 * @returns 返回值：arg1除以arg2的精确结果
 * 调用：$h.Div(arg1,arg2)
 */
export function Division(arg1, arg2) {
  arg1 = parseFloat(arg1);
  arg2 = parseFloat(arg2);
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''));
  r2 = Number(arg2.toString().replace('.', ''));
  return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
}

//替换安全域名
export function setDomain(url) {
  url = url ? url.toString() : '';
  // 正则替换存在的转义符
  url = url.replace(/\\/g, '');
  url = window.location.protocol === 'https:' ? url.replace('http://', 'https://') : url;
  if (url.startsWith('src="')) {
    url = url.replaceAll('src="', '');
  }
  if (url.startsWith('//img') && window.location.protocol === 'https:') {
    url = url.replace('//img', 'https://img');
  }
  return url;
}

// 过滤富文本中的 img 相对路径访问
export function replaceImgSrcHttps(content) {
  return content.replaceAll('src="//', 'src="https://');
}

/**
 *计算table固定高度
 */
export function getTableHeight(height) {
  let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
  let herderHeight = 100;
  let footerHeight = 93;
  return windowHeight - herderHeight - footerHeight - height;
}

/**
 *table分页记忆
 */
export function changePageCoreRecordData(multipleSelectionAll, multipleSelection, tableData, successFn) {
  // 标识当前行的唯一键的名称
  const idKey = 'id';
  // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
  if (multipleSelectionAll.length <= 0) {
    multipleSelectionAll = multipleSelection;
    return successFn(multipleSelectionAll);
  }
  // 总选择里面的key集合
  const selectAllIds = [];
  multipleSelectionAll.forEach((row) => {
    selectAllIds.push(row[idKey]);
  });
  const selectIds = [];
  // 获取当前页选中的id
  multipleSelection.forEach((row) => {
    selectIds.push(row[idKey]);
    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
    if (selectAllIds.indexOf(row[idKey]) < 0) {
      multipleSelectionAll.push(row);
    }
  });
  const noSelectIds = [];
  // 得到当前页没有选中的id
  tableData.forEach((row) => {
    if (selectIds.indexOf(row[idKey]) < 0) {
      noSelectIds.push(row[idKey]);
    }
  });
  noSelectIds.forEach((uid) => {
    if (selectAllIds.indexOf(uid) >= 0) {
      for (let i = 0; i < multipleSelectionAll.length; i++) {
        if (multipleSelectionAll[i][idKey] == uid) {
          // 如果总选择中有未被选中的，那么就删除这条
          multipleSelectionAll.splice(i, 1);
          break;
        }
      }
    }
  });
  successFn(multipleSelectionAll);
}

export const deepTraversal = (arr, child, cityTree) => {
  function traversal(arr) {
    arr.forEach((o, i) => {
      if (o.cityId === cityTree[i]) {
        o.disabled = true;
      }
      traversal(o[child]);
    });
  }
  traversal(arr);
};

/**
 * 图片转为base64格式
 * @param img 图片地址
 * @returns {string | *}
 */
export const imageToBase64 = (img) => {
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
  var dataURL = canvas.toDataURL('image/jpeg' + ext);
  return dataURL;
};

/**
 * base64格式转为File文件类型
 * @param urlData 图片地址
 * @param fileName 图片名字
 * @returns {File}
 */
export const base64ToFile = (urlData, fileName) => {
  let arr = urlData.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bytes = atob(arr[1]); // 解码base64
  let n = bytes.length;
  let ia = new Uint8Array(n);
  while (n--) {
    ia[n] = bytes.charCodeAt(n);
  }
  return new File([ia], fileName, { type: mime });
};

/**
 * 上传图片、视频
 * @param formData
 * @param data
 */
export function uploadImage(formData, data) {
  return new Promise((resolve, reject) => {
    fileImageApi(formData, data)
      .then((res) => {
        // Message.success('上传成功');
        return resolve(res);
      })
      .catch((res) => {
        reject();
      });
  });
}

/**
 * 上传文件格式校验
 * @param file
 * @returns {boolean}
 */
export function isFileUpload(file) {
  const typeArry = ['.doc', '.DOC', '.docx', '.xls', '.xlsx'];
  const type = file.name.substring(file.name.lastIndexOf('.'));
  const isFile = typeArry.indexOf(type) > -1;
  if (!isFile) {
    Message.error('上传文件必须为文件');
  }
  return isFile;
}

/**
 * 判断移动端配置地址中是否包含https://，http://
 * @param frontDomain 地址
 * @returns {boolean}
 */
export function isUrlHttp(frontDomain) {
  let url = ['https://', 'http://'];
  let contains = url.some((item) => frontDomain.includes(item));
  return contains;
}

//客服判断
export function getServiceInfo() {
  const JavaMerchantConfigInfo = JSON.parse(localStorage.getItem('JavaMerchantConfigInfo'));
  if (JavaMerchantConfigInfo.serviceType === 'H5') {
    return JavaMerchantConfigInfo.serviceLink;
  } else {
    return JavaMerchantConfigInfo.servicePhone;
  }
}

/**
 * 判断移动端配置地址中是否包含https://，http://
 * @returns {string|string|*|string}
 */
export function getFrontDomainUrl() {
  let url = localStorage.getItem('frontDomain');
  let contains = url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1;
  return contains ? url : `https://${url}`;
}
