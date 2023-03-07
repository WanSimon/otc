<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="设备组名称" prop="name">
            <el-input v-model="form.name" placeholder="设备组名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编号" prop="no">
            <el-input v-model="form.no" placeholder="编号"></el-input>
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
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="form.contacts" placeholder="联系人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="联系电话" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="详细地址" prop="addr">
            <el-autocomplete
              v-model="form.addr"
              :fetch-suggestions="querySearch"
              placeholder="请输入详细地址"
              style="width: 100%"
              :trigger-on-focus="false"
              @select="handleSelect"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" style="margin-top: 10px">
          <baidu-map class="bm-view"
                     :center="center"
                     :zoom="zoom"
                     @ready="handler"
                     @zoomend="zoomend"
                     :scroll-wheel-zoom="true"
                     :ak=ak>
            <bm-marker :position="center" :dragging="true" @dragend="getPostion">
              <bm-label content="设备组位置" :offset="{width: -22, height: 30}"/>
            </bm-marker>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          </baidu-map>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="状态" prop="isenable">
            <el-switch
              v-model="form.isenable">
            </el-switch>
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
  import {getInfo, update, add} from '@/api/deviceGroup';
  import {isPhone} from '@/utils/validate';
  import {parseTree} from '@/utils/index'
  import {getMerchantTree} from '@/api/merchant';
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue';
  import BmLabel from 'vue-baidu-map/components/overlays/Label.vue';
  import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue';
  import SelectTree from "@/components/treeSelect";
  import axios from 'axios';

  export default {
    name: 'deviceGroupEdit',
    components: {BaiduMap, BmMarker, BmLabel, BmNavigation, SelectTree},
    filters: {},
    data() {
      return {
        props: {                // 配置项（必选）
          value: 'value',
          label: 'label',
          children: 'children',
          // disabled:true
        },
        list: [],
        merchantList: [],
        form: {
          name: '',
          no: '',
          contacts: '',
          phone: '',
          merchant_id: '',
          isenable: true,
        },
        submitLoading: false,
        //表单验证
        rules: {
          name: [
            {required: true, message: '请输入设备组名称', trigger: 'blur'},
          ],
          no: [
            {required: true, message: '请输入编号', trigger: 'blur'},
          ],
          phone: [
            {validator: isPhone, trigger: 'blur'},
          ],
          merchant_id: [
            {required: true, message: '请选择商户', trigger: 'blur'},
          ],
        },
        //地图
        center: {
          lng: 0,
          lat: 0,
        },
        zoom: 16,
        ak: 'khOzaq42u98tFcBQEjG8UqZeEdyLKIca',
        addrComp: {},
        BMap: '',
      }
    },
    methods: {
      // 取值
      getValue(value) {
        if (value && value instanceof Array && value.length > 0) {
          let arr = [...value];
          this.form.merchant_id = arr.pop();
        } else {
          this.form.merchant_id = value;
        }
      },
      async getAddress() {
        let params = {
          ak: this.ak,
          coordtype: 'wgs84ll',
          location: `${this.center.lat},${this.center.lng}`
        }
        return axios.get('/baidu/reverse_geocoding/v3/?output=json', {params: params}).then(res => {
          const data = res.data.result;
          this.addrComp = data.addressComponent;
        }).catch(err => {
          this.$message.warning(err.message);
        })
      },
      async onSubmit() {
        await this.getAddress();
        this.$refs.form.validate(async valide => {
          if (valide) {
            let params = {
              ...this.form,
              province: this.addrComp.province,
              city: this.addrComp.city,
              area: this.addrComp.district
            };
            params.isenable = params.isenable ? 1 : 0;
            params.latitude = this.center.lat
            params.longitude = this.center.lng
            this.submitLoading = true;
            try {
              if (this.innerid) {
                await update(this.innerid, params);
              } else {
                await add(params);
              }
              this.$message.success('保存成功');
              this.onCancel()
            } catch (err) {
              this.$message.warning('保存失败');
              this.submitLoading = false;
            }
          } else {
            this.submitLoading = false;
          }
        });
      },
      onCancel() {
        this.$router.push('/device/group');
      },
      async initMerchantTree() {
        let dbData = await getMerchantTree();
        this.merchantList = parseTree(dbData);
      },
      //初始化 地图回调
      async handler({BMap, map}) {
        this.BMap = BMap;
        this.zoom = 16;
      },
      async getCurLocation() {
        try {
          let BMap = this.BMap;
          let geolocation = new BMap.Geolocation();
          let self = this;
          await geolocation.getCurrentPosition(function (res) {
            //允许定位 跳转定位地址
            if (this.getStatus() == BMAP_STATUS_SUCCESS && res.point) {
              self.$set(self.center, 'lng', res.point.lng);
              self.$set(self.center, 'lat', res.point.lat);
              this.addrComp = res.address;
              self.$set(self.form, 'addr', this.addrComp.province + this.addrComp.city + this.addrComp.district);
            }
          });
        } catch (e) {
          console.log(e.message);
        }
      },
      //更改缩放级别
      zoomend({target}) {
        this.zoom = target.getZoom();
      },
      //拖拽结束时获取定位
      async getPostion({type, target, pixel, point}) {
        var Geo = new BMap.Geocoder();
        var addressList = '';
        this.center = {lng: point.lng, lat: point.lat};
        await Geo.getLocation(point, rs => {
          var addComp = rs.addressComponents;
          addressList = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
          this.form.addr = addressList
        });
      },
      //根据地址模糊搜索
      querySearch(queryString, callback) {
        let self = this
        var myGeo = new BMap.Geocoder()
        myGeo.getPoint(queryString, function (point) {
          if (point) {
            self.center = {lng: point.lng, lat: point.lat};
          }
        })
        var local = new BMap.LocalSearch("北京")
        local.search(queryString)
        local.setSearchCompleteCallback(function (res) {
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            var list = []
            for (var i = 0; i < res.getCurrentNumPois(); i++) {
              var poi = res.getPoi(i);
              var item = {value: poi.address + poi.title, point: poi.point}
              list.push(item)
              callback(list)
            }
          } else {
            callback()
          }
        })
      },
      handleSelect(item) {
        this.center = {lng: item.point.lng, lat: item.point.lat};
      },
    },
    async mounted() {
      await this.initMerchantTree();
      this.innerid = this.$route.params.id;
      if (this.innerid) {
        let dbData = await getInfo(this.innerid);
        this.form = dbData;
        this.form.isenable = !!dbData.isenable;
        this.center.lng = this.form.longitude ? this.form.longitude : 116.404
        this.center.lat = this.form.latitude ? this.form.latitude : 39.915
      } else {
        await this.getCurLocation();
      }
    },
  }
</script>

<style scoped>
  .bm-view {
    width: 80%;
    height: 500px;
    margin: 0 auto;
  }
</style>

