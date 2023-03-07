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
          <el-select v-model="searchData.equipment_id" placeholder="请选择设备" clearable style="width:100%;">
            <el-option v-for="item in filterList" :key="item.innerid" :label="item.name"
                       :value="item.innerid"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-cascader
            style="width: 100%"
            placeholder="请选择订单来源"
            :options="$conf.OrderSource"
            :props="{ checkStrictly: true }"
            :value="orderSourceValue"
            clearable
            @change="getOrderSource"></el-cascader>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-select v-model="searchData.order_status" placeholder="请选择订单状态" clearable style="width:100%;">
            <el-option v-for="(item,idx) in $conf.OrderStatus" :key="idx" :label="item" :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-select v-model="searchData.pay_status" placeholder="请选择支付状态" clearable style="width:100%;">
            <el-option v-for="(item,idx) in $conf.PayStatus" :key="idx" :label="item" :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-input v-model="searchData.serial_no" placeholder="请输入订单流水号"
                    @keyup.enter.native="handleSearch" clearable/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-date-picker style="width:100%;" v-model="searchData.created_time" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4" class="filter-item">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="handleExcel">导出
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
      @sort-change="sortChange"
      border
      stripe
      fit
      highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            v-loading="listLoading"
            :data="orderDetailList"
            @selection-change="selectionChange"
            element-loading-text="Loading"
            border>
            <el-table-column
              v-if="(scope.row.pay_status == payStatus.PS_SUCCESS || (scope.row.pay_status == payStatus.PS_Refunded && scope.row.refund_mark == refundMark.RM_PartRefund)) && scope.row.source !=  orderSource.OSRC_Third"
              type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column label="商品名" align="center" prop="name"></el-table-column>
            <el-table-column label="商品规格" align="center" prop="specification"></el-table-column>
            <el-table-column label="生产厂家" align="center" prop="manufacturer"></el-table-column>
            <el-table-column label="商品编号" align="center" prop="product_no"></el-table-column>
            <el-table-column label="国际条码" align="center" prop="bar_code"></el-table-column>
            <el-table-column label="数量" align="center" prop="product_count" width="80"></el-table-column>
            <el-table-column label="已退款数量" align="center" prop="refund_count" width="90"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="150px"
                             fixed="right"
                             v-if="(scope.row.pay_status == payStatus.PS_SUCCESS || (scope.row.pay_status == payStatus.PS_Refunded && scope.row.refund_mark == refundMark.RM_PartRefund)) && scope.row.source !=  orderSource.OSRC_Third">
              <template slot-scope="{row,$index}">
                <div v-if="row.isHidden">
                  <el-input-number v-model="row.refund_num" placeholder="请输入退款数量" :min="0"
                                   :max="Number(row.product_count)-Number(row.refund_count)"
                                   style="width: 60%"></el-input-number>
                  <el-button v-if="row.isShow" type="primary" size="mini" @click="ConfirmPartRefund(row)"
                             style="margin-left: 10px">确定
                  </el-button>
                  <el-button v-if="row.isShow" type="danger" size="mini" @click="handleCancel(row)"
                             style="margin-left: 10px">取消
                  </el-button>
                </div>
                <div v-else>
                  <el-button type="primary" size="mini"
                             :disabled="Number(row.product_count)-Number(row.refund_count)===0"
                             @click="handlePartRefund(row)">退款
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ (searchData.page - 1) * searchData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="流水号" align="center" min-width="150px" prop="serial_no"></el-table-column>
      <el-table-column label="下单时间" prop="created_time" align="center" min-width="150px" sortable='custom'>
        <template slot-scope="scope">
          {{ parseTime(scope.row.created_time) }}
        </template>
      </el-table-column>
      <el-table-column label="商户" align="center" prop="fullname" min-width="120px"></el-table-column>
      <el-table-column label="订单来源" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.source===orderSource.OSRC_Third">
            {{ zget(scope.row.source_id, 'value', 'label', $conf.OrderSource[1].children) }}
          </span>
          <span v-else> {{ zget(scope.row.source, 'value', 'label', $conf.OrderSource) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center" min-width="120px" prop="equipment_name"></el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          {{ $conf.OrderStatus[scope.row.order_status] }}
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" width="120">
        <template slot-scope="{row,$index}">
          <span v-if="row.pay_status==payStatus.PS_Refunded && row.refund_mark==refundMark.RM_PartRefund">
             部分退款
          </span>
          <span v-else>
             {{ $conf.PayStatus[row.pay_status] }}
          </span>
          <span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.amount) }}
        </template>
      </el-table-column>
      <el-table-column label="会员金额" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.customer_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.pay_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="退款金额" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.refund_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">
          {{ $conf.payType[scope.row.pay_type] }}
        </template>
      </el-table-column>
      <el-table-column label="会员名" align="center" prop="customer_name"></el-table-column>
      <el-table-column label="身份证号" align="center" prop="id_card" min-width="150px"></el-table-column>
      <el-table-column label="取药时间" prop="created_time" align="center" min-width="150px">
        <template slot-scope="{row,$index}">
          {{ intervalTime(row.pickup_begin_time,row.pickup_end_time) }}
        </template>
      </el-table-column>
      <el-table-column label="总时间" prop="created_time" align="center" min-width="150px">
        <template slot-scope="{row,$index}">
          {{ intervalTime(row.created_time,row.finish_time) }}
        </template>
      </el-table-column>
      <el-table-column label="取药监控" align="center" prop="pickup_video" min-width="80px">
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini"
                     @click="viewPickUpRecord(row)">查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100px" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleRefund(row)"
                     :disabled="!((row.pay_status == payStatus.PS_SUCCESS || (row.pay_status == payStatus.PS_Refunded && row.refund_mark == refundMark.RM_PartRefund)) && row.source !=  orderSource.OSRC_Third)">
            退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog弹窗 -->
    <el-dialog title="退款订单明细" :visible.sync="dialogTableVisible" width="60%" :close-on-click-modal="false">
      <el-table
        :data="multipleSelection"
        border
        highlight-current-row
        max-height="500">
        <el-table-column align="center" type="index" label="序号" width="55"></el-table-column>
        <el-table-column label="商品名" align="center" prop="name"></el-table-column>
        <el-table-column label="商品规格" align="center" prop="specification"></el-table-column>
        <el-table-column label="生产厂家" align="center" prop="manufacturer"></el-table-column>
        <el-table-column label="商品编号" align="center" prop="product_no"></el-table-column>
        <el-table-column label="国际条码" align="center" prop="bar_code"></el-table-column>
        <el-table-column label="数量" align="center" prop="product_count" width="80"></el-table-column>
        <el-table-column label="已退款数量" align="center" prop="refund_count" width="90"></el-table-column>
        <el-table-column label="待退款数量" align="center" prop="refund_num" width="90"></el-table-column>
      </el-table>
      <el-row style="text-align: center;margin-top: 15px">
        <el-button type="primary" @click="handleSubmit" :loading="commitLoading">确认</el-button>
        <el-button @click="colseDialog">取消</el-button>
      </el-row>
    </el-dialog>

    <!-- 取药监控记录弹窗 -->
    <el-dialog title="取药监控记录" :visible.sync="pickUpRecord" width="60%" :close-on-click-modal="false">
      <el-row>
        <el-col :span="24" style="margin-bottom: 15px">
          <span>所属商户：</span>
          <span>{{ deviceInfo.merchant_name }}</span>
          <span><i class="el-icon-d-arrow-right" style="padding: 0 8px;"></i>{{ deviceInfo.equipment_name }}</span>
        </el-col>
      </el-row>
      <el-table
        :data="recordData"
        element-loading-text="Loading"
        border
        stripe
        fit
        highlight-current-row>
        <el-table-column type="index" align="center" label="序号" width="55"></el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="{row,$index}">
            <span>{{row.resource_type==1? '视频':'图片'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="result">
          <template slot-scope="{row,$index}">
            <el-tag :type="row.result==0 ?'success':'danger'">
              <span>{{row.result==0 ? '取药成功':'取药失败'}}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="监控" align="center" prop="pickup_video" min-width="80px">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="mini"
                       @click="handleView(row)">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 监控播放弹窗 -->
    <el-dialog title="取药监控" :visible.sync="pickUpMonitor" width="60%" :close-on-click-modal="false"
               @close="closeVideoPlayer">
      <div class="content" style="height:620px">
        <!--视频-->
        <div class="video" v-if="this.resource_type == 1">
          <video-player ref="myVideoPlayer" :sources="videoSources"></video-player>
        </div>
        <!--图片-->
        <div class="picture" v-else>
          <el-carousel indicator-position="outside" :autoplay="false">
            <el-carousel-item class="carousel-item" v-for="item in imgList" :key="item">
              <el-image class="carousel-img" :src="item" fit="contain"></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination/index';
  import VideoPlayer from "@/components/Video/index";
  import SelectTree from "@/components/treeSelect";
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  import {getList,getExcelList, orderRefund, getOrderDetail, partRefund, getPickupRecord} from "@/api/order";
  import {getMerchantTree} from "@/api/merchant";
  import {getDevicePairs} from "@/api/device";
  import {OrderSource, PayStatus, RefundMark} from '@/js/common'
  import {parseTime, parseTree, parseMoney, zget, orderBy, intervalTime} from '@/utils/index';

  export default {
    components: {Pagination, SelectTree, VideoPlayer, ElImageViewer},
    name: "index",
    data() {
      return {
        props: {                // 配置项（必选）
          value: 'value',
          label: 'label',
          children: 'children',
          // disabled:true
        },
        orderSource: OrderSource,//订单来源
        payStatus: PayStatus,//支付状态,
        refundMark: RefundMark,//退款分类,
        total: 0,
        //搜索
        searchData: {
          page: 1,//第几页
          limit: 10,//每页数量，
          merchant_id: '',//商户
          equipment_id: '',//设备
          source: '',//订单来源
          source_id: '',//当source为第三方平台的订单来源
          pay_status: '',//支付状态
          order_status: '',//订单状态
          serial_no: '',//订单流水号
          created_time: '',//下单时间
        },
        //排序
        sort: {order: {}},
        listLoading: false,//loading
        downloadLoading: false,//按钮loading;
        commitLoading: false,//防重提交
        merchantTree: [],//商户树
        deviceData: [],//设备
        filterList: [],//同一商户下的设备列表
        list: [],//订单列表
        orderDetailList: [],//订单详情列表
        expands: [],//展开行的 keys 数组
        orderSourceValue: [],//订单来源
        multipleSelection: [],//勾选的数据
        recordData: [],//订单取药监控数据
        dialogTableVisible: false,//退款数量明细
        orderId: '',//订单id
        pickUpRecord: false,//取药监控记录弹框
        pickUpMonitor: false,//取药监控弹框
        imgList: [],//图片url
        //视频地址配置
        videoSources: {
          type: "video/mp4",
          src: ""
        },
        deviceInfo: {},//设备名，所属商户
        resource_type: '',//监控类型 1：视频；2：图片
      }
    },
    methods: {
      parseTime: parseTime,
      parseMoney: parseMoney,
      intervalTime: intervalTime,
      zget: zget,
      // 获取商户和设备
      getOption() {
        Promise.all([getMerchantTree(), getDevicePairs()]).then(res => {
          let merchantList = res[0];
          this.merchantTree = parseTree(merchantList);
          this.deviceData = this.filterList = res[1];
        }).catch(err => {
          this.$message.warning(err);
        })
      },
      //获取商户id
      getValue(value) {
        this.searchData.merchant_id = value;
        if (value) {
          //获取商户下的设备
          this.filterList = this.deviceData.filter(item => {
            return item.merchant_id == value;
          })
          this.$set(this.searchData, 'equipment_id', '');
        } else {
          this.filterList = this.deviceData;
        }
      },
      //获取订单来源
      getOrderSource(value) {
        this.searchData.source = value[0] >= 0 ? value[0] : '';
        this.searchData.source_id = value[1] || '';
        this.orderSourceValue = value;
      },
      // 获取列表
      getList() {
        let obj = {
          created_time: '',
          pay_status: this.searchData.pay_status,
          refund_mark: ''
        };
        if (this.searchData.created_time) obj.created_time = `${this.$moment(this.searchData.created_time[0]).format('YYYY-MM-DD HH:mm:ss')},${this.$moment(this.searchData.created_time[1]).add('days', 1).format('YYYY-MM-DD HH:mm:ss')}`;
        //部分退款/全部退款
        if (this.searchData.pay_status == this.payStatus.PS_PartRefund) {
          obj.pay_status = this.payStatus.PS_Refunded;
          obj.refund_mark = this.refundMark.RM_PartRefund
        } else if (this.searchData.pay_status == this.payStatus.PS_Refunded) {
          obj.refund_mark = this.refundMark.RM_AllRefund
        }
        let req = {...this.searchData, ...obj, ...this.sort};
        this.listLoading = true;
        getList(req).then(res => {
          this.total = res.count;
          this.list = res.list;
        }).catch(e => {
          this.$message({message: e.message || '获取列表数据失败, 请点击搜索重新加载列表数据'});
        }).finally(() => {
          this.listLoading = false;
        })
      },
      // 搜索
      handleSearch() {
        this.$set(this.searchData, 'page', 1);
        this.getList();
      },
      //排序
      sortChange(column) {
        this.sort = orderBy(column)
        this.getList();
      },
      //导出
      async handleExcel() {
        this.downloadLoading = true;
        let obj = {
          created_time: '',
          pay_status: this.searchData.pay_status,
          refund_mark: ''
        };
        if (this.searchData.created_time) obj.created_time = `${this.$moment(this.searchData.created_time[0]).format('YYYY-MM-DD HH:mm:ss')},${this.$moment(this.searchData.created_time[1]).add('days', 1).format('YYYY-MM-DD HH:mm:ss')}`;
        if (this.searchData.pay_status == this.payStatus.PS_PartRefund) {
          obj.pay_status = this.payStatus.PS_Refunded;
          obj.refund_mark = this.refundMark.RM_PartRefund
        } else if (this.searchData.pay_status == this.payStatus.PS_Refunded) {
          obj.refund_mark = this.refundMark.RM_AllRefund
        }
        let res = await getExcelList({...this.searchData, ...obj, ...this.sort});
        await import('@/utils/Export2Excel').then(excel => {
          const tHeader = ['下单时间', '商户', '订单来源', '设备', '订单状态', '支付状态', '订单金额', '会员金额', '支付金额', '退款金额', '会员名', '身份证号'];
          const filterVal = ['created_time', 'fullname', 'source', 'equipment_name', 'order_status', 'pay_status', 'amount', 'customer_amount', 'pay_amount', 'refund_amount', 'customer_name', 'id_card'];
          const list = res;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: `订单报表`,
            autoWidth: true,
            bookType: 'xlsx'
          });
          this.downloadLoading = false;
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            if (j === 'created_time') {
              return parseTime(v[j]);
            } else if (j === 'source') {
              if (v[j] === this.orderSource.OSRC_Third) {
                return this.zget(v['source_id'], 'value', 'label', this.$conf.OrderSource[1].children);
              } else {
                return this.zget(v[j], 'value', 'label', this.$conf.OrderSource);
              }
            } else if (j === 'order_status') {
              return this.$conf.OrderStatus[v[j]];
            } else if (j === 'pay_status') {
              if (v[j] == this.payStatus.PS_Refunded && v['refund_mark'] == this.refundMark.RM_PartRefund) {
                return this.$conf.PayStatus[this.payStatus.PS_PartRefund];
              } else {
                return this.$conf.PayStatus[v[j]];
              }
            } else if (j === 'amount' || j === 'customer_amount' || j === 'pay_amount' || j === 'refund_amount') {
              return v[j] / 100;
            } else {
              return v[j];
            }
          })
        );
      },
      //勾选
      selectionChange(val) {
        this.multipleSelection = val;
        this.changeOperation(val);
      },
      //勾选时 操作按钮显隐
      changeOperation(val) {
        this.orderDetailList.forEach(item => {
          item.isHidden = false;
          item.isShow = true;
          val.forEach(val => {
            if (val.innerid == item.innerid) {
              item.isHidden = true;
              item.isShow = false;
            }
          })
        })
      },
      //子表格退款时 操作按钮显隐
      handlePartRefund(row) {
        return row.isHidden = true;
      },
      handleCancel(row) {
        row.refund_num = Number(row.product_count) - Number(row.refund_count);
        row.isHidden = false;
        return;
      },
      //退款
      async handleRefund(row) {
        if (this.multipleSelection.length === 0) {
          //没勾选部分退款
          await this.getOrderDetailList(row.order_id);
          for (let val of this.orderDetailList) {
            if (val.refund_count > 0) {
              return this.ConfirmPartRefund(this.orderDetailList);
            }
          }
          return this.ConfirmAllRefund(row);
        } else {
          //勾选部分退款(打开退款明细)
          this.dialogTableVisible = true;
        }

      },
      //行操作：确认全部退款
      ConfirmAllRefund(row) {
        this.$confirm('确定全部退款吗? 此操作不可逆, 请谨慎操作!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let parmas = {
            trade_no: row.inner_order_no,
            refund_fee: row.pay_amount,
            comment: ''
          };
          orderRefund(parmas).then(res => {
            this.$message.success('操作成功');
            this.listLoading = false;
            this.expands = [];
            this.getList();
          }).catch(err => {
            this.$message.warning('退款失败');
            this.listLoading = false;
          })
        }).catch(() => {
        });
      },
      //行操作：确认部分退款
      ConfirmPartRefund(list) {
        this.$confirm('确定退款吗? 此操作不可逆, 请谨慎操作!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = []
          if (!Array.isArray(list)) {
            data = [list];
          } else {
            data = JSON.parse(JSON.stringify(list))
          }
          let refund_details_list = data.filter(item => item.refund_num > 0).map(item => {
            return {
              merchant_product_id: item.merchant_product_id,
              refund_count: item.refund_num
            }
          })
          if (refund_details_list.length === 0) {
            return this.$message.warning('退款数量需大于0')
          }
          this.listLoading = true;
          this.commitLoading = true;
          let parmas = {
            order_id: this.orderId,
            refund_details_list: refund_details_list,
          };
          partRefund(parmas).then(res => {
            this.$message.success('操作成功');
            this.dialogTableVisible = false;
            this.expands = [];
            this.getList();
            // this.getOrderDetailList(this.order_id);
          }).catch(err => {
            this.$message.warning('退款失败');
          }).finally(() => {
            this.listLoading = false;
            this.commitLoading = false;
          })
        }).catch(() => {
        });
      },
      //勾选操作：确认部分退款
      handleSubmit() {
        this.ConfirmPartRefund(this.multipleSelection)
      },
      //关闭退款数量明细弹框
      colseDialog() {
        this.dialogTableVisible = false;
      },
      //展开行
      getRowKeys(row) {
        return row.order_id;
      },
      expandChange(row, expandedRows) {
        if (expandedRows.length) {
          this.expands = [];
          this.multipleSelection = [];
          if (row) {
            this.expands.push(row.order_id);
            //获取药品详情列表
            this.getOrderDetailList(row.order_id);
          }
        } else {
          this.expands = [];
          this.multipleSelection = [];
        }
      },
      getOrderDetailList(id) {
        this.orderId = id;
        this.orderDetailList = [];
        if (this.orderId) {
          return getOrderDetail({order_id: this.orderId}).then(res => {
            const data = res;
            for (let val of data) {
              //退款数量
              val.refund_num = Number(val.product_count) - Number(val.refund_count);
              //子表格退款时 操作按钮显隐
              val.isHidden = false;
              //勾选时 操作按钮显隐
              val.isShow = true;
            }
            this.orderDetailList = data;
          }).catch(err => {
            this.$message({message: err.message || '获取列表数据失败, 请点击搜索重新加载列表数据'});
          })
        }
      },
      //获取订单取药监控
      viewPickUpRecord(row) {
        this.deviceInfo = {
          merchant_name: row.fullname,
          equipment_name: row.equipment_name
        }
        getPickupRecord({order_id: row.order_id}).then(res => {
          const data = res;
          this.recordData = data;
          this.pickUpRecord = true;
        }).catch(err => {
          this.$message({message: err.message || '获取订单监控数据失败'});
        })

      },
      //查看监控
      handleView(row) {
        this.resource_type = row.resource_type;
        let resourceUrl = this.$conf.resource.resourceUrl;
        let resource = row.resource_id;
        if (this.resource_type == 1) {
          this.$set(this.videoSources, 'src', `${resourceUrl}${resource}`);
        } else {
          let img_list = resource.split(',')
          this.imgList = img_list.map(img => `${resourceUrl}${img}`)
        }
        this.pickUpMonitor = true;
      },
      //关闭弹框
      closeVideoPlayer() {
        this.$refs.myVideoPlayer.player.pause();
      }
    },
    created() {
      this.getOption();
      this.getList();
    },
    watch: {
      $route: {
        handler() {
          let routeData = this.$route.query;
          if (Object.keys(routeData).length > 0) {
            let data = [];
            for (let key in routeData) {
              if ((key === 'source' || key === 'source_id') && routeData[key] !== '') {
                data.push(Number(routeData[key]));
              }
              if (key === 'created_time') {
                this.searchData.created_time = [routeData[key], routeData[key]]
              }
              if (key != 'source' && key != 'source_id' && key != 'created_time') {
                this.searchData[key] = routeData[key].toString()
              }
            }
            this.getOrderSource(data);
            this.handleSearch();
          }
        },
        immediate: true,
        deep: true
      },
    },
  }
</script>

<style>
  .el-carousel__container {
    height: 600px;
  }
</style>

<style scoped>
  .carousel-item {
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .carousel-img {
    height: 100%;
    width: 100%;
    /*max-width: 100%;*/
    /*max-height: 100%;*/

  }

</style>
