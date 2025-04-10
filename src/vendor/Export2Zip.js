// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

/* eslint-disable */
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export function export_txt_to_zip(th, jsonData, txtName, zipName) {
  const zip = new JSZip();
  const txt_name = txtName || 'file';
  const zip_name = zipName || 'file';
  const data = jsonData;
  let txtData = `${th}\r\n`;
  data.forEach((row) => {
    let tempStr = '';
    tempStr = row.toString();
    txtData += `${tempStr}\r\n`;
  });
  zip.file(`${txt_name}.txt`, txtData);
  zip
    .generateAsync({
      type: 'blob',
    })
    .then(
      (blob) => {
        saveAs(blob, `${zip_name}.zip`);
      },
      (err) => {
        alert('导出失败');
      },
    );
}
