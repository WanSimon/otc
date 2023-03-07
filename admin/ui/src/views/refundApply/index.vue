<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.serial_no" placeholder="订单流水号"
                    @keyup.enter.native="handleSearch" clearable/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.status" placeholder="状态" clearable style="width:100%;">
            <el-option v-for="(val, idx) in $conf.refundApplyStatus" :key="idx" :label="val"
                       :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-date-picker style="width:100%;" v-model="searchData.period" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4">
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
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ (searchData.page - 1) * searchData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="订单流水号" align="center">
        <template slot-scope="scope">
          {{ scope.row.serial_no }}
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="客户电话" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ?'success':'warning'">
            {{ $conf.refundApplyStatus[scope.row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center">
        <template slot-scope="scope">
          {{ parseTime(scope.row.created_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" min-width="100px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="refundApply(row)">申请退款</el-button>
          <el-button type="primary" size="mini" @click="handle(row.innerid)">
            {{ row.status === refundApplyStatus.RAS_Settled ? '明细' : '处理' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
import {getList} from '@/api/refundApply'
import Pagination from '@/components/Pagination/index'
import {parseTime} from "@/utils";
import {RefundApplyStatus} from "@/js/common";

export default {
  components: {Pagination},
  name: "index",
  data() {
    return {
      refundApplyStatus: RefundApplyStatus,
      total: 0,
      //搜索
      searchData: {
        page: 1,//第几页
        limit: 10,//每页数量，
        serial_no: null,
        status: null,
        period: null
      },
      listLoading: false,//loading
      list: [],
    }
  },
  methods: {
    parseTime: parseTime,
    //获取列表数据
    getList() {
      let period = '';
      if (this.searchData.period) period = `${this.$moment(this.searchData.period[0]).format('YYYY-MM-DD HH:mm:ss')},${this.$moment(this.searchData.period[1]).add('days', 1).format('YYYY-MM-DD HH:mm:ss')}`
      let req = {...this.searchData, period: period}
      this.listLoading = true
      getList(req).then(res => {
        this.total = res.count
        this.list = res.list
      }).catch(err => {
        this.$message.warning(err.message || '获取列表数据失败, 请点击搜索重新加载列表数据')
      }).finally(() => {
        this.listLoading = false
      })
    },
    //搜索
    handleSearch() {
      this.$set(this.searchData, 'page', 1);
      this.getList()
    },
    handle(innerid) {
      this.$router.push('/report/refund/apply/handle/' + innerid);
    },
    //申请退款
    refundApply(row) {
      this.$router.push({path: '/report/order', query: {serial_no:row.serial_no,}
      })
    }
  },
  created() {
    this.getList()
  },
}
</script>

<style scoped>

</style>
