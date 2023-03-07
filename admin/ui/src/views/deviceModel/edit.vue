<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <divider :title="dividerTitle[0]"></divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="编号" prop="type">
            <el-input v-model="form.type" placeholder="请输入编号(M/T开头,例：M001)" :disabled="isDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应厂商" prop="manufacturer">
            <el-input v-model="form.manufacturer" placeholder="请输入供应厂商" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="硬件型号" prop="hardware_type">
            <el-input v-model="form.hardware_type" placeholder="请输入硬件型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="热敏打印机" prop="thermal_printer_type">
            <el-input v-model="form.thermal_printer_type" placeholder="请输入热敏打印机型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="激光打印机" prop="laser_printer_type">
            <el-input v-model="form.laser_printer_type" placeholder="请输入激光打印机型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="药道摄像头" prop="channel_camera_type">
            <el-input v-model="form.channel_camera_type" placeholder="请输入药道摄像头型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="扫描仪型号" prop="scanner_type">
            <el-input v-model="form.scanner_type" placeholder="请输入扫描仪型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="前置摄像头" prop="front_camera_type">
            <el-input v-model="form.front_camera_type" placeholder="请输入前置摄像头型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="取药口摄像头" prop="orifice_camera_type">
            <el-input v-model="form.orifice_camera_type" placeholder="请输入取药口摄像头型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="冷冻系统" prop="refrigeration_type">
            <el-input v-model="form.refrigeration_type" placeholder="请输入冷冻系统型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工控机型号" prop="ipc_hardware_type">
            <el-input v-model="form.ipc_hardware_type" placeholder="请输入工控机型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工控机软件" prop="ipc_software_type">
            <el-input v-model="form.ipc_software_type" placeholder="请输入工控机软件型号" maxlength="64" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <divider :title="dividerTitle[1]"></divider>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="层数" prop="aisleY">
            <el-input v-model="form.aisleY" placeholder="请输入层数, 必须为正整数" maxlength="6" :disabled="isDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="列数" prop="aisleX">
            <el-input v-model="form.aisleX" placeholder="请输入列数, 必须为正整数" maxlength="6" :disabled="isDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="药道长度" prop="length">
            <el-input v-model="form.length" placeholder="请输入药道长度, 必须为正整数" maxlength="6" :disabled="isDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="层高度" prop="height">
            <el-input v-model="form.height" placeholder="请输入默认层高度, 必须为正整数" maxlength="6" :disabled="isDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="列宽度" prop="width">
            <el-input v-model="form.width" placeholder="请输入默认列宽度, 必须为正整数" maxlength="6" :disabled="isDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <divider :title="dividerTitle[2]"></divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="药品复核" prop="imageComparison">
            <el-switch v-model="config.imageComparison" :disabled="isDisabled"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="人脸识别" prop="faceRecognition">
            <el-switch v-model="config.faceRecognition" :disabled="isDisabled"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="出药视频存留" prop="pickupMonitor">
            <el-switch v-model="config.pickupMonitor" :disabled="isDisabled"></el-switch>
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
  import {isPositiveInteger, checkTypeFormat} from '@/utils/validate';
  import divider from '@/components/Divider'
  import {getInfo, update, add} from '@/api/deviceModel'

  export default {
    components: {divider},
    name: 'deviceGroupEdit',
    filters: {},
    data() {
      return {
        isDisabled: false,//判断输入框显示隐藏
        form: {},
        config: {},
        submitLoading: false,
        innerid: '',
        //表单验证
        rules: {
          type: [
            {required: true, message: '请输入设备型号编号', trigger: 'blur'},
            {validator: checkTypeFormat, trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入设备型号名', trigger: 'blur'},
            {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'}
          ],
          aisleX: [
            {required: true, message: '请输入列数, 必须为正整数', trigger: 'blur'},
            {validator: isPositiveInteger, trigger: 'blur'},
          ],
          aisleY: [
            {required: true, message: '请输入层数, 必须为正整数', trigger: 'blur'},
            {validator: isPositiveInteger, trigger: 'blur'},
          ],
          length: [
            {required: true, message: '请输入药道长度, 必须为正整数,单位mm', trigger: 'blur'},
            {validator: isPositiveInteger, trigger: 'blur'},
          ],
          height: [
            {required: true, message: '请输入默认层高度, 必须为正整数,单位mm', trigger: 'blur'},
            {validator: isPositiveInteger, trigger: 'blur'},
          ],
          width: [
            {required: true, message: '请输入默认列宽度, 必须为正整数,单位mm', trigger: 'blur'},
            {validator: isPositiveInteger, trigger: 'blur'},
          ],
        },
        dividerTitle: ['基本信息', '药道信息', '配置信息']
      }
    },
    methods: {
      getInfo() {
        getInfo(this.innerid).then(res => {
          const dbData = res;
          let drugChannel = JSON.parse(dbData.drug_channel);
          this.form = dbData;
          this.$set(this.form, 'aisleY', drugChannel.aisleY);
          this.$set(this.form, 'aisleX', drugChannel.aisleX);
          this.$set(this.form, 'length', drugChannel.length);
          this.$set(this.form, 'height', drugChannel.height);
          this.$set(this.form, 'width', drugChannel.width);
          let configJson = JSON.parse(dbData.config_json);
          for (let key in configJson) {
            this.$set(this.config, key, configJson[key] ? true : false);
          }
        }).catch(err => {
          this.$message.warning(err.message)
        })

      },
      onSubmit() {
        this.$refs.form.validate(valide => {
          if (valide) {
            let config = {};
            for (let key in this.config) {
              config[key] = this.config[key] ? 1 : 0;
            }
            let params = {
              ...this.form,
              config: config
            };
            this.submitLoading = true;
            let promiseObj = this.innerid ? update(this.innerid, params) : add(params);
            promiseObj.then(res => {
              this.$message.success('保存成功');
              this.onCancel()
            }).catch(err => {
              this.$message.warning(err.message || '操作失败')
            }).finally(() => {
              this.submitLoading = false;
            })
          }
        })
      },
      onCancel() {
        this.$router.push('/device/model');
      },
    },
    created() {
      this.innerid = this.$route.params.id
      if (this.innerid) {
        this.isDisabled = true
        this.getInfo()
      } else {
        this.config = {imageComparison: false, faceRecognition: false, pickupMonitor: false};
        this.isDisabled = false
      }
    }
  }
</script>

<style scoped>

</style>

