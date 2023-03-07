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
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
      border
      stripe
      fit
      highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            v-loading="listLoading"
            :data="detailList"
            element-loading-text="Loading"
            border>
            <el-table-column label="药品" align="center" prop="product_name"></el-table-column>
            <el-table-column label="商品编码" align="center" prop="product_no"></el-table-column>
            <el-table-column label="槽位号" align="center" prop="slot_no"></el-table-column>
            <el-table-column label="当前库存" align="center" prop="real_stock"></el-table-column>
            <el-table-column label="补货数量" align="center" prop="actual_number"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ (searchData.page - 1) * searchData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="商户" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_id | zget('value', 'label', merchantList) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="设备" prop="device_name"></el-table-column>
      <el-table-column align="center" label="补货单号" prop="replenish_no"></el-table-column>
      <el-table-column align="center" label="操作时间" prop="op_time">
        <template slot-scope="scope">
          {{ scope.row.op_time | parseTime('{y}-{m}-{d}')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人" prop="op_name"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {getList, getDetail} from '@/api/replenish'
  import {getMerchantTree} from "@/api/merchant";
  import {getDevicePairs} from "@/api/device";
  import {parseTree, zget, parseTime} from '@/utils/index';
  import Pagination from "@/components/Pagination/index";
  import SelectTree from "@/components/treeSelect";

  export default {
    name: "index",
    components: {Pagination, SelectTree},
    filters: {zget, parseTime},
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
          merchant_id: null,
          equipment_id: null,
        },
        listLoading: false,//loading
        merchantList: [],//商户列表
        merchantTree: [],//商户树
        list: [],
        detailList: [],
        deviceData: [],//设备列表
        filterList: [],//同一商户下的设备列表
        expands: [],//展开行的 keys 数组
      }
    },
    methods: {
      //获取商户id
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
        this.listLoading = true;
        return getList(req).then(res => {
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
        this.searchData.page = 1;
        this.getList();
      },
      //展开行
      getRowKeys(row) {
        return row.innerid;
      },
      expandChange(row, expandedRows) {
        if (expandedRows.length) {
          this.expands = [];
          if (row) {
            this.expands.push(row.innerid);
            //获取药品详情列表
            this.getDetailList(row.innerid);
          }
        } else {
          this.expands = [];
        }
      },
      getDetailList(id) {
        this.detailList = [];
        if (id) {
          getDetail({replenish_id: id}).then(res => {
            const data = res;
            this.detailList = data;
          }).catch(err => {
            this.$message({message: err.message || '获取列表数据失败, 请点击搜索重新加载列表数据'});
          })
        }
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
