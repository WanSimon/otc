<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <divider :title="dividerTitle[0]"></divider>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入药品名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品别名" prop="alias">
            <el-input v-model="form.alias" placeholder="请输入药品别名" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="批准文号" prop="approval_number">
            <el-input v-model="form.approval_number" placeholder="请输入批准文号" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="国际条码" prop="bar_code">
            <el-input id="txtTask" v-model.trim="form.bar_code" placeholder="请输入国际条码" maxlength="32" class="input-width"></el-input>
            <el-button @click="getBarCode">获取唯一码</el-button>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品分类" prop="product_category_list_id">
            <el-cascader
              style="width: 100%"
              v-model="categorySelData"
              :options="categoryList"
              :props="{ multiple: true,checkStrictly: true}"
              clearable
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <divider :title="dividerTitle[1]"></divider>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="长度" prop="product_length">
            <el-input-number v-model="form.product_length" placeholder="请输入药品包装盒长度, 单位mm" :precision="2" :step="1"
                             :min="0.01" :max="100000" autocomplete="off" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="宽度" prop="product_width">
            <el-input-number v-model="form.product_width" placeholder="请输入药品包装盒宽度, 单位mm" :precision="2" :step="1"
                             :min="0.01" :max="100000" autocomplete="off" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="高度" prop="product_height">
            <el-input-number v-model="form.product_height" placeholder="请输入药品包装盒高度, 单位mm" :precision="2" :step="1"
                             :min="0.01" :max="100000" autocomplete="off" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="计量单位" prop="unit">
            <el-select v-model="form.unit" placeholder="请选择药品计量单位" filterable style="width:100%;" clearable>
              <el-option v-for="(item, idx) in codeData.USAGE_UNIT" :key="idx" :label="item" :value="idx"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="经营分类" prop="operator_category_id">
            <el-select v-model="form.operator_category_id" placeholder="请选择药品经营分类" filterable style="width:100%;" clearable>
              <el-option v-for="(item, idx) in codeData.OPERATOR_CATEGORY" :key="idx" :label="item"
                         :value="idx"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="商品规格" prop="specification">
            <el-input v-model="form.specification" placeholder="请输入商品规格" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品品牌" prop="brand">
            <el-input v-model="form.brand" placeholder="请输入药品品牌" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="生产厂家" prop="manufacturer">
            <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品产地" prop="origin_place">
            <el-input v-model="form.origin_place" placeholder="请输入药品产地" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="最短服用天数" prop="min_day">
            <el-input v-model="form.min_day" placeholder="请输入药品单盒最短服用天数" maxlength="3" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="最长服用天数" prop="max_day">
            <el-input v-model="form.max_day" placeholder="请输入药品单盒最长服用天数" maxlength="3" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="用法用量" prop="usage_dosage">
            <el-input v-model="form.usage_dosage" placeholder="请输入药品用法用量" maxlength="255" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="疗程" prop="treatment_course">
            <el-input v-model="form.treatment_course" placeholder="请输入药品疗程" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="服用时间" prop="eat_time">
            <el-select v-model="form.eat_time" placeholder="请选择药品服用时间" filterable style="width:100%;" clearable>
              <el-option v-for="(item, idx) in codeData.EAT_TIME" :key="idx" :label="item" :value="idx"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="保质期" prop="expiration_date">
            <el-input v-model="form.expiration_date" placeholder="请输入药品保质期" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品状态" prop="product_status">
            <el-select v-model="form.product_status" placeholder="请选择药品经营分类" filterable style="width:100%;" clearable>
              <el-option v-for="(item, idx) in codeData.PLATFORM_PRODUCT_STATUS" :key="idx" :label="item"
                         :value="idx"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品添加来源" prop="add_source">
            <el-select v-model="form.add_source" placeholder="请选择药品经营分类" filterable style="width:100%;" clearable>
              <el-option v-for="(item, idx) in codeData.PRODUCT_ADD_SOURCE" :key="idx" :label="item"
                         :value="idx"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药品适用症状" prop="symptom_id">
            <el-select v-model="form.symptom_id" placeholder="请选择药品适用症状" multiple filterable style="width:100%;" clearable>
              <el-option v-for="item in symptomList" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="主治功能" prop="product_function">
            <el-input type="textarea" v-model="form.product_function" placeholder="请输入主治功能" maxlength="500" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="不良反应" prop="adverse_reaction">
            <el-input type="textarea" v-model="form.adverse_reaction" placeholder="请输入不良反应" maxlength="500" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="禁忌" prop="taboo">
            <el-input type="textarea" v-model="form.taboo" placeholder="请输入药品禁忌" maxlength="500" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="注意事项" prop="attention">
            <el-input type="textarea" v-model="form.attention" placeholder="请输入药品注意事项" maxlength="500" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="药物相互作用" prop="interactions">
            <el-input type="textarea" v-model="form.interactions" placeholder="请输入药物相互作用" maxlength="500" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="是否兴奋剂" prop="analeptic_flag">
            <el-switch v-model="form.analeptic_flag" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="麻黄碱" prop="ephedrine_flag">
            <el-switch v-model="form.ephedrine_flag" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="可售状态" prop="sale_status">
            <el-switch v-model="form.sale_status" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="正面图">
            <el-upload
              accept="image/*"
              class="avatar-uploader"
              action=""
              :data="{filename: '正面图', key: 'frontImage'}"
              :show-file-list="false" :http-request="uploadImage">
              <el-image v-if="imgObj.frontImage" :src="imgObj.frontImage" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="背面图">
            <el-upload
              accept="image/*"
              class="avatar-uploader"
              action=""
              :data="{filename: '背面图', key: 'backImage'}"
              :show-file-list="false" :http-request="uploadImage">
              <el-image v-if="imgObj.backImage" :src="imgObj.backImage" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="推荐缩略图">
            <el-upload
              accept="image/*"
              class="avatar-uploader"
              action=""
              :data="{filename: '推荐缩略图',key: 'homeImage'}"
              :show-file-list="false" :http-request="uploadImage">
              <el-image v-if="imgObj.homeImage" :src="imgObj.homeImage" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="其他图片">
            <el-upload
              ref="otherImage"
              :file-list="imgObj.otherImage"
              accept="image/*"
              :limit="10"
              class="avatar-uploader custom-upload"
              action=""
              :data="{filename: '其他图片',imgUrl: 'otherImage'}"
              list-type="picture-card"
              :http-request="uploadImage">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="file" slot-scope="{file}">
                <el-image class="avatar" :src="file.url"/>
                <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click="removeOther(file, 'otherImage')">
                <i class="el-icon-delete"></i>
                </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="复核图片">
            <el-upload
              ref="comparisonImage"
              :file-list="imgObj.comparisonImage"
              accept="image/*"
              :limit="10"
              class="avatar-uploader custom-upload"
              action=""
              :data="{filename: '复核图片',imgUrl: 'comparisonImage'}"
              list-type="picture-card"
              :http-request="uploadImage">
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="file" slot-scope="{file}">
                <el-image class="avatar" :src="file.url" />
                <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-delete" @click="removeOther(file, 'comparisonImage')">
                <i class="el-icon-delete"></i>
                </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="详情" prop="product_detail">
            <wang-editor :init-content="form.product_detail" @catch-data="catchData"></wang-editor>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入备注" maxlength="500"></el-input>
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
import {getInfo, update, add, image, autoGenBarcode} from '@/api/product';
import {getCodeTree} from '@/api/code';
import {getSymptomTree} from '@/api/symptom';
import {getCategoryTree} from '@/api/productCategory';
import {parseTree} from '@/utils';
import WangEditor from '@/components/WangEditor';
import divider from "@/components/Divider/index";
import {upload} from "@/api/resource";

export default {
  name: 'editProduct',
  data() {
    return {
      //症状树形数据
      symptomList: [],
      //药品分类树形数据
      categoryList: [],
      //药品分类数据
      categoryData: [],
      //药品分类被选中的数据
      categorySelData: [],
      //代码表数据
      codeData: {},
      imgObj: {frontImage: '', backImage: '', homeImage: '', otherImage: [], comparisonImage: []},
      form: {otherImage: [],comparisonImage: []},
      imageUrl: {},
      submitLoading: false,
      //表单验证
      rules: {
        name: [
          {required: true, message: '请输入药品名', trigger: 'blur'},
        ],
        approval_number: [
          {required: true, message: '请输批准文号', trigger: 'blur'},
        ],
        bar_code: [
          {required: true, message: '请输入国际条码', trigger: 'blur'},
        ],
        product_length: [
          {required: true, message: '请输入药品包装盒长度', trigger: 'blur'},
        ],
        product_width: [
          {required: true, message: '请输入药品包装盒高度', trigger: 'blur'},
        ],
        product_height: [
          {required: true, message: '请输入药品包装盒宽度', trigger: 'blur'},
        ],
      },
      dividerTitle: ['基本信息', '详细数据'],
    }
  },
  components: {
    WangEditor,
    divider
  },
  methods: {
    getInfo() {
      return getInfo(this.innerid).then(res => {
        const data = res;
        let symptom_id = []
        if (data.symptom_id) symptom_id = data.symptom_id.split(',');
        this.form = {...data, frontImage: [], backImage: [], homeImage: [], otherImage: [],comparisonImage: [], symptom_id: symptom_id};
        this.$set(this.form, 'product_length', this.form.product_length / 100);
        this.$set(this.form, 'product_width', this.form.product_width / 100);
        this.$set(this.form, 'product_height', this.form.product_height / 100);
        //药品分类按逗号分隔成数组
        if (!this.form.product_category_list_id) return this.categorySelData = []
        let selCategory = this.form.product_category_list_id.split(',')
        //被选中的药品分类(多个)
        this.categorySelData = []
        selCategory.forEach(item => {
          //被选中的药品分类(其中一个)
          const parentArr = []
          //递归查询父级
          this.find(parentArr, item, this.categoryData);
          this.categorySelData.push(parentArr)
        })

      }).catch(err => {
        this.$message.warning(err.message || '获取详情失败');
      })
    },
    getImage() {
      return image({innerid: this.innerid}).then(res => {
        let img = res;
        let baseUrl = this.$conf.resource.baseUrl;
        for (let i = 0; i < img.length; i++) {
          let item = img[i];
          switch (item.type) {
            case 1:
              this.$set(this.imgObj, 'homeImage', baseUrl + item.image_url);
              this.$set(this.form, 'homeImage', [item.image_url]);
              break;
            case 2:
              this.$set(this.imgObj, 'frontImage', baseUrl + item.image_url);
              this.$set(this.form, 'frontImage', [item.image_url]);
              break;
            case 3:
              this.$set(this.imgObj, 'backImage', baseUrl + item.image_url);
              this.$set(this.form, 'backImage', [item.image_url]);
              break;
            case 4:
              this.imgObj.comparisonImage.push({url: baseUrl + item.image_url});
              this.form.comparisonImage.push(item.image_url);
              break;
            case 10:
              this.imgObj.otherImage.push({url: baseUrl + item.image_url});
              this.form.otherImage.push(item.image_url);
              break;
          }
        }
      }).catch(err => {
        this.$message.warning( err.message || '获取图片失败');
      })
    },
    //删除图片回调
    removeOther(file, img) {
      let fileList = this.$refs[img].uploadFiles;
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i]['url'] == file.url) {
          console.log(fileList[i]['url'],file.url)
          fileList.splice(i, 1);
        }
      }
      this.imgObj[img] = []
      this.form[img] = []
      let uuid = ''
      fileList.forEach(item => {
        uuid = item.url.split('/').pop()
        this.imgObj[img].push({url: item.url});
        this.form[img].push(uuid);
      })
    },

    //获取图片尺寸
    getImageSize(base64data) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64data;
        img.onload = function () {
          resolve(img);
        };
        img.onerror = function () {
          reject(new Error('加载图片失败'));
        };
      });
    },
    //图片上传
    async uploadImage(data) {
      const file = data.file;
      if (file.type.indexOf('image') === -1) {
        return this.$message.warning('只能上传图片');
      }
      let isLimit = file.size / 1024 / 1024 < 100;
      if (!isLimit) {
        return this.$message.warning('图片大小不能超过100M');
      }
      let img = await this.getImageSize(URL.createObjectURL(file));
      if (data.data.imgUrl != 'comparisonImage' && (!img || !img.width || !img.height || (img.width / img.height) !== 1)) {
        return this.$message.warning('图片长宽比必须为1, 建议200*200');
      }
      try {
        let uuid = await upload(file);
        if (data.data.imgUrl === 'otherImage' || data.data.imgUrl === 'comparisonImage') {
          this.imgObj[data.data.imgUrl].push({url: URL.createObjectURL(file)});
          this.form[data.data.imgUrl].push(uuid);
          return;
        }
        this.$set(this.imgObj, data.data.key, URL.createObjectURL(file));
        this.$set(this.form, data.data.key, [uuid]);
      } catch (err) {
        this.$message.warning(err.message || '上传失败');
      }
    },
    // 获取国际条码
    getBarCode() {
      autoGenBarcode().then(res=>{
        let code= res.bar_code
        this.$set(this.form,'bar_code',code)
      }).catch(err=>{
        this.$message.warning(err.message||'获取国际条形码失败')
      })
    },
    //药品详情内容
    catchData(content) {
      this.$set(this.form, 'product_detail', content);
    },
    // 获取code
    async initCodeTree() {
      let code = {code: ["USAGE_UNIT", "OPERATOR_CATEGORY", "EAT_TIME", "PLATFORM_PRODUCT_STATUS", "PRODUCT_ADD_SOURCE"]};
      this.codeData = await getCodeTree(code);
    },
    //递归查询父级
    find(parentArr, item, categoryData) {
      categoryData.forEach(ele => {
        if (ele.value === item) {
          parentArr.unshift(ele.value);
          this.find(parentArr, ele.parentId, categoryData);
        }
      })
    },
    // 获取药品分类
    async initCategoryTree() {
      this.categoryData = await getCategoryTree();
      this.categoryList = parseTree(this.categoryData);
    },
    handleChange(value) {
      if (value && value instanceof Array && value.length > 0) {
        let arr = []
        value.forEach(item => {
          arr.push(item[item.length - 1])
        })
        this.form.product_category_list_id = arr.join(',');
      } else {
        this.form.product_category_list_id = '';
      }
    },
    // 保存
    async onSubmit() {
      this.$refs.form.validate(async valide => {
        if (valide) {
          let product_length = Math.round(100 * this.form.product_length);
          let product_width = Math.round(100 * this.form.product_width);
          let product_height = Math.round(100 * this.form.product_height);
          let params = {
            ...this.form,
            product_length: product_length,
            product_width: product_width,
            product_height: product_height
          };
          this.submitLoading = true;
          let promiseObj = this.innerid ? update(this.innerid, params) : add(params);
          promiseObj.then(res => {
            this.$message.success('保存成功');
            this.onCancel();
          }).catch(err => {
            this.$message.warning(err.message || '保存失败');
          }).finally(() => {
            this.submitLoading = false;
          })
        }
      });
    },
    // 关闭
    onCancel() {
      this.$router.push('/product/product');
    },
  },
  async mounted() {
    this.initCategoryTree();
    this.initCodeTree();
    this.symptomList = await getSymptomTree();
    this.innerid = this.$route.params.id;
    try {
      if (this.innerid) {
        await this.getInfo()
        await this.getImage()
      }
    } catch (err) {
      this.$message.warning(err.message);
    }
  }
}
</script>

<style scoped>
#txtTask {
  float: left;
  min-width: 85%;
}

.custom-upload /deep/ .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}

.custom-upload /deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.input-width{
  width:calc(100% - 100px);
  margin-right: 8px;
}
</style>
