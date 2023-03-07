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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <el-radio v-model="form.sex" :label=1>男</el-radio>
            <el-radio v-model="form.sex" :label=2>女</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="身份证号" prop="idcard">
            <el-input v-model="form.idcard" placeholder="身份证号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="联系电话" autocomplete="new-password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isShow">
          <el-form-item label="登录密码" prop="pwd">
            <el-input placeholder="请输入密码" v-model="form.pwd" show-password autocomplete="new-password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="邮箱" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色" prop="account_role">
            <el-select multiple v-model="form.account_role" filterable placeholder="请选择角色" clearable
                       style="width:100%;">
              <el-option v-for="item in roleData" :key="item.innerid" :label="item.name"
                         :value="item.innerid"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="头像" prop="head_icon">
              <el-upload
                accept="image/*"
                class="avatar-uploader"
                action=""
                :data="{filename: '头像', key: 'head_icon'}"
                :show-file-list="false" :http-request="uploadImage">
                <el-image v-if="imgObj.head_icon" :src="imgObj.head_icon" class="avatar"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="启用状态" prop="isvalid">
            <el-switch v-model="form.isvalid"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.remark">
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
import {getInfo, update, add} from '@/api/account';
import {getRolePairs} from '@/api/role';
import {isEmail, isIdcard, isPhone} from "@/utils/validate";
import {parseTree} from '@/utils/index'
import {getMerchantTree} from '@/api/merchant';
import {upload} from "@/api/resource";
import SelectTree from "@/components/treeSelect";

export default {
  name: 'editAccount',
  components: {SelectTree},
  data() {
    return {
      props: {                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      roleData: [],
      merchantList: [],
      //表单数据
      form: {isvalid: true, merchant_id: ''},
      imgObj: {
        head_icon: null
      },
      submitLoading: false,
      //表单验证
      rules: {
        merchant_id: [
          {required: true, message: '请选择商户', trigger: 'blur'},
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: isPhone, trigger: 'blur'},
        ],
        pwd: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {type: 'string', min: 6, message: '密码不允许小于6位', trigger: 'blur'},
        ],
        email: [
          {validator: isEmail, trigger: 'blur'},
        ],
        idcard: [
          {validator: isIdcard, trigger: 'blur'},
        ],
        account_role: [
          {required: true, message: '至少选择一个角色', trigger: 'blur'},
        ],
      },
      isShow: false
    }
  },
  methods: {
    // 取值
    getValue(value) {
      this.form.merchant_id = value;
    },
    // 保存
    async onSubmit() {
      this.submitLoading = true;
      this.$refs.form.validate(async valide => {
        if (valide) {
          let params = {
            ...this.form,
          };
          params.isvalid = params.isvalid ? 1 : 0;
          params.account_role = this.form.account_role.join(",");
          try {
            if (this.innerid) {
              await update(this.innerid, params);
            } else {
              await add(params);
            }
            this.$message.success('保存成功');
            this.onCancel();
          } catch (err) {
            this.$message.warning(err.message || '保存失败');
            this.submitLoading = false;
          }
        } else {
          this.submitLoading = false;
        }
      });
    },
    // 关闭
    onCancel() {
      this.$router.push('/account/account');
    },
    // 获取商户
    async initMerchantTree() {
      let dbData = await getMerchantTree();
      this.merchantList = parseTree(dbData);
    },
    //获取角色
    getRoleParis() {
      getRolePairs().then(res => {
        this.roleData = res
      }).catch(err => {
        this.$message.warning(err.message ||'获取角色失败');
      })
    },
    async uploadImage(data) {
      const file = data.file;
      try {
        let uuid = await upload(file);
        this.$set(this.imgObj, data.data.key, URL.createObjectURL(file));
        this.$set(this.form, data.data.key, uuid);
      } catch (e) {
        console.error(e)
      }
    },
  },
  async mounted() {
    await this.initMerchantTree();
    await this.getRoleParis();
    this.innerid = this.$route.params.id;
    if (this.innerid) {
      let dbData = await getInfo(this.innerid);
      this.form = dbData;
      this.form.isvalid = !!dbData.isvalid;
      this.form.account_role = dbData.account_role.split(",");
      if (this.form.head_icon) this.$set(this.imgObj, 'head_icon', this.$conf.resource.baseUrl + this.form.head_icon);
    } else {
      this.isShow = true
    }
  }
}
</script>

<style scoped>

</style>

