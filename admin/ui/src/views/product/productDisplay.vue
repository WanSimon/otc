<template>
  <el-dialog title="摆放方式" :visible.sync="dialogVisible" width="1000px" :close-on-click-modal="false"
             :destroy-on-close="true" :show-close="true" @open="open" :before-close="onCancel">
    <el-table
      :data="list"
      border
      max-height="600"
      style="width: 100%">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="X轴" clearable align="center">
        <template slot-scope="{row,$index}">
          <el-select v-model="row['x'].key" placeholder="请选择尺寸" clearable style="width:100%;"
                     @focus="focusSize(row)">
            <el-option v-for="(item,index) in size" :key="index" :label="item.label+item.value"
                       :value="item.key" v-show="item.show">
              <span>{{ item.label }}</span>
              <span>{{ item.value }}(mm)</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Y轴" clearable align="center">
        <template slot-scope="{row,$index}">
          <el-select v-model="row['y'].key" placeholder="请选择尺寸" clearable style="width:100%;"
                     @focus="focusSize(row)">
            <el-option v-for="(item,index) in size" :key="index" :label="item.label+item.value"
                       :value="item.key" v-show="item.show">
              <span>{{ item.label }}</span>
              <span>{{ item.value }}(mm)</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Z轴" clearable align="center">
        <template slot-scope="{row,$index}">
          <el-select v-model="row['z'].key" placeholder="请选择尺寸" clearable style="width:100%;"
                     @focus="focusSize(row)">
            <el-option v-for="(item,index) in size" :key="index" :label="item.label+item.value"
                       :value="item.key" v-show="item.show">
              <span>{{ item.label }}</span>
              <span>{{ item.value }}(mm)</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="摆放示意图" align="center">
        <template slot-scope="{row,$index}">
          <el-select v-model="row.layout_url" style="width: 100%;" placeholder="请选择"
                     @change="changeSelection(row.layout_url,$index)"
                     :id="'url'+$index"
                     clearable>
            <el-option
              v-for="item in displayImage"
              :key="item.innerid"
              :label="item.innerid"
              :value="item.image_url"
              style="height: 65px;line-height: 65px">
              <el-image :src="$conf.resource.baseUrl+item.image_url" style="width: 60px;height: 60px"/>
            </el-option>
            <el-option style="text-align: center" label="" value="">
              <el-upload
                accept="image/*"
                action=""
                :data="{filename: '摆放示意图', key: 'layout_url'}"
                :show-file-list="false"
                :http-request="(response) => uploadImage(response,$index)">
                <span>+ 从本地选择</span>
              </el-upload>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px" align="center">
        <template slot-scope="{row,$index}">
          <div class="operation">
            <div class="operation_btn" @click="addRow(row,$index)" v-if="list.length < 6">
              <i class="el-icon-circle-plus-outline"></i></div>
            <div class="operation_btn" @click="reduceRow(row,$index)">
              <i class="el-icon-remove-outline"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <div slot="empty" style="height:60px;line-height: 60px;font-size: 14px">
        暂无数据,请点击
        <el-button type="text" size="mini" @click="addRow(0,0)">添加新的一行</el-button>
      </div>
    </el-table>
    <div style="text-align: center;margin-top: 15px">
      <el-button type="primary" @click="onSubmit" :loading="submitLoading">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addDisplay, getDisplay, getUsedDisplay, getDisplayImage} from "@/api/product";
import {upload} from "@/api/resource";
import {PicType} from "@/js/common";

export default {
  props: ["dialogVisible", "dialogData"],
  name: "productDisplay",
  data() {
    return {
      list: [],
      productDetail: {},//商品详情
      productSize: [],//药品尺寸原数据
      size: [],//药品尺寸
      submitLoading: false,
      displayImage: [],
    }
  },
  methods: {
    async open() {
      this.productDetail = this.dialogData;
      this.productSize = [
        {key: 1, label: '长', value: this.productDetail.product_length, show: true},
        {key: 2, label: '宽', value: this.productDetail.product_width, show: true},
        {key: 3, label: '高', value: this.productDetail.product_height, show: true}
      ];
      this.size = JSON.parse(JSON.stringify(this.productSize));
      //获取下拉框中复核图片
      await this.getImageComparison();
      await this.getProductDisplay();
      //回显复核图片
      this.showImageComparison();
    },
    //复核图片
    getImageComparison() {
      let innerid = this.productDetail.innerid;
      let type = `'${PicType.PT_Comparisonl}'`;
      getDisplayImage(innerid, {type}).then(res => {
        this.displayImage = res;
      }).catch(err => {
        this.$message.warning(err.message || '获取摆放图片失败');
      })
    },
    changeSelection(url, index) {
      let style = 'background:url(' + this.$conf.resource.baseUrl + url + ') no-repeat center center;color:transparent;background-size:100px 100px;height:120px'
      let dom = document.getElementById(`url${index}`);
      console.log(dom.parentElement)
      if (url) {
        dom.setAttribute('style', style);
      } else {
        dom.removeAttribute("style");
      }
    },
    showImageComparison() {
      this.list.forEach((item, index) => {
        this.changeSelection(item.layout_url, index);
      })
    },
    //摆放方式
    async getProductDisplay() {
      return getDisplay(this.productDetail.innerid).then(res => {
        let data = res;
        data.forEach(item => {
          let displays = JSON.parse(JSON.stringify(this.$conf.productDisplays[item.display - 1]));
          this.list.push({...displays, layout_url: item.show_image_url, innerid: item.innerid});
        })
      }).catch(err => {
        this.$message.warning(err.message || '获取摆放方式失败');
      })
    },
    //摆放尺寸
    focusSize(row) {
      this.size = JSON.parse(JSON.stringify(this.productSize))
      for (let k in row) {
        if (row[k] && k != 'layout_url') {
          let index = this.productSize.findIndex(item => {
            return item.key == row[k].key;
          })
          if (index != -1) {
            this.$set(this.size[index], 'show', false);
          }
        }
      }
    },
    //图片上传
    async uploadImage(data, index) {
      const file = data.file;
      const key = data.data.key;
      try {
        let uuid = await upload(file);
        this.list[index][key] = uuid;
        this.changeSelection(uuid, index);
      } catch (e) {
        console.error(e);
      }
    },
    //新增行
    addRow(row, index) {
      this.list.splice(index + 1, 0, {
        x: {},
        y: {},
        z: {},
        layout_url: null
      });
    },
    //删除行
    reduceRow(row, index) {
      if (row.innerid) {
        //判断该摆放方式是否在药道中使用(是：不可删除)
        getUsedDisplay(row.innerid).then(res => {
          const data = res;
          if (data.length === 0) {
            this.list.splice(index, 1);
          } else {
            this.$message.warning('不可删除，因该摆放方式已在药道摆放中使用');
          }
        }).catch(err => {
          this.$message.warning(err.message);
        })
      } else {
        this.list.splice(index, 1);
      }
    },
    //提交
    onSubmit() {
      let res = {
        product_id: this.productDetail.innerid,
        displays: []
      }
      this.list.forEach(item => {
        this.$conf.productDisplays.forEach((val, index) => {
          if (item['x'].key == val['x'].key && item['y'].key == val['y'].key && item['z'].key == val['z'].key) {
            res.displays.push({display: index + 1, image_id: item.layout_url, innerid: item.innerid});
          }
        })
      })
      for (let i = 0; i < res.displays.length - 1; i++) {
        for (let j = i + 1; j < res.displays.length; j++) {
          if (res.displays[i].display === res.displays[j].display) {
            return this.$message.warning("存在相同的摆放方式");
          }
        }
      }
      addDisplay(res).then(res => {
        this.$message.success('保存成功');
        this.onCancel();
      }).catch(err => {
        this.$message.warning(err.message || '操作失败');
      })
    },
    //关闭弹框
    onCancel() {
      this.$emit("closeCallback");
      this.list = [];
      },
    },
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
