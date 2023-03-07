<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8">
          <el-form-item label="商品名称" prop="name">
            <el-select :disabled="!!innerid"
                       @change="handleSelect"
                       style="width: 100%;"
                       v-model="form.name"
                       clearable
                       filterable
                       remote
                       placeholder="请输入商品名, 支持商品名、国际条码搜索"
                       :remote-method="remoteMethod"
                       :loading="loading">
              <el-option v-for="item in productData" :key="item.innerid" :label="item.name" :value="item.innerid">
                <span>{{ item.name }}</span>
                <span v-if="item.bar_code">({{ '条码:' + item.bar_code }}
                <span v-if="item.batch"> | {{ '批次:' + item.batch }}</span>
                <span v-if="item.batch_number"> | {{ '批号:' + item.batch_number }}</span>)
                </span>
              </el-option>
              <div v-if="productData.length ==0" slot="empty"
                   style="padding: 10px 0;margin: 0;text-align: center;color: #999;font-size: 14px;">
                <span>未找到药品信息, </span>
                <el-link type="primary" @click="handleAdd">添加药品</el-link>
              </div>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!!form.name">
          <el-form-item label="商品图片" prop="home_thumb_url">
            <div v-if="imgObj.home_thumb_url">
              <el-image :preview-src-list="[imgObj.home_thumb_url]"
                        :src="imgObj.home_thumb_url"
                        style="width:100px;height:100px;border: 1px dotted #c4c2c2">
              </el-image>
            </div>
            <span v-else>{{ '-' }}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" v-if="!!form.name">
          <el-form-item label="包装尺寸" prop="productSize">
            <span v-if="productSize.length && productSize.width && productSize.height">
            {{ `${productSize.length}(mm) x ${productSize.width}(mm) x ${productSize.height}(mm)` }}
            </span>
            <span v-else>{{ '-' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="!!form.name">
        <el-col :xs="24" :sm="14" :md="14" :lg="10">
          <el-form-item label="摆药方式">
            <el-table
              ref="displayTable"
              :data="displayList"
              border
              highlight-current-row
              @row-click="rowClick"
              max-height="300"
              style="width: 100%">
              <el-table-column label width="35">
                <template slot-scope="{row,$index}">
                  <el-radio :label="row.innerid" v-model="radioId" @click.native.prevent=""></el-radio>
                </template>
              </el-table-column>
              <el-table-column label="X轴" clearable align="center">
                <template slot-scope="{row,$index}">
                  {{ row.x }}
                </template>
              </el-table-column>
              <el-table-column label="Y轴" clearable align="center">
                <template slot-scope="{row,$index}">
                  {{ row.y }}
                </template>
              </el-table-column>
              <el-table-column label="Z轴" clearable align="center">
                <template slot-scope="{row,$index}">
                  {{ row.z }}
                </template>
              </el-table-column>
              <el-table-column label="摆放示意图" align="center" width="120">
                <template slot-scope="{row,$index}">
                  <div v-if="row.show_image_url">
                    <el-image :preview-src-list="[row.show_image_url]"
                              :src="row.show_image_url"
                              style="width:100px;height:100px;border: 1px dotted #c4c2c2">
                    </el-image>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8">
          <el-form-item label="复核">
            <el-switch v-model="form.image_comparison"
                       :disabled="!config.hasOwnProperty('imageComparison')"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8">
          <el-form-item label="药道深度">
            <span>{{ slot_info.length }}(mm)</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8">
          <el-form-item label="锁定库存" prop="lock_stock">
            <el-input v-model="form.lock_stock" placeholder="请输入锁定库存"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8">
          <el-form-item label="商品数量" prop="real_stock">
            <el-input v-model="form.real_stock" placeholder="请输入商品数量"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="8">
          <el-form-item label="最大上药数" prop="upper_limit">
            <el-input v-model="form.upper_limit" placeholder="请输入商品最大上药数量"></el-input>
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
  import {isPositiveInteger} from '@/utils/validate';
  import {getPairs} from "@/api/merchantProduct";
  import {getInfo, update, add} from "@/api/deviceProduct";
  import {getInfo as getDeviceInfo} from "@/api/device";
  import {getDisplay} from "@/api/product";

  export default {
    name: "edit",
    data() {
      let numControl = (rule, value, callback) => {
        if (Number(value) <= Number(this.form.upper_limit)) {
          if (Number.isInteger(Number(value)) && Number(value) >= 0) {
            callback();
          } else {
            callback(new Error('请输入正整数'));
          }
        } else {
          callback(new Error('商品数量需小于等于最大上药数'));
        }
      };
      return {
        form: {},
        displayList: [],//药品摆放方式
        //选择商品时loading
        loading: false,
        submitLoading: false,
        //搜索出来的商品数据
        productData: [],
        rules: {
          name: [
            {required: true, message: '请输入商品', trigger: 'change'},
          ],
          lock_stock: [
            {required: true, message: '请输入锁定库存', trigger: 'blur'},
            {validator: numControl, trigger: 'blur'},
          ],
          real_stock: [
            {required: true, message: '请输入商品数量', trigger: 'blur'},
            {validator: numControl, trigger: 'blur'},
          ],
          upper_limit: [
            {required: true, message: '请输入商品最大上药数量', trigger: 'blur'},
            {validator: isPositiveInteger, trigger: 'blur'},
          ],
        },
        imgObj: {home_thumb_url: ''},
        innerid: '',
        slot_info: {length: ''},//选中的药品详情
        //药品包装尺寸
        productSize: {
          length: '',
          width: '',
          height: '',
        },
        currentRow: null,
        radioId: '',
        config: {},//设备型号配置
      }
    },
    methods: {
      //库存详情
      getInfo() {
        getInfo(this.innerid).then(res => {
          const data = res;
          this.form = data;
          this.$set(this.form, 'image_comparison', this.form['image_comparison'] ? true : false);
          this.$set(this.imgObj, 'home_thumb_url', `${this.$conf.resource.baseUrl}${data.home_thumb_url}`);
          //药品包装尺寸
          this.$set(this.productSize, 'length', data.product_length / 100);
          this.$set(this.productSize, 'width', data.product_width / 100);
          this.$set(this.productSize, 'height', data.product_height / 100);
          //摆药方式
          this.getProductDisplay(data.product_id, data.product_display);
          //设备详情
          this.getDeviceInfo(this.form.equipment_id);
        }).catch(err => {
          this.$message.warning(err.message);
        })
      },
      //设备详情
      getDeviceInfo(id) {
        getDeviceInfo(id).then(res => {
          const dbData = res;
          this.config = JSON.parse(dbData.config_json);
          if (this.config.hasOwnProperty('imageComparison') && !this.innerid) {
            this.$set(this.form, 'image_comparison', this.config['imageComparison'] ? true : false);
          }
        }).catch(e => {
          this.$message.warning(e.message);
        })
      },
      //商品远程搜索
      async remoteMethod(query) {
        try {
          if (query) {
            this.loading = true;
            let dataList = await getPairs({keywords: query, merchant_id: this.$route.query.mid});
            this.productData = dataList;
            this.loading = false;
          }
        } catch (err) {
          this.loading = false;
        }
      },
      //选择商品名称
      handleSelect(id) {
        if (id) {
          let filterList = this.productData.find(item => {
            return item.innerid == id;
          })
          if (filterList) {
            this.$set(this.imgObj, 'home_thumb_url', `${this.$conf.resource.baseUrl}${filterList.home_thumb_url}`);
            this.$set(this.productSize, 'length', filterList.product_length / 100);
            this.$set(this.productSize, 'width', filterList.product_width / 100);
            this.$set(this.productSize, 'height', filterList.product_height / 100);
            this.$set(this.form, 'name', filterList.name);
            this.$set(this.form, 'merchant_product_id', filterList.innerid);
            this.$set(this.form, 'upper_limit', '');
          }
          this.getProductDisplay(filterList.product_id);
        }
      },
      //药品摆放方式
      getProductDisplay(product_id, direction = null) {
        getDisplay(product_id).then(res => {
          let data = res;
          this.displayList = [];
          data.forEach((item, index) => {
            let display = this.$conf.productDisplays[item.display - 1];
            let displayItem = {x: '', y: '', z: ''}
            for (let v in displayItem) {
              if (display[v].key === 1) {
                displayItem[v] = `长 ${this.productSize.length} (mm)`;
              } else if (display[v].key === 2) {
                displayItem[v] = `宽 ${this.productSize.width} (mm)`;
              } else if (display[v].key === 3) {
                displayItem[v] = `高 ${this.productSize.height} (mm)`;
              } else {
                displayItem[v] = '';
              }
            }
            this.displayList.push({
              ...displayItem,
              show_image_url: this.$conf.resource.baseUrl + item.show_image_url,
              display: item.display,
              innerid: item.innerid
            });
          })
          //选中的摆放方式
          if (this.displayList.length > 0) {
            this.radioId = direction;
          }
        }).catch(err => {
          this.$message.warning(err.message || '获取摆放方式失败');
        })
      },
      //选择摆药方式
      rowClick(row) {
        if (this.radioId && this.radioId === row.innerid) {
          this.radioId = '';
          this.$set(this.form, 'upper_limit', '');
        } else {
          this.radioId = row.innerid;
          this.getSize(row);
        }
        this.$set(this.form, 'product_display', this.radioId);
      },
      //摆放尺寸
      getSize(size) {
        //坐标轴x,y,z
        let x = Number(size['x'].replace(/[^\d.]/g, ''));
        let y = Number(size['y'].replace(/[^\d.]/g, ''));
        let z = Number(size['z'].replace(/[^\d.]/g, ''));
        //计算最大上药数
        this.$set(this.form, 'upper_limit', Math.floor(this.slot_info.length / z));
      },
      onSubmit() {
        this.$refs.form.validate(valide => {
          if (valide) {
            let image_comparison = this.form.image_comparison ? 1 : 0;
            let params = {
              ...this.form,
              image_comparison: image_comparison,
              merchant_id: this.$route.query.mid,
              equipment_id: this.$route.query.eid,
              slot_no: this.$route.query.sn,
            };
            this.submitLoading = true;
            let promiseObj = this.innerid ? update(this.innerid, this.form) : add(params);
            promiseObj.then(res => {
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
      handleAdd() {
        this.$router.push('/product/addProduct');
      },
      onCancel() {
        window.history.back();
      },
    },
    created() {
      //药道尺寸
      this.$set(this.slot_info, 'length', this.$route.query.len);
      this.innerid = this.$route.query.id;
      if (this.innerid) {
        this.getInfo();
      } else {
        this.getDeviceInfo(this.$route.query.eid);
      }
    }
  }
</script>

<style scoped lang="scss">
  .tips {
    text-align: center;
    color: #909399;
    font-size: 10px;
    padding: 10px;
  }

  .img {
    width: 200px;
    height: 40px;
    background-color: #36a3f7;
  }
</style>
