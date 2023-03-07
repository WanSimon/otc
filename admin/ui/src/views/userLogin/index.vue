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
          <el-select v-model="searchData.equipment_id" placeholder="请选择设备" clearable style="width:100%;">
            <el-option v-for="item in filterList" :key="item.innerid" :label="item.name"
                       :value="item.innerid"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
      <el-table-column align="center" label="设备" prop="device_name"></el-table-column>
      <el-table-column align="center" label="登录人" prop="op_name"></el-table-column>
      <el-table-column align="center" label="登录类型" prop="login_type">
        <template slot-scope="scope">
          {{ $conf.loginType[scope.row.login_type]}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录时间" prop="login_time">
        <template slot-scope="scope">
          {{ scope.row.login_time | parseTime}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="登出时间" prop="logout_time">
        <template slot-scope="scope">
          {{ scope.row.logout_time | parseTime}}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {userLogin} from '@/api/user';
  import {getMerchantTree} from "@/api/merchant";
  import {getDevicePairs} from "@/api/device";
  import {parseTime, parseTree} from '@/utils/index';
  import Pagination from "@/components/Pagination/index";
  import SelectTree from "@/components/treeSelect";

  export default {
    name: "index",
    components: {Pagination, SelectTree},
    filters: {parseTime},
    data() {
      return {
        props: {                // 配置项（必选）
          value: 'value',
          label: 'label',
          children: 'children',
        },
        total: 0,
        //搜索
        searchData: {
          page: 1,//第几页
          limit: 10,//每页数量
          equipment_id: null,
          merchant_id: null,
        },
        listLoading: false,//loading
        list: [],
        merchantList: [],//商户列表
        merchantTree: [],//商户数
        deviceData: [],//设备列表
        filterList: [],//同一商户下的设备列表
      }
    },
    methods: {
      // 取值
      getValue(value) {
        this.searchData.merchant_id = value;
        if (value) {
          //获取商户下的设备
          this.filterList = this.deviceData.filter(item => {
            return item.merchant_id == value;
          })
          this.$set(this.searchData, 'equipment_id', '');
        } else {
          this.filterList = this.deviceData;
        }
      },
      //获取商户和设备
      getOption() {
        return Promise.allSettled([getMerchantTree(), getDevicePairs()]).then(res => {
          if (res[0].status == "fulfilled") {
            this.merchantList = res[0].value;
            this.merchantTree = parseTree(this.merchantList);
          } else {
            this.$message.warning(res[0].reason);
          }
          if (res[1].status == "fulfilled") {
            this.deviceData = this.filterList = res[1].value;
          } else {
            this.$message.warning(res[1].reason);
          }
        })
      },
      //获取列表数据
      getList() {
        let req = {...this.searchData}
        this.listLoading = true
        return userLogin(req).then(res => {
          this.total = res.count;
          this.list = res.list;
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
    },
    async created() {
      await this.getOption();
      await this.getList();
    },
  }
</script>

<style scoped>

</style>
