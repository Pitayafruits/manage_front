<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>报修列表</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="报修人">
            <el-input v-model="parms.liverName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchRepair" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--投诉列表 -->
      <div>
        <el-table
          :data="tableList"
          empty-text="暂无数据"
          :header-cell-style="{
            background: 'rgba(0,0,0,0.05)',
            'text-align': 'center',
          }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column prop="liverName" label="报修人"></el-table-column>
          <el-table-column prop="liverPhone" label="联系电话"></el-table-column>
          <el-table-column
            prop="repairPlace"
            label="报修地址"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="repairText"
            label="报修内容"
            width="290"
          ></el-table-column>
          <el-table-column
            prop="repairTime"
            label="报修时间"
            :formatter="formatTime"
          ></el-table-column>
          <el-table-column prop="repairStatus" label="维修状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.repairStatus == '0'"
                type="info"
                size="small"
                >未维修</el-tag
              >
              <el-tag
                v-if="scope.row.repairStatus == '1'"
                type="success"
                size="small"
                >已维修</el-tag
              >
            </template></el-table-column
          ><el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('repair:repairList:slove')"
                type="success"
                size="small"
                @click="sloveRepair(scope.row)"
                icon="el-icon-view"
                >处理报修</el-button
              >
            </template></el-table-column
          >
        </el-table>
        <div style="margin-top: 10px">
          <!--分页组件-->
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="parms.currentPage"
            :page-sizes="[10, 15, 20]"
            :page-size="parms.pageSize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="parms.total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <Footer></Footer>
  </el-main>
</template>

<script>
import { getRepairListApi, overRepairApi } from "@/api/repair/repairList";
import Footer from "@/components/footer/footer";
export default {
  components: {
    Footer,
  },
  data() {
    return {
      //新增或编辑弹框属性
      addModel: {
        editType: "",
        repairId: "",
        liverId: "",
        repairPlace: "",
        repairText: "",
      },
      //弹框属性
      addDialog: {
        title: "",
        height: 200,
        width: 630,
        visible: false,
      },
      //表格数据
      tableList: [],
      //分页请求参数
      parms: {
        currentPage: 1,
        pageSize: 10,
        liverName: "",
        total: 0,
      },
    };
  },
  created() {
    this.getRepairList();
  },
  methods: {
    //分页查询
    async getRepairList() {
      let res = await getRepairListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getRepairList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getRepairList();
    },
    //处理维修按钮
    async sloveRepair(row) {
      let parm = {
        repairId: row.repairId,
        liverId: row.liverId,
        repairPlace: row.repairPlace,
        repairText: row.repairText,
        repairStatus: row.repairStatus,
      };
      if (row.repairStatus == "1") {
        this.$message.warning("该报修已处理，请勿重复操作！");
        return;
      }
      const confirm = await this.$confirm("确定处理完成了吗？");
      if (confirm) {
        let res = await overRepairApi(parm);
        if (res && res.code == 200) {
          this.getRepairList();
          this.$message.success(res.msg);
        }
      }
    },
    //表格时间格式化
    formatTime(row, column) {
      let data = row[column.property];
      let dtime = new Date(data);
      const year = dtime.getFullYear();
      let month = dtime.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let day = dtime.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      let hour = dtime.getHours();
      if (hour < 10) {
        hour = "0" + hour;
      }
      let minute = dtime.getMinutes();
      if (minute < 10) {
        minute = "0" + minute;
      }
      let second = dtime.getSeconds();
      if (second < 10) {
        second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    //重置按钮
    resetSearch() {
      this.parms.liverName = "";
      this.getRepairList();
    },
    //查询按钮
    searchRepair() {
      this.getRepairList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
