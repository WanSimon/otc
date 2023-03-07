<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.version_no" placeholder="版本号" clearable></el-input>
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
          {{ (searchData.page - 1) * searchData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="版本号" prop="version_no"></el-table-column>
      <el-table-column align="center" label="上一个版本id" prop="previous_version_id">
        <template slot-scope="scope">
          {{ scope.row.previous_version_id | zget('innerid','version_no',version) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最低兼容版本" prop="compatible_version_id">
        <template slot-scope="scope">
          {{ scope.row.compatible_version_id | zget('innerid','version_no',version)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="apk MD5" prop="apk_md5"></el-table-column>
      <el-table-column align="center" label="是否最新版本" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_latest ?'success':'info'">
            {{ scope.row.is_latest ? '是':'否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
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
  import {getList, del, versionKey} from '@/api/version';
  import {zget} from '@/utils/index';
  import Pagination from "@/components/Pagination/index";

  export default {
    name: "index",
    components: {Pagination},
    filters: {zget},
    data() {
      return {
        total: 0,
        //搜索
        searchData: {
          page: 1,//第几页
          limit: 10,//每页数量
          version_no: null,//版本号
        },
        listLoading: false,//loading
        list: [],
        version: [],
      }
    },
    methods: {
      async getVersionKey() {
        try {
          let dataList = await versionKey({innerid: this.innerid});
          this.version = dataList;
        } catch (err) {
          this.$message.warning(err.message || "获取数据失败");
        }
      },
      //获取列表数据
      async getList() {
        let req = {...this.searchData}
        this.listLoading = true
        return getList(req).then(res => {
          this.total = res.count
          this.list = res.list
        }).catch(e => {
          this.$message({message: e.message || '获取列表数据失败, 请点击搜索重新加载列表数据'});
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
        this.$router.push('/system/versionEdit/' + innerid);
      },
      // 新增
      handleAdd() {
        this.$router.push('/system/versionAdd');
      },
      //删除
      handleDelete(innerid) {
        this.$confirm('确定删除该条数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          del(innerid).then(res => {
            this.$message({message: '操作成功', type: 'success'});
            this.listLoading = false
            this.getList();
          }).catch(err => {
            this.$message({message: err.message || '操作失败', type: 'warning'});
            this.listLoading = false
          })
        }).catch(() => {
        });
      }
    },
    async created() {
      await this.getVersionKey();
      await this.getList()
    },
  }
</script>

<style scoped>

</style>
