<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <SelectTree
            placeholder="请选择商户"
            style="width: 100%"
            :props="props"
            :options="merchantTree"
            :value="searchData.merchant_id"
            @getValue="getValue($event)"/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-select v-model="searchData.group_id" filterable placeholder="设备组" clearable style="width: 100%">
            <el-option v-for="item in filterList" :key="item.innerid" :label="item.name"
                       :value="item.innerid"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-select v-model="searchData.status" placeholder="设备状态" clearable style="width:100%;">
            <el-option v-for="(val,idx) in $conf.equipmentStatusArr" ::key="idx" :label="val"
                       :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-input v-model="searchData.name" placeholder="设备名"
                    @keyup.enter.native="handleSearch" clearable/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-input v-model="searchData.no" placeholder="设备编号"
                    @keyup.enter.native="handleSearch" clearable/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-input v-model="searchData.mac" placeholder="设备MAC"
                    @keyup.enter.native="handleSearch" clearable/>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4" class="filter-item">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ (searchData.page - 1) * searchData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.no }}
        </template>
      </el-table-column>
      <el-table-column label="设备名" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="所属商户 | 设备组" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.merchant_id | zget('value', 'label', merchantList) }}|
          {{ scope.row.group_id | zget('innerid', 'name', groupData) }}
        </template>
      </el-table-column>
      <el-table-column label="型号" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <!--禁用-->
          <div v-if="scope.row.status===eqStatus.ES_Stop" class="icon-ban">
            <el-tooltip class="item" effect="dark" content="禁用" placement="top">
              <svg-icon icon-class="ban" class-name="svg-style"/>
            </el-tooltip>
          </div>
          <!--离线/正常-->
          <div v-if="scope.row.status===eqStatus.ES_IsOk || scope.row.status===eqStatus.ES_Offline"
               :class="[scope.row.status===eqStatus.ES_IsOk? 'icon-hook-on':'icon-hook-off']">
            <el-tooltip class="item" effect="dark" :content="scope.row.status===eqStatus.ES_IsOk?'正常':'离线'"
                        placement="top">
              <svg-icon icon-class="hook" class-name="svg-style"/>
            </el-tooltip>
          </div>
          <!--异常-->
          <div v-if="scope.row.status===eqStatus.ES_Fault" class="icon-warning">
            <el-tooltip class="item" effect="dark" content="异常" placement="top">
              <svg-icon icon-class="abnormal" class-name="svg-style"/>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最新在线时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.lasttime| parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column label="温度 | 湿度" align="center" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.temperature != null">{{ scope.row.temperature }}°C</div>
          <div v-if="scope.row.humidity != null">{{ scope.row.humidity }}%</div>
        </template>
      </el-table-column>
      <el-table-column label="设备管理员" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="adminDialog(row)">查看管理员</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设备库存" align="center">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.type.split('')[0]==='M'" type="text" size="mini" @click="viewInventory(row.innerid)">
            查看设备库存
          </el-button>
          <el-button v-if="row.type.split('')[0]==='T'" type="text" size="mini" @click="viewEqOrder(row)">查看设备订单
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="药道详情" align="center">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="viewChannel(row)">查看药道</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="220px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.innerid)">
            编辑
          </el-button>
          <el-button @click="updateStatus(row)" :type="row.status == eqStatus.ES_Stop?'success':'warning'" size="mini">
            {{ row.status == eqStatus.ES_Stop ? '启用' : '禁用' }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.innerid)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
    <coustom-dialog :dialogVisible="dialogVisible" :dialogData="dialogData"
                    @closeCallback="closeCallback"></coustom-dialog>
  </div>
</template>

<script>
import {getMerchantTree} from '@/api/merchant';
import {getDeviceGroupPairs} from '@/api/deviceGroup'
import {getList, del, updateStatus} from '@/api/device'
import {parseTree, zget,parseTime} from '@/utils/index';
import {EquipmentStatus} from '@/js/common'
import Pagination from '@/components/Pagination/index'
import coustomDialog from '@/views/device/coustomDialog'
import SelectTree from "@/components/treeSelect";

export default {
  components: {coustomDialog, Pagination, SelectTree},
  name: "index",
  data() {
    return {
      props: {                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      //设备状态
      eqStatus: EquipmentStatus,
      total: 0,
      //搜索
      searchData: {
        page: 1,//第几页
        limit: 10,//每页数量，
        merchant_id: null,//商家
        group_id: null,//设备组
        name: null,//设备型号名称
        no: null,//设备编号
        mac: null,//设备MAC
        status: null,//设备状态
      },
      listLoading: false,//loading
      dialogVisible: false,//设备管理员
      merchantList: [],//商户列表
      merchantTree: [],//商户树
      groupData: [],//设备组数据
      filterList: [],//同一商户下的设备组数据
      dialogData: {},
      list: [],
    }
  },
  methods: {
    //获取商户id
    getValue(value) {
      this.searchData.merchant_id = value;
      if (value) {
        //获取商户下的设备
        this.filterList = this.groupData.filter(item => {
          return item.merchant_id == value;
        })
        this.$set(this.searchData, 'group_id', '');
      } else {
        this.filterList = this.groupData;
      }
    },
    //获取列表数据
    getList() {
      let req = {...this.searchData};
      this.listLoading = true;
      getList(req).then(res => {
        this.total = res.count;
        this.list = res.list;
      }).catch(err => {
        this.$message.warning(err.message || '获取列表数据失败, 请点击搜索重新加载列表数据');
      }).finally(() => {
        this.listLoading = false;
      })
    },
    //获取商户和设备组
    getOption() {
      Promise.all([getMerchantTree(), getDeviceGroupPairs()]).then(res => {
        this.merchantList = res[0];
        this.merchantTree = parseTree(this.merchantList);
        this.groupData = this.filterList = res[1];
      }).catch(err => {
        this.$message.warning(err);
      })
    },
    //搜索
    handleSearch() {
      this.searchData.page = 1;
      this.getList();
    },
    //查看管理员
    adminDialog(row) {
      this.dialogData = {"merchant_id": row.merchant_id, "equipment_id": row.innerid};
      this.dialogVisible = true;
    },
    //关闭dialog回调
    closeCallback() {
      this.dialogVisible = false;
    },
    //查看设备库存
    viewInventory(innerid) {
      this.$router.push('/device/stock/stock/' + innerid);
    },
    //查看设备订单详情
    viewEqOrder(row) {
      this.$router.push('/device/order/' + row.innerid);
    },
    //查看设备药道详情
    viewChannel(row) {
      this.$router.push('/device/channel/' + row.innerid);
    },
    //编辑
    handleUpdate(innerid) {
      this.$router.push('/device/deviceEdit/' + innerid);
    },
    // 新增
    handleAdd() {
      this.$router.push('/device/deviceAdd');
    },
    // 启用/禁用
    async updateStatus(row) {
      try {
        //状态不为3(停用)时可禁用，反之可启用
        let isDisable = row.status != this.eqStatus.ES_Stop ? true : false
        let msg = isDisable ? '确认禁用该设备?' : '确认启用该设备?';
        await this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        let params = {
          isenable: isDisable ? this.eqStatus.ES_Stop : this.eqStatus.ES_Offline
        };
        this.listLoading = true;
        await updateStatus(row.innerid, params);
        this.$message.success('操作成功');
        this.listLoading = false;
        this.getList();
      } catch (err) {
        this.listLoading = false;
        if (err !== 'cancel') {
          this.$message.warning(err.message || '操作失败');
        }
      }
    },
    //删除
    handleDelete(innerid) {
      this.$confirm('确定删除该条数据吗? 此操作不可逆, 请谨慎操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        del(innerid).then(res => {
          this.$message.success('操作成功');
          this.listLoading = false;
          this.getList();
        }).catch(err => {
          this.$message.warning(err.message || '操作失败');
          this.listLoading = false;
        })
      }).catch(() => {
      });
    }
  },
  created() {
    this.getOption();
    this.getList();
  },
  watch: {
    $route: {
      handler() {
        let status = this.$route.query.status;
        this.searchData.status = status;
        this.handleSearch();
      },
      immediate: true,
      deep: true
    }
  },
  filters: {
    zget: zget,
    parseTime:parseTime,
  }
}
</script>

<style scoped lang="scss">

</style>
