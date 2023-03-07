<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.name" placeholder="症状名" clearable></el-input>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.part" placeholder="部位" clearable></el-input>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.people_classify" placeholder="人群分类" clearable></el-input>
        </el-col>
        <el-col :xs="16" :sm="8" :md="8" :lg="8">
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
          {{(searchData.page-1)*searchData.limit + scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="部位" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.part }}
        </template>
      </el-table-column>
      <el-table-column label="人群分类" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.people_classify }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="备注"  align="left">
        <template slot-scope="scope">
          {{ scope.row .description }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width" width="150px">
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

    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit" @pagination="getList" />
  </div>
</template>

<script>
  import { getList,del } from '@/api/symptom'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'symptom',
    components: { Pagination },
    data() {
      return {
        list: null,
        listLoading: true,
        total: 0,
        // 搜索
        searchData: {
          page: 1,
          limit: 10,
          name:"",
          part:"",
          people_classify:"",
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取列表
      getList() {
        this.listLoading = true;
        getList(this.searchData).then(response => {
          this.list = response.list;
          this.total = response.count;
        }).finally(() => {
        this.listLoading = false
      })
      },
      // 搜索
      search(){
        this.$set(this.searchData,'page',1);
        this.getList();
      },
      // 新增
      handleAdd(){
        this.$router.push('/product/addSymptom')
      },
      // 编辑
      handleUpdate(innerid){
        this.$router.push('/product/editSymptom/'+innerid);
      },
      // 删除
      async handleDelete(innerid){
        try{
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
        }
        catch (err) {
          this.listLoading = false;
          if(err !=='cancel'){
            this.$message.warning(err.message || '操作失败');
          }
        }
      }
    }
  }
</script>
