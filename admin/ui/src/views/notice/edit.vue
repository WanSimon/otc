<template>
 <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" maxlength="64" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item label="有效期" prop="period">
            <el-date-picker style="width:100%;" v-model="form.period" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="公告类型" prop="type">
            <el-select style="width: 100%" v-model="form.type" placeholder="请选择公告类型">
              <el-option v-for="(item, idx) in $conf.noticeType" :key="idx" :label="item" :value="idx * 1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发布渠道" prop="place_list">
            <el-select style="width: 100%" v-model="form.place_list" multiple filterable clearable placeholder="请选择发布渠道">
              <el-option v-for="(item, idx) in $conf.noticePlace" :key="idx" :label="item" :value="idx"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="28" v-if="form.place_list.indexOf('1') != -1">
          <el-form-item label="设备组" prop="equipment_group_list">
            <el-transfer
            v-model="form.equipment_group_list"
            :data="data"
            :button-texts="['取消', '选择']"
            :titles="['未选择设备组', '已选择设备组']"></el-transfer>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="公告内容" prop="content">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入公告内容"
              v-model="form.content">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="备注" prop="remarks">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.remarks">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
        <el-button type="primary" @click="release" :loading="submitLoading">保存并发布</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getInfo, update, add} from '@/api/notice';
import {getDeviceGroupPairs} from '@/api/deviceGroup'
import {parseTree} from '@/utils/index'
import {getMerchantTree} from '@/api/merchant';
import SelectTree from "@/components/treeSelect";

export default {
  name: 'noticeEdit',
  components: { SelectTree },
  data() {
    return {
      props:{                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        parentId: 'parentId'
        // disabled:true
      },
      list: [],
      merchantList: [],
      form: {
        place_list:[],
        equipment_group_list:[],
        merchant_id: '',
        period: null
      },
      submitLoading: false,
      //表单验证
      rules: {
        merchant_id: [
          {required: true, message: '请选择商户', trigger: 'change'}
        ],
        title: [
          {required: true, message: '请添加标题', trigger: 'change'}
        ],
        period: [
          {required: true, message: '请确认日期', trigger: 'change'}
        ],
        type: [
          {required: true, message: '请选择类型', trigger: 'change'}
        ],
        place_list: [
          {required: true, message: '请选择发布渠道', trigger: 'change'}
        ],
        equipment_group_list: [
          {required: true, message: '请选择设备组', trigger: 'change'}
        ],
        content: [
          {required: true, message: '请添加标内容', trigger: 'change'}
        ],
      },
      groupData: [],//设备组数据
      relativeGroupData: [],//指定商户下的设备组
      data: [],
    }
  },
  methods: {
    // 取值
    getValue(value){
      if (value && value instanceof Array && value.length > 0) {
        let arr = [...value];
        this.form.merchant_id = arr.pop();
      } else {
        this.form.merchant_id = value;
      }
      this.getRelativeGroupData(this.form.merchant_id)
      this.form.equipment_group_list = [];
    },
    //获取商户和设备组
    getOption() {
      return Promise.all([getMerchantTree(), getDeviceGroupPairs()]).then(res => {
        this.merchantList = parseTree(res[0]);
        this.groupData = res[1];
      }).catch(err => {
        this.$message.warning(err.message)
      })
    },
    //获取公告详情
    getInfo() {
      getInfo(this.innerid).then(res => {
        this.form = res
        if(res.equipment_group_list){
        this.form.equipment_group_list = res.equipment_group_list.split(",");
        }else{
          this.form.equipment_group_list = []
        }
        this.form.place_list = res.place_list.split(",");
        this.$set(this.form, 'period', [new Date(this.form.begin_time), new Date(this.form.end_time)]);
        this.getRelativeGroupData(this.form.merchant_id);
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    //获取定向商户关联设备组
    getRelativeGroupData(merchant_id) {
      this.relativeGroupData = this.groupData.filter(item => {
        return item.merchant_id == merchant_id
      })
      this.data = []
      this.relativeGroupData.forEach((item, index) => {
        this.data.push({
          label: item.name,
          key: item.innerid,
        });
      });
    },
    // 保存
    async onSubmit() {
      this.submitLoading = true;
      this.$refs.form.validate(async valide => {
        if (valide) {
          let params = {
            ...this.form
          };
          params.period[0] = `${this.$moment(this.form.period[0]).format('YYYY-MM-DD HH:mm:ss')}`
          params.period[1] = `${this.$moment(this.form.period[1]).format('YYYY-MM-DD HH:mm:ss')}`
          if(params.equipment_group_list) {
            params.equipment_group_list = this.form.equipment_group_list.join(",");
          }else{
            this.form.equipment_group_list = []
          }
          params.place_list = this.form.place_list.join(",");
          try {
            if (this.innerid) {
              await update(this.innerid, params);
            } else {
              await add(params);
            }
            this.$message.success('保存成功');
            this.$router.push('/notice/notice');
          } catch (err) {
            this.$message.warning('保存失败');
            this.submitLoading = false;
          }
        } else {
          this.submitLoading = false;
        }
      });
    },
    // 保存并发布
    release() {
      this.submitLoading = true;
      this.form.status = 1;
      this.$refs.form.validate(async valide => {
        if (valide) {
          let params = {
            ...this.form
          };
          params.period[0] = `${this.$moment(this.form.period[0]).format('YYYY-MM-DD HH:mm:ss')}`
          params.period[1] = `${this.$moment(this.form.period[1]).format('YYYY-MM-DD HH:mm:ss')}`
          if(params.equipment_group_list) {
            params.equipment_group_list = this.form.equipment_group_list.join(",");
          }
          params.place_list = this.form.place_list.join(",");
          try {
            if (this.innerid) {
              await update(this.innerid, params);
            } else {
              await add(params);
            }
            this.$message.success('保存成功');
            this.$router.push('/notice/notice');
          } catch (err) {
            this.$message.warning('保存失败');
            this.submitLoading = false;
          }
        } else {
          this.submitLoading = false;
        }
      });
    },
    // 关闭
    onCancel() {
      this.$router.push('/notice/notice');
    },
  },
  async mounted() {
    await this.getOption()
    this.innerid = this.$route.params.id;
    if (this.innerid) {
      this.getInfo()
    }
  }
}
</script>

<style scoped>

</style>

