<template>
    <div id="divider">
      <div class="content">
        <span class="content_title">{{ title }}</span>
      </div>
    </div>
</template>

<script>
export default {
  name: "index",
  props: {
    title: {
      type: String,
      default: ''
    },
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
#divider {
  width: 100%;
  height: 35px;
  border-radius: 4px;
  background-color: #F4F4F5;
  margin: 0px 0px 15px 0px;
  //border-bottom: 1px solid #d9dbdc;
  //box-shadow: 5px 5px 5px #e2dfdf;

  .content {
    padding: 0px 15px;
    line-height: 35px;
    font-size: 14px;
    color: #909399;
    &_title{
      padding-left: 8px;
    }
    //
    //&:before {
    //  content: "";
    //  display: inline-block;
    //  vertical-align: middle;
    //  margin-right: 5px;
    //  width: 15px;
    //  height: 15px;
    //  border-radius: 10px;
    //  background-color: #cfd0d2;
    //}
  }
}


</style>
