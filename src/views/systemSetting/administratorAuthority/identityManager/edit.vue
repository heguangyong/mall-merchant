<template>
  <div>
    <el-form ref="pram" :model="pram" label-width="80px" @submit.native.prevent>
      <el-form-item
        label="角色名称："
        prop="roleName"
        :rules="[{ required: true, message: '请填写角色名称', trigger: ['blur', 'change'] }]"
      >
        <el-input v-model.trim="pram.roleName" placeholder="身份名称" />
      </el-form-item>
      <el-form-item label="状态：">
        <el-switch
          v-model="pram.status"
          active-text="开启"
          inactive-text="关闭"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <el-form-item label="菜单权限：">
        <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
        <!-- <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox> -->
        <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')"
          >父子联动</el-checkbox
        >
        <el-tree
          class="tree-border"
          :data="menuOptions"
          show-checkbox
          ref="menu"
          node-key="id"
          :default-expand-all="expandAll"
          :check-strictly="!menuCheckStrictly"
          empty-text="加载中，请稍候"
          :props="defaultProps"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button size="small" @click="close">取消</el-button>
      <el-button
        :loading="loading"
        size="small"
        type="primary"
        @click="handlerSubmit('pram')"
        v-hasPermi="['merchant:admin:role:update']"
        >{{ isCreate === 0 ? '确定' : '更新' }}</el-button
      >
    </div>
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

import * as roleApi from '@/api/role.js';
import { Debounce } from '@/utils/validate';
import Cookies from 'js-cookie';
export default {
  name: 'roleEdit',
  props: {
    isCreate: {
      type: Number,
      required: 0,
    },
    editData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      expandAll: false,
      loading: false,
      pram: {
        roleName: null,
        rules: '',
        status: null,
        id: null,
        merId: JSON.parse(Cookies.get('JavaMerInfo')).id,
      },
      menuExpand: false,
      menuNodeAll: false,
      menuOptions: [],
      menuCheckStrictly: true,
      currentNodeId: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
      },
      menuIds: [],
    };
  },
  mounted() {
    this.initEditData();
    this.getCacheMenu();
  },
  methods: {
    close() {
      this.$emit('hideEditDialog');
    },
    initEditData() {
      if (this.isCreate !== 1) return;
      const { roleName, status, id, merId } = this.editData;
      this.pram.roleName = roleName;
      this.pram.status = status;
      this.pram.id = id;
      this.pram.merId = JSON.parse(Cookies.get('JavaMerInfo')).id;
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
      });
      roleApi.getInfo(id).then((res) => {
        this.menuOptions = res.menuList;
        this.checkDisabled(this.menuOptions);
        loading.close();
        this.getTreeId(res.menuList);
        this.$nextTick(() => {
          this.menuIds.forEach((i, n) => {
            var node = this.$refs.menu.getNode(i);
            if (node.isLeaf) {
              this.$refs.menu.setChecked(node, true);
            }
          });
        });
      });
    },
    handlerSubmit: Debounce(function (form) {
      this.$refs[form].validate((valid) => {
        if (!valid) return;
        let roles = this.getMenuAllCheckedKeys().toString();
        this.pram.rules = roles;
        if (this.isCreate === 0) {
          this.handlerSave();
        } else {
          this.handlerEdit();
        }
      });
    }),
    handlerSave() {
      this.loading = true;
      roleApi
        .addRole(this.pram)
        .then((data) => {
          this.$message.success('创建身份成功');
          this.$emit('hideEditDialog');
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    handlerEdit() {
      this.loading = true;
      roleApi
        .updateRole(this.pram)
        .then((data) => {
          this.$message.success('更新身份成功');
          this.$emit('hideEditDialog');
          this.loading = false;
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    rulesSelect(selectKeys) {
      this.pram.rules = selectKeys;
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      // this.expandAll = true
      this.expandAll = this.menuExpand ? true : false;
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.menuCheckStrictly = value ? true : false;
      }
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    getCacheMenu() {
      if (this.isCreate !== 0) return;
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
      });
      roleApi.menuCacheList().then((res) => {
        this.menuOptions = res;
        this.checkDisabled(this.menuOptions);
        loading.close();
      });
    },
    getTreeId(datas) {
      for (var i in datas) {
        if (datas[i].checked) this.menuIds.push(datas[i].id);
        if (datas[i].childList) {
          this.getTreeId(datas[i].childList);
        }
      }
    },
    checkDisabled(data) {
      //设置公共权限默认勾选且不可操作
      data.forEach((item) => {
        if (item.id === 179 || item.id === 180) {
          item.disabled = true;
          item.childList.forEach((item1) => {
            item1.disabled = true;
            this.$nextTick(() => {
              var node = this.$refs.menu.getNode(item1.id);
              if (node.isLeaf) {
                this.$refs.menu.setChecked(node, true);
              }
            });
          });
        }
      });
    },
  },
};
</script>

<style scoped></style>
