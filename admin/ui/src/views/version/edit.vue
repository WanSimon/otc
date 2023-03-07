<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="版本号" prop="version_no">
            <el-input v-model="form.version_no" placeholder="请输入版本号" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="是否最新版本" prop="is_latest">
            <el-radio v-model="form.is_latest" :label=1>是</el-radio>
            <el-radio v-model="form.is_latest" :label=0>否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="上一个版本id" prop="previous_version_id">
            <el-select v-model="form.previous_version_id" filterable placeholder="请选择" style="width: 100%" clearable>
              <el-option
                v-for="item in version"
                :key="item.innerid"
                :label="item.version_no"
                :value="item.innerid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="最低兼容版本" prop="compatible_version_id">
            <el-select v-model="form.compatible_version_id" filterable placeholder="请选择" style="width: 100%" clearable>
              <el-option
                v-for="item in version"
                :key="item.innerid"
                :label="item.version_no"
                :value="item.innerid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="apk MD5" prop="apk_md5">
            <el-input v-model="form.apk_md5" placeholder="请输入apk MD5" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="下载地址" prop="download_url">
            <el-input v-model="form.download_url" placeholder="请输入下载地址" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
          <el-form-item label="修改内容">
            <el-table
              :data="form.modify_content"
              border
              max-height="300"
              style="width: 100%"
              size="mini">
              <el-table-column type="index" width="50" align="center"></el-table-column>
              <el-table-column label="类型" clearable align="center" width="200">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type" placeholder="请选择更新版本类型" clearable style="width:100%;">
                    <el-option v-for="item in type " :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="内容" align="center">
                <template slot-scope="scope">
                  <el-input type="textarea" v-model="scope.row.content" placeholder="请输入更新版本内容" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template slot-scope="{row,$index}">
                  <div class="operation">
                    <div class="operation_btn" @click="addRow($index)"><i
                      class="el-icon-circle-plus-outline"></i></div>
                    <div class="operation_btn" @click="reduceRow($index)"><i
                      class="el-icon-remove-outline"></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <div slot="empty" style="height:60px;line-height: 60px;font-size: 14px">
                暂无数据,请点击
                <el-button type="text" size="mini" @click="addRow(0)">添加新的一行</el-button>
              </div>
            </el-table>
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
  import {getInfo, update, add, versionKey} from '@/api/version';

  export default {
    name: 'edit',
    data() {
      return {
        form: {
          is_latest: 1,
          modify_content: [],
        },
        version: [],
        submitLoading: false,
        selectLoading: false,

        //表单验证
        rules: {
          version_no: [
            {required: true, message: '请输入版本号', trigger: 'change'},
          ]
        },
        //路由参数id
        innerid: '',
        //版本功能类型
        type: [{
          value: 1,
          label: '新增'
        }, {
          value: 2,
          label: '修改'
        },
          {
            value: 3,
            label: '删除'
          }]
      }
    },
    methods: {
      async getInfo() {
        try {
          let dbData = await getInfo(this.innerid);
          this.form = dbData;
          this.$set(this.form, 'modify_content', JSON.parse(this.form.modify_content));
        } catch (err) {
          this.$message.warning(err.message);
        }
      },
      async getVersionKey() {
        try {
          let dataList = await versionKey({innerid: this.innerid});
          this.version = dataList;
        } catch (err) {
          this.$message.warning(err.message || "获取数据失败");
        }
      },
      // 保存
      async onSubmit() {
        this.submitLoading = true;
        this.$refs.form.validate(async valide => {
          if (valide) {
            this.$set(this.form, 'modify_content', JSON.stringify(this.form.modify_content));
            let params = {
              ...this.form,
            };
            try {
              if (this.innerid) {
                await update(this.innerid, params);
              } else {
                await add(params);
              }
              this.$message.success('保存成功');
              this.onCancel();
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
        this.$router.push('/system/version');
      },
      //新增行
      addRow(index) {
        let obj = {type: '', content: ''};
        this.form.modify_content.splice(index + 1, 0, obj);
      },
      //删除行
      reduceRow(index) {
        this.form.modify_content.splice(index, 1)
      }
    },
    async mounted() {
      this.innerid = this.$route.params.id;
      await this.getVersionKey();
      if (this.innerid) {
        await this.getInfo();
      }
    }
  }
</script>

<style scoped lang="scss">
  .operation {
    padding: 0px 5px;
    width: 100%;
    display: inline-flex;
    font-size: 18px;
    flex-direction: row;
    justify-content: space-between;

    &_btn {
      width: 20px;
      height: 20px;
      color: #409EFF;

      &:hover {
        cursor: pointer;
      }

      &:last-child {
        color: #F56C6C;
      }
    }
  }
</style>

