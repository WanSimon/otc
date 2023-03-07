<template>
 <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="症状名" prop="name">
            <el-input v-model="form.name" placeholder="请输入症状名" maxlength="50" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部位" prop="part">
            <el-input v-model="form.part" placeholder="请输入部位" maxlength="20" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="人群分类" prop="people_classify">
            <el-input v-model="form.people_classify" placeholder="请输入人群分类" maxlength="20" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="排序号" prop="sort">
            <el-input v-model="form.sort" placeholder="请输入症状排序号" maxlength="50" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="备注" prop="description">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.description">
            </el-input>
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
  import { getInfo,update,add } from '@/api/symptom';

  export default {
    name:'editSymptom',
    data() {
      return {
        list:[],
        form: {
          name: '',
          part:'',
          people_classify:'',
          sort:''
        },
        submitLoading:false,
        //表单验证
        rules: {
          name: [
            {required: true, message: '请输入症状名', trigger: 'blur'},
          ],
          part: [
            {required: true, message: '请输入部位', trigger: 'blur'},
          ],
          people_classify: [
            {required: true, message: '请输入人群分类', trigger: 'blur'},
          ],
          sort:[
            {required: true, message: '请输入症状排序号', trigger: 'blur'},
          ],
        },
      }
    },
    methods: {
      // 保存
      async onSubmit() {
        this.submitLoading = true;
        this.$refs.form.validate(async valide => {
          if(valide){
            let params = {
              ...this.form
            };
            params.isenable = params.isenable?1:0;

            try{
              if(this.innerid){
                await update(this.innerid,params);
              }else {
                await add(params);
              }
              this.$message.success('保存成功');
              this.onCancel()
            }
            catch (e) {
              this.$message.warning('保存失败')
              this.submitLoading = false;
            }
          }else{
            this.submitLoading = false;
          }
        });
      },
      // 关闭
      onCancel() {
        this.$router.push('/product/symptom');
      },
    },
    async mounted() {
      this.innerid = this.$route.params.id;
      if(this.innerid){
        let dbData = await getInfo(this.innerid);
        this.form = dbData;
        this.form.isenable = !!dbData.isenable;
      }
    }
  }
</script>

<style scoped>

</style>

