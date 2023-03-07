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
          <el-select v-model="searchData.equipment_id" placeholder="请选择设备" style="width:100%;" clearable>
            <el-option v-for="item in filterList" :key="item.innerid" :label="item.name" :value="item.innerid"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.op_type" placeholder="请选择类型" style="width:100%;" clearable>
            <el-option v-for="(item,idx) in opType" :key="idx" :label="item" :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.errcode" placeholder="请选择操作结果" style="width:100%;" clearable>
            <el-option v-for="item in opRes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-date-picker style="width:100%;" v-model="searchData.period" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4">
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
          {{(pageData.page-1)*pageData.limit + scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="所属商户" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_id | zget('value', 'label', merchantList) }}
        </template>
      </el-table-column>
      <el-table-column label="设备" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.equipment_id | zget('innerid', 'name', deviceData) }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="200" align="center">
        <template slot-scope="scope">
          {{ opType[scope.row.op_type] }}
        </template>
      </el-table-column>
      <el-table-column label="药道号" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.slot_no }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.number }}
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.op_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
        </template>
      </el-table-column>
      <el-table-column prop="errcode" label="操作结果">
        <template slot-scope="scope">
          <div v-if="scope.row.errcode === -1 ">
            <el-tag type="danger">失败</el-tag>
          </div>
          <div v-else>
            <el-tag type="success">成功</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageData.page" :limit.sync="pageData.limit" @pagination="getList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SelectTree from "@/components/treeSelect";
import {getStockEventList} from '@/api/stock';
import {getMerchantTree} from '@/api/merchant';
import {getDevicePairs} from "@/api/device";
import {parseTime, parseTree, zget} from "@/utils";

export default {
  name: 'logs',
  components: {Pagination,SelectTree},
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
        // disabled:true
      },
      opRes: [{
        value: '0',
        label: '成功'
      }, {
        value: '-1',
        label: '失败'
      }],
      list: [],
      listLoading: true,
      merchantList: [],//商户列表
      merchantTree: [],//商户树
      deviceData: [],//设备列表
      filterList: [],//同一商户下的设备列表
      opType:this.$conf.stockOpType.filter((item, idx) => {return idx <= 2}),
      total: 0,
      // 搜索
      pageData: {
        page: 1,
        limit: 10,
      },
      searchData: {
        merchant_id: null,
        equipment_id: null,
        op_type: null,
        errcode: null,
        period: null,
      },
    }
  },
  created() {
    this.getList();
    this.getOption()
  },
  methods: {
    //获取商户id
    getValue(value){
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
    //获取商户和设备组
    getOption() {
      Promise.all([getMerchantTree(), getDevicePairs()]).then(res => {
        this.merchantList = res[0];
        this.merchantTree = parseTree(this.merchantList);
        this.deviceData = this.filterList = res[1];
      }).catch(err => {
        this.$message.warning(err);
      })
    },
    // 获取列表
    getList() {
      let period = null;
      if (this.searchData.period) period = `${this.$moment(this.searchData.period[0]).format('YYYY-MM-DD HH:mm:ss')},${this.$moment(this.searchData.period[1]).add('days', 1).format('YYYY-MM-DD HH:mm:ss')}`
      this.listLoading = true;
      let parmas = {
        ...this.pageData,
        ...this.searchData,
        period:period,
      }
      getStockEventList(parmas).then(response => {
        this.list = response.list;
        this.total = response.count;
      }).finally(() => {
        this.listLoading = false
      })
    },
    // 搜索
    search() {
      this.$set(this.pageData, 'page', 1);
      this.getList();
    },
  }
}
</script>
