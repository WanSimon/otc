<template>
  <div class="chart-card-container">
    <el-row>
      <div class="total">总成交额</div>
    </el-row>
    <el-row :gutter="10" class="panel-group">
      <el-col :xs="12" :sm="24" :md="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-total-money">
            <svg-icon icon-class="money" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              总成交额
            </div>
            <count-to :start-val="0" :end-val="totalAmount" :duration="1200" class="card-panel-num" :decimals="2"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="24" :md="12" :lg="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-month-money">
            <svg-icon icon-class="money" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              本月成交额
            </div>
            <count-to :start-val="0" :end-val="monthAmount" :duration="1200" class="card-panel-num" :decimals="2"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div class="total">药品销量排行榜/月
        <span style="padding-left: 5px; color: #8c939d;font-weight: bold">- {{new Date() | parseTime('{y}.{m}')}}</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        height="317px">
        <el-table-column align="center" label="排名" width="100">
          <template slot-scope="scope">
            {{(searchData.page-1)*searchData.limit + scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="药品名称" min-width="150" align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="销售数" align="center">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <!--        <el-table-column label="月同比" sortable align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.people_classify }}-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
      <pagination style="text-align: right;" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                  @pagination="getProductSales"/>
    </el-row>
  </div>
</template>

<script>
  import {totalTurnover, productSales} from '@/api/dashboard'
  import {parseTime} from '@/utils/index'
  import CountTo from 'vue-count-to'
  import Pagination from '@/components/Pagination'

  export default {
    name: "total_turnover",
    components: {Pagination, CountTo},
    filters: {parseTime},
    data() {
      return {
        listLoading: false,
        total: 0,
        // 搜索
        searchData: {
          page: 1,
          limit: 10,
        },
        list: [],
        totalAmount: null,
        monthAmount: null,
      }
    },
    methods: {
      //总成交额
      async getTotalAmount() {
        return totalTurnover().then(res => {
          const data = res;
          this.totalAmount = data.total_amount / 100 || 0;
          this.monthAmount = data.month_amount / 100 || 0;
        }).catch(err => {
          this.$message.warning(err.message);
        })
      },
      //药品排行
      async getProductSales() {
        let req = {...this.searchData}
        return productSales(req).then(res => {
          this.list = res.list;
          this.total = res.count;
        }).catch(err => {
          this.$message.warning(err.message);
        })
      },
      // 搜索
      search() {
        this.$set(this.searchData, 'page', 1);
        this.getProductSales();
      },
    },
    async mounted() {
      await this.getTotalAmount();
      await this.getProductSales();
    }
  }
</script>

<style scoped lang="scss">
  .total {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding: 5px 0px 5px 0px;
    border-bottom: 2px solid #d8dadc;
  }

  .title {
    margin: 20px 0px 5px 0px;
    height: 50px;

    .text {
      font-size: 14px;
      color: #8c939d;

    }

    .card-panel-num {
      font-size: 20px;
    }
  }

  .pb_05 {
    padding-bottom: 5px;
  }

  .panel-group {
    .card-panel-col {
      margin-bottom: 32px;
    }

    margin-top: 18px;

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 0px 2px 10px rgba(194, 191, 191, 0.5);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 10px;

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-total-money {
          background: #F4516C;
        }

        .icon-month-money {
          background: #FBD437;
        }

      }

      .icon-total-money {
        color: #F4516C;
      }

      .icon-month-money {
        color: #FBD437;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

</style>
