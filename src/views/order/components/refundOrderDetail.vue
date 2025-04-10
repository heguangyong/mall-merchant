<template>
  <div>
    <el-drawer :visible.sync="drawerVisible" :direction="direction" size="1000px" :before-close="handleClose">
      <div v-loading="loading">
        <div class="detailHead">
          <div class="acea-row row-between headerBox">
            <div class="full">
              <div class="order_icon"><span class="iconfont icon-shouhou_tuikuan-2"></span></div>
              <div class="text">
                <div class="title">退款订单</div>
                <div>
                  <span class="mr20">退款单号：{{ refundInfo.refundOrderNo }}</span>
                </div>
              </div>
            </div>
            <!-- 售后状态：0:待审核 1:商家拒绝 2：退款中 3:已退款 4:用户退货 5:商家待收货 6:已撤销-->
            <div class="acea-row justify-content">
              <!-- 审核 -->
              <div
                v-if="refundInfo.refundStatus === 0 && checkPermi(['merchant:refund:order:audit'])"
                class="acea-row row-center-wrappe mr14"
              >
                <el-button
                  type="primary"
                  v-debounceClick="
                    () => {
                      handleApprovedReview('success');
                    }
                  "
                  >{{ loadingBtn ? '提交中 ...' : '审核通过' }}</el-button
                >
                <el-button
                  type="danger"
                  v-debounceClick="
                    () => {
                      handleOrderRefuse('refuse');
                    }
                  "
                  >拒绝</el-button
                >
              </div>
              <!-- 商家收货 -->
              <div v-if="refundInfo.refundStatus === 5" class="acea-row row-center-wrapper mr14">
                <el-button
                  v-if="checkPermi(['merchant:refund:order:receiving'])"
                  type="primary"
                  v-debounceClick="handleConfirmReceipt"
                  >{{ loadingBtn ? '提交中 ...' : '确认收货' }}</el-button
                >
                <el-button
                  v-if="checkPermi(['merchant:refund:order:audit'])"
                  type="danger"
                  v-debounceClick="handleRefuseReceipt"
                  >拒绝</el-button
                >
              </div>
              <el-button size="small" @click.native="onOrderMark()" v-if="checkPermi(['merchant:refund:order:mark'])"
                >订单备注</el-button
              >
            </div>
          </div>

          <ul class="list">
            <li class="item">
              <div class="title">退款状态</div>
              <div class="color-warning">{{ refundInfo.refundStatus | refundStatusFilter }}</div>
            </li>
            <li class="item">
              <div class="title">退款金额</div>
              <div>¥ {{ refundInfo.refundPrice || '0.0' }}</div>
            </li>
            <li class="item">
              <div class="title">实付金额</div>
              <div>{{ refundInfo.payPrice }}</div>
            </li>
            <li class="item">
              <div class="title">创建时间</div>
              <div>{{ refundInfo.orderInfoVo ? refundInfo.orderInfoVo.createTime : '' }}</div>
            </li>
          </ul>
        </div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="售后信息" name="refund">
            <div class="detailSection" style="border: none">
              <div class="title">退款商品</div>
              <ul class="list">
                <li class="item row-middle">
                  <div class="image mr10">
                    <el-image
                      :src="refundInfo.image"
                      :preview-src-list="[refundInfo.image]"
                      style="width: 40px; height: 40px"
                    ></el-image>
                  </div>
                  <div>
                    <div class="text666 mb10 productName line-height-15">{{ refundInfo.productName }}</div>
                    <div class="text999">
                      <span>{{ refundInfo.sku }}</span
                      ><span class="ml30">售价：￥{{ refundInfo.price }}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">退款明细</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">退款数量：</div>
                  <div class="value">{{ refundInfo.applyRefundNum }}</div>
                </li>
                <li class="item">
                  <div class="lang">购买数量：</div>
                  <div class="value">{{ refundInfo.payNum }}</div>
                </li>
                <li class="item">
                  <div class="lang">预计退款方式：</div>
                  <div class="value">原支付返还</div>
                </li>
                <li v-show="refundInfo.refundStatus === 2 || refundInfo.refundStatus === 3" class="item">
                  <div class="lang">退回运费：</div>
                  <div class="value">{{ refundInfo.refundFreightFee }}</div>
                </li>
                <li v-show="refundInfo.refundStatus === 2 || refundInfo.refundStatus === 3" class="item">
                  <div class="lang">退一级佣金：</div>
                  <div class="value">{{ refundInfo.refundFirstBrokerageFee }}</div>
                </li>
                <li v-show="refundInfo.refundStatus === 2 || refundInfo.refundStatus === 3" class="item">
                  <div class="lang">退回抵扣积分：</div>
                  <div class="value">{{ refundInfo.refundUseIntegral }}</div>
                </li>
                <li v-show="refundInfo.refundStatus === 2 || refundInfo.refundStatus === 3" class="item">
                  <div class="lang">收回赠送积分：</div>
                  <div class="value">{{ refundInfo.refundGainIntegral }}</div>
                </li>
                <li v-show="refundInfo.refundStatus === 2 || refundInfo.refundStatus === 3" class="item">
                  <div class="lang">退二级返佣：</div>
                  <div class="value">{{ refundInfo.refundSecondBrokerageFee }}</div>
                </li>
              </ul>
            </div>
            <!-- 退款流程信息-->
            <div class="detailSection">
              <div class="title">退款流程信息</div>
              <div class="detail-centent acea-row">
                <div>
                  <!--  操作类型：apply-申请退款，audit-商家审核，returning-商品退回，receiving-商家确认收货，refund-退款，compulsory-平台强制退款,revoke-撤销-->
                  <el-steps
                    direction="vertical"
                    :active="
                      refundInfo.promoterType === 'merchant' ? 2 : refundInfo.statusList && refundInfo.statusList.length
                    "
                    finish-status="success"
                  >
                    <el-step title="直接退款-商家" v-if="refundInfo.promoterType === 'merchant'">
                      <template slot="description">
                        <div class="mb10">
                          {{ refundInfo.refundTime }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="申请退款-用户"
                      v-if="
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'apply')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{ refundInfo.statusList.filter((item) => item.changeType === 'apply')[0].createTime }}
                        </div>
                        <div class="refundReasonWap">
                          <div class="acea-row">
                            <div class="detail-term" style="width: 58%">
                              <span class="detail-infoTitle">退款原因：</span
                              ><span class="detail-info">{{ refundInfo.refundReasonWap }}</span>
                            </div>
                            <div class="detail-term">
                              <span class="detail-infoTitle">退货方式：</span
                              ><span class="detail-info">{{
                                refundInfo.returnGoodsType === 1
                                  ? '快递退回'
                                  : refundInfo.returnGoodsType === 2
                                  ? '到店退货'
                                  : '不退货'
                              }}</span>
                            </div>
                          </div>
                          <div class="detail-term acea-row">
                            <span class="detail-infoTitle">备注说明：</span>
                            <div class="detail-info" style="width: 600px">
                              {{ refundInfo.refundReasonWapExplain | filterEmpty }}
                            </div>
                          </div>
                          <div class="detail-term">
                            <div class="acea-row">
                              <span class="detail-infoTitle">退款凭证：</span>

                              <div v-if="refundInfo.refundReasonWapImg">
                                <el-image
                                  v-for="(item, index) in refundInfo.refundReasonWapImg.split(',')"
                                  :key="index"
                                  style="width: 60px; height: 60px"
                                  :src="item"
                                  class="mr10"
                                  :preview-src-list="refundInfo.refundReasonWapImg.split(',')"
                                ></el-image>
                              </div>
                              <div v-else>-</div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="商家审核-商家"
                      v-if="
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'audit')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{
                            refundInfo.statusList.filter((item) => item.changeType === 'audit').length
                              ? refundInfo.statusList.filter((item) => item.changeType === 'audit')[0].createTime
                              : ''
                          }}
                        </div>
                        <div v-if="refundInfo.refundStatus > 0" class="refundReasonWap">
                          <div class="detail-term">
                            <span class="detail-infoTitle">审核结果：</span
                            ><span class="detail-info">{{
                              refundInfo.refundStatus === 1 && refundInfo.statusList.length === 2
                                ? '拒绝退款'
                                : '同意退款'
                            }}</span>
                          </div>
                          <div
                            v-if="refundInfo.refundStatus === 1 && refundInfo.statusList.length === 2"
                            class="detail-term"
                          >
                            <span class="detail-infoTitle">拒绝原因：</span>
                            <span class="detail-info">{{ refundInfo.refundReason | filterEmpty }}</span>
                          </div>
                          <div
                            v-if="refundInfo.returnGoodsType === 1 && refundInfo.refundStatus !== 1"
                            class="detail-term"
                          >
                            <div>
                              <span class="detail-infoTitle">退货地址：</span>
                              <span class="detail-info">{{ refundInfo.receiverAddressDetail }}</span>
                            </div>
                            <div>
                              <span class="detail-infoTitle"></span>
                              <span class="detail-info">{{ refundInfo.receiver }} {{ refundInfo.receiverPhone }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="商品退回信息-用户"
                      v-if="
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'returning')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{ refundInfo.statusList.filter((item) => item.changeType === 'returning')[0].createTime }}
                        </div>
                        <div v-if="refundInfo.returnGoodsType === 1" class="refundReasonWap">
                          <div class="acea-row">
                            <div class="detail-term" style="width: 58%">
                              <span class="detail-infoTitle">物流公司：</span
                              ><span class="detail-info">{{ refundInfo.expressName }}</span>
                            </div>
                            <div class="detail-term">
                              <span class="detail-infoTitle">物流单号：</span>
                              <span class="detail-info">{{ refundInfo.trackingNumber }}</span>
                            </div>
                          </div>
                          <div class="detail-term">
                            <div>
                              <span class="detail-infoTitle">联系电话：</span>
                              <span class="detail-info">{{ refundInfo.telephone }}</span>
                            </div>
                          </div>
                        </div>
                        <div v-if="refundInfo.returnGoodsType === 2" class="refundReasonWap">
                          <div class="detail-term">
                            <div>
                              <span class="detail-infoTitle">联系电话：</span>
                              <span class="detail-info">{{ refundInfo.telephone }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="商家确认收货-商家"
                      v-if="
                        refundInfo.refundStatus !== 1 &&
                        refundInfo.refundStatus !== 6 &&
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'receiving')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{
                            refundInfo.statusList.filter((item) => item.changeType === 'receiving').length
                              ? refundInfo.statusList.filter((item) => item.changeType === 'receiving')[0].createTime
                              : ''
                          }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="商品拒绝收货-商家"
                      v-if="
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'rejectionGoods')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{
                            refundInfo.statusList.filter((item) => item.changeType === 'rejectionGoods')[0].createTime
                          }}
                        </div>
                        <div v-if="refundInfo.refundStatus > 0" class="refundReasonWap">
                          <div class="detail-term">
                            <span class="detail-infoTitle">审核结果：</span
                            ><span class="detail-info">{{
                              refundInfo.refundStatus === 1 ? '拒绝退款' : '同意退款'
                            }}</span>
                          </div>
                          <div v-if="refundInfo.refundStatus === 1" class="detail-term">
                            <span class="detail-infoTitle">拒绝原因：</span>
                            <span class="detail-info">{{ refundInfo.refundReason | filterEmpty }}</span>
                          </div>
                          <div
                            v-if="refundInfo.returnGoodsType === 1 && refundInfo.refundStatus !== 1"
                            class="detail-term"
                          >
                            <div>
                              <span class="detail-infoTitle">退货地址：</span>
                              <span class="detail-info">{{ refundInfo.receiverAddressDetail }}</span>
                            </div>
                            <div>
                              <span class="detail-infoTitle"></span>
                              <span class="detail-info">{{ refundInfo.receiver }} {{ refundInfo.receiverPhone }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="已撤销"
                      v-if="
                        refundInfo.refundStatus === 6 &&
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'revoke')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{
                            refundInfo.statusList.filter((item) => item.changeType === 'revoke').length
                              ? refundInfo.statusList.filter((item) => item.changeType === 'revoke')[0].createTime
                              : ''
                          }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="平台强制退款成功"
                      v-if="
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'compulsory')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{
                            refundInfo.statusList.filter((item) => item.changeType === 'compulsory').length
                              ? refundInfo.statusList.filter((item) => item.changeType === 'compulsory')[0].createTime
                              : ''
                          }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      :title="refundInfo.promoterType === 'user' ? '退款成功' : '退款成功-商家直接退款'"
                      v-if="
                        refundInfo.refundStatus !== 1 &&
                        refundInfo.refundStatus !== 6 &&
                        refundInfo.statusList &&
                        refundInfo.statusList.length &&
                        refundInfo.statusList.find((item) => item.changeType === 'refund')
                      "
                    >
                      <template slot="description" v-if="refundInfo.statusList && refundInfo.statusList.length">
                        <div class="mb10">
                          {{
                            refundInfo.statusList.filter((item) => item.changeType === 'refund').length
                              ? refundInfo.statusList.filter((item) => item.changeType === 'refund')[0].createTime
                              : ''
                          }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      title="商家审核-商家"
                      v-if="
                        refundInfo.refundStatus !== 1 &&
                        refundInfo.refundStatus !== 2 &&
                        refundInfo.refundStatus !== 6 &&
                        refundInfo.refundStatus === 0
                      "
                    >
                    </el-step>
                    <el-step
                      title="商品退回信息-用户"
                      v-if="
                        refundInfo.refundStatus !== 1 &&
                        refundInfo.refundStatus !== 2 &&
                        refundInfo.refundStatus !== 6 &&
                        refundInfo.afterSalesType === 2 &&
                        (refundInfo.refundStatus === 0 || refundInfo.refundStatus === 4)
                      "
                    >
                    </el-step>
                    <el-step
                      title="商家确认收货-商家"
                      v-if="
                        refundInfo.refundStatus !== 1 &&
                        refundInfo.refundStatus !== 2 &&
                        refundInfo.refundStatus !== 6 &&
                        refundInfo.afterSalesType === 2 &&
                        (refundInfo.refundStatus === 0 ||
                          refundInfo.refundStatus === 4 ||
                          refundInfo.refundStatus === 5)
                      "
                    >
                    </el-step>
                    <el-step
                      :title="refundInfo.promoterType === 'user' ? '退款成功' : '退款成功-商家直接退款'"
                      v-if="
                        refundInfo.refundStatus !== 1 &&
                        refundInfo.refundStatus !== 6 &&
                        (refundInfo.refundStatus === 0 ||
                          refundInfo.refundStatus === 2 ||
                          refundInfo.refundStatus === 4 ||
                          refundInfo.refundStatus === 5)
                      "
                    >
                    </el-step>
                  </el-steps>
                </div>
              </div>
            </div>
            <div class="detailSection">
              <div class="title">平台备注</div>
              <ul class="list">
                <li class="item">
                  <div>{{ refundInfo.platformRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">商家备注</div>
              <ul class="list">
                <li class="item">
                  <div>{{ refundInfo.merRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
          <el-tab-pane label="订单信息" name="detail" v-if="refundInfo.orderInfoVo">
            <div class="detailSection">
              <div class="title">用户信息</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">用户昵称：</div>
                  <div class="value">
                    <span class="mr5">{{ refundInfo.orderInfoVo.nickname }}</span>
                    <span class="mr5"> | </span>
                    <span>{{ refundInfo.orderInfoVo.uid }}</span>
                  </div>
                </li>
                <li class="item">
                  <div class="lang">用户电话：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.phone }}</div>
                </li>
              </ul>
            </div>
            <div
              v-show="refundInfo.orderInfoVo.shippingType < 3 && refundInfo.orderInfoVo.secondType !== 2"
              class="detailSection"
            >
              <div class="title">配送信息</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">配送方式：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.shippingType === 1 ? '商家配送' : '到店自提' }}</div>
                </li>
                <li class="item">
                  <div class="lang">收货电话：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.userPhone | filterEmpty }}</div>
                </li>
                <li class="item">
                  <div class="lang">收货人：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.realName | filterEmpty }}</div>
                </li>
              </ul>
              <div class="userAddress acea-row">
                <div class="lang">收货地址：</div>
                <div class="value">{{ refundInfo.orderInfoVo.userAddress | filterEmpty }}</div>
              </div>
            </div>
            <div class="detailSection">
              <div class="title">订单信息</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">订单号：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.orderNo }}</div>
                </li>
                <li class="item">
                  <div class="lang">商品总数：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.totalNum }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付状态：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.paid ? '已支付' : '未支付' }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付方式：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.payType | payTypeFilter }}</div>
                </li>
                <li class="item">
                  <div class="lang">订单状态：</div>
                  <div class="value textE93323">
                    <span v-if="refundInfo.orderInfoVo.refundStatus === 3">已退款</span>
                    <span v-else>{{ refundInfo.orderInfoVo.status | orderStatusFilter }}</span>
                  </div>
                </li>
                <li class="item">
                  <div class="lang">已发货数量：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.deliveryNum }}</div>
                </li>
                <li class="item">
                  <div class="lang">创建时间：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.createTime }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付时间：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.payTime }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">订单明细</div>
              <ul class="list">
                <li class="item">
                  <div class="lang">商品总价：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.proTotalPrice }}</div>
                </li>
                <li class="item">
                  <div class="lang">平台优惠金额：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.platCouponPrice }}</div>
                </li>
                <li class="item">
                  <div class="lang">赠送积分：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.gainIntegral }}</div>
                </li>
                <li class="item">
                  <div class="lang">实际支付：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.payPrice || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">扣除抵扣积分：</div>
                  <div class="value">{{ refundInfo.orderInfoVo.useIntegral }}</div>
                </li>
                <li class="item">
                  <div class="lang">商家优惠金额：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.merCouponPrice || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">会员抵扣金额：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.svipDiscountPrice || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">支付邮费：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.payPostage || '0.0' }}</div>
                </li>
                <li class="item">
                  <div class="lang">积分抵扣金额：</div>
                  <div class="value">￥{{ refundInfo.orderInfoVo.integralPrice || '0.0' }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">用户备注</div>
              <ul class="list">
                <li class="item">
                  <div class="value productName">{{ refundInfo.orderInfoVo.userRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
            <div class="detailSection">
              <div class="title">商家备注</div>
              <ul class="list">
                <li class="item">
                  <div class="value productName">{{ refundInfo.orderInfoVo.merchantRemark | filterEmpty }}</div>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
    <!-- 同意退款,退货退款-->
    <el-dialog
      title="同意退款"
      :visible.sync="dialogVisible"
      width="900px"
      :before-close="handleCloseAgreeToReturn"
      class="dialog-bottom"
    >
      <agree-to-return
        ref="agreeToReturn"
        @onHandleCancel="handleCloseAgreeToReturn"
        @onHandleSuccess="handleSuccess"
        :refundInfo="refundInfo"
        v-if="dialogVisible"
      ></agree-to-return>
    </el-dialog>
  </div>
</template>
<script>
import { orderAuditApi, refundMarkApi, refundOrderDetailApi, refundOrderReceivingRejectApi } from '@/api/order';
import AgreeToReturn from './agreeToReturn.vue';
import { filterEmpty, refundStatusFilter } from '@/filters';
import useRefundOrder from '@/libs/useRefundOrder';
const { onConfirmReceipt, onApprovedReview } = useRefundOrder();
import { checkPermi } from '@/utils/permission';
export default {
  name: 'refundOrderDetail',
  props: {
    //退款单号
    refundOrderNo: {
      type: String,
      default: 0,
    },
    //是否显示隐藏
    drawerVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    AgreeToReturn,
  },
  data() {
    return {
      activeName: 'refund',
      dialogVisible: false,
      loadingBtn: false,
      direction: 'rtl',
      reverse: true,
      orderDatalist: {},
      loading: false,
      modal2: false,
      result: [],
      resultInfo: {},
      refundInfo: {},
    };
  },
  mounted() {
    this.getRefundOrderDetail(this.refundOrderNo);
  },
  methods: {
    checkPermi,
    // 备注
    onOrderMark() {
      this.$modalPrompt('textarea', '备注', this.refundInfo.merRemark, '退款单备注').then((V) => {
        refundMarkApi({ remark: V, refundOrderNo: this.refundOrderNo }).then(() => {
          this.$message.success('操作成功');
          this.getRefundOrderDetail(this.refundOrderNo);
          this.$emit('getReviewSuccessful');
        });
      });
    },
    //拒绝收货
    handleRefuseReceipt() {
      this.$modalPrompt('textarea', '拒绝收货', null, '拒绝收货原因').then((V) => {
        refundOrderReceivingRejectApi({ reason: V, refundOrderNo: this.refundOrderNo }).then(() => {
          this.$message.success('拒绝收货成功');
          this.getSuccessful();
        });
      });
    },
    //商家确认收货
    handleConfirmReceipt() {
      onConfirmReceipt(this.refundOrderNo).then(() => {
        this.getSuccessful();
      });
    },
    //审核同意
    handleApprovedReview() {
      if (this.refundInfo.returnGoodsType !== 1) {
        onApprovedReview({
          auditType: 'success',
          refundOrderNo: this.refundInfo.refundOrderNo,
        }).then(() => {
          this.handleSuccess();
        });
      } else {
        //退货退款
        this.dialogVisible = true;
      }
    },
    //审核成功回调
    handleSuccess() {
      this.dialogVisible = false;
      this.getSuccessful();
    },
    //操作成功之后的回调，比如关闭弹窗，刷新列表等
    getSuccessful() {
      this.getRefundOrderDetail(this.refundOrderNo);
      this.$emit('getReviewSuccessful');
      this.handleClose();
    },
    //同意弹窗
    handleCloseAgreeToReturn() {
      this.dialogVisible = false;
    },
    //审核拒绝
    handleOrderRefuse() {
      this.$modalPrompt('textarea', '拒绝退款', null, '拒绝退款原因').then((V) => {
        orderAuditApi({ auditType: 'refuse', reason: V, refundOrderNo: this.refundInfo.refundOrderNo }).then(() => {
          this.$message.success('审核成功');
          this.getSuccessful();
        });
      });
    },
    handleClose() {
      this.$emit('onClosedrawerVisible');
    },
    // 获取订单退款信息
    getRefundOrderDetail(id) {
      this.loading = true;
      refundOrderDetailApi(id)
        .then(async (res) => {
          this.refundInfo = res;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped lang="scss">
.userAddress {
  width: 100%;
  margin-top: 16px;
  font-size: 13px;
  color: #666;
}
.productName {
  width: 633px;
}
.detail-centent {
  margin-top: 16px;
}
::v-deep .el-step__main {
  margin-bottom: 30px !important;
}
::v-deep .el-step__title {
  font-size: 14px !important;
}
.flow-path {
  margin-bottom: 70px;
}
.refundReasonWap {
  width: 720px;
  height: auto;
  padding: 10px 25px 0 0;
  border-radius: 14px;
  background-color: #f3f8fe;
  overflow: hidden;
}
.image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
}
.refund {
  &-title {
    font-size: 17px;
    color: #333333;
    font-weight: 600;
  }
  &-orderNo {
    font-size: 14px;
    color: #333333;
  }
  &-price {
    margin-right: 100px;
  }
}
</style>
