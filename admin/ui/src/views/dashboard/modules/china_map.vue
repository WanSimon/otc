<template>
  <div class="chart-card-container" style="height: 510px">
    <div class="total">设备地图</div>
    <!--    <el-row>-->
    <!--      <el-tabs tab-position="left" style="height: 100%;">-->
    <!--        <el-tab-pane label="全国" name="chinaMap"></el-tab-pane>-->
    <!--        <el-tab-pane label="省" name="provincesMap"></el-tab-pane>-->
    <!--        <el-tab-pane label="市" name="citiesMap"></el-tab-pane>-->
    <!--        <el-tab-pane label="县" name="countiesMap"></el-tab-pane>-->
    <!--        <el-tab-pane label="镇" name="townsMap"></el-tab-pane>-->
    <!--        <el-tab-pane label="村" name="villagesMap"></el-tab-pane>-->
    <!--      </el-tabs>-->
    <!--    </el-row>-->
    <china-map :chart-data="chartData"></china-map>
  </div>
</template>

<script>
  import {deviceAddress} from '@/api/dashboard';
  import ChinaMap from "@/views/dashboard/components/ChinaMap";

  export default {
    name: "china_map",
    components: {ChinaMap},
    data() {
      return {
        chartData: {
          data: []
        }
      }
    },
    methods: {
      getAddress() {
        deviceAddress().then(res => {
          const data = res.map(item => {
            return {
              name: item.name,
              value: item.num
            }
          })
          this.chartData.data = data;
        }).catch(err => {
          this.$message.warning('获取设备地址数据失败');
        })
      }
    },
    created() {
      this.getAddress();
    }
  }
</script>

<style scoped lang="scss">
  .total {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding: 5px 0px 5px 0px;
  }
</style>
