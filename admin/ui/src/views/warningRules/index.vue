<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
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
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
      highlight-current-row>
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{(searchData.page-1)*searchData.limit + scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="商户" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_name }}
        </template>
      </el-table-column>
      <el-table-column label="规则名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="预警类型" align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ $conf.warningType[scope.row.type] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.innerid)">
            编辑
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
import Pagination from '@/components/Pagination/index'
import SelectTree from "@/components/treeSelect";
import {getList, del} from '@/api/warningRules'
import {getMerchantTree} from "@/api/merchant";
import {parseTree} from "@/utils";

export default {
  components: { Pagination,SelectTree },
  name: "index",
  data() {
    return {
      props:{                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      total: 0,
      //搜索
      searchData: {
        page: 1,//第几页
        limit: 10,//每页数量，
        merchant_id: null,//商家
      },
      listLoading: false,//loading
      merchantTree: [],//商户树
      list: [],
    }
  },
  methods: {
    //获取商户id
    getValue(value){
      this.searchData.merchant_id = value
    },
    //获取列表数据
    getList() {
      let req = {...this.searchData}
      this.listLoading = true
      getList(req).then(res => {
        this.total = res.count
        this.list = res.list
      }).catch(err => {
        this.$message.warning(err.message || '获取列表数据失败, 请点击搜索重新加载列表数据');
      }).finally(() => {
        this.listLoading = false
      })
    },
    //搜索
    handleSearch() {
      this.searchData.page = 1
      this.getList()
    },
    // 获取商户s
    getMerchantTree() {
      getMerchantTree().then(res => {
        let merchantList = res;
        this.merchantTree = parseTree(merchantList);
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    //编辑
    handleUpdate(innerid) {
      this.$router.push('/warning/rulesEdit/' + innerid)
    },
    // 新增
    handleAdd() {
      this.$router.push('/warning/rulesAdd')
    },
    //删除
    handleDelete(innerid) {
      this.$confirm('确定删除该条数据吗? 此操作不可逆, 请谨慎操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        del(innerid).then(res => {
          this.$message.success('操作成功');
          this.listLoading = false
          this.getList();
        }).catch(err => {
          this.$message.warning(err.message || '操作失败');
          this.listLoading = false
        })
      }).catch(() => {
      });
    }
  },
  created() {
    this.getList()
    this.getMerchantTree()
  },
}
</script>

<style scoped>

</style>
