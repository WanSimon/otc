<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="上级分类" prop="parent_id">
            <SelectTree
              placeholder="请选择上级分类"
              style="width: 100%"
              :props="props"
              :options="categoryList"
              :value="form.parent_id"
              @getValue="getValue($event)"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类名" prop="name">
            <el-input v-model="form.name" placeholder="请输入分类名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类全称" prop="fullname">
            <el-input v-model="form.fullname" placeholder="请输入分类全称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="排序号" prop="sort_no">
            <el-input v-model="form.sort_no" placeholder="请输入排序号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="图标">
            <el-upload
              accept="image/*"
              class="avatar-uploader"
              action=""
              :data="{filename: '图标', key: 'image_url'}"
              :show-file-list="false" :http-request="uploadImage">
              <el-image v-if="imgObj.image_url" :src="imgObj.image_url" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="是否显示" prop="is_show">
            <el-switch v-model="form.is_show" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" :rows="3" placeholder="请输入备注"></el-input>
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
import {getInfo, update, add, getCategoryTree} from '@/api/productCategory';
import {checkMaxNumber} from '@/utils/validate';
import {upload} from '@/api/resource'
import {parseTree} from '@/utils'
import SelectTree from "@/components/treeSelect";

export default {
  name: 'edit',
  components: { SelectTree },
  data() {
    return {
      props:{                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      //药品分类树形数据
      categoryList: [],
      //上级分类
      parentData: [],
      //表单
      form: {
        parent_id: '',
        name: '',
        fullname: '',
        sort_no: '',
        image_url: '',
        is_show: '1',
        remark: '',
      },
      imgObj: {
        image_url: null
      },
      submitLoading: false,
      //表单验证
      rules: {
        name: [
          {required: true, message: '请输入药品分类名', trigger: 'blur'}
        ],
        fullname: [
          {required: true, message: '请输入药品分类全称', trigger: 'blur'}
        ],
        sort_no: [
          {required: true, message: '请输入排序号', trigger: 'blur'},
          {validator: checkMaxNumber, trigger: 'blur'},
        ],
        image_url: [
          {required: true, message: '请选择图标', trigger: 'blur'},
        ],
      },
      innerid: ''
    }
  },
  methods: {
    // 取值
    getValue(value){
      if (value && value instanceof Array && value.length > 0) {
        let arr = [...value];
        this.form.parent_id = arr.pop();
      } else {
        this.form.parent_id = value;
      }
    },
    onSubmit() {
      this.$refs.form.validate(valide => {
        if (valide) {
          let params = {
            ...this.form
          };
          this.submitLoading = true;
          let promiseObj = this.innerid ? update(this.innerid, params) : add(params);
          promiseObj.then(res => {
            this.$message.success('保存成功');
            this.onCancel()
          }).catch(err => {
            this.$message.warning('保存失败');
          }).finally(() => {
            this.submitLoading = false;
          })
        }
      })
    },
    onCancel() {
      this.$router.push('/product/category');
    },
    async uploadImage(data) {
      const file = data.file;
      try {
        let uuid = await upload(file);
        console.info(uuid, 'uuid');
        this.$set(this.imgObj, data.data.key, URL.createObjectURL(file));
        this.$set(this.form, data.data.key, uuid);
      } catch (e) {
        console.error(e)
      }
    },
    async initCategoryTree() {
      let dbData = await getCategoryTree();
      this.categoryList = parseTree(dbData);
    },
  },
  async mounted() {
    await this.initCategoryTree();
    this.innerid = this.$route.params.id;
    if (this.innerid) {
      let dbData = await getInfo(this.innerid);
      this.form = dbData;
      this.form.is_show = dbData.is_show.toString()
      if (this.form.image_url) this.$set(this.imgObj, 'image_url', this.$conf.resource.baseUrl + this.form.image_url);
    }
  },
}
</script>

<style scoped>

</style>

