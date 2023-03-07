<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商户" prop="merchant_id">
            <SelectTree
              placeholder="请选择商户"
              style="width: 100%"
              :props="props"
              :options="merchantList"
              :value="form.merchant_id"
              @getValue="getValue($event)"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="药品" prop="product_id">
            <el-select style="width: 100%;" v-model="form.name" clearable filterable remote
                       placeholder="请输入商品, 支持商品名、国际条码搜索" :remote-method="remoteMethod" :loading="selectLoading"
                       :disabled="isDisabled"
                       @change="handleSelect">
              <el-option v-for="item in baseProductData" :key="item.innerid" :label="item.name" :value="item.innerid">
                <span>{{ item.name }}</span>
                <span v-if="item.bar_code">({{ item.bar_code }})</span>
              </el-option>
              <div slot="empty" style="padding: 10px 0;margin: 0;text-align: center;color: #999;font-size: 14px;">
                <span>未找到药品信息, </span>
                <el-link type="primary" @click="handleAdd">添加药品</el-link>
              </div>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="product_type">
            <el-select v-model="form.product_type" placeholder="请选择类型" style="width: 100%;">
              <el-option v-for="(item, idx) in $conf.productType" :key="idx" :label="item" :value="idx * 1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商品编号" prop="product_no">
            <el-input v-model="form.product_no" placeholder="请输入商品编号" maxlength="64" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效期至" prop="expire_date">
            <el-date-picker style="width: 100%;" v-model="form.expire_date" type="date" placeholder="请选择日期"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="批次" prop="batch">
            <el-input v-model="form.batch" placeholder="请输入批次" maxlength="100" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="批号" prop="batch_number">
            <el-input v-model="form.batch_number" placeholder="请输入批号" maxlength="16" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电子监管码" prop="electronic_monitoring_code">
            <el-input v-model="form.electronic_monitoring_code" placeholder="请输入电子监管码" maxlength="64"
                      autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="原价" prop="price">
            <el-input-number v-model="form.price" placeholder="请输入原价, 单位元" :precision="2" :step="1" :min="0.01"
                             :max="100000" autocomplete="off" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="会员价" prop="customer_price">
            <el-input-number v-model="form.customer_price" placeholder="请输入会员价, 单位元" :precision="2" :step="1"
                             :min="0.01" :max="100000" autocomplete="off" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品美团编号" prop="merchant_product_third_code">
            <el-input v-model="form.merchant_product_third_code" placeholder="请输入商户美团编号" maxlength="16" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" maxlength="500"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getInfo, update, add} from '@/api/merchantProduct';
import {getPairs} from '@/api/product';
import {getMerchantTree} from '@/api/merchant';
import {parseTree} from '@/utils';
import {checkPrice} from "@/utils/validate";
import SelectTree from "@/components/treeSelect";

export default {
  name: 'edit',
  components: {SelectTree},
  data() {
    return {
      props:{                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      form: {
        merchant_id: '',
        name: '',
        part: '',
        alias: '',
        approval_number: ''
      },
      // 商户树形数据
      merchantList: [],
      submitLoading: false,
      selectLoading: false,
      baseProductData: [],

      //表单验证
      rules: {
        merchant_id: [
          {required: true, message: '请选择商户', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入药品名或国际条码', trigger: 'change'},
        ],
        product_type: [
          {required: true, message: '请选择类型', trigger: 'change'},
        ],
        electronic_monitoring_code: [
          {pattern: /^[0-9]{20}$/, message: '电子监管码格式不正确', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入原始价格', trigger: 'blur'},
          {validator: checkPrice, trigger: 'blur'},
        ],
        customer_price: [
          {required: true, message: '请输入会员价格', trigger: 'blur'},
          {validator: checkPrice, trigger: 'blur'},
        ],
      },
      //路由参数id
      innerid: '',
      //是否禁用
      isDisabled: false
    }
  },
  methods: {
    //获取商户id
    getValue(value){
      this.form.merchant_id = value
    },
    //搜索药品
    async remoteMethod(query) {
      try {
        if (query) {
          this.selectLoading = true;
          let dataList = await getPairs({keywords: query})
          if (dataList) {
            this.baseProductData = dataList
          }
          this.selectLoading = false;
        } else {
          this.selectLoading = false;
          this.baseProductData = [];
        }
      } catch (err) {
        this.$message.warning(err.message || "获取数据失败");
      }
    },
    //选择商品名称
    handleSelect(id) {
      let filterList = this.baseProductData.find(item => {
        return item.innerid == id
      })
      if (filterList) {
        this.$set(this.form, 'name', filterList.name);
        this.$set(this.form, 'product_id', filterList.innerid);
      }
    },
    // 新增
    handleAdd() {
      this.$router.push('/product/addProduct')
    },
    // 获取商户
    async initMerchantTree() {
      let dbData = await getMerchantTree();
      this.merchantList = parseTree(dbData);
    },
    // 保存
    async onSubmit() {
      this.submitLoading = true;
      this.$refs.form.validate(async valide => {
        if (valide) {
          let customer_price = Math.round(100 * this.form.customer_price);
          let price = Math.round(100 * this.form.price);
          let params = {
            ...this.form,
            customer_price: customer_price,
            price: price
          };

          try {
            if (this.innerid) {
              await update(this.innerid, params);
            } else {
              await add(params);
            }
            this.$message.success('保存成功');
            this.onCancel()
          } catch (err) {
            this.$message.warning(err.message||'保存失败');
            this.submitLoading = false;
          }
        } else {
          this.submitLoading = false;
        }
      });
    },
    // 关闭
    onCancel() {
      this.$router.push('/product/goods');
    },
  },
  async mounted() {
    await this.initMerchantTree();
    this.innerid = this.$route.params.id;
    if (this.innerid) {
      this.isDisabled = true;
      try {
        let dbData = await getInfo(this.innerid);
        this.form = dbData[0];
        this.form.price = this.form.price / 100;
        this.form.customer_price = this.form.customer_price / 100;
      } catch (err) {
        this.$message.warning(err.message);
      }
    } else {
      this.isDisabled = false;
    }
  }
}
</script>

<style scoped>

</style>

