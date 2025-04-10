<template>
  <div>
    <el-form ref="editPram" :rules="rules" :model="editPram" label-width="90px">
      <el-form-item label="关联用户：" prop="uid">
        <div class="upLoadPicBox" @click="userVisible = true">
          <div v-if="editPram.userAvatar" class="pictrue">
            <img :src="editPram.userAvatar" />
          </div>
          <div v-else class="upLoad">
            <i class="el-icon-camera cameraIconfont" />
          </div>
          <div class="nick">{{ editPram.nickname }}</div>
          <div class="from-tips">员工必须在商城关注店铺</div>
        </div>
      </el-form-item>
      <el-form-item label="员工头像：" prop="avatar">
        <div class="upLoadPicBox" @click="modalPicTap('1')">
          <div v-if="editPram.avatar" class="pictrue">
            <img :src="editPram.avatar" />
          </div>
          <div v-else class="upLoad">
            <i class="el-icon-camera cameraIconfont" />
          </div>
          <div class="from-tips">用于移动端商家管理工作台展示，建议：80*80PX，大小不超过5KB。</div>
        </div>
      </el-form-item>
      <el-form-item label="员工姓名：" prop="name">
        <el-input v-model="editPram.name" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="editPram.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="管理权限：" prop="role">
        <el-checkbox-group v-model="editPram.role">
          <el-checkbox label="1">订单管理</el-checkbox>
          <el-checkbox label="2">商品管理</el-checkbox>
          <el-checkbox label="3">售后管理</el-checkbox>
          <el-checkbox label="5">订单核销</el-checkbox>
          <el-checkbox label="6">销量/用户统计</el-checkbox>
        </el-checkbox-group>
        <div class="from-tips">管理权限控制该员工能够进行的操作限制。</div>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch v-model="editPram.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-inner">
      <el-button @click="handlerClose()">取消</el-button>
      <el-button type="primary" @click="handlerSubmit('editPram')">确定</el-button>
    </div>
    <!-- 关联用户弹窗 -->
    <el-dialog
      title="关联用户列表"
      :visible.sync="userVisible"
      width="900px"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <userList @getRow="getRow" v-if="userVisible"></userList>
    </el-dialog>
  </div>
</template>

<script>
import userList from '../user/list';
import { employeeAddRole, employeeUpdateRole } from '@/api/staff';
import { validatePhone } from '@/utils/toolsValidate';

export default {
  components: { userList },
  props: ['editData', 'isCreate'],
  data() {
    return {
      selectedRow: null,
      userVisible: false,
      editPram: {
        avatar: null,
        name: null,
        uid: null,
        phone: null,
        status: false,
        role: [],
        id: null,
        nickname: null,
        userAvatar: null,
      },
      rules: {
        avatar: [{ required: true, message: '请设置头像', trigger: 'change' }],
        role: [{ required: true, message: '请设置管理权限', trigger: 'change' }],
        uid: [{ required: true, message: '请关联用户', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.isCreate == 1) {
        for (const key in this.editData) {
          this.editPram[key] = this.editData[key];
        }
        this.editPram.role = this.editPram.role.split(',');
      }
    },
    close() {
      this.userVisible = false;
    },
    getUser() {
      this.editPram.userAvatar = this.selectedRow.avatar;
      this.editPram.uid = this.selectedRow.id;
      this.editPram.nickname = this.selectedRow.nickname;
      this.userVisible = false;
    },
    getRow(row) {
      this.selectedRow = row;
      this.getUser();
    },
    //取消
    handlerClose() {
      this.$emit('hideEditDialog', 0);
    },
    //表单确认
    handlerSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        let pram = { ...this.editPram };
        pram.role = pram.role.join(',');
        pram.status = pram.status ? 1 : 0;
        pram.uid = +pram.uid;
        if (this.isCreate == 0) {
          employeeAddRole(pram).then((res) => {
            this.$emit('hideEditDialog', 1, 0);
          });
        } else {
          employeeUpdateRole(pram).then((res) => {
            this.$emit('hideEditDialog', 1, 1);
          });
        }
      });
    },
    //点击头像
    modalPicTap(tit, num, i) {
      const _this = this;
      const attr = [];
      this.$modalUpload(
        function (img) {
          if (!img) return;
          if (tit === '1' && !num) {
            _this.editPram.avatar = img[0].sattDir;
          }
          if (tit === '2' && !num) {
            img.map((item) => {
              attr.push(item.attachment_src);
              _this.formValidate.slider_image.push(item);
            });
          }
        },
        tit,
        'store',
      );
    },
  },
};
</script>

<style scoped lang="scss">
.upLoadPicBox {
  position: relative;
  .nick {
    width: 100%;
    position: absolute;
    left: 70px;
    top: 15px;
  }
}
::v-deep .el-dialog__title {
  font-weight: 600 !important;
}
::v-deep .el-dialog__body {
  padding-top: 20px !important;
}
::v-deep .el-card__body {
  padding: 0 0 20px !important;
}
</style>
