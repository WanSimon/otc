<template>
  <div class="app-container" style="background-color: #EFF1F4;height: calc(100% - 50px)">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="10" :md="10" :lg="10" class="col-mb">
        <div class="card">
          <total-turnover></total-turnover>
        </div>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14" :lg="14" class="col-mb">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="16" class="col-mb">
            <div class="card">
              <order-quantity></order-quantity>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="8" class="col-mb">
            <div class="card">
              <member></member>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" class="col-mb">
            <div class="card">
              <distribution></distribution>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="14" :md="14" :lg="14" class="col-mb">
        <div class="card">
          <eqt-overview></eqt-overview>
        </div>
      </el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="10" class="col-mb">
        <div class="card">
          <eqt-map></eqt-map>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TotalTurnover from './modules/total_turnover'
  import OrderQuantity from './modules/order_quantity'
  import Member from './modules/member'
  import distribution from './modules/distribution'
  import EqtOverview from './modules/overview'
  import EqtMap from './modules/china_map'

  export default {
    components: {TotalTurnover, OrderQuantity, Member,distribution,EqtOverview,EqtMap},
    data() {
      return {}
    },
    methods: {},
    async created() {
    },
  }
</script>

<style scoped lang="scss">
  .card {
    background-color: #ffffff;
  }

  .col-mb {
    margin-bottom: 10px;
  }
</style>
