<template>
  <div class="deviseBox">
    <div class="devise_head acea-row row-between-wrapper">
      <div class="acea-row row-baseline">
        <div class="title">当前页面：{{ nameTop }}</div>
        <el-popover placement="bottom" width="450" trigger="click" v-model="visible">
          <div class="acea-row row-middle">
            <el-input
              v-model="nameTopFrom"
              placeholder="必填不超过15个字"
              maxlength="15"
              size="small"
              style="width: 260px"
              class="mr20"
            />
            <el-button
              size="small"
              @click="
                visible = false;
                nameTopFrom = '';
              "
              >取消</el-button
            >
            <el-button
              v-hasPermi="['platform:pagediy:update', 'platform:pagediy:save']"
              type="primary"
              size="small"
              @click="saveName(nameTopFrom, 0)"
              >确定</el-button
            >
          </div>
          <i slot="reference" class="edit el-icon-edit-outline"></i>
        </el-popover>
      </div>
      <div class="acea-row preview">
        <el-popover placement="top-start" trigger="hover" :disabled="Number(pageId) === 0">
          <div id="diyQrcode"></div>
          <el-button @click="reast" class="ht_btn" slot="reference" style="line-height: 9px">重置</el-button>
        </el-popover>
        <button
          v-hasPermi="['merchant:system:form:add', 'merchant:system:form:update']"
          class="ht_btn mx_12"
          v-debounceClick="saveConfig"
        >
          仅保存
        </button>
        <el-button
          v-hasPermi="['merchant:system:form:add', 'merchant:system:form:update']"
          size="small"
          style="color: #2d8cf0"
          v-debounceClick="
            () => {
              saveConfig(1);
            }
          "
          :loading="loading"
          >保存关闭</el-button
        >
      </div>
    </div>
    <div style="height: 66px"></div>
    <el-card :bordered="false" :body-style="{ padding: '0' }">
      <div class="diy-wrapper" :style="'height:' + (clientHeight + 9) + 'px;'">
        <!-- 左侧 -->
        <div class="left">
          <div class="wrapper" :style="'height:' + (clientHeight - 96) + 'px;'" v-if="tabCur == 0">
            <div v-for="(item, index) in leftMenu" :key="index">
              <div class="tips" @click="item.isOpen = !item.isOpen">
                {{ item.title }}
                <i class="el-icon-arrow-right" size="16" v-if="!item.isOpen"></i>
                <i class="el-icon-arrow-down" size="16" v-else></i>
              </div>
              <!-- 拖拽组件 -->
              <draggable
                class="dragArea list-group"
                :list="item.list"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :clone="cloneDog"
                dragClass="dragClass"
                filter=".search , .navbar , .homeComb , .service"
              >
                <!--filter=".search , .navbar"-->
                <!--:class="{ search: element.cname == '搜索框' , navbar: element.cname == '商品分类' }"-->
                <div
                  class="list-group-item"
                  :class="{
                    search: element.cname == '搜索框',
                    navbar: element.cname == '商品分类',
                    homeComb: element.cname == '头部组件',
                    service: element.cname == '在线客服',
                  }"
                  v-for="(element, index) in item.list"
                  :key="element.id"
                  @click="addDom(element, 1)"
                  v-show="item.isOpen"
                >
                  <div>
                    <div class="position" style="display: none">释放鼠标将组建添加到此处</div>
                    <span class="conter iconfont" :class="element.icon"></span>
                    <p class="conter">{{ element.cname }}</p>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <!-- 中间自定义配置移动端页面 -->
        <div
          class="wrapper-con"
          style="flex: 1; background: #f0f2f5; display: flex; justify-content: center; padding-top: 20px; height: 100%"
        >
          <div class="content">
            <div class="contxt" style="display: flex; flex-direction: column; overflow: hidden; height: 100%">
              <div class="overflowy">
                <div class="picture"><img src="@/assets/imgs/electric.png" /></div>
                <div class="page-title">
                  {{ nameTop }}
                </div>
              </div>
              <div class="scrollCon">
                <div style="width: 460px; margin: 0 auto">
                  <div
                    class="scroll-box"
                    :class="
                      picTxt && tabValTxt == 2
                        ? 'fullsize noRepeat'
                        : picTxt && tabValTxt == 1
                        ? 'repeat ysize'
                        : 'noRepeat ysize'
                    "
                    :style="
                      'background-color:' +
                      (colorTxt ? colorPickerTxt : '') +
                      ';background-image: url(' +
                      (picTxt ? picUrlTxt : '') +
                      ');height:' +
                      rollHeight +
                      'px;'
                    "
                    ref="imgContainer"
                  >
                    <draggable
                      class="dragArea list-group"
                      :list="mConfig"
                      group="people"
                      @change="log"
                      filter=".top"
                      :move="onMove"
                      animation="300"
                    >
                      <div
                        class="mConfig-item"
                        :class="{
                          on: activeIndex == key,
                        }"
                        v-for="(item, key) in mConfig"
                        :key="key"
                        @click.stop="bindconfig(item, key)"
                        :style="colorTxt ? 'background-color:' + colorPickerTxt + ';' : 'background-color:#fff;'"
                      >
                        <component
                          :is="item.name"
                          ref="getComponentData"
                          :configData="propsObj"
                          :index="key"
                          :num="item.num"
                        ></component>
                        <div class="delete-box">
                          <div class="handleType">
                            <div class="iconfont icon-caozuo-shanchu" @click.stop="bindDelete(item, key)"></div>
                            <div class="iconfont icon-caozuo-fuzhi1" @click.stop="bindAddDom(item, 0, key)"></div>
                            <div
                              class="iconfont icon-caozuo-shang"
                              :class="key === 0 ? 'on' : ''"
                              @click.stop="movePage(item, key, 1)"
                            ></div>
                            <div
                              class="iconfont icon-caozuo-xia"
                              :class="key === mConfig.length - 1 ? 'on' : ''"
                              @click.stop="movePage(item, key, 0)"
                            ></div>
                          </div>
                        </div>
                        <div class="handle"></div>
                      </div>
                    </draggable>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧页面设置 -->
        <div class="right-box">
          <div class="mConfig-item" style="background-color: #fff" v-for="(item, key) in rConfig" :key="key">
            <div class="title-config-diy">
              <div class="title-bar">{{ item.cname }}</div>
            </div>
            <component
              :is="item.configName"
              @config="config"
              :activeIndex="activeIndex"
              :num="item.num"
              :index="key"
            ></component>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script crossorigin="anonymous">
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import vuedraggable from 'vuedraggable';
import mPage from '../components/mobileFormPage/index.js';
import mConfig from '../components/mobileFormConfig/index.js';
import { mapState } from 'vuex';
import useDeviseDiy from '@/hooks/use-devise';
import { systemFormAddApi, systemFormDetailApi, systemFormUpdateApi } from '@/api/systemForm';
const { objToArr } = useDeviseDiy();
let idGlobal = 0;
export default {
  name: 'creatSystemFrom',
  components: {
    draggable: vuedraggable,
    ...mPage,
    ...mConfig,
  },
  data() {
    return {
      objval: {},
      leftMenu: [], // 左侧菜单
      lConfig: [], // 左侧组件
      mConfig: [], // 中间组件渲染
      rConfig: [], // 右侧组件配置
      clientHeight: '', //页面动态高度
      nameTopFrom: '', //头部模板名称表单提交
      visible: false,
      rollHeight: '',
      activeConfigName: '',
      propsObj: {}, // 组件传递的数据,
      activeIndex: 0, // 选中的下标
      number: 0,
      pageId: '',
      pageType: '',
      tabCur: 0,
      loading: false,
      relLoading: false,
      isSearch: false,
      isTab: false,
      isFllow: false,
      isComb: false,
      isService: false,
      name: '', //模板名称
    };
  },
  watch: {
    nameTop(val) {
      //直接赋值给本地data中的属性，就不会报错啦
      this.name = val;
    },
  },
  computed: {
    ...mapState({
      nameTop: (state) => state.mobildConfig.pageName || '系统表单',
      showTxt: (state) => state.mobildConfig.pageShow,
      colorTxt: (state) => state.mobildConfig.pageColor,
      picTxt: (state) => state.mobildConfig.pagePic,
      colorPickerTxt: (state) => state.mobildConfig.pageColorPicker,
      tabValTxt: (state) => state.mobildConfig.pageTabVal,
      picUrlTxt: (state) => state.mobildConfig.pagePicUrl,
    }),
  },
  created() {
    this.lConfig = objToArr(mPage);
  },
  beforeDestroy() {
    this.$store.commit('mobildConfig/titleUpdata', '');
    this.$store.commit('mobildConfig/nameUpdata', '');
    this.$store.commit('mobildConfig/showUpdata', 1);
    this.$store.commit('mobildConfig/colorUpdata', 0);
    this.$store.commit('mobildConfig/picUpdata', 0);
    this.$store.commit('mobildConfig/pickerUpdata', '#f5f5f5');
    this.$store.commit('mobildConfig/radioUpdata', 0);
    this.$store.commit('mobildConfig/picurlUpdata', '');
    this.$store.commit('mobildConfig/SETEMPTY');
  },
  destroyed() {
    this.$store.commit('mobildConfig/titleUpdata', '');
    this.$store.commit('mobildConfig/nameUpdata', '');
    this.$store.commit('mobildConfig/showUpdata', 1);
    this.$store.commit('mobildConfig/colorUpdata', 0);
    this.$store.commit('mobildConfig/picUpdata', 0);
    this.$store.commit('mobildConfig/pickerUpdata', '#f5f5f5');
    this.$store.commit('mobildConfig/radioUpdata', 0);
    this.$store.commit('mobildConfig/picurlUpdata', '');
    this.$store.commit('mobildConfig/SETEMPTY');
  },
  mounted() {
    //监听事件
    document.addEventListener('keydown', this.saveDiy, { passive: true });
    this.pageId = Number(this.$route.params.id);
    this.pageType = this.$route.params.type;
    if (this.pageId === 0) this.visible = true; //新增的时候修改模板名称显示出来
    this.nameTopFrom = this.pageType !== 'copy' ? this.nameTop : this.nameTop + '-副本';
    this.name = this.pageType !== 'copy' ? this.nameTop : this.nameTop + '-副本';
    this.$nextTick(() => {
      this.arraySort();
      if (this.pageId != 0) {
        this.getDefaultConfig();
      }
      this.clientHeight = `${document.documentElement.clientHeight}` - 65.81; //获取浏览器可视区域高度
      let H = `${document.documentElement.clientHeight}` - 180;
      this.rollHeight = H > 650 ? 650 : H;
      let that = this;
      window.onresize = function () {
        that.clientHeight = `${document.documentElement.clientHeight}` - 65.81;
        let H = `${document.documentElement.clientHeight}` - 180;
        that.rollHeight = H > 650 ? 650 : H;
      };
    });
  },
  methods: {
    goBack() {
      this.$router.push({ path: `${roterPre}/systemForm/form_list` });
    },
    onMove(e) {
      return true;
    },
    onCopy() {
      this.$message.success('复制成功');
    },
    onError() {
      this.$message.error('复制失败');
    },
    // 左侧tab
    bindTab(index) {
      this.tabCur = index;
    },
    log(evt) {
      // 中间拖拽排序
      if (evt.moved) {
        evt.moved.oldNum = this.mConfig[evt.moved.oldIndex].num;
        evt.moved.newNum = this.mConfig[evt.moved.newIndex].num;
        evt.moved.status = evt.moved.oldIndex > evt.moved.newIndex;
        this.mConfig.forEach((el, index) => {
          el.num = new Date().getTime() * 1000 + index;
        });
        evt.moved.list = this.mConfig;
        this.rConfig = [];
        let item = evt.moved.element;
        let tempItem = JSON.parse(JSON.stringify(item));
        this.rConfig.push(tempItem);
        this.activeIndex = evt.moved.newIndex;
        //  this.$store.commit('mobildConfig/SETCONFIGNAME', item.name);
        this.$store.commit('mobildConfig/defaultArraySort', evt.moved);
      }
      // 从左向右拖拽排序
      if (evt.added) {
        let data = evt.added.element;
        let obj = {};
        let timestamp = new Date().getTime() * 1000;
        data.num = timestamp;
        this.activeConfigName = data.name;
        let tempItem = JSON.parse(JSON.stringify(data));
        tempItem.id = 'id' + tempItem.num;
        this.mConfig[evt.added.newIndex] = tempItem;
        this.rConfig = [];
        this.rConfig.push(tempItem);
        this.mConfig.forEach((el, index) => {
          el.num = new Date().getTime() * 1000 + index;
        });
        evt.added.list = this.mConfig;
        this.activeIndex = evt.added.newIndex;
        // 保存组件名称
        //  this.$store.commit('mobildConfig/SETCONFIGNAME', data.name);
        this.$store.commit('mobildConfig/defaultArraySort', evt.added);
      }
    },
    cloneDog(data) {
      // this.mConfig.push(tempItem)
      return {
        ...data,
      };
    },
    //数组元素互换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    //点击上下移动；
    movePage(item, index, type) {
      if (type) {
        if (index == 0) {
          return;
        }
      } else {
        if (index == this.mConfig.length - 1) {
          return;
        }
      }
      if (type) {
        this.swapArray(this.mConfig, index - 1, index);
      } else {
        this.swapArray(this.mConfig, index, index + 1);
      }
      let obj = {};
      this.rConfig = [];
      obj.oldIndex = index;
      if (type) {
        obj.newIndex = index - 1;
      } else {
        obj.newIndex = index + 1;
      }
      this.mConfig.forEach((el, index) => {
        el.num = new Date().getTime() * 1000 + index;
      });
      let tempItem = JSON.parse(JSON.stringify(item));
      this.rConfig.push(tempItem);
      obj.element = item;
      obj.list = this.mConfig;
      if (type) {
        this.activeIndex = index - 1;
      } else {
        this.activeIndex = index + 1;
      }
      this.$store.commit('mobildConfig/SETCONFIGNAME', item.name);
      this.$store.commit('mobildConfig/defaultArraySort', obj);
    },
    // 组件添加
    addDomCon(item, type, index) {
      idGlobal += 1;
      let obj = {};
      let timestamp = new Date().getTime() * 1000;
      item.num = `${timestamp}`;
      item.id = `id${timestamp}`;
      this.activeConfigName = item.name;
      let tempItem = JSON.parse(JSON.stringify(item));
      if (type) {
        this.rConfig = [];
        this.mConfig.push(tempItem);
        this.activeIndex = this.mConfig.length - 1;
        this.rConfig.push(tempItem);
      } else {
        this.mConfig.splice(index + 1, 0, tempItem);
        this.activeIndex = index;
      }
      this.mConfig.forEach((el, index) => {
        el.num = new Date().getTime() * 1000 + index;
      });
      // 保存组件名称
      obj.element = item;
      obj.list = this.mConfig;
      // this.$store.commit('mobildConfig/SETCONFIGNAME', item.name);
      this.$store.commit('mobildConfig/defaultArraySort', obj);
    },
    //中间页点击添加模块；
    bindAddDom(item, type, index) {
      let i = item;
      this.lConfig.forEach((j) => {
        if (item.name == j.name) {
          i = j;
        }
      });
      this.addDomCon(i, type, index);
    },
    //左边配置模块点击添加；
    addDom(item, type) {
      this.addDomCon(item, type);
    },
    // 点击显示相应的配置
    bindconfig(item, index) {
      this.rConfig = [];
      let tempItem = JSON.parse(JSON.stringify(item));
      this.rConfig.push(tempItem);
      this.activeIndex = index;
      //  this.$store.commit('mobildConfig/SETCONFIGNAME', item.name);
    },
    // 组件删除
    bindDelete(item, key) {
      this.mConfig.splice(key, 1);
      this.rConfig.splice(0, 1);
      if (this.mConfig.length != key) {
        this.rConfig.push(this.mConfig[key]);
      } else {
        if (this.mConfig.length) {
          this.activeIndex = key - 1;
          this.rConfig.push(this.mConfig[key - 1]);
        }
      }
      // 删除第几个配置
      this.$store.commit('mobildConfig/DELETEARRAY', item);
    },
    // 组件返回
    config(data) {
      let propsObj = this.propsObj;
      propsObj.data = data;
      propsObj.name = this.activeConfigName;
    },
    addSort(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    // 数组排序
    arraySort() {
      let tempArr = [];
      let basis = {
        title: '组件',
        list: [],
        isOpen: true,
      };
      this.lConfig.map((el, index) => {
        if (el.type == 0) {
          basis.list.push(el);
        }
      });
      tempArr.push(basis);
      this.leftMenu = tempArr;
    },
    diySaveDate(val, n, j) {
      let data = [];
      objToArr(val).forEach((item) => {
        data.push(item.titleConfig.val);
      });
      this.pageId
        ? systemFormUpdateApi({
            id: this.pageId,
            allKeys: data.join(','),
            formValue: JSON.stringify(val),
            formName: this.nameTopFrom,
          })
            .then((res) => {
              this.$message.success('保存成功');
              this.$store.commit('mobildConfig/SET_SystemForm', []);
              this.loading = false;
              this.relLoading = false;
              this.close(n);
            })
            .catch((res) => {
              this.loading = false;
              this.$message.error(res.message);
            })
        : systemFormAddApi({
            allKeys: data.join(','),
            formValue: JSON.stringify(val),
            formName: this.nameTopFrom,
          })
            .then((res) => {
              this.pageId = res.id;
              this.$message.success('保存成功');
              this.loading = false;
              this.$store.commit('mobildConfig/SET_SystemForm', []);
              this.$store.commit('mobildConfig/nameUpdata', this.nameTopFrom);
              this.close(n);
            })
            .catch((res) => {
              this.loading = false;
              this.relLoading = false;
              this.$message.error(res.message);
            });
    },
    //保存关闭
    close(n) {
      this.$store.commit('mobildConfig/UPNAME', this.nameTopFrom);
      if (n === 1) {
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('Firefox') != -1 || userAgent.indexOf('Chrome') != -1) {
          window.open('', '_self').close();
          window.location.href = 'about:blank';
        } else {
          window.opener = null;
          window.open('about:blank', '_self');
          window.close();
        }
      }
    },
    // 模板名称保存
    saveName(n, j) {
      if (!n) return this.$message.warning('请填写模板名称');
      if (j === 1) {
        //this.$store.commit('mobildConfig/UPNAME', this.nameContent);
      } else {
        this.$store.commit('mobildConfig/UPNAME', this.nameTopFrom);
      }
    },
    /**
     * 保存配置
     * @param n 是否关闭页面，1是
     * @param j 是否是另存模板，1是,0只编辑模板名称
     */
    saveConfig(n, j) {
      if (this.mConfig.length == 0) {
        return this.$message.error('暂未添加任何组件，保存失败！');
      }
      this.loading = true;
      let val = this.$store.state.mobildConfig.defaultArray;
      this.$nextTick(function () {
        this.diySaveDate(val, n, j);
      });
    },
    // 获取默认配置
    getDefaultConfig() {
      systemFormDetailApi(this.pageId).then((res) => {
        this.nameTopFrom = this.pageType !== 'copy' ? res.formName : res.formName + '-副本';
        this.$store.commit('mobildConfig/nameUpdata', this.pageType !== 'copy' ? res.formName : res.formName + '-副本');
        let obj = {};
        let tempARR = [];
        let newArr = objToArr(JSON.parse(res.formValue));
        function sortNumber(a, b) {
          return a.timestamp - b.timestamp;
        }
        newArr.sort(sortNumber);
        newArr.map((el, index) => {
          el.id = 'id' + el.timestamp;
          this.lConfig.map((item, j) => {
            if (el.name == item.defaultName) {
              item.num = el.timestamp;
              item.id = 'id' + el.timestamp;
              let tempItem = JSON.parse(JSON.stringify(item));
              tempARR.push(tempItem);
              obj[el.timestamp] = el;
              this.mConfig.push(tempItem);
              // 保存默认组件配置
              this.$store.commit('mobildConfig/ADDARRAY', {
                num: el.timestamp,
                val: el,
              });
            }
          });
        });
        this.rConfig = [];
        this.activeIndex = 0;
        this.rConfig.push(this.mConfig[0]);
      });
    },
    // 重置
    reast() {
      this.$modalSure('是否重置当前页面数据?').then(() => {
        this.mConfig = [];
        this.rConfig = [];
        this.activeIndex = -99;
        this.getDefaultConfig();
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import '../styles/index.scss';
.product_tabs {
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid #e8eaec;
  text-align: right;
  .back {
    color: #303133;
  }
  .form-name {
    font-size: 14px;
    font-weight: bold;
    margin-left: 20px;
    color: #303133;
    &::before {
      content: '';
      display: inline-block;
      width: 1.1px;
      height: 14px;
      background: #303133;
      position: relative;
      top: 2px;
      left: -10px;
    }
  }
}

.ysize {
  background-size: 100%;
}
.fullsize {
  background-size: 100% 100%;
}
.repeat {
  background-repeat: repeat;
}
.noRepeat {
  background-repeat: no-repeat;
}
.overflowy {
  overflow-y: scroll;
  .picture {
    width: 379px;
    height: 20px;
    margin: 0 auto;
    background-color: #fff;
  }
}
.bnt {
  width: 80px !important;
  &:hover {
    border-color: rgba(255, 255, 255, 0.8);
    color: rgba(255, 255, 255, 0.8);
  }
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #fff;
  display: none;
}

.left:hover::-webkit-scrollbar-thumb,
.right-box:hover::-webkit-scrollbar-thumb {
  display: block;
}

.contxt:hover ::-webkit-scrollbar-thumb {
  display: block;
}

::-webkit-scrollbar {
  width: 4px !important; /*对垂直流动条有效*/
}

.scrollCon {
  overflow-y: scroll;
  overflow-x: hidden;
}

.scroll-box .position {
  display: block !important;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border: 1px dashed var(--prev-color-primary);
  color: var(--prev-color-primary);
  background-color: #edf4fb;
}

.scroll-box .conter {
  display: none !important;
}

.dragClass {
  background-color: #fff;
}

.ivu-mt {
  display: flex;
  justify-content: space-between;
}

.iconfont {
  font-size: 24px;
  color: var(--prev-color-primary);
}

.diy-wrapper {
  max-width: 100%;
  min-width: 1100px;
  display: flex;
  justify-content: space-between;
  .left {
    min-width: 300px;
    max-width: 300px;
    border-radius: 4px;
    height: 100%;
    .title {
      padding: 15px;
      .tips {
        font-size: 13px;
        color: #000;
      }
    }
    .input-add {
      margin-top: 10px;
    }
    .wrapper {
      padding: 15px;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .tips {
        display: flex;
        justify-content: space-between;
        padding-bottom: 15px;
        font-size: 13px;
        color: #000;
        cursor: pointer;
        .ivu-icon {
          color: #000;
        }
      }
    }
    .link-item {
      padding: 10px;
      border-bottom: 1px solid #f5f5f5;
      font-size: 12px;
      color: #323232;
      .name {
        font-size: 14px;
        color: var(--prev-color-primary);
      }
      .link-txt {
        margin-top: 2px;
        word-break: break-all;
      }
      .params {
        margin-top: 5px;
        color: #1cbe6b;
        word-break: break-all;
        .txt {
          color: #323232;
        }
        span {
          &:last-child i {
            display: none;
            color: red;
          }
        }
      }
      .lable {
        display: flex;
        margin-top: 5px;
        color: #999;
        align-items: center;
        p {
          flex: 1;
          word-break: break-all;
        }
        button {
          margin-left: 30px;
        }
      }
    }
    .dragArea.list-group {
      display: flex;
      flex-wrap: wrap;
      .list-group-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 74px;
        height: 66px;
        margin-right: 17px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #666;
        cursor: pointer;
        border-radius: 5px;
        text-align: center;
        &:hover {
          box-shadow: 0 0 5px 0 rgba(24, 144, 255, 0.3);
          border-right: 5px;
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
  .content {
    position: relative;
    height: 100%;
    width: 100%;
    .page-foot {
      position: relative;
      width: 379px;
      margin: 0 auto 20px auto;
      .delete-box {
        display: none;
        position: absolute;
        left: -2px;
        top: 0;
        width: 383px;
        height: 100%;
        border: 2px dashed var(--prev-color-primary);
        padding: 10px 0;
      }
      &:hover,
      &.on {
        /*cursor: move;*/
        .delete-box {
          /*display: block;*/
        }
      }
      &.on {
        cursor: move;
        .delete-box {
          display: block;
          border: 2px solid var(--prev-color-primary);
          box-shadow: 0 0 10px 0 rgba(24, 144, 255, 0.3);
        }
      }
    }
    .page-title {
      position: relative;
      height: 35px;
      line-height: 35px;
      background: #fff;
      font-size: 15px;
      color: #333333;
      text-align: center;
      width: 379px;
      margin: 0 auto;
      .delete-box {
        display: none;
        position: absolute;
        left: -2px;
        top: 0;
        width: 383px;
        height: 100%;
        border: 2px dashed var(--prev-color-primary);
        padding: 10px 0;
        span {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 32px;
          height: 16px;
          line-height: 16px;
          display: inline-block;
          text-align: center;
          font-size: 10px;
          color: #fff;
          background: rgba(0, 0, 0, 0.4);
          margin-left: 2px;
          cursor: pointer;
          z-index: 11;
        }
      }
      &:hover,
      &.on {
        /*cursor: move;*/
        .delete-box {
          /*display: block;*/
        }
      }
      &.on {
        cursor: move;
        .delete-box {
          display: block;
          border: 2px solid var(--prev-color-primary);
          box-shadow: 0 0 10px 0 rgba(24, 144, 255, 0.3);
        }
      }
    }
    .scroll-box {
      flex: 1;
      background-color: #fff;
      width: 379px;
      margin: 0 auto;
      padding-top: 1px;
    }
    .dragArea.list-group {
      width: 100%;
      height: 100%;
      .mConfig-item {
        position: relative;
        cursor: move;
        .delete-box {
          display: none;
          position: absolute;
          left: -2px;
          top: 0;
          width: 383px;
          height: 100%;
          border: 2px dashed var(--prev-color-primary);
          /*padding: 10px 0;*/
          .handleType {
            position: absolute;
            right: -43px;
            top: 0;
            width: 36px;
            height: 143px;
            border-radius: 4px;
            background-color: var(--prev-color-primary);
            cursor: pointer;
            color: #fff;
            font-weight: bold;
            text-align: center;
            padding: 4px 0;
            .iconfont {
              padding: 5px 0;
              color: #fff;
              &.on {
                opacity: 0.4;
              }
            }
          }
        }
        &.on {
          cursor: move;
          .delete-box {
            display: block;
            border: 2px solid var(--prev-color-primary);
            box-shadow: 0 0 10px 0 rgba(24, 144, 255, 0.3);
          }
        }
      }
    }
  }
  .right-box {
    width: 445px;
    height: 100%;
    border-radius: 4px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    //.title-bar {
    //  width: 100%;
    //  height: 45px;
    //  line-height: 45px;
    //  padding-left: 24px;
    //  color: #000;
    //  border-radius: 4px;
    //  border-bottom: 1px solid #eee;
    //  font-size: 14px;
    //}
  }
  ::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bfc1c4;
  }
}
.foot-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background: #fff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.03);
  button {
    width: 100px;
    height: 32px;
    font-size: 13px;
    &:first-child {
      margin-right: 20px;
    }
  }
}
::v-deep .ivu-scroll-loader {
  display: none;
}
::v-deep .el-card {
  border: none;
  box-shadow: none;
}
::v-deep .el-card__body {
  padding: 0;
}
</style>
