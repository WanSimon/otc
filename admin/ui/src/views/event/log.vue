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
            <el-option v-for="item in filterList" :key="item.innerid" :label="item.name"
                       :value="item.innerid"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="8" :sm="10" :md="6" :lg="6">
          <el-date-picker style="width:100%;" v-model="searchData.period" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.status" placeholder="请选择处理状态" style="width:100%;" clearable>
            <el-option v-for="(val,idx) in $conf.logStatus" :key="idx" :label="val" :value="idx"></el-option>
          </el-select>
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
          {{ (pageData.page - 1) * pageData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="所属商户" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_id | zget('value', 'label', merchantList) }}
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center">
        <template slot-scope="scope">
          {{ scope.row.equipment_id | zget('innerid', 'name', deviceData) }}
        </template>
      </el-table-column>
      <el-table-column label="事件类型" align="center">
        <template slot-scope="scope">
          {{ $conf.eventType[scope.row.type] || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="故障代码" align="center">
        <template slot-scope="scope">
          {{ scope.row.fault_code}}
        </template>
      </el-table-column>
      <el-table-column label="事件时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column label="内容" width="350" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==logStatus.LS_Unsettled? 'warning':'primary'">
            {{ scope.row.status==logStatus.LS_Unsettled?"未处理":'已处理'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleLogs(row.innerid)">
            {{row.status == logStatus.LS_Unsettled ? '处理':'处理明细'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageData.page" :limit.sync="pageData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
  import {getList} from '@/api/event'
  import Pagination from '@/components/Pagination'
  import SelectTree from "@/components/treeSelect";
  import {getMerchantTree} from '@/api/merchant';
  import {getDevicePairs} from '@/api/device'
  import {parseTime, parseTree, zget} from '@/utils/index';
  import {LogStatus} from '@/js/common';

  export default {
    name: 'logs',
    components: {Pagination, SelectTree},
    filters: {
      parseTime: parseTime,
      zget: zget,
    },
    data() {
      return {
        props: {                // 配置项（必选）
          value: 'value',
          label: 'label',
          children: 'children',
          // disabled:true
        },
        listLoading: true,
        merchantList: [],//商户列表
        merchantTree: [],//商户树
        deviceData: [],//设备列表
        filterList: [],//同一商户下的设备列表
        total: 0,
        // 搜索
        pageData: {
          page: 1,
          limit: 10,
        },
        searchData: {
          merchant_id: null,
          equipment_id: null,
          period: null,
          status: null
        },
        list: [],
        //错误事件处理状态
        logStatus: LogStatus,
      }
    },
    created() {
      this.getList();
      this.getOption()
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
        let obj = {}
        if (this.searchData.merchant_id) obj.merchant_id = this.searchData.merchant_id;
        if (this.searchData.equipment_id) obj.equipment_id = this.searchData.equipment_id;
        if (this.searchData.status) obj.status = this.searchData.status;
        if (this.searchData.period) obj.period = `${this.$moment(this.searchData.period[0]).format('YYYY-MM-DD HH:mm:ss')},${this.$moment(this.searchData.period[1]).add('days', 1).format('YYYY-MM-DD HH:mm:ss')}`
        this.listLoading = true;
        let parmas = {
          ...this.pageData,
          ...obj
        }
        getList(parmas).then(response => {
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
      //处理
      handleLogs(id) {
        this.$router.push('/event/handleLogs/' + id)
      }
    },

  }
</script>
