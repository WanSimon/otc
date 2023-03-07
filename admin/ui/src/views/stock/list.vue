<template>
  <div class="app-container">
    <div class="filter-container" style="font-size: 14px">
      <el-row>
        <el-col :span="24" style="margin-bottom: 15px">
          <span>所属商户：</span>
          <span>{{ deviceInfo.shortname }}</span>
          <span><i class="el-icon-d-arrow-right" style="padding: 0 8px;"></i>{{ deviceInfo.name }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.name" placeholder="商品名" clearable></el-input>
        </el-col>
        <el-col :xs="18" :sm="20" :md="20" :lg="20">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button :loading="downloadStockOrder" type="primary" icon="el-icon-document" @click="handleStockOrder">生成备货单
          </el-button>
          <el-button :loading="downloadExcel" type="primary" icon="el-icon-upload2" @click="handleExcel">药道库存导出
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="药道库存" name="drugChannelStock">
        <el-table
          v-loading="listLoading"
          :data="drugChannelList"
          element-loading-text="Loading"
          border
          stripe
          fit
          highlight-current-row>
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="药道编号" align="center">
            <template slot-scope="scope">
              {{ scope.row.slot_no }}
              <span v-if="drugChannelData.aisleX">
              ({{
                  Math.floor((scope.row.slot_no - 1) / drugChannelData.aisleX) + 1
                }}层{{ ((scope.row.slot_no - 1) % drugChannelData.aisleX) + 1 }}列
              <span v-if="scope.row.colspan > 1">、并道{{ scope.row.colspan }}</span>)
             </span>
            </template>
          </el-table-column>
          <el-table-column label="商品名" align="center">
            <template slot-scope="scope">
              <span v-if="productData[scope.row.slot_no]">{{ productData[scope.row.slot_no].name }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="实时库存" align="center">
            <template slot-scope="scope">
              <span v-if="productData[scope.row.slot_no]">{{ productData[scope.row.slot_no].real_stock }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="最大数量" align="center">
            <template slot-scope="scope">
              <span v-if="productData[scope.row.slot_no]">{{ productData[scope.row.slot_no].upper_limit }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="锁定库存" align="center">
            <template slot-scope="scope">
              <span v-if="productData[scope.row.slot_no]">{{ productData[scope.row.slot_no].lock_stock }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="商品详情" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini"
                         :disabled="!(productData[scope.row.slot_no] && productData[scope.row.slot_no].merchant_product_id)"
                         @click="viewMerchantProduct(productData[scope.row.slot_no])">查看详情
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="150px">
            <template slot-scope="scope">
              <el-button
                :disabled="!(productData[scope.row.slot_no] && productData[scope.row.slot_no].merchant_product_id)"
                @click="delEqtProduct(productData[scope.row.slot_no])" type="danger" size="mini">下架
              </el-button>
              <el-button @click="editEqtProduct(productData[scope.row.slot_no],scope.row.slot_no)" type="primary"
                         size="mini">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="药品库存" name="productStock">
        <el-table
          v-loading="listLoading"
          :data="productList"
          element-loading-text="Loading"
          border
          stripe
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="商品名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="国际条码" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.bar_code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实时库存" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.real_stock }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最大数量" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.upper_limit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="锁定库存" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lock_stock }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import {getList} from "@/api/stock";
import {getDrugChannel, getInfo} from "@/api/device";
import {del} from "@/api/deviceProduct";

export default {
  name: "list",
  data() {
    return {
      activeName: 'drugChannelStock',//选项卡默认页签
      total: 0,
      searchData: {
        name: null,//商品名
        equipment_id: this.$route.params.id
      },
      listLoading: false,//列表loading
      downloadStockOrder: false,//备货单按钮loading
      downloadExcel: false,//导出按钮loading
      productList: [],//药品库存列表数据
      drugChannelList: [],//药道库存列表数据
      deviceInfo: {},//设备信息
      productData: {},
      drugChannelData: {},//药道信息
    }
  },
  methods: {
    //获取商品与设备数据
    getList() {
      let req = {...this.searchData};
      this.listLoading = true;
      Promise.allSettled([getList(req), getInfo(this.$route.params.id)]).then(res => {
        let stockListData = res[0];
        let deviceData = res[1];
        //库存详情
        if (stockListData.status === 'fulfilled') {
          let obj = {};
          this.productList = [];
          stockListData.value.forEach((val, idx) => {
            obj[val.slot_no] = val;
            //合并相同药品的库存
            let position = this.productList.findIndex(item => item.bar_code == val.bar_code);
            if (position != -1) {
              this.productList[position].real_stock += val.real_stock;
              this.productList[position].lock_stock += val.lock_stock;
              this.productList[position].upper_limit += val.upper_limit;
            } else {
              this.productList.push({
                merchant_product_id: val.merchant_product_id,
                product_id: val.product_id,
                bar_code: val.bar_code,
                name: val.name,
                real_stock: val.real_stock,
                lock_stock: val.lock_stock,
                upper_limit: val.upper_limit
              });
            }
          })
          this.productData = obj;
        } else {
          this.$message.warning(stockListData.reason);
        }
        //药道详情
        if (deviceData.status === 'fulfilled') {
          this.deviceInfo = deviceData.value || {};
          this.drugChannelData = JSON.parse(this.deviceInfo.drug_channel);
          if (this.drugChannelData.hasOwnProperty('slot_info_list') && Array.isArray(this.drugChannelData.slot_info_list)) {
            this.drugChannelList = this.drugChannelData.slot_info_list.filter(item => {
              if (this.searchData.name) {
                if (this.productData[item.slot_no]) {
                  return item.x_aisle_count > 0 && this.productData[item.slot_no].name.indexOf(this.searchData.name) != -1;
                }
              } else {
                return item.x_aisle_count > 0;
              }
            });
            this.total = this.drugChannelList.length;
          } else {
            this.$message.warning(deviceData.reason);
          }
        }
      }).catch(err => {
        console.log(err.message);
      }).finally(() => {
        this.listLoading = false;
      })
    },
    //搜索
    handleSearch() {
      this.searchData.page = 1;
      this.getList();
    },
    //生成备货单
    handleStockOrder() {
      this.downloadStockOrder = true;
      import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['商品名', '国际条码', '实时库存', '最大数量', '锁定库存'];
        const filterVal = ['name', 'bar_code', 'real_stock', 'upper_limit', 'lock_stock'];
        const list = this.productList;
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `${this.deviceInfo.name}备货单`,
          autoWidth: true,
          bookType: 'xlsx'
        });
        this.downloadStockOrder = false;
      })
    },
    //导出药道信息
    handleExcel() {
      this.downloadExcel = true;
      import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['层', '列', '药品', '实时库存', '最大数量'];
        const filterVal = ['x', 'y', 'name', 'real_stock', 'upper_limit'];
        let list = [];
        for (let i = 0; i < this.drugChannelList.length; i++) {
          let item = this.drugChannelList[i]
          if (this.productData[item.slot_no]) {
            let val = this.productData[item.slot_no];
            let obj = {
              x: Math.floor((item.slot_no - 1) / this.drugChannelData.aisleX) + 1,
              y: ((item.slot_no - 1) % this.drugChannelData.aisleX) + 1,
              name: val.name,
              real_stock: val.real_stock,
              upper_limit: val.upper_limit,
            };
            list.push(obj);
          }
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `${this.deviceInfo.name}药道库存`,
          autoWidth: true,
          bookType: 'xlsx'
        });
        this.downloadExcel = false;
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j];
        })
      );
    },
    //查看商品详情
    viewMerchantProduct(row) {
      this.$router.push('/device/stock/stockDetail/' + row.merchant_product_id + '/' + row.product_id)
    },
    //下架
    delEqtProduct(row) {
      this.$confirm('确认删除该槽位的药品数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        del(row.innerid, row.equipment_id).then(res => {
          this.$message.success('操作成功');
          this.getList()
        }).catch(err => {
          this.$message.warning(err.message || '操作失败');
        }).finally(() => {
          this.listLoading = false
        })
      }).catch(() => {
      });
    },
    //编辑
    editEqtProduct(row, slot_no) {
      if (row) {
        this.$router.push({
          path: '/device/stock/stockEdit/',
          query: {id: row.innerid, len: this.drugChannelData.length}
        })
      } else {
        this.$router.push({
          path: '/device/stock/stockEdit',
          query: {
            mid: this.deviceInfo.merchant_id,
            eid: this.deviceInfo.innerid,
            sn: slot_no,
            len: this.drugChannelData.length
          }
        })
      }
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style scoped>

</style>
