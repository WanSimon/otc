<template>
  <vue-seamless-scroll :data="listData" :class-option="classOption" class="seamless-warp">
    <div v-for="item in listData" class="item" v-if="listData.length>0">
          <span style="text-decoration: underline">
          <span>{{ item.index + '. ' }}</span><span>{{ item.title + '：' }}</span><span>{{ item.content }}</span>
          </span>
    </div>
    <span class="item" v-if="listData.length===0">暂无公告</span>
  </vue-seamless-scroll>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import {getNoticeInfo} from '@/api/notice'

export default {
  components: {vueSeamlessScroll},
  name: "index",
  data() {
    return {
      listData: [],
      getTimer:null,
    }
  },
  computed: {
    classOption() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: this.listData.length || 1, // 开始无缝滚动的数据量 this.listData.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 2, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
      }
    }
  },
  methods: {
    noticeInfo() {
      getNoticeInfo().then(res => {
        const data = res
        this.listData = data.map((item, index) => {
          return {
            index: index + 1,
            title: item.title,
            content: item.content,
          }
        })
      }).catch(err => {
        this.$message.warning('获取公告失败')
      })
    }
  },
  created() {
    this.noticeInfo()
    this.getTimer  = setInterval(() => {
     this.noticeInfo();
    }, 1000 * 60 * 10);
  },
  beforeDestroy() {
    this.getTimer && clearInterval(this.getTimer);
  }
}
</script>

<style scoped lang="scss">

.seamless-warp {
  width: 25%;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  background-color: #FDF6EC;
  border-radius: 5px;

  .item {
    display: inline-block;
    margin: 0px 15px;
    font-size: 12px;
    color: #f5a005;
    line-height: 30px;
  }
}

</style>
