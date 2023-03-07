<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="tableData.list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
      :span-method="spanMethod"
    >
      <el-table-column align="center" label="No" width="50" fixed>
        <template slot-scope="scope">
          <span style="font-weight: bold">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" v-for="header in tableData.headers" :label="header.value" class="my">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <div style="padding: 8px 8px">
              <el-input v-model="scope.row[`x${header.value}`].x_aisle_count" class="edit-input" size="small"/>
            </div>
          </template>
          <span v-else>
            <el-tooltip placement="top">
              <div
                slot="content">{{
                  scope.row[`x${header.value}`] ? ((scope.row[`x${header.value}`].y + 1) + "层 " + (scope.row[`x${header.value}`].x + 1) + "列") : ""
                }}</div>
              <div class="c-td">
                {{
                  scope.row[`x${header.value}`] ? (scope.row[`x${header.value}`].x_aisle_count == 0 ? " " : scope.row[`x${header.value}`].x_aisle_count) : ''
                }}
              </div>
           </el-tooltip>
          </span>
        </template>

      </el-table-column>
      <el-table-column v-if="!isHidden" label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="150px">
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            @click="confirmEdit(row,$index)">
            保存
          </el-button>
          <el-button
            v-if="row.edit"
            type="warning"
            size="small"
            @click="cancel(row,$index)">
            取消
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!!!row.edit">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:15px; text-align: center">
      <router-link :to="'/device/device'">
        <el-button type="primary" size="small">返回</el-button>
      </router-link>
    </el-row>
  </div>
</template>

<script>
import {getInfo,updateChannel} from '@/api/device'

export default {
  name: "channel",
  data() {
    return {
      listLoading: false,
      tableData: {
        headers: [],
        list: []
      },
      channelInfo: {},
      rawData: [],
      info:{},
      isHidden:false,
    }
  },
  methods: {
    //获取设备型号详情
    async getInfo() {
      try {
        this.info = await getInfo(this.innerid);
        //T开头设备型号的设备不能修改药道
        this.isHidden= this.info.type.startsWith('T')
      } catch (err) {
        this.$message.warning(err.message);
      }

    },
    initChannel() {
      this.channelInfo = JSON.parse(this.info.drug_channel);
      for (let i = 0; i < this.channelInfo.aisleX; i++) {
        this.tableData.headers.push({
          key: `X${i + 1}`,
          value: (i + 1).toString()
        });
      }

      let list = this.channelInfo.slot_info_list;
      if (list && Array.isArray(list) && list.length > 0) {
        for (let i = 0; i < this.channelInfo.aisleY; i++) {
          let row = { edit:false};
          for (let j = 0; j < this.channelInfo.aisleX; j++) {
            let filterArr = list.filter(item => (item.y === i && item.x === j));
            if (filterArr.length > 0) {
              let obj = filterArr[0];
              row[`x${j + 1}`] = {};
              row[`x${j + 1}`].x_aisle_count = obj.x_aisle_count;
              row[`x${j + 1}`].colspan = (obj.x_aisle_count == 0 ? 1 : obj.x_aisle_count);
              row[`x${j + 1}`].x = obj.x;
              row[`x${j + 1}`].y = obj.y;
              row[`x${j + 1}`].slot_no = obj.slot_no;
              j +=  obj.x_aisle_count >0?(obj.x_aisle_count - 1):0;
            }
            else {
              row[`x${j + 1}`] = {};
              row[`x${j + 1}`].slot_no = this.channelInfo.aisleX * i + j + 1;
              row[`x${j + 1}`].x = j;
              row[`x${j + 1}`].y = i;
              row[`x${j + 1}`].x_aisle_count = 0;
              row[`x${j + 1}`].colspan = 1;
            }

          }
          this.tableData.list.push(row);
        }

      } else {
        for (let i = 0; i < this.channelInfo.aisleY; i++) {
          let row = { edit:false};
          for (let j = 0; j < this.channelInfo.aisleX; j++) {
            row[`x${j + 1}`] = {};
            row[`x${j + 1}`].slot_no = this.channelInfo.aisleX * i + j + 1;
            row[`x${j + 1}`].x = j;
            row[`x${j + 1}`].y = i;
            row[`x${j + 1}`].x_aisle_count = 0;
            row[`x${j + 1}`].colspan = 1;
          }
          this.tableData.list.push(row);
        }
      }
      this.rawData = JSON.parse(JSON.stringify(this.tableData.list))
    },
    spanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0 || columnIndex === this.channelInfo.aisleX + 1) return {
        rowspan: 1,
        colspan: 1
      }
      else {
        return {
          rowspan: 1,
          colspan: row[`x${columnIndex}`] ? row[`x${columnIndex}`].colspan : 0,
        }
      }

    },
    confirmEdit(row, index) {
      let newRow = {
        edit: false
      };
      for (let i = 0; i < this.channelInfo.aisleX; i++) {

        newRow[`x${i + 1}`] = row[`x${i + 1}`];

        if (newRow[`x${i + 1}`]) {
          let x_aisle_count = Number(newRow[`x${i + 1}`].x_aisle_count);
          if (x_aisle_count + i > this.channelInfo.aisleX) {
            return this.$message.warning(`第${newRow[`x${i + 1}`].y + 1}行第${i + 1}列数据有误, 请核实.`);
          }
          newRow[`x${i + 1}`].colspan = (x_aisle_count == 0 ? 1 : x_aisle_count);
          if (x_aisle_count > 1) i += (x_aisle_count - 1);
        }
      }
      this.fillRow(newRow, index);
      this.$set(this.tableData.list, index, newRow);
      this.saveChannel();
    },
    // 填充row
    fillRow(row, index) {
      for (let i = 0; i < this.channelInfo.aisleX; i++) {
        if (!row[`x${i + 1}`]) {
          row[`x${i + 1}`] = {};
          row[`x${i + 1}`].slot_no = this.channelInfo.aisleX * index + i + 1;
          row[`x${i + 1}`].x = i;
          row[`x${i + 1}`].y = index;
          row[`x${i + 1}`].x_aisle_count = 0;
          row[`x${i + 1}`].colspan = 1;
        } else {
          let x_aisle_count = row[`x${i + 1}`].x_aisle_count;
          if (x_aisle_count > 1) i += (x_aisle_count - 1);
        }
      }
    },
    async saveChannel() {
      let newChannelInfo = {};
      newChannelInfo.type = this.channelInfo.type;
      newChannelInfo.container_num = this.channelInfo.container_num;
      newChannelInfo.aisleX = this.channelInfo.aisleX;
      newChannelInfo.aisleY = this.channelInfo.aisleY;
      newChannelInfo.length = this.channelInfo.length;
      newChannelInfo.width = this.channelInfo.width;
      newChannelInfo.height = this.channelInfo.height;
      newChannelInfo.slot_info_list = [];
      for (let i = 0; i < this.tableData.list.length; i++) {
        let row = this.tableData.list[i];
        for (let j = 0; j < this.channelInfo.aisleX; j++) {
          if (row[`x${j + 1}`] && row[`x${j + 1}`].x_aisle_count) {
            newChannelInfo.slot_info_list.push({
              slot_no: row[`x${j + 1}`].slot_no,
              x_aisle_count: Number(row[`x${j + 1}`].x_aisle_count),
              x: row[`x${j + 1}`].x,
              y: row[`x${j + 1}`].y,
              colspan:row[`x${j + 1}`].colspan
            });
          }
        }
      }
      try {
        await updateChannel(this.innerid,{drug_channel:JSON.stringify(newChannelInfo)});
      }
      catch (err) {
        this.$message.warning(err.message);
      }
    },
    cancel(row, index) {
      row.edit=false
      let newRow = {}
      for (let i = 0; i < this.channelInfo.aisleX; i++) {
        newRow[`x${i + 1}`] = row[`x${i + 1}`]
        if (newRow[`x${i + 1}`]) {
          newRow[`x${i + 1}`].slot_no = this.rawData[index][`x${i + 1}`].slot_no
          newRow[`x${i + 1}`].x = this.rawData[index][`x${i + 1}`].x
          newRow[`x${i + 1}`].y = this.rawData[index][`x${i + 1}`].y
          newRow[`x${i + 1}`].colspan = this.rawData[index][`x${i + 1}`].colspan
          newRow[`x${i + 1}`].x_aisle_count = this.rawData[index][`x${i + 1}`].x_aisle_count
          if (newRow[`x${i + 1}`].x_aisle_count > 1) i += (newRow[`x${i + 1}`].x_aisle_count - 1);
        }
      }
      row=newRow
      return;
    }
  },

  async created() {
    this.innerid = this.$route.params.id;
    await this.getInfo();
    this.initChannel();
  },
}
</script>

<style scoped>
/deep/ .el-table td {
  padding: 0;
}

/deep/ .el-table .cell {
  padding: 0;
}

.c-td {
  width: 100%;
  padding: 12px 0;
  min-height: 47px;
}

.c-td:hover {
  background: #409EFF;
}
</style>
