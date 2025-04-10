import { couponDeleteApi } from '@/api/product';
import { orderAuditApi, refundOrderReceivingApi } from '@/api/order';
import modalSure from '@/libs/modal-sure';
import { MessageBox, Message } from 'element-ui';
export default function useRefundOrder() {
  //商家确认收货
  const onConfirmReceipt = (refundOrderNo) => {
    return new Promise((resolve, reject) => {
      MessageBox.confirm('确定已经收到所有退款商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await refundOrderReceivingApi(refundOrderNo).then(() => {
            Message.success('确认收货成功');
            return resolve();
          });
        })
        .catch(() => {
          reject();
          Message({
            type: 'info',
            message: '已取消',
          });
        });
    });
  };

  //审核通过到店退款
  const onApprovedReview = (data) => {
    return new Promise((resolve, reject) => {
      MessageBox.confirm('您确定同意此退款单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await orderAuditApi(data).then(() => {
            Message.success('审核成功');
            return resolve();
          });
        })
        .catch(() => {
          reject();
          Message({
            type: 'info',
            message: '已取消',
          });
        });
    });
  };
  return {
    onConfirmReceipt,
    onApprovedReview,
  };
}
