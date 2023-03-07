<template>
  <el-dialog title="编辑设备管理员" :visible.sync="dialogVisible" width="735px" :close-on-click-modal="false"
             :destroy-on-close="true" :show-close="true" @open="openDialog" :before-close="onCancel">
    <div v-loading="initLoading">
      <div style="padding: 14px 20px;">
        <el-transfer v-model="selectedUser" :data="allAccount" filterable :titles="['未选择账户', '已选择账户']"
                     :button-texts="['取消', '选择']"></el-transfer>
      </div>
      <div style="text-align: center">
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {getAdminList, getAccountList, getAdminSave} from '@/api/device'

export default {
  props: ["dialogVisible", "dialogData"],
  name: "coustomDialog",
  data() {
    return {
      submitLoading: false,
      initLoading: false,
      selectedUser: [],
      allAccount: [],
    }
  },
  methods: {
    openDialog() {
      this.getAccountList()
      this.getAdminList()
    },
    //所有账户
    getAccountList() {
      getAccountList({merchant_id: this.dialogData.merchant_id}).then(res => {
        let accountList = res
        accountList = Array.isArray(accountList) ? accountList : [];
        this.allAccount = accountList.map(item => {
          return {key: item.account_id, label: item.label};
        });
      })
    },
    //已选中账户
    getAdminList() {
      getAdminList({equipment_id: this.dialogData.equipment_id}).then(res => {
        let adminList = res
        adminList = Array.isArray(adminList) ? adminList : [];
        this.selectedUser = adminList.map(item => item.account_id);
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    onSubmit() {
      let params = {
        merchant_id: this.dialogData.merchant_id,
        equipment_id: this.dialogData.equipment_id,
        accountArr: JSON.parse(JSON.stringify(this.selectedUser))
      }
      this.submitLoading = true
      getAdminSave(params).then(res => {
        this.$message.success('保存成功');
        this.onCancel()
      }).catch(err => {
        this.$message.warning(err.message || '保存失败');
      }).finally(() => {
        this.submitLoading = false;
      })
    },
    onCancel() {
      this.$emit("closeCallback")
    }
  },
}
</script>

<style scoped>

</style>
