<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <SelectTree
            placeholder="请选择商户"
            style="width: 100%"
            :props="props"
            :options="merchantTree"
            :value="searchData.merchant_id"
            @getValue="getValue($event)"/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model="searchData.name" placeholder="名称" clearable></el-input>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-input v-model.trim="searchData.bar_code" placeholder="国际条码" clearable></el-input>
        </el-col>

        <el-col :xs="24" :sm="20" :md="16" :lg="12">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteAll">批量删除</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="handleExcel" :loading="downloadLoading">导出</el-button>
          <el-button type="success" icon="el-icon-notebook-2" @click="downloadFile">模板</el-button>
          <el-upload
            class="upload-demo inline-block margin-right-10"
            action=""
            :on-change="handleImport"
            :show-file-list="false"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :auto-upload="false"
            style="margin-left: 10px">
            <el-button type="success" icon="el-icon-download">导入</el-button>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" fixed/>
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{ (searchData.page - 1) * searchData.limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="图标" width="120" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.home_thumb_url">
            <el-image :preview-src-list="[`${$conf.resource.baseUrl}${scope.row.home_thumb_url}`]"
                      :src="`${$conf.resource.baseUrl}${scope.row.home_thumb_url}`"
                      style="width:60px;height:60px;">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商家" min-width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.merchant_id | zget('value', 'label', merchantList) }}
        </template>
      </el-table-column>
      <el-table-column label="药品名" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="药品别名" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.alias }}
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="135" align="center">
        <template slot-scope="scope">
          {{ $conf.productType[scope.row.product_type] || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="批准文号" min-width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.approval_number }}
        </template>
      </el-table-column>
      <el-table-column label="商品品牌" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.brand }}
        </template>
      </el-table-column>
      <el-table-column label="生产厂家" min-width="210" align="center">
        <template slot-scope="scope">
          {{ scope.row.manufacturer }}
        </template>
      </el-table-column>
      <el-table-column label="批次批号" width="160" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.batch }}</div>
          <div>{{ scope.row.batch_number }}</div>
          <div>{{ scope.row.electronic_monitoring_code }}</div>
        </template>
      </el-table-column>
      <el-table-column label="国际条码" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.bar_code }}
        </template>
      </el-table-column>
      <el-table-column label="原价格" width="100" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.price) }}
        </template>
      </el-table-column>
      <el-table-column label="会员价" width="100" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.customer_price) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.innerid)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row.innerid)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog弹窗 -->
    <el-dialog title="导入结果" :visible.sync="dialogTableVisible" width="60%" :close-on-click-modal="false">
      <el-col :span="8">
        <SelectTree
          placeholder="请选择商户"
          :props="props"
          :options="merchantTree"
          :value="form.merchant_id"
          @getValue="getMerchantId"
          style="margin-bottom: 15px"/>
      </el-col>
      <el-table
        :data="productData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        border
        highlight-current-row
        max-height="500">
        <el-table-column align="center" label="序号" width="55">
          <template slot-scope="{row,$index}">
            {{ (currentPage - 1) * PageSize + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column property="name" label="药品名称" min-width="150" align="center"></el-table-column>
        <el-table-column property="approval_number" label="批准文号" min-width="150" align="center"></el-table-column>
        <el-table-column property="bar_code" label="国际条码" min-width="150" align="center"></el-table-column>
        <el-table-column label="药品尺寸(长x宽x高)mm" min-width="150" align="center">
          <template slot-scope="{row,$index}">
            {{ (row.product_length/100) + 'x' + (row.product_width/100) + 'x' + (row.product_height/100) }}
          </template>
        </el-table-column>
        <el-table-column property="specification" label="商品规格" min-width="100" align="center"></el-table-column>
        <el-table-column property="brand" label="药品品牌" min-width="100" align="center"></el-table-column>
        <el-table-column property="manufacturer" label="生产厂家" min-width="200" align="center"></el-table-column>
        <el-table-column property="origin_place" label="药品产地" min-width="200" align="center"></el-table-column>
        <el-table-column property="min_day" label="单盒服用最短天数" width="120" align="center"></el-table-column>
        <el-table-column property="max_day" label="单盒服用最长天数" width="120" align="center"></el-table-column>
        <el-table-column property="usage_dosage" label="用法用量" min-width="100" align="center"></el-table-column>
        <el-table-column property="treatment_course" label="疗程" align="center"></el-table-column>
        <el-table-column property="expiration_date" label="保质期" align="center"></el-table-column>
        <el-table-column property="product_function" label="主治功能" align="center"></el-table-column>
        <el-table-column property="adverse_reaction" label="不良反应" align="center"></el-table-column>
        <el-table-column property="taboo" label="禁忌" align="center"></el-table-column>
        <el-table-column property="attention" label="注意事项" align="center"></el-table-column>
        <el-table-column property="interactions" label="药物相互作用" width="100" align="center"></el-table-column>
        <el-table-column property="product_no" label="商品编号" min-align="center"></el-table-column>
        <el-table-column property="expire_date" label="有效期至" min-width="100" align="center"></el-table-column>
        <el-table-column property="batch" label="批次" min-width="100" align="center"></el-table-column>
        <el-table-column property="batch_number" label="批号" min-width="100" align="center"></el-table-column>
        <el-table-column property="electronic_monitoring_code" label="电子监管码" min-width="100"
                         align="center"></el-table-column>
        <el-table-column property="price" label="原价" width="75" align="center" fixed="right">
          <template slot-scope="scope">
            {{ parseMoney(scope.row.price) }}
          </template>
        </el-table-column>
        <el-table-column property="customer_price" label="会员价" width="75" align="center" fixed="right">
          <template slot-scope="scope">
            {{ parseMoney(scope.row.customer_price) }}
          </template>
        </el-table-column>
        <el-table-column prop="errcode" label="操作结果" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.errcode">
              <el-tag type="success">成功</el-tag>
            </div>
            <div v-else>
              <el-tag type="danger">失败</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="productData.length" style="margin-top: 15px">
      </el-pagination>
      <el-row style="text-align: center;margin-top: 15px">
        <el-button type="primary" @click="confrimImport">确认</el-button>
        <el-button @click="colseDialog">取消</el-button>
      </el-row>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
import {getList, del, addBatch} from '@/api/merchantProduct'
import Pagination from '@/components/Pagination'
import SelectTree from "@/components/treeSelect";
import XLSX from 'xlsx';
import {getMerchantTree} from '@/api/merchant';
import {parseTree, zget, parseMoney} from '@/utils/index';

export default {
  name: 'index',
  components: {Pagination, SelectTree},
  filters: {
    zget: zget,
  },
  data() {
    return {
      props: {                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      list: [],
      listLoading: false,
      downloadLoading: false,
      // 商户列表
      merchantList: [],
      // 商户树
      merchantTree: [],
      dialogTableVisible: false,
      form: {merchant_id: ''},
      productData: [],
      // 默认显示第几页
      currentPage: 1,
      // 个数选择器
      pageSizes: [10, 20, 50, 100],
      // 默认每页显示的条数
      PageSize: 10,

      total: 0,
      // 搜索
      searchData: {
        page: 1,
        limit: 10,
        name: "",
        bar_code: "",
        manufacturer: "",
      },
      multipleSelection: []
    }
  },
  created() {
    this.getList();
    this.initMerchantTree();
  },
  methods: {
    //获取商户id
    getValue(value) {
      this.searchData.merchant_id = value;
    },
    parseMoney: parseMoney,
    // 每页显示的条数
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
    },

    // 获取商户
    initMerchantTree() {
      this.listLoading = true;
      getMerchantTree().then(response => {
        this.merchantList = response;
        this.merchantTree = parseTree(this.merchantList);
        this.listLoading = false;
      })
    },
    // 搜索
    search() {
      this.$set(this.searchData, 'page', 1);
      this.getList();
    },
    // 新增
    handleAdd() {
      this.$router.push('/product/addGoods');
    },
    // 编辑
    handleUpdate(innerid) {
      this.$router.push('/product/editGoods/' + innerid);
    },
    // 删除
    handleDelete(innerid) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        del({innerid: innerid}).then(res => {
          this.$message.success('操作成功');
          this.getList();
        }).catch(err => {
          this.$message.warning(err.message || '操作失败');
        }).finally(() => {
          this.listLoading = false;
        });
      }).catch(() => {
      });
    },
    //批量删除
    deleteAll() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先至少选择一项')
      }
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.innerid);
        });
        this.listLoading = true;
        del({innerid: idList}).then(res => {
          this.$message.success('操作成功');
          this.getList();
        }).catch(err => {
          this.$message.warning(err.message || '操作失败');
        }).finally(() => {
          this.listLoading = false;
        })
      }).catch(() => {
      });
    },
    //选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      getList(this.searchData).then(response => {
        this.list = response.list;
        this.total = response.count;
      }).finally(() => {
        this.listLoading = false;
      })
    },

    //上传文件时处理方法
    async handleImport(file, fileList) {
      let fileTemp = file.raw;
      let fileName = file.raw.name;
      let fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
      if (fileTemp) {
        if (fileType === 'xlsx' || fileType === 'xls') {
          let dataBinary = await this.readFile(file.raw);
          let workBook = XLSX.read(dataBinary, {type: 'binary', cellDates: true});
          let workSheet = workBook.Sheets[workBook.SheetNames[0]];
          let data = XLSX.utils.sheet_to_json(workSheet);
          let tableList = data.map(v => {
            return {
              name: v['药品名称'] || '',
              approval_number: v['批准文号'] || '',
              bar_code: v['国际条码'] || '',
              product_length: Math.round(100 * v['长度(mm)']) || '',
              product_width: Math.round(100 * v['宽度(mm)']) || '',
              product_height: Math.round(100 * v['高度(mm)']) || '',
              specification: v['商品规格'] || '',
              brand: v['药品品牌'] || '',
              manufacturer: v['生产厂家'] || '',
              origin_place: v['药品产地'] || '',
              min_day: v['单盒服用最短天数'] || '',
              max_day: v['单盒服用最长天数'] || '',
              usage_dosage: v['用法用量'] || '',
              treatment_course: v['疗程'] || '',
              expiration_date: v['保质期'] || '',
              product_function: v['主治功能'] || '',
              adverse_reaction: v['不良反应'] || '',
              taboo: v['禁忌'] || '',
              attention: v['注意事项'] || '',
              interactions: v['药物相互作用'] || '',
              product_no: v['商品编号'] || '',
              expire_date: this.$moment(v['有效期至']).add(1, 'days').format('YYYY-MM-DD') || '',
              batch: v['批次'] || '',
              batch_number: v['批号'] || '',
              electronic_monitoring_code: v['电子监管码'] || '',
              price: Math.round(100 * v['原价(元)']) || '',
              customer_price: Math.round(100 * v['会员价(元)']) || '',
            };
          })
          tableList.forEach(item => {
            if (!item.name || !item.approval_number || !item.bar_code || !item.product_length || !item.product_width || !item.product_height || !item.price || !item.customer_price) {
              item.errcode = 0;
            } else {
              item.errcode = 1;
            }
          })
          this.productData = JSON.parse(JSON.stringify(tableList));
          this.dialogTableVisible = true;
        } else {
          this.$message.warning('附件必须是xlsx或xls格式');
        }
      } else {
        this.$message.warning('请上传Excel附件');
      }
    },
    //读取文件
    readFile(file) {
      return new Promise(resolve => {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = ev => {
          resolve(ev.target.result);
        }
      })
    },
    //确认导入
    confrimImport() {
      let params = this.productData.filter(item => item.errcode === 1);
      if (!this.form.merchant_id) {
        return this.$message.warning("请选择商户");
      }
      //检查文件中的国际条形码是否重复
      for (let i = 0; i < params.length - 1; i++) {
        for (let j = i + 1; j < params.length; j++) {
          if (params[i].bar_code === params[j].bar_code) {
            return this.$message.warning("导入文件中含有重复国际条码,请检查导入文件");
          }
        }
      }
      let res = {
        merchant_id: this.form.merchant_id,
        productData: params,
      };
      addBatch(res).then(res => {
        this.colseDialog();
        this.getList();
      }).catch(err => {
        this.$message.warning(err.message || '保存失败');
      })
    },
    //关闭导入弹框
    colseDialog() {
      this.dialogTableVisible = false;
    },
    getMerchantId(e) {
      this.$set(this.form, 'merchant_id', e);
    },
    // 导出excel
    async handleExcel() {
      try {
        this.downloadLoading = true;
        let res = await getList({...this.searchData, page: 1, limit: 1000000});
        // 导出
        await import("../../utils/Export2Excel").then(excel => {
          const tHeader = ["商家", "药品名", "药品别名", "类型", "批准文号", "商品品牌", "生产厂家", "批次", "批号", "电子监管码", "国际条码", "原价格", "会员价"];
          const filterVal = ["merchant_id", "name", "alias", "product_type", "approval_number", "brand", "manufacturer", "batch", "batch_number", "electronic_monitoring_code", "bar_code", "price", "customer_price"];
          const list = res.list;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "商家药品列表",
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
        this.downloadLoading = false;
      } catch (err) {
        this.downloadLoading = false;
        this.$message.warning(err.message || '操作失败');
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'merchant_id') {
            return zget(v[j], 'value', 'label', this.merchantList);
          } else if (j === 'product_type') {
            return this.$conf.productType[v[j]];
          } else if (j === 'price' || j === 'customer_price') {
            return parseMoney(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    downloadFile() {
      window.open(window.location.origin + '/merchantProduct.xlsx');
    },
  }
}
</script>

<style scoped>
.inline-block {
  display: inline-block;
}

</style>
