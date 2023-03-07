<template>
  <div class="chart-card-container" style="min-height: 510px">
    <div class="total">设备总览</div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="title">
          <div class="text pb_05 font_bold">设备状态</div>
        </div>
        <pie-chart :chartData="pieChartData" height="220px"></pie-chart>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="title">
          <div class="text pb_05 font_bold">设备成交额排行/元</div>
        </div>
        <div class="list" v-for="(item,index) in salesList">
          <div class="no"
               :style="{backgroundColor:(index<3?'#314659':'#e4e5e7'),color:((index<3?'#FFFFFF':'#212121'))}">
            {{index+1}}
          </div>
          <div class="name">{{item.name}}</div>
          <div class="count">
            <count-to :start-val="0" :end-val="item.amount" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {deviceOverview} from '@/api/dashboard'
  import PieChart from "@/views/dashboard/components/PieChart";
  import CountTo from "vue-count-to";
  import {EquipmentStatus} from "@/js/common";

  export default {
    name: "overview",
    components: {PieChart, CountTo},
    data() {
      return {
        pieChartData: {
          data: [
            {
              value: 0,
              name: '在线设备',
              status: EquipmentStatus.ES_IsOk
            },
            {
              value: 0,
              name: '离线设备',
              status: EquipmentStatus.ES_Offline
            },
            {
              value: 0,
              name: '异常设备',
              status: EquipmentStatus.ES_Fault
            },
            {
              value: 0,
              name: '禁用设备',
              status: EquipmentStatus.ES_Stop
            }],
          color: ['#4FCB74', '#bec2bf', '#FBD438', '#F04864', '#37CBCB'],
          series: {
            radius: ['70%', '90%'],
            center: ["26%", "50%"],
          },
          legend: {
            right: '0'
          },
          title: {
            text: '{name|总设备/台}',
            subtext: '{value|89}',
            subtextStyle: {
              rich: {
                value: {
                  fontSize: "22",
                  color: "#7f7f7f",
                }
              }
            },
            textStyle: {
              rich: {
                name: {
                  fontSize: "22",
                  color: "#333333",
                }
              }
            },
            left: '24%',
            bottom: '35%',
            textAlign: 'center',
          },
        },
        salesList: []
      }
    },
    methods: {
      getOverview() {
        let device_count = 0;
        deviceOverview().then(res => {
          const data = res;
          data.sales.forEach(item => {
            item.amount = item.amount / 100;
          });
          this.salesList = data.sales;
          data.device_status.forEach(m => {
            device_count += m.num;
            this.pieChartData.data.forEach(n => {
              if (n.status == m.status) {
                n.value = m.num;
              }
            })
          })
          this.pieChartData['title'].subtext = `{value| ${device_count}}`
        }).catch(err => {
          this.$message.warning('获取设备总览数据失败');
        })
      }
    },
    created() {
      this.getOverview();
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
      color: #333333;

    }

    .pb_05 {
      padding-bottom: 5px;
    }

    .font_bold {
      font-weight: bold;
    }
  }

  .list {
    width: 100%;
    display: flex;
    height: 30px;
    align-items: center;
    margin: 10px 0;

    .no {
      font-size: 14px;
      background-color: #F0F2F5;
      width: 24px;
      height: 24px;
      line-height: 25px;
      text-align: center;
      border-radius: 50%;
      margin-right: 25px;
    }

    .name {
      flex-grow: 1;
    }

    .count {
      width: 100px;
    }
  }
</style>
