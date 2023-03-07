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
          <el-input v-model="searchData.phone" placeholder="手机号" clearable></el-input>
        </el-col>

        <el-col :xs="12" :sm="8" :md="8" :lg="8">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
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
      <el-table-column label="商户" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_name }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="名称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="真实姓名" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="150" align="center">
        <template slot-scope="scope">
            {{ scope.row.status ===1?"正常":"禁用" }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="性别" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.sex ===1?"男":"女" }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="生日" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.birthday | parseTime('{y}-{m}-{d}')}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="手机号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="身份证号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.idcard }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="来源" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.register_from ===1?"平台":"药机"}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="地址" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.addr }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit" @pagination="getList" />
  </div>
</template>

<script>
  import { getList } from '@/api/customer'
  import Pagination from '@/components/Pagination'
  import SelectTree from "@/components/treeSelect";
  import {parseTime, parseTree} from '@/utils/index';
  import { getMerchantTree } from '@/api/merchant';

  export default {
    name: 'member',
    components: { Pagination,SelectTree },
    filters: {
      parseTime: parseTime
    },
    data() {
      return {
        props:{                // 配置项（必选）
          value: 'value',
          label: 'label',
          children: 'children',
          // disabled:true
        },
        list: null,
        listLoading: true,
        total: 0,
        merchantTree:[],
        searchData: {
          page: 1,
          limit: 10,
          merchant_id:"",
          name:"",
          phone:"",
        },
      }
    },
    created() {
      this.getList();
      this.initMerchantTree();
    },
    methods: {
      //获取商户id
      getValue(value){
        this.searchData.merchant_id = value
      },
      // 获取商户
      initMerchantTree(){
        this.listLoading = true;
        getMerchantTree().then(response => {
          let merchantList = response
          this.merchantTree = parseTree(merchantList);
          this.listLoading = false;
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
