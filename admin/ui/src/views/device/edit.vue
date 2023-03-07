<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
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
          <el-form-item label="设备组" prop="group_id">
            <el-select v-model="form.group_id" placeholder="请选择设备组" style="width: 100%">
              <el-option v-for="item in relativeGroupData" :key="item.innerid" :label="item.name"
                         :value="item.innerid"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备型号" prop="type">
            <el-select v-model="form.type" placeholder="请选择设备型号名称"
                       style="width: 100%"
                       :disabled="isDisabled"
                       @change="handleChange">
              <el-option v-for="item in equipmentTypeData" :key="item.innerid" :label="item.name"
                         :value="item.type"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="设备名" prop="name">
            <el-input v-model="form.name" placeholder="请输入设备名" maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isDisabled">
          <el-form-item label="设备编号" prop="no">
            <el-input v-model="form.no" placeholder="请输入设备编号" maxlength="32" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备MAC" prop="mac">
            <el-input v-model="form.mac" placeholder="请输入设备MAC" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
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
      <divider :title="dividerTitle[1]" v-if="JSON.stringify(config)!='{}'"></divider>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="药品复核" v-if="config.hasOwnProperty('imageComparison')">
            <el-switch v-model="config.imageComparison"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="人脸识别" v-if="config.hasOwnProperty('faceRecognition')">
            <el-switch v-model="config.faceRecognition"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="出药视频存留" v-if="config.hasOwnProperty('pickupMonitor')">
            <el-radio-group v-model="config.pickupMonitor">
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">视频</el-radio>
              <el-radio :label="2">图片</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <divider :title="dividerTitle[2]"></divider>
      <el-row>
        <el-col :span="8">
          <el-form-item label="当前版本" prop="current_version_id">
            <el-select v-model="form.current_version_id"
                       placeholder="请选择当前版本"
                       style="width: 100%"
                       filterable
                       clearable
                       :disabled="isDisabledId">
              <el-option
                v-for="item in version"
                :key="item.innerid"
                :label="item.version_no"
                :value="item.innerid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="更新版本" prop="refresh_version_id">
            <el-select v-model="form.refresh_version_id"
                       placeholder="请选择更新版本"
                       style="width: 100%"
                       filterable
                       clearable>
              <el-option
                v-for="item in version"
                :key="item.innerid"
                :label="item.version_no"
                :value="item.innerid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否强制升级" prop="is_force">
            <el-radio v-model="form.is_force" :label=1>是</el-radio>
            <el-radio v-model="form.is_force" :label=0>否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <divider :title="dividerTitle[3]"></divider>
    <el-row :gutter="20">
      <div class="search-panel">
        <el-date-picker
          v-model="xDate"
          :picker-options="pickerOptions"
          type="date"
          placeholder="选择日期"
          :clearable=false
          style="margin-right: 10px">
        </el-date-picker>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <line-chart :option="option"></line-chart>
    </el-row>
  </div>
</template>

<script>
  import {getMerchantTree} from "@/api/merchant";
  import {getDeviceGroupPairs} from "@/api/deviceGroup";
  import {getDevicePairs} from "@/api/deviceModel";
  import {getInfo, add, update, getTempHumHistory} from "@/api/device";
  import {versionKey} from '@/api/version';
  import {parseTree, parseTime} from "@/utils";
  import {isMac} from "@/utils/validate";
  import SelectTree from "@/components/treeSelect";
  import divider from '@/components/Divider'
  import LineChart from '@/components/Echarts/LineChart'

  export default {
    name: "edit",
    components: {SelectTree, divider, LineChart},
    data() {
      return {
        props: {                // 配置项（必选）
          value: 'value',
          label: 'label',
          children: 'children',
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        },
        submitLoading: false,
        form: {group_id: '', merchant_id: '', is_force: 0},
        rules: {
          merchant_id: [
            {required: true, message: '请选择商户', trigger: 'change'}
          ],
          group_id: [
            {required: true, message: '请选择设备组', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择设备型号', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入设备名', trigger: 'blur'}
          ],
          mac: [
            {required: true, message: '请输入设备MAC地址, 去掉-和:', trigger: 'blur'},
            {validator: isMac, trigger: 'blur'},
          ]
        },
        merchantList: [],//商户列表
        groupData: [],//设备组数据
        relativeGroupData: [],//指定商户下的设备组
        equipmentTypeData: [],//设备组型号数据
        version: [],//版本列表
        isDisabled: false, //编辑状态不可修改
        isDisabledId: false, //当前版本ID为空 可编辑
        innerid: '',
        config: {},//设备型号配置
        //折线图温湿度配置
        option: {
          title: {
            text: '设备温湿度',
            left: 'center',
            textStyle: {
              color: '#5a5858',
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          xAxis: {
            data: [],
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 100,
            right: 100,
            bottom: 60,
            top: 40,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              animation: false,
              label: {
                backgroundColor: '#409EFF'
              }
            }
          },
          yAxis: [
            {
              name: '温度°C',
              type: 'value',
              position: 'left'
            },
            {
              name: '湿度%',
              type: 'value',
              position: 'right'
            }
          ],
          legend: {
            left: 200,
            data: ['温度', '湿度']
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 35,
              end: 65
            },
            {
              type: 'inside',
              realtime: true,
              start: 35,
              end: 65
            }
          ],
          series: [{
            name: '温度',
            yAxisIndex: 0,  // 通过这个判断左右
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FF7070',
                lineStyle: {
                  color: '#FF7070',
                  width: 2
                },
              }
            },
            data: [],
          },
            {
              name: '湿度',
              yAxisIndex: 1,  // 通过这个判断左右
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#72BEDC',
                  lineStyle: {
                    color: '#72BEDC',
                    width: 2
                  },

                }
              },
              data: [],
            }]
        },
        xDate: null,
        dividerTitle: ['基本配置', '配置信息', '版本信息', '数据分析']
      }
    },
    methods: {
      //获取商户和设备组
      getOption() {
        return Promise.all([getMerchantTree(), getDeviceGroupPairs(), getDevicePairs()]).then(res => {
          this.merchantList = parseTree(res[0]);
          this.groupData = res[1];
          this.equipmentTypeData = res[2];
        }).catch(err => {
          this.$message.warning(err.message)
        })
      },
      //获取设备详情
      getInfo() {
        return getInfo(this.innerid).then(res => {
          this.form = res;
          if (this.form.hasOwnProperty('is_force')) this.isDisabledId = true;
          let configJson = JSON.parse(this.form.config_json);
          for (let key in configJson) {
            if (key != 'pickupMonitor') {
              this.$set(this.config, key, configJson[key] ? true : false);
            } else {
              this.$set(this.config, key, configJson[key]);
            }
          }
          this.getRelativeGroupData(this.form.merchant_id);
        }).catch(err => {
          this.$message.warning(err.message);
        })
      },
      //搜索温湿度记录
      handleSearch() {
        this.$set(this.option.xAxis, 'data', []);
        this.$set(this.option.series[0], 'data', []);
        this.$set(this.option.series[1], 'data', []);
        this.getTempHumHistory();
      },
      //获取设备温湿度记录
      getTempHumHistory() {
        this.xDate = this.xDate ? parseTime(this.xDate, '{y}-{m}-{d}') : parseTime(new Date(), '{y}-{m}-{d}');
        let created_time = '';
        if (this.xDate) created_time = `${this.xDate} 00:00:00 , ${this.xDate} 23:59:59`;
        return getTempHumHistory(this.innerid, {created_time}).then(res => {
          const data = res;
          for (let i = 0; i < data.length; i++) {
            this.option['xAxis'].data.push(parseTime(data[i].created_time, '{h}:{i}:{s}'));
            this.option['series'][0].data.push(data[i].temperature);
            this.option['series'][1].data.push(data[i].humidity);
          }
        }).catch(err => {
          this.$message.warning(err.message);
        })
      },
      async getVersionKey() {
        try {
          let dataList = await versionKey();
          this.version = dataList;
        } catch (err) {
          this.$message.warning(err.message || "获取数据失败");
        }
      },
      onSubmit() {
        this.$refs.form.validate(valide => {
          if (valide) {
            let config = {};
            for (let key in this.config) {
              if (key != 'pickupMonitor') {
                config[key] = this.config[key] ? 1 : 0;
              } else {
                this.$set(config, key, this.config[key]);
              }
            }
            let params = {
              ...this.form,
              config: config
            };
            //是否强制升级 不选择默认否
            this.$set(params, 'is_force', params.hasOwnProperty('is_force') ? params.is_force : 0);
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
        this.$router.push('/device/device');
      },
      //获取商户id
      getValue(value) {
        this.form.merchant_id = value
        this.getRelativeGroupData(this.form.merchant_id)
        this.form.group_id = null;
      },
      //获取定向商户关联设备组
      getRelativeGroupData(merchant_id) {
        this.relativeGroupData = this.groupData.filter(item => {
          return item.merchant_id == merchant_id
        })
      },
      //获取设备型号的配置信息
      handleChange(e) {
        this.config = {};
        let data = this.equipmentTypeData.find(item => item.type == e);
        let config = JSON.parse(data.config_json);
        for (let key in config) {
          if (config[key]) {
            if (key == 'pickupMonitor') {
              this.$set(this.config, key, 1);
            } else {
              this.$set(this.config, key, true);
            }
          }
        }
      },
    },
    async created() {
      try {
        await this.getOption();
        await this.getVersionKey();
        this.innerid = this.$route.params.id;
        if (this.innerid) {
          this.isDisabled = true;
          await this.getInfo();
          await this.getTempHumHistory();
        } else {
          this.isDisabled = false;
          this.isDisabledId = false;
        }
      } catch (err) {
        this.$message.warning(err.message);
      }

    },
  }
</script>

<style scoped>
  .search-panel {
    text-align: center;
    margin-bottom: 20px;
  }
</style>
