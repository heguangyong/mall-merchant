<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <div class="acea-row">
        <div class="tab_view">
          <div
            class="cell_item"
            :class="{ tab_active: listActive === index }"
            v-for="(item, index) in tabList"
            :key="index"
            @click="ProductNavTab(index)"
          >
            {{ item }}
          </div>
        </div>
        <div v-if="listActive === 0" class="rightModel acea-row">
          <div class="leftModel">
            <div class="current_home">
              <div class="model_header">
                <iframe id="iframe" class="iframe-box" :src="frontDomain" frameborder="0" ref="iframe"></iframe>
              </div>
              <div class="mask"></div>
            </div>
          </div>
          <div style="width: 100%">
            <el-row>
              <el-col v-bind="grid">
                <div class="flex_between">
                  <el-button
                    v-hasPermi="['merchant:page:diy:update', 'merchant:page:diy:set:default', 'merchant:page:diy:info']"
                    type="primary"
                    @click="handlerDiyHomePage()"
                    size="small"
                    class="mb35"
                    style="font-size: 12px"
                    >首页装修</el-button
                  >
                  <!--                  <el-card-->
                  <!--                    body-style="background-color: #F9F9F9;"-->
                  <!--                    class="mb20 Qrcode-card"-->
                  <!--                    shadow="never"-->
                  <!--                    :bordered="false"-->
                  <!--                  >-->
                  <!--                    <el-row>-->
                  <!--                      <el-col v-bind="grid2">-->
                  <!--                        <div class="acea-row row-between-wrapper Qrcode-box">-->
                  <!--                          <div>-->
                  <!--                            <div class="title mb20">微信小程序</div>-->
                  <!--                            <div class="tips">扫描右侧二维码查看</div>-->
                  <!--                          </div>-->
                  <!--                        </div>-->
                  <!--                      </el-col>-->
                  <!--                      <el-col v-bind="grid2">-->
                  <!--                        <div style="text-align: right">-->
                  <!--                          <el-image :src="Qrcode" class="Qrcode_img"></el-image>-->
                  <!--                        </div>-->
                  <!--                      </el-col>-->
                  <!--                    </el-row>-->
                  <!--                  </el-card>-->
                  <!--                  <el-card body-style="background-color: #F9F9F9;" class="Qrcode-card" shadow="never" :bordered="false">-->
                  <!--                    <el-row>-->
                  <!--                      <el-col v-bind="grid2">-->
                  <!--                        <div class="acea-row row-between-wrapper Qrcode-box">-->
                  <!--                          <div>-->
                  <!--                            <div class="title mb20">微信公众号</div>-->
                  <!--                            <div class="tips">扫描右侧二维码查看</div>-->
                  <!--                          </div>-->
                  <!--                        </div>-->
                  <!--                      </el-col>-->
                  <!--                      <el-col v-bind="grid2">-->
                  <!--                        <div class="acea-row" style="justify-content: right">-->
                  <!--                          <div id="diyQrcode"></div>-->
                  <!--                        </div>-->
                  <!--                      </el-col>-->
                  <!--                    </el-row>-->
                  <!--                  </el-card>-->
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="rightModel">
          <div slot="header" class="clearfix mb20">
            <div class="container" v-hasPermi="['merchant:page:diy:page']">
              <el-form size="small" inline @submit.native.prevent>
                <el-form-item label="模板名称：">
                  <el-input
                    v-model.trim="keywords"
                    placeholder="请输入模板名称"
                    class="selWidth"
                    clearable
                    @keyup.enter.native="getList(1)"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-button
              type="primary"
              v-hasPermi="['platform:pagediy:save']"
              @click="handlerEditDiyPage(0, 'add')"
              size="small"
              style="font-size: 12px"
              ><i class="el-icon-plus" style="margin-right: 4px" />添加</el-button
            >
            <el-button v-hasPermi="['merchant:page:diy:page']" @click="getList(1)" size="small" style="font-size: 12px"
              >刷新</el-button
            >
          </div>
          <el-table
            v-loading="listLoading"
            :data="tableData.data"
            size="small"
            class="table"
            @row-dblclick="handleName"
            highlight-current-row
            :cell-class-name="tableCellClassName"
          >
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column label="模板名称" prop="name" min-width="210" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <div class="acea-row row-middle">
                  <el-tag v-show="scope.row.isDefault === 1" effect="plain" class="mr5">首页</el-tag>
                  <!--v-if去判断双击的是不是当前单元格-->
                  <el-input
                    @blur="hideInput(scope.row)"
                    size="mini"
                    maxlength="15"
                    :ref="scope.row.index + ',' + scope.column.index"
                    v-model="scope.row.name"
                    v-if="
                      scope.row.index + ',' + scope.column.index == currentCell &&
                      checkPermi(['merchant:page:diy:update:name'])
                    "
                  >
                  </el-input>
                  <div v-else style="cursor: pointer" class="line1">{{ scope.row.name }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="addTime" label="添加时间" min-width="180" />
            <el-table-column prop="updateTime" label="更新时间" min-width="180" />
            <el-table-column label="操作" width="190" fixed="right">
              <template slot-scope="scope">
                <a
                  v-hasPermi="['merchant:page:diy:update', 'merchant:page:diy:info']"
                  @click="handlerEditDiyPage(scope.row.id, 'edit')"
                  >设计</a
                >
                <el-divider direction="vertical"></el-divider>
                <template v-if="scope.row.isDefault !== 1 && checkPermi(['merchant:page:diy:set:default'])">
                  <a @click="setHomepage(scope.row.id)">设为首页</a>
                  <el-divider direction="vertical"></el-divider>
                </template>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-hasPermi="['merchant:page:diy:save', 'merchant:page:diy:info']"
                      @click.native="handlerEditDiyPage(scope.row.id, 'copy')"
                      >复制</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-if="scope.row.isDefault !== 1 && checkPermi(['merchant:page:diy:delete'])"
                      @click.native="handleDelete(scope.row.id)"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="previewProtol(scope.row.id)">预览</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              background
              :page-sizes="[10, 20, 30]"
              :page-size="tableForm.limit"
              :current-page="tableForm.page"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.total"
              @size-change="handleSizeChange"
              @current-change="pageChange"
            />
          </div>
        </div>
      </div>
    </el-card>

    <!--    列表预览弹窗-->
    <el-dialog
      :visible.sync="perViewDia.visible"
      title=""
      width="430px"
      top="7vh"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <iframe
        v-if="perViewDia.visible"
        id="ifPerviewShop"
        :src="perViewDia.perViewUrl"
        style="width: 390px; height: 800px"
        frameborder="0"
      />
    </el-dialog>
  </div>
</template>

<script>
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2025 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import {
  pagediyListApi,
  pagediySetdefaultApi,
  pagediyDeleteApi,
  pagediyGetSetHome,
  wechatQrcodeApi,
  pagediyUpdatenameApi,
} from '@/api/devise';
import QRcode from 'qrcodejs2';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public';
import Cookies from 'js-cookie';
import { isUrlHttp } from '@/utils/ZBKJIutil';
import { merchantConfigInfoApi } from '@/api/merchant'; // 权限判断函数
export default {
  name: 'index',
  data() {
    return {
      grid: {
        xl: 16,
        lg: 20,
        md: 20,
        sm: 24,
        xs: 24,
      },
      grid2: {
        xl: 12,
        lg: 12,
        md: 20,
        sm: 24,
        xs: 24,
      },
      listActive: 0,
      tabList: ['店铺首页', '自定义页面'],
      tableForm: {
        page: 1,
        limit: 10,
        keywords: '',
      },
      keywords: '',
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      frontDomain: '',
      perViewDia: {
        // 列表二维码预览
        visible: false,
        perViewUrl: '',
      },
      Qrcode: '', //小程序二维码
      // 用一个字符串来保存当前双击的是哪一个单元格
      currentCell: null,
      merchantId: 0, //商户id
    };
  },
  mounted() {
    if (!localStorage.getItem('JavaMerchantConfigInfo')) this.getConfigInfo();
    this.merchantId = Cookies.get('JavaMerchantId');
    let time = new Date().getTime() * 1000;
    this.frontDomain = `${this.$selfUtil.getFrontDomainUrl()}/pages/merchant/home/index?merId=${
      this.merchantId
    }&inner_frame=1&time=${time}`;
    if (checkPermi(['merchant:page:diy:page'])) this.getList();
  },
  methods: {
    checkPermi,
    // 获取商户配置信息
    async getConfigInfo() {
      let res = await merchantConfigInfoApi();
      localStorage.setItem('JavaMerchantConfigInfo', JSON.stringify(res));
    },
    // 给单元格绑定横向和竖向的index，这样就能确定是哪一个单元格
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },
    // 获得当前双击的单元格的横竖index，然后拼接成一个唯一字符串用于判断，并赋给currentCell
    // 拼接后类似这样："1,0","1,1",
    handleName(row, column) {
      this.currentCell = row.index + ',' + column.index;
      // 这里必须要setTimeout，因为在点击的时候，input才刚被v-if显示出来，不然拿不到dom
      setTimeout(() => {
        // 双击后自动获得焦点
        this.$refs[row.index + ',' + column.index].focus();
      });
    },
    // 当input失去焦点的时候，隐藏input
    hideInput(item) {
      if (!item.name) {
        return this.$message.warning('模板名称不能为空');
      } else {
        this.currentCell = null;
      }
      pagediyUpdatenameApi({
        id: item.id,
        name: item.name,
      }).then((res) => {
        this.$message.success('编辑成功');
      });
    },
    //微信二维码
    getQRcode() {
      document.getElementById('diyQrcode').innerHTML = '';
      new QRcode('diyQrcode', { width: 120, height: 120, text: this.frontDomain });
    },
    //小程序二维码
    getWechatQrcode() {
      // env_version	默认值为："release"，要打开的小程序版本。正式版为"release"，体验版为"trial"，开发版为"develop"，仅在微信外打开时生效。
      wechatQrcodeApi({
        scene: 'id=0',
        path: `/pages/merchant/home/index?merId=${this.merchantId}`,
        env_version: 'release',
      }).then((res) => {
        this.Qrcode = res.code;
      });
    },
    //点击左侧菜单
    ProductNavTab(index) {
      this.listActive = index;
    },
    //预览
    previewProtol(id) {
      if (!id) return;
      this.perViewDia.perViewUrl = this.frontDomain + '&id=' + id;
      this.perViewDia.visible = true;
    },
    // 使用模板
    setHomepage(id) {
      this.$modalSure('把该模板设为首页').then(() => {
        pagediySetdefaultApi(id).then((res) => {
          this.$message.success('操作成功');
          this.getList();
        });
      });
    },
    // DIY 编辑首页
    handlerDiyHomePage() {
      pagediyGetSetHome().then((homePageId) => {
        this.handlerEditDiyPage(homePageId, 'edit');
      });
    },
    // 添加
    handlerEditDiyPage(id, type) {
      const { href } = this.$router.resolve({
        path: `/page/design/creatDevise/${id}/${type}`,
      });
      window.open(href);
    },
    getList(num) {
      this.listLoading = true;
      this.tableForm.page = num ? num : this.tableForm.page;
      this.tableForm.keywords = encodeURIComponent(this.keywords);
      pagediyListApi(this.tableForm)
        .then((res) => {
          this.listLoading = false;
          this.tableData.data = res.list;
          this.tableData.total = res.total;
        })
        .then((res) => {
          this.listLoading = false;
        });
    },
    // 删除
    handleDelete(id) {
      this.$modalSure('删除模板吗').then(() => {
        pagediyDeleteApi(id).then((res) => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableForm);
          this.getList();
        });
      });
    },
    handleSizeChange(val) {
      this.tableForm.limit = val;
      this.getList();
    },
    pageChange(val) {
      this.tableForm.page = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.current_home {
  position: relative;
}

.mask {
  position: absolute;
  left: 0;
  width: 100%;
  top: 0;
  height: 100%;
  background-color: transparent;
}

.Qrcode-box {
  width: 100%;
  height: 120px;
}

.Qrcode_img {
  width: 120px;
}

.flex_between {
  margin-left: 60px;
  width: 100%;
  border-radius: 2px 2px 2px 2px;
  opacity: 1;
  border: 1px solid #eeeeee;
  position: relative;
  padding: 20px;

  &:before {
    content: '';
    width: 0px;
    height: 0px;
    border-right: 10px solid #eeeeee;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    position: absolute;
    top: 23px;
    left: -10px;
  }

  &:after {
    content: '';
    width: 0px;
    height: 0px;
    border-right: 9px solid #ffffff;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    position: absolute;
    top: 24px;
    left: -9px;
  }
}

.title {
  font-size: 20px;
  font-weight: 800;
  color: #303133;
}

.tips {
  font-size: 14px;
  color: #909399;
}

.tab_view {
  width: 200px;
  border-right: 1px solid #eee;
  margin-right: 40px;
  display: flex;
  flex-direction: column;

  .cell_item {
    height: 50px;
    font-size: 14px;
    line-height: 50px;
    text-align: left;
    padding-left: 30px;
    cursor: pointer;
  }
}

.tab_active {
  color: var(--prev-color-primary);
  border-right: 1px solid var(--prev-color-primary);
}

.rightModel {
  width: 100%;
  min-width: 700px;
}

.acea-row {
  flex-wrap: nowrap !important;
}

.model_header {
  width: 350px;
}

.iframe-box {
  width: 350px;
  height: 669px;
  border-radius: 10px;
  border: 1px solid #eee;
}
</style>
