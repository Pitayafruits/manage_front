<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>水费记录</span>
      </div>
      <div class="box">
        <!--缴费表格-->
        <el-table :data="tableList" border stripe>
          <el-table-column prop="waterDate" label="缴费时间"> </el-table-column>
          <el-table-column prop="waterMoney" label="缴费金额">
          </el-table-column>
          <el-table-column prop="waterStatus" label="缴费状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.waterStatus == '0'"
                type="danger"
                size="normal"
                >未缴费</el-tag
              >
              <el-tag
                v-if="scope.row.waterStatus == '1'"
                type="success"
                size="normal"
                >已缴费</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <div style="margin-top: 10px">
          <!--分页组件-->
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="parms.currentPage"
            :page-sizes="[5, 10, 20]"
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
import { getLiverWaterListApi } from "@/api/payRecords/records";
import { getUserId } from "@/utils/auth";
import Footer from "@/components/footer/footer";
export default {
  //注册自定义组件
  components: {
    Footer,
  },
  data() {
    return {
      //表格数据
      tableList: [],
      //分页参数
      parms: {
        currentPage: 1,
        pageSize: 5,
        liverId: getUserId(),
        total: 0,
      },
    };
  },
  created() {
    this.getLiverWaterList();
  },
  methods: {
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getLiverWaterList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getLiverWaterList();
    },
    //查询水费记录
    async getLiverWaterList() {
      let res = await getLiverWaterListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
