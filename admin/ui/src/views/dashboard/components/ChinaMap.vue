<template>
  <div style="width: 100%; height: calc(100% - 30px)" class="map" ref="map"/>
</template>

<script>
  import echarts from 'echarts';
  import 'echarts/map/js/china.js' // 引入中国地图数据

  import resize from './mixins/resize'

  export default {
    mixins: [resize],
    props: {
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$refs.map)
        this.setOptions(this.chartData)
      },
      setOptions({data = []}) {
        this.chart.setOption(
          { // 进行相关配置
            // backgroundColor: "#02AFDB",
            tooltip: {// 鼠标移到图里面的浮动提示框
              trigger: 'item',
            },
            dataRange: {
              show: true,
              min: 0,
              max: 50000,
              text: ['High', 'Low'],
              realtime: false,
              calculable: true,
              inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
              }
            },
            layoutCenter: ['50%', '50%'],
            layoutSize: 600,
            series: [
              {
                name: '设备分布', // 浮动框的标题
                type: 'map',
                // geoIndex: 0,
                map: 'china',
                roam: true,
                label: {
                  show: false
                },
                data: data,
                // 自定义名称映射
                nameMap: {
                  '台湾': '台湾省',
                  '河北': '河北省',
                  '山西': '山西省',
                  '内蒙古': '内蒙古自治区',
                  '辽宁': '辽宁省',
                  '吉林': '吉林省',
                  '黑龙江': '黑龙江省',
                  '江苏': '江苏省',
                  '浙江': '浙江省',
                  '安徽': '安徽省',
                  '福建': '福建省',
                  '江西': '江西省',
                  '山东': '山东省',
                  '河南': '河南省',
                  '湖北': '湖北省',
                  '湖南': '湖南省',
                  '广东': '广东省',
                  '广西': '广西壮族自治区',
                  '海南': '海南省',
                  '四川': '四川省',
                  '贵州': '贵州省',
                  '云南': '云南省',
                  '西藏': '西藏自治区',
                  '陕西': '陕西省',
                  '甘肃': '甘肃省',
                  '青海': '青海省',
                  '宁夏': '宁夏回族自治区',
                  '新疆': '新疆维吾尔自治区',
                  '北京': '北京市',
                  '天津': '天津市',
                  '上海': '上海市',
                  '重庆': '重庆市',
                  '香港': '香港特别行政区',
                  '澳门': '澳门特别行政区',
                }
              }
            ],

          }
        )
      }
    }
  }
</script>

<style scoped>

</style>
