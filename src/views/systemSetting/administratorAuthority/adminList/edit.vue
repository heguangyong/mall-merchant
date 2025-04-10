<template>
  <div>
    <el-form ref="pram" :model="pram" :rules="rules" label-width="90px" @submit.native.prevent>
      <el-form-item label="管理员账号：" prop="account">
        <el-input :disabled="isCreate === 1" v-model.trim="pram.account" placeholder="管理员账号" />
      </el-form-item>
      <el-form-item v-if="isCreate === 0" label="管理员密码：" prop="pwd">
        <el-input v-model.trim="pram.pwd" placeholder="管理员密码" clearable type="password" />
      </el-form-item>
      <el-form-item v-if="pram.pwd && isCreate === 0" label="确认密码：" prop="repwd">
        <el-input v-model.trim="pram.repwd" type="password" placeholder="确认密码" clearable />
      </el-form-item>
      <el-form-item label="管理员姓名：" prop="realName">
        <el-input v-model.trim="pram.realName" maxlength="16" placeholder="管理员姓名" />
      </el-form-item>
      <el-form-item label="管理员身份：" prop="roles">
        <el-select v-model="pram.roles" placeholder="身份" clearable multiple style="width: 100%">
          <el-option v-for="(item, index) in roleList.list" :key="index" :label="item.roleName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input type="text" v-model.trim="pram.phone" prefix="ios-contact-outline" placeholder="请输入手机号" />
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
      <el-form-item> </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="handlerSubmit('pram')" v-hasPermi="['merchant:admin:update']">{{
        isCreate === 0 ? '确定' : '更新'
      }}</el-button>
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
import * as systemAdminApi from '@/api/systemadmin.js';
import { Debounce } from '@/utils/validate';
import { PhoneReg, validatePhone } from '@/utils/toolsValidate';
export default {
  // name: "edit"
  components: {},
  props: {
    isCreate: {
      type: Number,
      required: 0,
    },
    editData: {
      type: Object,
      default: () => {
        return { rules: [] };
      },
    },
  },
  data() {
    const confirmvalidatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pram.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理员密码'));
      } else {
        if (this.pram.repwd !== '') {
          this.$refs.pram.validateField('repwd');
        }
        callback();
      }
    };
    return {
      constants: this.$constants,
      pram: {
        account: null,
        pwd: '',
        repwd: '',
        realName: null,
        roles: [],
        status: null,
        id: null,
        phone: null,
      },
      roleList: [],
      rules: {
        account: [{ required: true, message: '请填写管理员账号', trigger: ['blur', 'change'] }],
        pwd: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { required: true, min: 6, max: 20, message: '长度6-20个字符' },
        ],
        repwd: [{ required: true, validator: confirmvalidatePass, trigger: ['blur', 'change'] }],
        realName: [{ required: true, message: '请填写管理员姓名', trigger: ['blur', 'change'] }],
        roles: [{ required: true, message: '请选择管理员身份', trigger: ['blur', 'change'] }],
        phone: [{ validator: validatePhone, trigger: ['blur', 'change'] }],
      },
    };
  },
  mounted() {
    this.initEditData();
    this.handleGetRoleList();
  },
  methods: {
    close() {
      this.$emit('hideEditDialog');
    },
    handleGetRoleList() {
      const _pram = {
        page: 1,
        limit: this.constants.page.limit[4],
        status: 1,
      };
      roleApi.getRoleList(_pram).then((data) => {
        this.roleList = data;
        let arr = [];
        data.list.forEach((item) => {
          arr.push(item.id);
        });
        if (!arr.includes(Number.parseInt(this.pram.roles))) {
          this.$set(this.pram, 'roles', []);
        }
      });
    },
    initEditData() {
      if (this.isCreate !== 1) return;
      const { account, realName, roles, level, status, id, phone } = this.editData;
      this.pram.account = account;
      this.pram.realName = realName;
      const _roles = [];
      if (roles && roles.length > 0 && !roles.includes(',')) {
        //如果权限id集合有长度并且是只有一个，就将它Push进_roles这个数组
        _roles.push(Number.parseInt(roles));
      } else {
        //否则就将多个id集合解构以后push进roles并且转换为整型
        _roles.push(...roles.split(',').map((item) => Number.parseInt(item)));
      }
      this.pram.roles = _roles;
      this.pram.status = status;
      this.pram.id = id;
      this.pram.phone = phone;
      this.rules.pwd = [];
      this.rules.repwd = [];
    },
    handlerSubmit: Debounce(function (form) {
      this.$refs[form].validate((valid) => {
        if (!valid) return;
        if (this.isCreate === 0) {
          this.handlerSave();
        } else {
          this.handlerEdit();
        }
      });
    }),
    handlerSave() {
      systemAdminApi.adminAdd(this.pram).then((data) => {
        this.$message.success('创建管理员成功');
        this.$emit('hideEditDialog');
      });
    },
    handlerEdit() {
      this.pram.roles = this.pram.roles.join(',');
      systemAdminApi.adminUpdate(this.pram).then((data) => {
        this.$message.success('更新管理员成功');
        this.$emit('hideEditDialog');
      });
    },
    rulesSelect(selectKeys) {
      this.pram.rules = selectKeys;
    },
  },
};
</script>

<style scoped></style>
