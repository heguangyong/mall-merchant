<template>
  <div class="divBox relative">
    <el-card
      :bordered="false"
      shadow="never"
      class="ivu-mt"
      :body-style="{ padding: 0 }"
      v-hasPermi="['merchant:seckill:product:list']"
    >
      <div class="padding-add">
        <el-form size="small" inline label-position="right" @submit.native.prevent>
          <el-form-item label="商品名称：">
            <el-input v-model="proName" placeholder="请输入商品名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input v-model="activityName" placeholder="请输入活动名称" class="selWidth" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品状态：" class="inline">
            <el-select
              v-model="tableFrom.proStatus"
              clearable
              placeholder="请选择"
              class="selWidth"
              @change="getList(1)"
            >
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动状态：" class="inline">
            <el-select
              v-model="tableFrom.activityStatus"
              clearable
              placeholder="请选择"
              class="selWidth"
              @change="getList(1)"
            >
              <el-option label="进行中" :value="1" />
              <el-option label="已结束" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card mt14" :body-style="{ padding: '0 20px 20px' }" shadow="never" :bordered="false">
      <el-tabs
        class="list-tabs"
        v-model="tableFrom.auditStatus"
        @tab-click="getList(1)"
        v-hasPermi="['merchant:seckill:product:list']"
      >
        <el-tab-pane :label="item.name" :name="item.type" v-for="(item, index) in headeNum" :key="index" />
      </el-tabs>
      <div class="mt5 mb20">
        <el-button size="small" @click="onEdit(0)" type="primary" v-hasPermi="['merchant:seckill:product:add']"
          >添加秒杀商品</el-button
        >
        <el-button
          v-show="tableFrom.auditStatus === '3'"
          v-hasPermi="['merchant:seckill:product:delete']"
          size="small"
          @click="batchDel"
          :disabled="!multipleSelection.length"
          >批量删除</el-button
        >
        <el-button
          v-hasPermi="['merchant:seckill:product:down']"
          v-if="tableFrom.auditStatus === '2'"
          size="small"
          @click="batchDown"
          :disabled="!multipleSelection.length"
          >批量下架</el-button
        >
      </div>
      <el-table
        v-loading="listLoading"
        :data="tableData.data"
        style="width: 100%"
        size="small"
        ref="multipleTable"
        row-key="id"
        class="tableSelection"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" width="45"></el-table-column>
        <el-table-column prop="id" label="ID" min-width="50" />
        <el-table-column label="商品图" min-width="80">
          <template slot-scope="scope">
            <div class="demo-image__preview line-heightOne">
              <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" min-width="180" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="categoryName" label="商品分类" min-width="100" />
        <el-table-column prop="activityName" label="活动名称" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="price" label="商品售价" min-width="90" />
        <el-table-column prop="seckillPrice" label="活动价" min-width="90" />
        <el-table-column prop="sort" label="排序" min-width="60" />
        <el-table-column label="商品状态" min-width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isShow">上架</el-tag>
            <el-tag v-else>下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" fixed="right" min-width="90">
          <template slot-scope="scope">
            <el-tag class="notStartTag tag-background" v-if="scope.row.activityStatus === 0">未开始</el-tag>
            <el-tag class="doingTag tag-background" v-if="scope.row.activityStatus === 1">进行中</el-tag>
            <el-tag class="endTag tag-background" type="info" v-if="scope.row.activityStatus === 2">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" fixed="right" min-width="90">
          <template slot-scope="scope">
            <el-tag class="doingTag tag-background" v-if="scope.row.auditStatus === 1">待审核</el-tag>
            <el-tag class="endTag tag-background" v-if="scope.row.auditStatus === 2">审核成功</el-tag>
            <el-tag class="notStartTag tag-background" type="info" v-if="scope.row.auditStatus === 3">审核失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableFrom.auditStatus === '3'"
          prop="reason"
          label="失败原因"
          fixed="right"
          min-width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <a @click="handleAudit(scope.row, 2)" v-hasPermi="['merchant:seckill:product:list']">详情</a>
            <template
              v-if="
                tableFrom.auditStatus === '2' &&
                checkPermi(['merchant:seckill:product:list', 'merchant:seckill:product:add'])
              "
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleAudit(scope.row, 3)">编辑</a>
            </template>
            <template
              v-if="tableFrom.auditStatus === '2' && scope.row.isShow && checkPermi(['merchant:seckill:product:down'])"
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleDown(scope.row, '下架')">下架</a>
            </template>
            <template
              v-if="tableFrom.auditStatus === '2' && !scope.row.isShow && checkPermi(['merchant:seckill:product:up'])"
            >
              <el-divider direction="vertical"></el-divider>
              <a @click="handleDown(scope.row, '上架')">上架</a>
            </template>
            <template v-if="tableFrom.auditStatus === '1' && checkPermi(['merchant:seckill:product:withdraw'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleWithdraw(scope.row)">撤回审核</a>
            </template>
            <template v-if="tableFrom.auditStatus === '3' && checkPermi(['merchant:seckill:product:delete'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="handleDelete(scope.row)">删除</a>
            </template>
            <template v-if="tableFrom.auditStatus === '3' && checkPermi(['merchant:seckill:product:add'])">
              <el-divider direction="vertical"></el-divider>
              <a @click="onEdit(1, scope.row)">重新提交</a>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          background
          :page-sizes="$constants.page.limit"
          :page-size="tableFrom.limit"
          :current-page="tableFrom.page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="pageChange"
        />
      </div>
    </el-card>
    <!--秒杀商品 审核 详情-->
    <el-drawer direction="rtl" :visible.sync="dialogVisible" size="1000px" @close="close('ruleForm')">
      <div v-loading="loading">
        <div class="detailHead">
          <div class="acea-row row-between headerBox">
            <div class="full">
              <img class="order_icon" :src="seckillInfo.image" alt="" />
              <div class="text">
                <div class="title">{{ seckillInfo.name }}</div>
                <div>
                  <span class="mr20">商品ID：{{ seckillInfo.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="detailSection padBox">
          <div class="title">活动信息</div>
          <ul class="list">
            <li class="item">
              <div class="tips">活动名称：</div>
              <div class="value">{{ seckillInfo.activityName }}</div>
            </li>
            <li class="item">
              <div class="tips">活动状态：</div>
              <div class="value">{{ seckillInfo.activityStatus | activityStatusFilter }}</div>
            </li>
            <li class="item">
              <div class="tips">审核状态：</div>
              <div class="value">
                {{ seckillInfo.auditStatus == 1 ? '待审核' : seckillInfo.auditStatus == 2 ? '审核通过' : '审核失败' }}
              </div>
            </li>
            <li class="item">
              <div class="tips">商品分类：</div>
              <div class="value">{{ seckillInfo.categoryName }}</div>
            </li>
          </ul>
        </div>
        <div class="detailSection padBox">
          <div class="title">商品信息</div>
          <div class="item mb20">
            <div class="tips">商品名称：</div>
            <div class="value">{{ seckillInfo.name }}</div>
          </div>
          <div style="width: 100%">
            <el-table
              ref="tableList"
              row-key="id"
              :data="seckillInfo.attrValue"
              v-loading="listLoading"
              size="mini"
              border
              default-expand-all
              :tree-props="{ children: 'children' }"
              style="width: 100%"
            >
              <el-table-column min-width="140" label="商品信息">
                <template slot-scope="scope">
                  <div class="acea-row">
                    <div class="demo-image__preview mr10 line-heightOne">
                      <el-image :src="scope.row.image" :preview-src-list="[scope.row.image]" />
                    </div>
                    <div class="row_title line2">{{ scope.row.sku }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="otPrice" label="售价" width="120" />
              <el-table-column prop="quotaShow" label="限量" width="80" />
              <el-table-column prop="quota" label="限量剩余" width="120" />
              <el-table-column prop="price" label="活动价格" min-width="120">
                <template slot-scope="scope">
                  <el-input-number
                    :disabled="isShow < 3"
                    v-model="scope.row.price"
                    type="number"
                    :precision="2"
                    :min="0"
                    :max="99999"
                    :controls="false"
                    class="input_width"
                  >
                  </el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-show="isShow === 3" class="px35">
          <el-button
            size="small"
            class="mb20"
            type="primary"
            @click="setPrice(seckillInfo.id, seckillInfo.attrValue)"
            v-hasPermi="['merchant:seckill:product:price']"
            >保存活动价</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  seckillProListApi,
  seckillProSetPriceApi,
  seckillProDelApi,
  seckillProDownApi,
  seckillProUpApi,
  seckillProWithdrawApi,
} from '@/api/marketing';
import { checkPermi } from '@/utils/permission';
import { handleDeleteTable } from '@/libs/public'; // 权限判断函数
export default {
  name: 'SeckillList',
  data() {
    return {
      listLoading: false,
      tableData: {
        data: [],
        total: 0,
      },
      proName: '',
      activityName: '',
      tableFrom: {
        page: 1,
        limit: this.$constants.page.limit[0],
        proName: '',
        activityName: '',
        auditStatus: '2',
        activityStatus: '',
        proStatus: '',
      },
      headeNum: [
        {
          name: '审核成功',
          type: '2',
        },
        {
          name: '待审核',
          type: '1',
        },
        {
          name: '审核失败',
          type: '3',
        },
      ],
      multipleSelection: [],
      dialogVisible: false,
      seckillInfo: {},
      isShow: 0, //1审核，2查看，3编辑
      loading: false,
      id: '', //秒杀商品id
    };
  },
  mounted() {
    if (checkPermi(['merchant:seckill:product:list'])) this.getList(1);
    this.$store.dispatch('product/getAdminProductClassify');
  },
  methods: {
    checkPermi,
    //表格选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查看编辑
    handleAudit(row, n) {
      this.id = row.id;
      this.isShow = n;
      this.dialogVisible = true;
      this.seckillInfo = row;
    },
    close(refName) {
      this.dialogVisible = false;
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    //重新提交
    onEdit(num, item) {
      if (num === 0) {
        this.$cache.local.remove('seckillData');
      } else {
        localStorage.setItem('seckillData', JSON.stringify(item));
      }
      this.$router.push({ path: '/marketing/seckill/creatSeckill' });
    },
    //撤回审核
    handleWithdraw(row) {
      this.$modalSure('撤回审核秒杀商品吗？').then(() => {
        seckillProWithdrawApi(row.id).then((res) => {
          this.getList();
        });
      });
    },
    handleReset() {
      this.tableFrom.proName = '';
      this.tableFrom.activityName = '';
      this.tableFrom.activityStatus = '';
      this.tableFrom.proStatus = '';
      this.activityName = '';
      this.proName = '';
      this.getList(1);
    },
    // 列表
    getList(num) {
      this.tableFrom.page = num ? num : this.tableFrom.page;
      this.tableFrom.activityName = encodeURIComponent(this.activityName);
      this.tableFrom.proName = encodeURIComponent(this.proName);
      this.listLoading = true;
      seckillProListApi(this.tableFrom)
        .then((res) => {
          this.tableData.data = res.list;
          this.tableData.total = res.total;
          this.listLoading = false;
        })
        .catch((res) => {
          this.listLoading = false;
        });
    },
    batchDel() {
      let ids = this.multipleSelection.map((item) => item.id).toString();
      this.$modalSure('批量删除秒杀商品吗？').then(() => {
        seckillProDelApi({ ids: ids }).then(() => {
          this.$message.success('删除成功');
          this.getList();
        });
      });
    },
    // 删除
    handleDelete(row) {
      this.$modalSure('删除该秒杀商品吗？').then(() => {
        seckillProDelApi({ ids: row.id }).then(() => {
          this.$message.success('删除成功');
          handleDeleteTable(this.tableData.data.length, this.tableFrom);
          this.getList();
        });
      });
    },
    batchDown() {
      let ids = this.multipleSelection.map((item) => item.id).toString();
      this.$modalSure('批量下架秒杀商品吗？').then(() => {
        seckillProDownApi({ ids: ids }).then(() => {
          this.$message.success('下架成功');
          this.getList();
        });
      });
    },
    handleDown(row, title) {
      this.$modalSure(`${title}该秒杀商品吗？`).then(() => {
        row.isShow
          ? seckillProDownApi({ ids: row.id }).then(() => {
              this.$message.success(`${title}成功`);
              this.getList();
            })
          : seckillProUpApi({ ids: row.id }).then(() => {
              this.$message.success(`${title}成功`);
              this.getList();
            });
      });
    },
    pageChange(page) {
      this.tableFrom.page = page;
      this.getList();
    },
    handleSizeChange(val) {
      this.tableFrom.limit = val;
      this.getList();
    },
    setPrice(id, row) {
      let productList = {
        productList: [
          {
            attrValue: row.map((item) => {
              return {
                activityPrice: item.price,
                id: item.id,
              };
            }),
            id: id,
          },
        ],
      };
      seckillProSetPriceApi(productList)
        .then((res) => {
          this.$message.success('添加成功');
          this.getList();
          this.dialogVisible = false;
        })
        .catch((res) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.px35 {
  padding: 0 35px;
}
.row_title {
  width: 246px;
}
.demo-drawer__content {
  padding: 0 30px;
}
</style>
