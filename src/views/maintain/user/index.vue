<template>
  <div class="divBox">
    <el-card class="box-card" shadow="never" :bordered="false">
      <el-form ref="pram" :model="pram" :rules="rules" label-width="100px">
        <el-form-item label="管理员账号：" prop="account">
          <el-input v-model.trim="pram.account" class="from-ipt-width" placeholder="管理员账号" :disabled="true" />
        </el-form-item>
        <el-form-item label="管理员姓名：" prop="realName">
          <el-input
            :disabled="type === 'password'"
            v-model.trim="pram.realName"
            maxlength="16"
            class="from-ipt-width"
            placeholder="管理员姓名"
          />
        </el-form-item>
        <el-form-item v-if="type === 'password'" label="原始密码：" prop="oldPassword">
          <el-input
            v-model.trim="pram.oldPassword"
            type="password"
            class="from-ipt-width"
            placeholder="原始密码"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="type === 'password'" label="新密码：" prop="password">
          <el-input
            v-model.trim="pram.password"
            type="password"
            class="from-ipt-width"
            placeholder="新密码"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="pram.password" label="确认新密码：" prop="confirmPassword">
          <el-input
            v-model.trim="pram.confirmPassword"
            class="from-ipt-width"
            type="password"
            placeholder="确认新密码"
            clearable
          />
        </el-form-item>
        <el-form-item v-hasPermi="['merchant:login:admin:update:password', 'merchant:login:admin:update']">
          <el-button type="primary" @click="handlerSubmit('pram')">提交</el-button>
          <el-button @click="close('pram')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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

import * as systemAdminApi from '@/api/systemadmin.js';
import Cookies from 'js-cookie';
import { Debounce } from '@/utils/validate';
import { checkPermi } from '@/utils/permission';
export default {
  name: 'index',
  data() {
    const confirmvalidatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pram.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.pram.confirmPassword !== '') {
          this.$refs.pram.validateField('confirmPassword');
        }
        callback();
      }
    };
    const JavaMerInfo = JSON.parse(Cookies.get('JavaMerInfo'));
    return {
      password: '',
      JavaMerInfo: JSON.parse(Cookies.get('JavaMerInfo')),
      pram: {
        account: JavaMerInfo.account,
        password: '',
        oldPassword: '',
        confirmPassword: '',
        realName: JavaMerInfo.realName,
        id: JavaMerInfo.id,
      },
      roleList: [],
      rules: {
        account: [{ required: true, message: '请填写管理员账号', trigger: ['blur', 'change'] }],
        oldPassword: [{ required: true, message: '请填写原始密码', trigger: ['blur', 'change'] }],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { required: true, min: 6, max: 20, message: '长度6-20个字符' },
        ],
        confirmPassword: [{ required: true, validator: confirmvalidatePass, trigger: ['blur', 'change'] }],
        realName: [{ required: true, message: '管理员姓名', trigger: ['blur', 'change'] }],
      },
      type: 'users', //个人中心还是修改密码
    };
  },
  watch: {
    $route(to, from) {
      this.type = this.$route.params.type;
      this.tempRoute = Object.assign({}, this.$route);
      this.setTagsViewTitle();
    },
  },
  created() {
    this.type = this.$route.params.type;
    this.tempRoute = Object.assign({}, this.$route);
  },
  mounted() {
    this.setTagsViewTitle();
  },
  methods: {
    checkPermi,
    //设置头部标题
    setTagsViewTitle() {
      const title = this.type === 'password' ? '修改密码' : '个人中心';
      const route = Object.assign({}, this.tempRoute, { title: `${title}` });
      this.$store.dispatch('tagsView/updateVisitedView', route);
    },
    close(formName) {
      this.$refs[formName].resetFields();
    },
    handlerSubmit: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 'password') {
            this.onSavePassword();
          } else {
            this.onSaveAccount();
          }
        } else {
          return false;
        }
      });
    }),
    //保存密码
    onSavePassword() {
      systemAdminApi.adminPasswordUpdate(this.pram).then((data) => {
        this.$message.success('提交成功');
        this.$router.go(-1);
      });
    },
    //保存账号
    onSaveAccount() {
      systemAdminApi.adminAccountUpdate(this.pram).then((data) => {
        this.$message.success('提交成功');
        this.$router.go(-1);
      });
    },
  },
};
</script>

<style scoped></style>
