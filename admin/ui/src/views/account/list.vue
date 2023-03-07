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
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.name" placeholder="名称" clearable></el-input>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.login_id" placeholder="登录名" clearable></el-input>
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
          {{(searchData.page-1)*searchData.limit + scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="所属商户" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_id | zget('value', 'label', merchantList) }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="姓名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="登录名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.login_id }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="200" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isvalid ===1?'success':'info'">
            {{ scope.row.isvalid ===1?"有效":"无效" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="角色">
        <template slot-scope="scope">
          <span v-for="item in  scope.row.account_role.split(',')">
          <el-tag style="margin-right: 5px">{{ item | zget('innerid', 'name', roleData) }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width" width="220px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.innerid)">
            编辑
          </el-button>
          <el-button v-if="row.isvalid===1" size="mini" type="warning" @click="updateStatus(row.innerid,row.isvalid)">
            禁用
          </el-button>
          <el-button v-if="row.isvalid===0" size="mini" type="success" @click="updateStatus(row.innerid,row.isvalid)">
            启用
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
  import Pagination from '@/components/Pagination';
  import SelectTree from "@/components/treeSelect";
  import {parseTime, parseTree,zget} from '@/utils/index';
  import { getMerchantTree } from '@/api/merchant';
  import { getList,del,updateStatus } from '@/api/account';
  import { getRolePairs } from '@/api/role';

  export default {
    name: 'account',
    components: { Pagination,SelectTree },
    filters: {
      parseTime: parseTime,
      zget: zget,
    },
    data() {
      return {
        props:{                // 配置项（必选）
          value: 'value',
          label: 'label',
          children: 'children',
        },
        roleData:[],
        list: null,
        listLoading: true,
        total: 0,
        // 商户列表
        merchantList: [],
        // 商户树
        merchantTree:[],
        searchData: {
          page: 1,
          limit: 10,
          merchant_id:"",
          name:"",
          login_id:"",
        },
      }
    },
    created() {
      this.getList();
      this.initMerchantTree();
      this.getRoleParis()
    },
    methods: {
      //获取商户id
      getValue(value){
        this.searchData.merchant_id = value
      },
      // 新增
      handleAdd(){
        this.$router.push('/account/addAccount');
      },
      // 编辑
      handleUpdate(innerid){
        this.$router.push('/account/editAccount/'+innerid);
      },
      // 启用/禁用
      async updateStatus(innerid,isvalid){
        try{
          let title = isvalid?"禁用":"启用";
          await this.$confirm(`确认${title}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
          this.listLoading = true;
          isvalid = isvalid?0:1;
          await updateStatus(innerid,{isvalid});
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
      },
      handleDelete(innerid){
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
      },
      // 获取商户
      initMerchantTree(){
        this.listLoading = true;
        getMerchantTree().then(res => {
          this.merchantList = res
          this.merchantTree = parseTree(this.merchantList)
          this.listLoading = false;
        })
      },
      //获取角色
      getRoleParis(){
        getRolePairs().then(res=>{
          this.roleData=res
        }).catch(err=>{
          this.$message.warning(err.message)
        })
      },
      // 搜索
      search(){
        this.$set(this.searchData,'page',1);
        this.getList();
      },
      // 获取列表
      getList() {
        this.listLoading = true;
        getList(this.searchData).then(response => {
          this.list = response.list;
          this.total = response.count;
          this.listLoading = false;
        })
      },
    }
  }
</script>
