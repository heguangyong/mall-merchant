export const defaultObj = {
  image: '',
  sliderImages: [],
  sliderImage: '',
  name: '',
  intro: '',
  keyword: '',
  cateIds: [], // 商品分类id
  cateId: null, // 商品分类id传值
  unitName: '',
  sort: 0,
  isShow: false,
  tempId: '',
  header: [],
  attrValueList: [
    {
      image: '',
      brokerage: 0,
      brokerageTwo: 0,
      price: 0.01,
      vipPrice: 0.01,
      cost: 0.01,
      otPrice: 0.01,
      stock: 0,
      barCode: '',
      itemNumber: '',
      weight: 0,
      volume: 0,
      cdkeyId: null,
      cdkeyLibraryName: '',
      expand: '',
      isShow: true,
    },
  ], // 数据提交用
  attrList: [], // 数据提交用
  attrs: [], ////数据渲染用
  selectRule: '',
  isSub: false,
  isPaidMember: false,
  content: '',
  specType: false,
  id: undefined,
  couponIds: [],
  coupons: [],
  categoryId: 0,
  guaranteeIds: '',
  guaranteeIdsList: null,
  brandId: '',
  type: 0, // 商品类型
  isAutoSubmitAudit: false, //是否自动提审
  isAutoUp: false, //是否自动上架
  deliveryMethodList: ['1'],
  deliveryMethod: '',
  systemFormId: null,
  refundSwitch: true,
};
export const objTitle = {
  price: {
    title: '售价（元）',
  },
  vipPrice: {
    title: '会员价（元）',
  },
  cost: {
    title: '成本价（元）',
  },
  otPrice: {
    title: '划线价（元）',
  },
  stock: {
    title: '库存',
  },
  barCode: {
    title: '商品编码',
  },
  itemNumber: {
    title: '商品条码',
  },
  weight: {
    title: '重量（KG）',
  },
  volume: {
    title: '体积(m³)',
  },
  brokerage: {
    title: '一级返佣(%)',
  },
  brokerageTwo: {
    title: '二级返佣(%)',
  },
};
