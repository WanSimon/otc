<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.type" placeholder="设备型号"
                    @keyup.enter.native="handleSearch" clearable/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.name" placeholder="设备型号名称"
                    @keyup.enter.native="handleSearch" clearable/>
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
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{(searchData.page-1)*searchData.limit + scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="设备型号" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="供应厂商" align="center">
        <template slot-scope="scope">
          {{ scope.row.manufacturer }}
        </template>
      </el-table-column>
      <el-table-column label="药道布局 (层数 x 列数)" align="center">
        <template slot-scope="{row,$index}">
          <span>{{ `${row.drug_channel.aisleY} x ${row.drug_channel.aisleX}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药道详情" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="viewChannel(row)">查看药道</el-button>
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
import {getList, del} from '@/api/deviceModel'

export default {
  components: {Pagination},
  name: "index",
  data() {
    return {
      total: 0,
      //搜索
      searchData: {
        page: 1,//第几页
        limit: 10,//每页数量，
        type: null,//设备型号
        name: null//设备型号名称
      },
      listLoading: false,//loading
      list: [],
    }
  },
  methods: {
    //获取列表数据
    getList() {
      let req = {...this.searchData}
      this.listLoading = true
      getList(req).then(res => {
        this.total = res.count
        this.list = res.list
        for (let item of this.list) {
          item.drug_channel = JSON.parse(item.drug_channel)
        }
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
    //编辑
    handleUpdate(innerid) {
      this.$router.push('/device/modelEdit/' + innerid)
    },
    // 新增
    handleAdd() {
      this.$router.push('/device/modelAdd')
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
          this.getList();
        }).catch(err => {
          this.$message.warning(err.message || '操作失败');
        }).finally(() => {
          this.listLoading = false
        })

      }).catch(() => {
      });
    },
    //查看药道详情
    viewChannel(row) {
      this.$router.push('/device/modelChannel/'+row.innerid);
    },
  },
  created() {
    this.getList()
  },
}
</script>

<style scoped>

</style>
