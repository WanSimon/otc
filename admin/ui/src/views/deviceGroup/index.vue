<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.no" placeholder="编号" clearable></el-input>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.name" placeholder="设备组名称" clearable></el-input>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <SelectTree
            placeholder="请选择商户"
            style="width: 100%"
            :props="props"
            :options="merchantTree"
            :value="searchData.merchant_id"
            @getValue="getValue($event)"/>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ (searchData.page - 1) * searchData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="名称" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="商户" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_name }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="联系人" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.contacts }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="联系电话" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" min-width="150" align="center">
        <template slot-scope="scope">
          <div :class="[scope.row.isenable ===1?'icon-hook-on':'icon-ban']">
            <el-tooltip class="item" effect="dark" :content="scope.row.isenable ===1?'启用':'禁用'" placement="top">
              <svg-icon :icon-class="scope.row.isenable ===1?'hook':'ban'" class-name="svg-style"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.innerid)">
            编辑
          </el-button>
          <el-button v-if="row.isenable===1" size="mini" type="warning" @click="updateStatus(row.innerid,row.isenable)">
            禁用
          </el-button>
          <el-button v-if="row.isenable===0" size="mini" type="success" @click="updateStatus(row.innerid,row.isenable)">
            启用
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.innerid)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
import {getList, del, updateStatus} from '@/api/deviceGroup'
import {getMerchantTree} from "@/api/merchant";
import {parseTree} from '@/utils/index'
import Pagination from '@/components/Pagination'
import SelectTree from "@/components/treeSelect";

export default {
  name: 'deviceGroup',
  components: {Pagination, SelectTree},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      props: {                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      list: null,
      listLoading: true,
      total: 0,
      searchData: {
        page: 1,
        limit: 10,
        name: null,
        no: null,
        merchant_id: null,
      },
      merchantTree: []
    }
  },
  created() {
    this.initMerchantTree();
    this.getList();
  },
  methods: {
    //获取商户id
    getValue(value) {
      this.searchData.merchant_id = value
    },
    search() {
      this.$set(this.searchData, 'page', 1);
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getList(this.searchData).then(response => {
        this.list = response.list;
        this.total = response.count;
        this.listLoading = false
      })
    },
    handleUpdate(innerid) {
      this.$router.push('/device/groupEdit/' + innerid);
    },
    handleAdd() {
      this.$router.push('/device/groupAdd');
    },
    async handleDelete(innerid) {
      try {
        await this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        this.listLoading = true;
        await del(innerid);
        this.$message.success('操作成功');
        this.listLoading = false;
        this.getList();
      } catch (err) {
        this.listLoading = false;
        if (err !== 'cancel') {
          this.$message.warning(err.message || '操作失败');
        }
      }
    },
    async updateStatus(innerid, isenable) {
      try {
        let title = isenable ? "禁用" : "启用";
        await this.$confirm(`确认${title}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        this.listLoading = true;
        isenable = isenable ? 0 : 1;
        await updateStatus(innerid, {isenable});
        this.$message.success('操作成功');
        this.listLoading = false;
        this.getList();
      } catch (err) {
        this.listLoading = false;
        if (err !== 'cancel') {
          this.$message.warning(err.message || '操作失败');
        }
      }
    },
    async initMerchantTree() {
      let dbData = await getMerchantTree();
      this.merchantTree = parseTree(dbData);
    },
  }
}
</script>
