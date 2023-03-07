<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="105px" label-position="left">
      <divider :title="dividerTitle[0]"></divider>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品名称:" prop="name">
            <span>{{ form.name || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品别名:" prop="alias">
            <span>{{ form.alias }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="批准文号:" prop="approval_number">
            <span>{{ form.approval_number || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="国际条码:" prop="bar_code">
            <span>{{ form.bar_code || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品分类:" prop="product_category_list_id">
            <span>{{ form.product_category_list_id | zget('value', 'label', categoryList) }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <divider :title="dividerTitle[1]"></divider>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="所属商户:" prop="merchant_id">
            <span>{{ form.merchant_id | zget('value', 'label', merchantList) }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品批次:" prop="batch">
            <span>{{ form.batch }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品批号:" prop="batch_number">
            <span>{{ form.batch_number }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="电子监管码:" prop="electronic_monitoring_code">
            <span>{{ form.electronic_monitoring_code }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="原价:" prop="price">
            <span>&yen;{{ form.price ? (((form.price * 1000) / 1000).toFixed(2)) : form.price }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="会员价:" prop="customer_price">
            <span>&yen;{{
                form.customer_price ? (((form.customer_price * 1000) / 1000).toFixed(2)) : form.customer_price
              }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <divider :title="dividerTitle[2]"></divider>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="长度(mm):" prop="product_length">
            <span>{{ form.product_length/100 }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="宽度(mm):" prop="product_width">
            <span>{{ form.product_width/100 }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="高度(mm):" prop="product_height">
            <span>{{ form.product_height/100}}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="计量单位:" prop="unit">
            <span v-if="codeData.USAGE_UNIT">{{ codeData.USAGE_UNIT[form.unit] || form.unit }}</span>
            <span v-else>{{ form.unit || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="经营分类:" prop="operator_category_id">
            <span
              v-if="codeData.OPERATOR_CATEGORY">{{
                codeData.OPERATOR_CATEGORY[form.operator_category_id] || form.operator_category_id
              }}</span>
            <span v-else>{{ form.operator_category_id || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品品牌:" prop="brand">
            <span>{{ form.brand }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="生产厂家:" prop="manufacturer">
            <span>{{ form.manufacturer }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品产地:" prop="origin_place">
            <span>{{ form.origin_place }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="最短服用天数:" prop="min_day">
            <span>{{ form.min_day }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="最长服用天数:" prop="min_day">
            <span>{{ form.max_day }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="用法用量:" prop="usage_dosage">
            <span>{{ form.usage_dosage }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="疗程:" prop="treatment_course">
            <span>{{ form.treatment_course }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="服用时间:" prop="eat_time">
            <span v-if="codeData.EAT_TIME">{{ codeData.EAT_TIME[form.eat_time] || form.eat_time }}</span>
            <span v-else>{{ form.eat_time || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="主治功能:" prop="product_function">
            <span>{{ form.product_function }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="不良反应:" prop="adverse_reaction">
            <span>{{ form.adverse_reaction }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="禁忌:" prop="taboo">
            <span>{{ form.taboo }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="注意事项:" prop="attention">
            <span>{{ form.attention }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药物相互作用:" prop="interactions">
            <span>{{ form.interactions }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="商品规格:" prop="specification">
            <span>{{ form.specification }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="保质期:" prop="expiration_date">
            <span>{{ form.expiration_date }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品状态:" prop="product_status">
            <span
              v-if="codeData.PLATFORM_PRODUCT_STATUS">{{
                codeData.PLATFORM_PRODUCT_STATUS[form.product_status] || form.product_status
              }}</span>
            <span v-else>{{ form.product_status || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="药品添加来源:" prop="add_source">
            <span
              v-if="codeData.PRODUCT_ADD_SOURCE">{{
                codeData.PRODUCT_ADD_SOURCE[form.add_source] || form.add_source
              }}</span>
            <span v-else>{{ form.add_source || '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="是否兴奋剂:" prop="analeptic_flag">
            <span>{{ form.analeptic_flag ? '是' : '否' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="麻黄碱:" prop="ephedrine_flag">
            <span>{{ form.ephedrine_flag ? '是' : '否' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="可售状态:" prop="sale_status">
            <span>{{ form.sale_status ? '可售' : '不可售' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="推荐缩略图:" prop="home">
            <div v-if="imageData.home">
              <el-image :preview-src-list="[`${imageData.home}`]"
                        :src="`${imageData.home}`"
                        style="width:80px;height:80px;"></el-image>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="正面图:" prop="front">
            <div v-if="imageData.front">
              <el-image :preview-src-list="[`${imageData.front}`]"
                        :src="`${imageData.front}`"
                        style="width:80px;height:80px;"></el-image>
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="背面图:" prop="back">
            <div v-if="imageData.back">
              <el-image :preview-src-list="[`${imageData.back}`]"
                        :src="`${imageData.back}`"
                        style="width:80px;height:80px;"></el-image>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="其他图:" prop="other">
            <div v-if="imageData.other && imageData.other.length">
              <el-image v-for="(item, index) in imageData.other" :key="index"
                        :preview-src-list="imageData.other"
                        :src="item" style="width:80px;height:80px;margin-right:10px;"></el-image>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="复核图:" prop="other">
            <div v-if="imageData.comparisonImage && imageData.comparisonImage.length">
              <el-image v-for="(item, index) in imageData.comparisonImage" :key="index"
                        :preview-src-list="imageData.comparisonImage"
                        :src="item" style="width:80px;height:80px;margin-right:10px;"></el-image>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详情:" prop="product_detail">
            <div v-html="form.product_detail"></div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注:" prop="remark">
            <span>{{ form.remark }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="callBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getMerchantTree} from "@/api/merchant";
import {getInfo} from "@/api/merchantProduct";
import {getCategoryTree} from "@/api/productCategory";
import {getCodeTree} from "@/api/code";
import {image} from "@/api/product"
import divider from '@/components/Divider'
import {zget} from '@/utils/index';

export default {
  components: {divider},
  name: "detail",
  data() {
    return {
      form: {},
      imageData: {
        home: '',
        front: '',
        back: '',
        other: [],
        comparisonImage:[]
      },
      merchantList: [],
      dividerTitle: ['药品信息', '商家信息', '药品详细'],
      //药品分类数据
      categoryList: [],
      //代码表数据
      codeData: {},
    }
  },
  methods: {
    getInit(id) {
      let data = {code: ["USAGE_UNIT", "OPERATOR_CATEGORY", "EAT_TIME", "PLATFORM_PRODUCT_STATUS", "PRODUCT_ADD_SOURCE"]}
      Promise.allSettled([getCodeTree(data), getMerchantTree(), getInfo(id), getCategoryTree(), image({'innerid': this.$route.params.pid})]).then(res => {
        //代码表数据
        if (res[0].status == "fulfilled") {
          this.codeData = res[0].value
        }
        //商户数据
        if (res[1].status == "fulfilled") {
          this.merchantList = res[1].value
        }
        //商品详情
        if (res[2].status == "fulfilled") {
          this.form = res[2].value[0]
        }
        //药品分类
        if (res[3].status == "fulfilled") {
          this.categoryList = res[3].value
        }
        //图片分类
        if (res[4].status == "fulfilled") {
          let imgData = res[4].value
          imgData.forEach(item => {
            switch (item.type) {
              case 1:
                this.$set(this.imageData, 'home', `${this.$conf.resource.baseUrl}${item.image_url}`);
                break;
              case 2:
                this.$set(this.imageData, 'front', `${this.$conf.resource.baseUrl}${item.image_url}`);
                break;
              case 3:
                this.$set(this.imageData, 'back', `${this.$conf.resource.baseUrl}${item.image_url}`);
                break;
              case 4:
                this.imageData.comparisonImage.push(`${this.$conf.resource.baseUrl}${item.image_url}`);
                break;
              case 10:
                this.imageData.other.push(`${this.$conf.resource.baseUrl}${item.image_url}`);
                break;
            }
          })
        }
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    //返回库存列表
    callBack() {
      window.history.back()
    },
  },
  created() {
    let id = this.$route.params.id
    if (id) {
      this.getInit(id)
    }
  },
  filters: {
    zget: zget,
  }
}
</script>

<style scoped>
</style>
