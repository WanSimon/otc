<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="130px">
      <el-row>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="设备" prop="type">
            <el-input v-model="form.equipment_name" placeholder="" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="事件时间" prop="type">
            <el-input v-model="form.time" placeholder="" disabled></el-input>
            <!--            <span>{{}}</span>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="事件内容" prop="type">
            <el-input v-model="form.content" placeholder="" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="24" :md="12" :lg="8">
          <el-form-item label="处理描述" prop="type">
            <el-input type="textarea" v-model="form.resolve_content" placeholder="请输入处理描述" :rows="5"
                      maxlength="500" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onHandle" :loading="submitLoading" v-if="!disabled">处理</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getInfo, update} from '@/api/event';
  import {LogStatus} from '@/js/common';
  import {parseTime} from '@/utils/index'

  export default {
    name: "handle_log",
    data() {
      return {
        submitLoading: false,
        form: {},
        innerid: '',
        disabled:null,
      }
    },
    methods: {
      getInfo() {
        getInfo(this.innerid).then(res => {
          const data = res;
          this.form = data;
          this.$set(this.form, 'time', parseTime(this.form.time, '{y}-{m}-{d} {h}:{i}:{s}'));
          this.disabled = (this.form.status == LogStatus.LS_Settled);
        }).catch(err => {
          this.$message.warning(err.message);
        })
      },
      onHandle() {
        let obj = {
          status: LogStatus.LS_Settled,
          resolve_content: this.form.resolve_content
        }
        this.submitLoading = true;
        update(this.innerid, obj).then(res => {
          this.$message.success('处理成功');
          this.onCancel();
        }).catch(err => {
          this.$message(err.message || '处理错误事件失败');
        }).finally(() => {
          this.submitLoading = false;
        })
      },
      onCancel() {
        this.$router.push('/event/logs');
      }
    },
    created() {
      this.innerid = this.$route.params.id;
      this.getInfo();
    }
  }
</script>

<style scoped>

</style>
