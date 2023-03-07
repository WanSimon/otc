<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <divider :title="dividerTitle[0]"></divider>
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
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入规则名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预警类型" prop="type">
            <el-select v-model="form.type" placeholder="预警类型" clearable @change="changeWarningType"
                       style="width:100%;">
              <el-option v-for="(item,index) in $conf.warningTypeConf"
                         :key="index"
                         :label="item.label"
                         :value="index+1">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="启用" prop="status">
            <el-switch v-model="form.status"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.type">
        <divider :title="dividerTitle[1]"></divider>
        <el-row :gutter="20" v-if="form.type == $conf.warningTypeConf[6].Fault">
          <el-form-item label="故障类型" prop="faultType">
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
              <el-col :span="14">
                <el-select v-model="warningType.faultType" placeholder="请选择故障类型" clearable style="width: 100%">
                  <el-option v-for="(item,index) in faultType"
                             :key="index"
                             :label="item"
                             :value="index">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="执行时间" prop="executeTime">
            <el-col :xs="24" :sm="24" :md="12" :lg="12">
              <el-col :span="5">
                <el-select v-model="warningType.executeType" placeholder="请选择单位" clearable style="width: 100%">
                  <el-option label="分钟" value="1"></el-option>
                  <el-option label="小时" value="2"></el-option>
                  <el-option label="天" value="3"></el-option>
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-input v-model.number="warningType.executeNum" placeholder="请输入数值" @change="changeNum"></el-input>
              </el-col>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="20" v-if="form.type != $conf.warningTypeConf[6].Fault">
          <template v-for="item in warningLevel">
            <el-form-item :label="item.label" prop="content">
              <el-col :xs="24" :sm="24" :md="12" :lg="12">
                <el-col :span="4">
                  <el-tag :type="item.type">{{ item.level }}</el-tag>
                </el-col>
                <el-col :span="10" v-if="form.type != $conf.warningTypeConf[4].Temperature">
                  <el-input v-model.number="warningType['warningInfo'][item['key']]" placeholder="请输入阈值"
                            @change="((val)=>{changeThreshold(val, item['key'])})"
                            @input="((val)=>{changeThreshold(val, item['key'])})"></el-input>
                </el-col>
                <el-col :span="10" v-else>
                  <el-input v-model.number="warningType['warningInfo'][`${item['key']}Max`]"
                            placeholder="请输入阈值"></el-input>
                </el-col>
                <el-col :span="10" class="alarm">
              <span v-if="warningType['warningInfo'][item['key']] && form.type != $conf.warningTypeConf[4].Temperature">
                <span v-if="form.type==$conf.warningTypeConf[0].Expiry">
                  药品库有效期到期 <= {{ warningType['warningInfo'][item['key']] }} 天就产生 {{ item.level }}
                </span>
                 <span v-if="form.type==$conf.warningTypeConf[1].Network">
                  设备离线时长 >= {{ warningType['warningInfo'][item['key']] }} 分钟就产生{{ item.level }}
                </span>
                 <span v-if="form.type==$conf.warningTypeConf[2].Print">
                  打印机异常时长 >= {{ warningType['warningInfo'][item['key']] }} 分钟就产生{{ item.level }}
                </span>
                <span v-if="form.type==$conf.warningTypeConf[3].Stock">
                  某品类药品库存数 <= {{ warningType['warningInfo'][item['key']] }}% 时就产生{{ item.level }}
                </span>
                <span v-if="form.type==$conf.warningTypeConf[5].Humidity">
                  湿度 >= {{ warningType['warningInfo'][item['key']] }} %就产生{{ item.level }}
                </span>
              </span>
                  <span v-if="form.type == $conf.warningTypeConf[4].Temperature">
                <span v-if="warningType['warningInfo'][`${item['key']}Max`]">
                  温度 >= {{ warningType['warningInfo'][`${item['key']}Max`] }}°C
                </span>
                <span
                  v-if="warningType['warningInfo'][`${item['key']}Max`]||warningType['warningInfo'][`${item['key']}Min`]">
                  就产生{{ item.level }}
                </span>
              </span>
                </el-col>
              </el-col>
            </el-form-item>
          </template>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="预警方式" prop="notify">
            <el-col :span="8">
              <el-checkbox-group v-model="warningType.notify">
                <el-checkbox label="1" name="notify">邮件</el-checkbox>
                <el-checkbox label="2" name="notify">短信</el-checkbox>
                <el-checkbox label="3" name="notify">微信公众号</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-form-item>
        </el-row>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import {getMerchantTree} from "@/api/merchant";
import {getInfo, getType, update, add} from "@/api/warningRules";
import {parseTree} from "@/utils";
import divider from '@/components/Divider'
import SelectTree from "@/components/treeSelect";

export default {
  components: {divider, SelectTree},
  name: "edit",
  data() {
    return {
      props: {                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      innerid: '',
      form: {},
      submitLoading: false,
      //商户数据
      merchantList: [],
      //预警配置
      warningType: {
        faultType: '',
        executeType: '',
        executeNum: '',
        warningInfo: {urgent: '', main: '', minor: '', hint: ''},
        notify: [],
      },
      //故障类型
      faultType: {},
      //该预警初始故障类型
      initialFaultType: '',
      //预警级别
      warningLevel: [
        {label: '预警级别', type: 'danger', level: '紧急告警', key: 'urgent'},
        {label: '', type: 'warning', level: '主要告警', key: 'main'},
        {label: '', type: '', level: '次要告警', key: 'minor'},
        {label: '', type: 'info', level: '提示告警', key: 'hint'}
      ],
      //表单验证
      rules: {
        name: [
          {required: true, message: '请输入规则名称', trigger: 'blur'},
        ],
        merchant_id: [
          {required: true, message: '请选择商户', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择预警类型', trigger: 'blur'}
        ]
      },
      dividerTitle: ['基本信息', '预警配置']
    }
  },
  methods: {
    // 取值
    getValue(value) {
      this.form.merchant_id = value;
      this.$set(this.warningType, 'faultType', '');
    },
    getInfo() {
      getInfo(this.innerid).then(res => {
        const dbData = res;
        this.initialFaultType = JSON.parse(dbData.config).faultType,
          this.form = {
            merchant_id: dbData.merchant_id,
            name: dbData.name,
            type: dbData.type,
            status: !!dbData.status,
            stockConf: {warningInfo: {}, notify: []},
            expiryConf: {warningInfo: {}, notify: []},
            networkConf: {warningInfo: {}, notify: []},
            temConf: {warningInfo: {}, notify: []},
            humConf: {warningInfo: {}, notify: []},
            printConf: {warningInfo: {}, notify: []},
            faultConf: {warningInfo: {}, notify: []}
          }
        this.$conf.warningTypeConf.forEach((item, index) => {
          if (index + 1 == this.form['type']) {
            this.form[item.conf] = JSON.parse(dbData.config)
            this.warningType = this.form[item.conf]
          }
        })
      }).catch(err => {
        this.$message.warning(err.message)
      })

    },
    onSubmit() {
      this.$refs.form.validate((v) => {
        if (v) {
          if (this.form.type == this.$conf.warningTypeConf[6].Fault && !this.warningType.faultType) {
            return this.$message.warning('请选择故障类型');
          }
          let params = {
            conf: JSON.stringify(this.warningType),
            merchant_id: this.form.merchant_id,
            name: this.form.name,
            type: this.form.type,
            status: this.form.status ? 1 : 0,
          }
          this.submitLoading = true;
          let promiseObj = this.innerid ? update({...params, innerid: this.innerid}) : add(params);
          promiseObj.then(() => {
            this.$message.success('保存成功');
            this.onCancel()
          }).catch(err => {
            this.$message.warning('保存失败')
          }).finally(() => {
            this.submitLoading = false;
          })
        }
      })
    },
    onCancel() {
      this.$router.push('/warning/rules');
    },
    getMerchantTree() {
      return getMerchantTree().then(res => {
        this.merchantList = parseTree(res)
      }).catch(err => [
        this.$message.warning(err.message)
      ])
    },
    changeWarningType(e) {
      this.$conf.warningTypeConf.forEach((item, index) => {
        if (index + 1 == e) {
          this.warningType = this.form[item.conf]
        }
      })
    },
    //执行时间单位为分钟时，时间不得小于十分钟
    changeNum(e) {
      if (this.warningType.executeType == 1 && Number(e) < 10) {
        this.$set(this.warningType, 'executeNum', 10);
      }
    },
    //改变阈值时
    changeThreshold(e,key) {
      //库存
      if (this.form.type == this.$conf.warningTypeConf[3].Stock && Number(e) > 100) {
        this.$set(this.warningType['warningInfo'], key, 100);
      }
    },
    //故障类型
    getType(merchant_id, type) {
      this.faultType = {};
      let faultType = Object.assign({}, this.$conf.faultType);
      let req = {
        merchant_id: merchant_id,
        type: type
      }
      getType(req).then(res => {
        const data = res;
        if (data.length > 0) {
          for (let item of data) {
            let config = JSON.parse(item.config);
            let type = config['faultType'];
            if (type != this.initialFaultType) {
              delete faultType[type];
            }
          }
          for (let key in faultType) {
            this.$set(this.faultType, key, faultType[key])
          }
        } else {
          this.faultType = faultType;
        }
      }).catch(err => {
        this.$message.warning(err.message);
      })
    }
  },
  async created() {
    this.faultType = this.$conf.faultType;
    await this.getMerchantTree()
    this.innerid = this.$route.params.id
    if (!this.innerid) {
      this.form = {
        merchant_id: '',
        name: '',
        type: '',
        status: true,
        stockConf: {warningInfo: {}, notify: []},
        expiryConf: {warningInfo: {}, notify: []},
        networkConf: {warningInfo: {}, notify: []},
        temConf: {warningInfo: {}, notify: []},
        humConf: {warningInfo: {}, notify: []},
        printConf: {warningInfo: {}, notify: []},
        faultConf: {warningInfo: {}, notify: []},
      }
    } else {
      this.getInfo()
    }
  },
  watch: {
    'warningType.executeType': {
      handler(newV, oldV) {
        let executeNum = Number(this.warningType.executeNum || '');
        if (newV == 1 && executeNum < 10) this.$set(this.warningType, 'executeNum', 10);
      },
      deep: true
    },
    'form.merchant_id': {
      handler(newV, oldV) {
        let merchant_id = this.form.merchant_id;
        let type = this.$conf.warningTypeConf[6].Fault;
        if (merchant_id && this.form.type == type) {
          this.getType(merchant_id, type);
        }
      },
      deep: true
    },
    'form.type': {
      handler(newV, oldV) {
        let merchant_id = this.form.merchant_id;
        let type = this.$conf.warningTypeConf[6].Fault;
        if (merchant_id && this.form.type == type) {
          this.getType(merchant_id, type);
        }
      },
      deep: true
    },
    }
  }
</script>

<style scoped>
.alarm {
  font-size: 12px;
  color: red
}
</style>
