<template>
  <el-drawer
    v-if="dialogVisible"
    title="运费模板"
    :visible.sync="dialogVisible"
    size="1100px"
    direction="rtl"
    :before-close="handleClose"
    :modal-append-to-body="false"
    :wrapperClosable="false"
    class="showHeader"
  >
    <div class="demo-drawer__content detailSection">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" size="small" v-if="dialogVisible" :rules="rules">
        <el-form-item label="模板名称：" prop="name">
          <el-input v-model.trim="ruleForm.name" class="withs" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="包邮方式：" prop="appoint">
          <el-radio-group v-model="ruleForm.appoint" @change="changeAppoint">
            <el-radio :label="0">全国包邮</el-radio>
            <el-radio :label="1">部分包邮</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="Number(ruleForm.appoint) > 0">
          <el-form-item label="计费方式：" prop="type">
            <el-radio-group v-model="ruleForm.type" @change="changeRadio(ruleForm.type)">
              <el-radio :label="1">按件数</el-radio>
              <el-radio :label="2">按重量</el-radio>
              <el-radio :label="3">按体积</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运费：" prop="region">
            <el-table
              v-loading="listLoading"
              :data="ruleForm.region"
              border
              fit
              highlight-current-row
              style="width: 100%"
              size="small"
              class="tempBox"
            >
              <el-table-column label="送达到" min-width="260" prop="city_ids">
                <template slot-scope="scope">
                  <span v-if="scope.$index === 0 && ruleForm.appoint === 2">默认运费</span>
                  <el-cascader
                    ref="cascader"
                    v-else
                    style="width: 98%"
                    :options="cityList"
                    v-model="scope.row.city_ids"
                    :rules="rules.city_ids"
                    :props="props"
                    collapse-tags
                    @change="changeRegion"
                  />
                </template>
              </el-table-column>
              <el-table-column min-width="120px" :label="columns.title" prop="first">
                <template slot-scope="scope">
                  <el-form-item :rules="rules.first" :prop="'region.' + scope.$index + '.first'">
                    <el-input-number
                      v-model.trim="scope.row.first"
                      controls-position="right"
                      :step-strictly="ruleForm.type === 1 ? true : false"
                      :min="ruleForm.type === 1 ? 1 : 0.1"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column min-width="120px" label="运费（元）" prop="firstPrice">
                <template slot-scope="scope">
                  <el-form-item :rules="rules.firstPrice" :prop="'region.' + scope.$index + '.firstPrice'">
                    <el-input-number v-model.trim="scope.row.firstPrice" controls-position="right" :min="0" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column min-width="120px" :label="columns.title2" prop="renewal">
                <template slot-scope="scope">
                  <el-form-item :rules="rules.renewal" :prop="'region.' + scope.$index + '.renewal'">
                    <el-input-number
                      v-model.trim="scope.row.renewal"
                      controls-position="right"
                      :step-strictly="ruleForm.type === 1 ? true : false"
                      :min="ruleForm.type === 1 ? 1 : 0.1"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column class-name="status-col" label="续费（元）" min-width="120" prop="renewalPrice">
                <template slot-scope="scope">
                  <el-form-item :rules="rules.renewalPrice" :prop="'region.' + scope.$index + '.renewalPrice'">
                    <el-input-number v-model.trim="scope.row.renewalPrice" controls-position="right" :min="0" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <a
                    v-if="ruleForm.appoint === 1 || (ruleForm.appoint !== 1 && scope.$index > 0)"
                    @click="confirmEdit(ruleForm.region, scope.$index)"
                  >
                    删除
                  </a>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="addRegion(ruleForm.region)">
              添加区域
            </el-button>
          </el-form-item>
          <el-form-item v-if="ruleForm.appoint === 2" label="包邮区域">
            <el-table
              v-loading="listLoading"
              :data="ruleForm.free"
              border
              fit
              highlight-current-row
              style="width: 100%"
              size="mini"
            >
              <el-table-column label="选择区域" min-width="220">
                <template slot-scope="{ row }">
                  <el-cascader
                    v-model="row.city_ids"
                    ref="cascader"
                    style="width: 95%"
                    :options="cityList"
                    :props="props"
                    clearable
                    collapse-tags
                  />
                </template>
              </el-table-column>
              <el-table-column min-width="180px" :label="columns.title3">
                <template slot-scope="{ row }">
                  <el-input-number
                    v-model.trim="row.number"
                    controls-position="right"
                    :step-strictly="ruleForm.type === 1 ? true : false"
                    :min="ruleForm.type === 1 ? 1 : 0.1"
                  />
                </template>
              </el-table-column>
              <el-table-column min-width="120px" label="包邮金额（元）">
                <template slot-scope="{ row }">
                  <el-input-number v-model.trim="row.price" controls-position="right" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <a @click="confirmEdit(ruleForm.free, scope.$index)"> 删除 </a>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-if="ruleForm.appoint === 2">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="addFree(ruleForm.free)">
              添加指定包邮区域
            </el-button>
          </el-form-item>
        </template>
        <el-form-item label="排序：">
          <el-input v-model.trim="ruleForm.sort" class="withs" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
    </div>
    <div class="demo-drawer__footer from-foot-btn btn-shadow drawer_fix">
      <div class="acea-row row-center">
        <el-button @click="handleClose('ruleForm')">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="onsubmit('ruleForm')"
          v-hasPermi="['merchant:shipping:templates:update']"
          >确 定</el-button
        >
      </div>
    </div>
  </el-drawer>
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

import * as logistics from '@/api/logistics';
import { Loading } from 'element-ui';
import { Debounce } from '@/utils/validate';
import * as selfUtil from '@/utils/ZBKJIutil.js';
const defaultRole = {
  name: '',
  type: 1,
  appoint: 0,
  sort: 0,
  region: [
    {
      first: 1,
      firstPrice: 0,
      renewal: 0,
      renewalPrice: 0,
      city_ids: [],
      cityId: 0,
    },
  ],
  undelivery: 0,
  free: [],
  undelives: {},
};
const kg = '重量（kg）';
const m = '体积（m³）';
const statusMap = [
  {
    title: '首件',
    title2: '续件',
    title3: '包邮件数',
  },
  {
    title: `首件${kg}`,
    title2: `续件${kg}`,
    title3: `包邮${kg}`,
  },
  {
    title: `首件${m}`,
    title2: `续件${m}`,
    title3: `包邮${m}`,
  },
];
export default {
  name: 'CreatTemplates',
  components: {},
  data() {
    return {
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        free: [{ type: 'array', required: true, message: '请至少添加一个区域', trigger: 'change' }],
        appoint: [{ required: true, message: '请选择包邮方式', trigger: 'change' }],
        undelivery: [{ required: true, message: '请选择是否指定区域不配送', trigger: 'change' }],
        type: [{ required: true, message: '请选择计费方式', trigger: 'change' }],
        region: [{ required: true, message: '请选择区域运费', trigger: 'change' }],
        city_ids: [{ type: 'array', required: true, message: '请至少选择一个区域', trigger: 'change' }],
        first: [{ required: true, message: '请输入', trigger: 'blur' }],
        renewal: [{ required: true, message: '请输入', trigger: 'blur' }],
        firstPrice: [{ required: true, message: '请输入运费', trigger: 'blur' }],
        renewalPrice: [{ required: true, message: '请输入续费', trigger: 'blur' }],
      },
      nodeKey: 'city_ids',
      props: {
        children: 'child',
        label: 'regionName',
        value: 'regionId',
        multiple: true,
      },
      dialogVisible: false,
      ruleForm: Object.assign({}, defaultRole),
      listLoading: false,
      cityList: [],
      columns: {
        title: '首件',
        title2: '续件',
        title3: '包邮件数',
      },
      tempId: 0,
      regionNew: [
        {
          first: 1,
          firstPrice: 0,
          renewal: 0,
          renewalPrice: 0,
          city_ids: [],
          cityId: 0,
        },
      ],
      type: 0, // 0添加 1编辑
    };
  },
  mounted() {
    let cityList = localStorage.getItem('cityList') ? JSON.parse(localStorage.getItem('cityList')) : [];
    // this.cityList = this.changeNodes(cityList);
    this.cityList = this.changeNodes(cityList);
  },
  methods: {
    changeAppoint() {
      let region = [...this.ruleForm.region];
    },
    changType(type) {
      this.type = type;
    },
    confirmEdit(row, index) {
      row.splice(index, 1);
    },
    popoverHide() {},
    handleClose() {
      this.dialogVisible = false;
      setTimeout(() => {
        this.ruleForm = {
          name: '',
          type: 1,
          appoint: 0,
          sort: 0,
          region: [
            {
              first: 0,
              firstPrice: 0,
              renewal: 0,
              renewalPrice: 0,
              city_ids: [],
              cityId: 0,
            },
          ],
          undelivery: 0,
          free: [],
          undelives: {},
        };
      }, 1000);
      this.columns = Object.assign({}, statusMap[0]);
    },
    changeNodes(data) {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (!data[i].child || data[i].child.length < 1) {
            // this.$delete(data[i], 'child');
            data[i].child = undefined;
          } else {
            this.changeNodes(data[i].child);
          }
        }
      }
      return data;
    },
    changeRegion(value) {
      // let val = value;
      // let attr = JSON.parse(JSON.stringify(val));
      // for (var i = 0; i < attr.length; i++) {
      //   attr[i].splice(0, 2);
      // }
      // let cityTree = attr.flat();
      // for (var i = 0; i < this.cityList.length; i++) {
      //   for (var j = 0; j < this.cityList[i].child.length; j++) {
      //     for (var w = 0; w < this.cityList[i].child[j].child.length; w++) {
      //       if (!this.cityList[i].child[j].child[w]) return;
      //       if (cityTree.includes(this.cityList[i].child[j].child[w].regionId)) {
      //         this.cityList[i].child[j].child[w].disabled = true;
      //       }
      //     }
      //   }
      // }
    },
    judgeDisabled(cityList, cityTree) {
      cityList.map((item, index) => {
        item.disabled = item.regionId === cityTree[index];
        if (item.child && item.child.length) {
          this.judgeDisabled(item.child);
        }
      });
    },

    changeRadio(num) {
      this.columns = Object.assign({}, statusMap[num - 1]);
    },
    // 添加配送区域
    addRegion(region) {
      region.push(
        Object.assign(
          {},
          {
            first: 0,
            firstPrice: 0,
            renewal: 0,
            renewalPrice: 0,
            city_ids: [],
            cityId: '',
          },
        ),
      );
    },
    addFree(Free) {
      Free.push(
        Object.assign(
          {},
          {
            number: 1,
            price: 1,
            city_ids: [],
            cityId: '',
          },
        ),
      );
    },
    /**
     * 详情
     * id 模板id
     * appoint true包邮 false不包邮
     **/
    getInfo(id, appoint) {
      this.tempId = id;
      const loadingInstance = Loading.service({ fullscreen: true });
      logistics
        .templateDetailApi({ id })
        .then((res) => {
          this.dialogVisible = true;
          const info = res;
          if (info.appoint === 0) info.type = 1;
          if (Number(info.appoint) > 0) {
            if (info.regionList && info.regionList.length > 0) {
              info.regionList.forEach((item, index) => {
                item.title = JSON.parse(item.title);
                item.city_ids = item.title;
              });
            }
            if (info.freeList && info.freeList.length > 0) {
              info.freeList.forEach((item, index) => {
                item.title = JSON.parse(item.title);
                item.city_ids = item.title;
              });
            }
          }
          this.ruleForm = Object.assign(this.ruleForm, {
            name: info.name,
            type: info.type,
            appoint: info.appoint,
            sort: info.sort,
            region: info.regionList || [], // 运费区域
            free: info.freeList || [], // 包邮区域
          });
          this.regionNew = [...this.ruleForm.region];
          this.columns = Object.assign({}, statusMap[this.ruleForm.type - 1]);
          this.$nextTick(() => {
            loadingInstance.close();
          });
        })
        .catch((res) => {
          // console.integralLog(res)
          this.$message.error(res.message);
          this.$nextTick(() => {
            loadingInstance.close();
          });
        });
    },
    // 列表
    getCityList() {
      logistics
        .cityListTree()
        .then((res) => {
          localStorage.setItem('cityList', JSON.stringify(res));
          let cityList = JSON.parse(localStorage.getItem('cityList'));
          this.cityList = cityList;
          this.changeNodes(cityList);
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    change(idBox) {
      idBox.map((item) => {
        const ids = [];
        item.city_ids.map((j) => {
          j.splice(0, 1);
          ids.push(j[0]);
        });
        item.city_ids = ids;
      });
      return idBox;
    },
    changeOne(idBox) {
      const city_ids = [];
      idBox.map((item) => {
        item.splice(0, 1);
        city_ids.push(item[0]);
      });
      return city_ids;
    },
    onsubmit: Debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          const param = {
            appoint: this.ruleForm.appoint,
            name: this.ruleForm.name,
            sort: this.ruleForm.sort,
            type: this.ruleForm.type,
            // 配送区域及运费
            shippingTemplatesRegionRequestList: [],
            // 指定包邮设置
            shippingTemplatesFreeRequestList: [],
            id: this.tempId,
          };
          this.ruleForm.region.forEach((el, index) => {
            el.title = el.city_ids.length > 0 ? JSON.stringify(el.city_ids) : JSON.stringify([[0, 0]]);
            if (el.title === '[[0,0]]') {
              el.cityId = '0';
            } else {
              for (var i = 0; i < el.city_ids.length; i++) {
                el.city_ids[i].splice(0, 2);
              }
              el.cityId = el.city_ids.length > 0 ? el.city_ids.join(',') : '0';
            }
          });
          param.shippingTemplatesRegionRequestList = this.ruleForm.region;
          param.shippingTemplatesRegionRequestList.forEach((el, index) => {
            this.$delete(el, 'city_ids');
          });
          this.ruleForm.free.forEach((el, index) => {
            el.title = el.city_ids.length > 0 ? JSON.stringify(el.city_ids) : JSON.stringify([[0, 0]]);
            if (el.title === '[[0,0]]') {
              el.cityId = '0';
            } else {
              for (var i = 0; i < el.city_ids.length; i++) {
                el.city_ids[i].splice(0, 2);
              }
              el.cityId = el.city_ids.length > 0 ? el.city_ids.join(',') : '0';
            }
          });
          param.shippingTemplatesFreeRequestList = this.ruleForm.free;
          param.shippingTemplatesFreeRequestList.forEach((el, index) => {
            this.$delete(el, 'city_ids');
          });
          if (this.ruleForm.appoint === 2) {
            this.ruleForm.region.map((item, index) => {
              this.ruleForm.region[0].title = '[[0,0]]';
              this.ruleForm.region[0].cityId = '0';
            });
          }
          if (this.ruleForm.appoint === 0) {
            this.$delete(param, 'shippingTemplatesRegionRequestList');
            this.$delete(param, 'shippingTemplatesFreeRequestList');
            this.ruleForm.type = 0;
          }
          if (this.type === 0) {
            logistics
              .shippingSave(param)
              .then((res) => {
                this.$message.success('操作成功');
                this.$emit('getList');
                this.loading = false;
                this.$store.commit('product/SET_ShippingTemplates', []);
                this.handleClose();
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            logistics
              .shippingUpdate(param)
              .then((res) => {
                this.$message.success('操作成功');
                this.$store.commit('product/SET_ShippingTemplates', []);
                this.$emit('getList');
                this.handleClose();
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    }),
    clear() {
      this.ruleForm.name = '';
      this.ruleForm.sort = 0;
    },
  },
};
</script>

<style scoped lang="scss">
.demo-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.demo-drawer__content form {
  flex: 1;
  padding-bottom: 80px;
}
::v-deep .el-drawer__body {
  padding: 30px 0 70px 0;
}
.withs {
  width: 50%;
}
.tempBox {
  ::v-deep .el-input-number--mini {
    width: 100px !important;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
