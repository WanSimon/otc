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
          <el-select v-model="searchData.place_list" placeholder="发布渠道" clearable style="width:100%;">
            <el-option v-for="(val, idx) in $conf.noticePlace" :key="idx" :label="val" :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.status" placeholder="公告状态" clearable style="width:100%;">
            <el-option v-for="(val, idx) in $conf.noticeStatus" :key="idx" :label="val" :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.type" placeholder="公告类型" clearable style="width:100%;">
            <el-option v-for="(val, idx) in $conf.noticeType" :key="idx" :label="val" :value="idx"></el-option>
          </el-select>
        </el-col>

        <el-col :xs="12" :sm="8" :md="8" :lg="8">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
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
      <el-table-column label="标题" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="发布日期" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.publication_date| parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="公告类型" min-width="200" align="center">
        <template slot-scope="scope">
          {{ $conf.noticeType[scope.row.type] || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="200" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==noticeStatus.NS_Online">{{ $conf.noticeStatus[scope.row.status]}}</el-tag>
          <el-tag type="info" v-else-if="scope.row.status==noticeStatus.NS_Offline">{{ $conf.noticeStatus[scope.row.status]}}</el-tag>
          <el-tag type="warning" v-else>{{ $conf.noticeStatus[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="发布人" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" :disabled="row.status == noticeStatus.NS_Online" @click="handleUpdate(row.innerid)">
            编辑
          </el-button>
          <el-button v-show="row.status !== noticeStatus.NS_Online" type="primary" size="mini" @click="release(row.innerid)">
            发布
          </el-button>
          <el-button v-show="row.status == noticeStatus.NS_Online" type="primary" size="mini" @click="cancel(row.innerid)">
            下线
          </el-button>
          <el-button size="mini" type="danger" :disabled="row.status == noticeStatus.NS_Online" @click="handleDelete(row.innerid)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="searchData.page" :limit.sync="searchData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import SelectTree from "@/components/treeSelect";
import {getMerchantTree} from '@/api/merchant';
import {getList, del, release, cancel} from '@/api/notice';
import {parseTime, parseTree} from '@/utils/index';
import {NoticeStatus} from "@/js/common";

export default {
  name: 'notice',
  components: { Pagination,SelectTree },
  filters: {
    parseTime: parseTime
  },
  data() {
    return {
      props:{                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      noticeStatus: NoticeStatus,//公告状态
      list: null,
      listLoading: true,
      merchantTree: [],//商户树
      total: 0,
      // 搜索
      searchData: {
        page: 1,
        limit: 10,
        place_list: "",
        status: "",
        type: '',
        merchant_id: '',
      },
    }
  },
  created() {
    this.initMerchantTree();
    this.getList();
  },
  methods: {
    //获取商户id
    getValue(value){
      this.searchData.merchant_id = value
    },
    // 获取商户
    initMerchantTree() {
      this.listLoading = true;
      getMerchantTree().then(response => {
        let merchantList = response
        this.merchantTree = parseTree(merchantList)
        this.listLoading = false;
      })
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      getList(this.searchData).then(response => {
        this.list = response.list;
        this.total = response.count;
      }).finally(() => {
        this.listLoading = false
      })
    },
    // 搜索
    search() {
      this.$set(this.searchData, 'page', 1);
      this.getList();
    },
    // 新增
    handleAdd() {
      this.$router.push('/notice/noticeAdd')
    },
    // 编辑
    handleUpdate(innerid) {
      this.$router.push('/notice/noticeEdit/' + innerid);
    },
    // 发布
    async release(innerid) {
      try {
        await this.$confirm('是否发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        });
        this.listLoading = true;
        await release(innerid);
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
    // 下线
    async cancel(innerid) {
      try {
        await this.$confirm('确认下线吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        this.listLoading = true;
        await cancel(innerid);
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
    // 删除
    async handleDelete(innerid) {
      try {
        await this.$confirm('确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        this.listLoading = true;
        await del(innerid);
        this.$message.success('操作成功');
        this.listLoading = false;
        this.getList();
      } catch (err) {
        this.listLoading = false;
        if (err !== 'cancel') {
          this.$message.warning(err.message || '操作失败');
        }
      }
    }
  }
}
</script>
