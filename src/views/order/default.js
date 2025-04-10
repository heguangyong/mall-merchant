import { validatePhone } from '@/utils/toolsValidate';

export const postRules = {
  expressCode: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
  expressNumber: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
  deliveryCarrier: [{ required: true, message: '请输入配送人员', trigger: 'blur' }],
  carrierPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  isSplit: [{ required: true, message: '请选择分单发货', trigger: 'change' }],
  toName: [{ required: true, message: '请输入寄件人姓名', trigger: 'blur' }],
  expressTempId: [{ required: true, message: '请选择电子面单', trigger: 'blur' }],
  toTel: [{ required: true, message: '请输入寄件人电话', trigger: 'blur' }],
  toAddr: [{ required: true, message: '请输入寄件人地址', trigger: 'blur' }],
};
