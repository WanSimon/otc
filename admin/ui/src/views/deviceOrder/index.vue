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
          <el-input v-model="searchData.serial_no" placeholder="订单号" clearable></el-input>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.status" placeholder="请选择状态" clearable style="width:100%;">
            <el-option v-for="(val, idx) in $conf.equipmentOrderStatus" :key="idx" :label="val"
                       :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="orderList"
      element-loading-text="Loading"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
      border
      stripe
      fit
      highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            v-loading="listLoading"
            :data="DrugsList"
            element-loading-text="Loading"
            border>
            <el-table-column type="index" align="center" label="#" width="50"></el-table-column>
            <el-table-column label="商品名" align="center" prop="name"></el-table-column>
            <el-table-column label="商品规格" align="center" prop="specification"></el-table-column>
            <el-table-column label="生产厂家" align="center" prop="manufacturer"></el-table-column>
            <el-table-column label="数量" align="center" prop="product_count"></el-table-column>
            <el-table-column label="商品编号" align="center" prop="product_no"></el-table-column>
            <el-table-column label="国际条码" align="center" prop="bar_code"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.slot_no }}
          <span v-if="drugChannelData.aisleX">
            ({{
              Math.floor((scope.row.slot_no - 1) / drugChannelData.aisleX) + 1
            }}层{{ ((scope.row.slot_no - 1) % drugChannelData.aisleX) + 1 }}列)
          </span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.serial_no" placeholder="请输入订单号" class="el-input-width"></el-input>
          </template>
          <span v-else>  {{ scope.row.serial_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-select v-model="scope.row.status" placeholder="请选择状态" class="el-input-width">
              <el-option v-for="(val, idx) in $conf.equipmentOrderStatus" :key="idx" :label="val"
                         :value="idx"></el-option>
            </el-select>
          </template>
          <span v-else>{{ $conf.equipmentOrderStatus[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="150px">
        <template slot-scope="{row,$index}">
          <div v-if="!row.edit">
            <el-button type="danger" size="mini" @click="delEqtProduct(row)">下架</el-button>
            <el-button type="primary" size="mini" @click="row.edit=!!!row.edit">编辑</el-button>
          </div>
          <div v-else>
            <el-button type="success" size="mini" @click="confirmEdit(row)">保存</el-button>
            <el-button type="warning" size="mini" @click="cancel(row,$index)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getList, update, updateStatus} from "@/api/deviceOrder";
import {getOrderDetail} from "@/api/order";
import {getInfo} from "@/api/device";
import {EquipmentOrderStatus} from '@/js/common'

export default {
  name: "index",
  data() {
    return {
      equipmentOrderStatus: EquipmentOrderStatus,
      activeName: 'productStock',//选项卡默认页签
      total: 0,
      searchData: {
        serial_no: null,//商品名
        status: null,//状态
      },
      listLoading: false,//loading
      rawOrderList: [],//初始化订单列表数据
      orderList: [],//药品订单列表数据
      DrugsList: [],//药品详情列表
      drugChannelData: {},//药道数据
      deviceInfo: {},//设备信息
      equipment_id: '',
      expands: [],//展开行的 keys 数组
    }
  },
  methods: {
    getList() {
      let parmas = {
        equipment_id: this.equipment_id,
        ...this.searchData
      }
      this.listLoading = true
      getList(parmas).then(res => {
        const data = res
        for (let item of data.list) {
          item.edit = false;
          item.status = item.status.toString()
        }
        this.rawOrderList = JSON.parse(JSON.stringify(data.list))
        this.orderList = data.list
        this.drugChannelData = JSON.parse(res.drugChannel)
      }).catch(err => {
        this.$message({message: err.message || '获取列表数据失败, 请点击搜索重新加载列表数据'});
      }).finally(() => {
        this.listLoading = false
      })
    },
    //获取设备数据
    getOneDevice() {
      getInfo(this.equipment_id).then(res => {
        this.deviceInfo = res
      }).catch(err => {
        this.$message.warning(err.message);
      })
    },
    //搜索
    handleSearch() {
      this.getList()
    },
    //查看商品详情
    viewMerchantProduct(row) {
      this.$router.push('/device/stock/stockDetail/' + row.merchant_product_id + '/' + row.product_id)
    },
    //下架
    delEqtProduct(row) {
      this.$confirm('确认下架该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        updateStatus(row.innerid, {status: this.equipmentOrderStatus.EOS_Free}).then(res => {
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
    //保存
    confirmEdit(row) {
      let parmas = {
        status: row.status,
        serial_no: row.serial_no,
      };
      this.listLoading = true;
      update(row.innerid, parmas).then(res => {
        this.$message.success('操作成功');
        this.$set(row, 'edit', false);
        this.getList()
      }).catch(err => {
        this.$message.warning(err.message || '操作失败');
      }).finally(() => {
        this.listLoading = false;
      })
    },
    //取消
    cancel(row, index) {
      row.edit = false
      let rawRow = this.rawOrderList[index]
      this.$set(row, 'innerid', rawRow.innerid)
      this.$set(row, 'slot_no', rawRow.slot_no)
      this.$set(row, 'status', rawRow.status)
      this.$set(row, 'serial_no', rawRow.serial_no)
    },
    //展开行
    getRowKeys(row) {
      return row.innerid
    },
    expandChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.innerid)
          //获取药品详情列表
          this.getDrugsList(row)
        }
      } else {
        this.expands = []
      }
    },
    getDrugsList(row) {
      let orderId = row.order_id
      this.DrugsList = []
      if (orderId) {
        this.listLoading = true
        getOrderDetail({order_id: orderId}).then(res => {
          this.DrugsList = res
        }).catch(err => {
          this.$message.warning(err.message || '获取列表数据失败, 请点击搜索重新加载列表数据');
        }).finally(() => {
          this.listLoading = false
        })
      }
    }
  },
  created() {
    this.equipment_id = this.$route.params.eid
    this.getList()
    this.getOneDevice()
  }
}
</script>

<style scoped>

</style>
