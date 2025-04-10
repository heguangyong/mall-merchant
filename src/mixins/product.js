import { productCouponListApi } from '@/api/product';
import { defaultObj } from '@/views/product/creatProduct/default';

export default {
  data() {
    return {
      headTab: [
        { tit: '商品信息', name: '1' },
        { tit: '规格库存', name: '2' },
        { tit: '商品详情', name: '3' },
        { tit: '其他设置', name: '4' },
      ],
      formValidate: Object.assign({}, defaultObj),
      attrInfo: {},
    };
  },
  methods: {
    getData(res, type) {
      let info = res;
      this.formValidate.content = '';
      this.formValidate = {
        ...info,
        image: this.$selfUtil.setDomain(info.image),
        sliderImages: JSON.parse(info.sliderImage),
        cateIds: info.cateId ? info.cateId.split(',') : [], // 商品分类id
        sort: info.sort ? info.sort : 0,
        attrList: info.attrList ? info.attrList : [],
        attrValueList: info.attrValueList ? info.attrValueList : [],
        isSub: info.isSub ? info.isSub : false,
        content: info.content ? this.$selfUtil.replaceImgSrcHttps(info.content) : '',
        id: info.id ? info.id : 0,
        coupons: info.coupons ? info.coupons : [],
        couponIds: info.couponIds ? info.couponIds : [],
        type: info.type ? info.type : Number(this.$route.params.productType),
        guaranteeIdsList: info.guaranteeIds ? info.guaranteeIds.split(',').map(Number) : [], //保障服务
        isPaidMember: info.isPaidMember ? info.isPaidMember : false,
        deliveryMethodList: info.deliveryMethod ? info.deliveryMethod.split(',') : ['1'],
        systemFormId: info.systemFormId ? info.systemFormId : null,
        refundSwitch: type === 'add' ? info.refundSwitch : true,
        // categoryId: info.categoryId ? info.categoryId : '',
        // brandId: info.brandId ? info.brandId : ''
      };
      this.htmlKey++;
      this.labelarr = info.keyword ? info.keyword.split(',') : [];
      if (this.formValidate.categoryId) {
        this.getbrandList();
        this.brandList.push({ name: '其他', id: 0 });
      }
      if (this.formValidate.couponIds && this.formValidate.couponIds.length) {
        productCouponListApi().then((res) => {
          let ids = this.formValidate.couponIds.toString();
          let arr = res;
          let obj = {};
          for (let i in arr) {
            obj[arr[i].id] = arr[i];
          }
          let strArr = ids.split(',');
          let newArr = [];
          for (let item of strArr) {
            if (obj[item]) {
              newArr.push(obj[item]);
            }
          }
          this.$set(this.formValidate, 'coupons', newArr); //在编辑回显时，让返回数据中的优惠券id，通过接口匹配显示,
        });
      }

      let imgs = JSON.parse(info.sliderImage);
      let imgss = [];
      Object.keys(imgs).map((i) => {
        imgss.push(this.$selfUtil.setDomain(imgs[i]));
      });
      this.formValidate.sliderImages = [...imgss];
      if (this.getFileType(this.formValidate.sliderImages[0]) == 'video') {
        //如果返回数据轮播图的第一张是视频，就将其赋值给videoLink做渲染，同时将其在轮播图中删除
        this.$set(this, 'videoLink', this.formValidate.sliderImages[0]);
        this.formValidate.sliderImages.splice(0, 1);
      }
      if (info.specType) {
        if (info.attrValueList) {
          info.attrValueList.forEach((val) => {
            val.image = this.$selfUtil.setDomain(val.image);
            val.attrValueShow = JSON.parse(val.attrValue);
            val.attr_arr = val.sku.split(',');
            val.brokerage = val.brokerage || 0;
            val.brokerageTwo = val.brokerageTwo || 0;
            val.vipPrice = val.vipPrice || 0;
          });
          this.ManyAttrValue = [...this.oneFormBatch, ...info.attrValueList];
        } else {
          if (this.formValidate.attrList.length) {
            this.oneFormBatch[0].image = this.$selfUtil.setDomain(info.image);
          }
        }
      } else {
        this.OneattrValue = info.attrValueList;
      }
    },
    // 点击商品图
    modalPicTap(tit, num, i, status) {
      const _this = this;
      if (_this.isDisabled) return;
      this.$modalUpload(
        function (img) {
          if (!img) return;
          if (tit === '1' && !num) {
            _this.formValidate.image = img[0].sattDir;
            _this.OneattrValue[0].image = img[0].sattDir;
          }
          if (tit === '2' && !num) {
            if (img.length > 10) return this.$message.warning('最多选择10张图片！');
            if (img.length + _this.formValidate.sliderImages.length > 10)
              return this.$message.warning('最多选择10张图片！');
            img.map((item) => {
              _this.formValidate.sliderImages.push(item.sattDir);
            });
          }
          if (tit === '1' && num === 'dan') {
            _this.OneattrValue[0].image = img[0].sattDir;
          }
          if (tit === '1' && num === 'duo') {
            _this.ManyAttrValue[i].image = img[0].sattDir;
          }
          if (tit === '1' && num === 'pi') {
            _this.oneFormBatch[0].image = img[0].sattDir;
          }
        },
        tit,
        'content',
      );
    },
    // 移动
    handleDragStart(e, item) {
      if (!this.isDisabled) this.dragging = item;
    },
    handleDragEnd(e, item) {
      if (!this.isDisabled) this.dragging = null;
    },
    handleDragOver(e) {
      if (!this.isDisabled) e.dataTransfer.dropEffect = 'move';
    },
    // 移动关键代码，包含轮播图、规格
    handleDragEnter(e, item, index) {
      if (!this.isDisabled) {
        e.dataTransfer.effectAllowed = 'move';
        if (item === this.dragging) {
          return;
        }
        let newItems = [];
        newItems = [...this.formValidate.sliderImages];
        const src = newItems.indexOf(this.dragging);
        const dst = newItems.indexOf(item);
        newItems.splice(dst, 0, ...newItems.splice(src, 1));
        this.formValidate.sliderImages = newItems;
      }
    },
  },
};
