<template>
  <div>
    <template v-if="selectModel">
      <el-tree
        ref="tree"
        :data="treeList"
        show-checkbox
        node-key="id"
        @check="getCurrentNode"
        :default-checked-keys="selectModelKeysNew"
        :props="treeProps"
      >
      </el-tree>
    </template>
    <template v-else>
      <div class="divBox">
        <el-card class="box-card" :body-style="{ padding: '20px 20px 20px' }" shadow="never" :bordered="false">
          <el-button
            size="small"
            type="primary"
            @click="handleAddMenu({ id: 0, name: '顶层目录' })"
            v-hasPermi="['merchant:product:category:add']"
            >新增{{ biztype.name }}</el-button
          >
          <el-table
            :data="dataList"
            size="small"
            v-loading="listLoading"
            class="table mt20"
            highlight-current-row
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="name" label="名称" min-width="200">
              <template slot-scope="scope"> {{ scope.row.name }} | {{ scope.row.id }} </template>
            </el-table-column>
            <template v-if="!selectModel">
              <el-table-column label="分类图标" min-width="80">
                <template slot-scope="scope">
                  <div class="demo-image__preview line-heightOne">
                    <el-image :src="scope.row.icon" :preview-src-list="[scope.row.icon]" v-if="scope.row.icon" />
                    <img v-else :src="defaultImg" alt="" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="排序" prop="sort" min-width="150" />
              <el-table-column label="状态" min-width="150">
                <template slot-scope="scope">
                  <el-switch
                    v-if="checkPermi(['merchant:category:update:status'])"
                    v-model="scope.row.isShow"
                    :active-value="true"
                    :inactive-value="false"
                    active-text="显示"
                    inactive-text="隐藏"
                    @change="onchangeIsShow(scope.row)"
                  />
                  <div v-else>{{ scope.row.isShow ? '显示' : '隐藏' }}</div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                  <template v-if="scope.row.pid === 0 && checkPermi(['merchant:product:category:add'])">
                    <a @click="handleAddMenu(scope.row)">添加子目录</a>
                    <el-divider direction="vertical"></el-divider>
                  </template>
                  <a @click="handleEditMenu(scope.row)" v-hasPermi="['merchant:product:category:update']">编辑</a>
                  <el-divider direction="vertical"></el-divider>
                  <a @click="handleDelMenu(scope.row)" v-hasPermi="['merchant:product:category:delete']">删除</a>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-card>
      </div>
    </template>
    <el-dialog
      :title="editDialogConfig.isCreate === 0 ? `创建${biztype.name}` : `编辑${biztype.name}`"
      :visible.sync="editDialogConfig.visible"
      destroy-on-close
      :close-on-click-modal="false"
      width="540px"
      class="dialog-bottom"
    >
      <edit
        v-if="editDialogConfig.visible"
        :prent="editDialogConfig.prent"
        :is-create="editDialogConfig.isCreate"
        :edit-data="editDialogConfig.data"
        :biztype="editDialogConfig.biztype"
        :all-tree-list="dataList"
        @hideEditDialog="hideEditDialog"
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

import * as storeApi from '@/api/product.js';
import info from './info';
import edit from './edit';
import * as selfUtil from '@/utils/ZBKJIutil.js';
import { checkPermi } from '@/utils/permission';
export default {
  // name: "list"
  components: { info, edit },
  props: {
    biztype: {
      // 类型，1 产品分类，2 附件分类，3 文章分类， 4 设置分类， 5 菜单分类
      type: Object,
      default: { value: -1 },
      validator: (obj) => {
        return obj.value > 0;
      },
    },
    pid: {
      type: Number,
      default: 0,
      validator: (value) => {
        return value >= 0;
      },
    },
    selectModel: {
      // 是否选择模式
      type: Boolean,
      default: false,
    },
    selectModelKeys: {
      type: Array,
    },
    rowSelect: {},
  },
  data() {
    return {
      listLoading: false,
      selectModelKeysNew: this.selectModelKeys,
      loading: false,
      constants: this.$constants,
      treeProps: {
        label: 'name',
        children: 'child',
      },
      multipleSelection: [],
      editDialogConfig: {
        visible: false,
        isCreate: 0, // 0=创建，1=编辑
        prent: {}, // 父级对象
        data: {},
        biztype: this.biztype, // 统一主业务中的目录类型
      },
      dataList: [],
      treeList: [],
      listPram: {
        pid: this.pid,
        type: this.biztype.value,
        isShow: false,
        name: '',
        page: this.$constants.page.page,
        limit: this.$constants.page.limit[0],
      },
      viewInfoConfig: {
        data: null,
        visible: false,
      },
      defaultImg: require('@/assets/imgs/moren.jpg'),
    };
  },
  mounted() {
    if (checkPermi(['merchant:product:category:list'])) this.handlerGetTreeList();
  },
  methods: {
    checkPermi, //权限控制
    onchangeIsShow(row) {
      storeApi.productCategoryShowApi(row.id).then(() => {
        this.$message.success('修改成功');
        this.handlerGetTreeList();
        this.$store.commit('product/SET_MerProductClassify', []);
      });
    },
    handleEditMenu(rowData) {
      this.editDialogConfig.isCreate = 1;
      this.editDialogConfig.data = rowData;
      this.editDialogConfig.prent = rowData;
      this.editDialogConfig.visible = true;
    },
    handleAddMenu(rowData) {
      this.editDialogConfig.isCreate = 0;
      this.editDialogConfig.prent = rowData;
      this.editDialogConfig.data = {};
      this.editDialogConfig.biztype = this.biztype;
      this.editDialogConfig.visible = true;
    },
    getCurrentNode(data) {
      let node = this.$refs.tree.getNode(data);
      this.childNodes(node);
      //编辑时候使用
      this.$emit('rulesSelect', this.$refs.tree.getCheckedKeys());
    },
    //具体方法可以看element官网api
    childNodes(node) {
      let len = node.childNodes.length;
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = node.checked;
        this.childNodes(node.childNodes[i]);
      }
    },
    parentNodes(node) {
      if (node.parent) {
        for (let key in node) {
          if (key == 'parent') {
            node[key].checked = true;
            this.parentNodes(node[key]);
          }
        }
      }
    },
    handleDelMenu(rowData) {
      this.$modalSure('删除当前数据?').then(() => {
        storeApi.productCategoryDeleteApi(rowData.id).then((res) => {
          this.handlerGetTreeList();
          this.$store.commit('product/SET_MerProductClassify', []);
          this.$message.success('删除成功');
        });
      });
    },
    handlerGetList() {
      this.handlerGetTreeList();
    },
    changeNodes(data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (!data[i].childList || data[i].childList.length < 1) {
            data[i].childList = undefined;
          } else {
            this.changeNodes(data[i].childList);
          }
        }
      }
      return data;
    },
    handlerGetTreeList() {
      storeApi
        .productCategoryListApi()
        .then((res) => {
          let obj = {},
            dataList = [];
          res.forEach((item) => {
            obj = item;
            obj.parentId = item.pid;
            obj.children = [];
            dataList.push(obj);
          });
          this.dataList = this.handleTree(dataList, 'menuId');
          this.treeList = this.handleAddArrt(res);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handlerGetInfo(id) {
      this.viewInfoConfig.data = id;
      this.viewInfoConfig.visible = true;
    },
    handleNodeClick(data) {
      console.log('data:', data);
    },
    handleAddArrt(treeData) {
      const _result = selfUtil.addTreeListLabel(treeData);
      return _result;
    },
    hideEditDialog() {
      setTimeout(() => {
        this.editDialogConfig.prent = {};
        this.editDialogConfig.type = 0;
        this.editDialogConfig.visible = false;
        this.handlerGetTreeList();
      }, 200);
    },
    handleSelectionChange(d1, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) {
      // this.multipleSelection =  checkedKeys.concat(halfCheckedKeys)
      this.multipleSelection = checkedKeys;
      this.$emit('rulesSelect', this.multipleSelection);
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
