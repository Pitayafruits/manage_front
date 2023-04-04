<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>统计报表</span>
      </div>
      <div>
        <!--第 1 层-->
        <el-row>
          <el-col :span="8"
            ><div style="display: flex; align-items: center">
              <el-image :src="url1"></el-image>
              <div
                style="
                  margin-left: 50px;
                  font-size: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div>{{ houseNum }}</div>
                <div>房屋数量</div>
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div style="display: flex; align-items: center">
              <el-image :src="url2"></el-image>
              <div
                style="
                  margin-left: 50px;
                  font-size: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div>{{ liverNum }}</div>
                <div>业主人数</div>
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div style="display: flex; align-items: center">
              <el-image :src="url3"></el-image>
              <div
                style="
                  margin-left: 50px;
                  font-size: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div>{{ parkingNum }}</div>
                <div>车位数量</div>
              </div>
            </div></el-col
          >
        </el-row>
        <!--第 2 层-->
        <el-row style="margin-top: 15px">
          <el-col :span="12"
            ><div ref="chart2" style="height: 400px"></div
          ></el-col>
          <el-col :span="12"
            ><div ref="chart1" style="height: 400px"></div
          ></el-col>
        </el-row>
        <!--第 3 层-->
        <el-row style="margin-top: 15px">
          <el-col :span="8"
            ><div ref="chart3" style="height: 400px"></div
          ></el-col>
          <el-col :span="8"
            ><div ref="chart4" style="height: 400px"></div
          ></el-col>
          <el-col :span="8"
            ><div ref="chart5" style="height: 400px"></div
          ></el-col>
        </el-row>
      </div>
    </el-card>
    <Footer></Footer>
  </el-main>
</template>

<script>
import { getHouseNumApi } from "@/api/houseBuilding/house";
import { getLiverNumApi } from "@/api/liver/liver";
import { getParkingNumApi } from "@/api/parking/parking";
import {
  getComplaintCountApi,
  getRepairCountApi,
  getHouseStatusApi,
  getLiverBuildApi,
  getParkingStatusApi,
} from "@/api/report/report";
import Footer from "@/components/footer/footer";
export default {
  //注册自定义组件
  components: {
    Footer,
  },
  data() {
    return {
      //车位使用率饼形图
      //1.示例
      parkingStatus: [],
      //2.数据
      parkingCount: [],
      //小区人数统计饼形图
      //1.示例
      liverBuildList: [],
      //2.数据
      liverByBuildCount: [],
      //房屋入住率饼形图
      //1.示例
      houseStatus: [],
      //2.数据
      houseCount: [],
      //报修柱状图相关数据
      //1.报修月份
      repairMonths: [],
      //2.报修数量
      repairCount: [],
      //投诉折线图相关数据
      //1.投诉月份
      complaintMonths: [],
      //2.投诉数量
      complaintCount: [],
      //车位数量
      parkingNum: "",
      //业主数量
      liverNum: "",
      //房屋数量
      houseNum: "",
      //楼宇数量
      url1: "https://cdn.staticaly.com/gh/Pitayafruits/myPicRep@main/PropertyManage/202303051654369.jpg",
      //业主数量
      url2: "https://cdn.staticaly.com/gh/Pitayafruits/myPicRep@main/PropertyManage/202303051659374.jpg",
      //车位数量
      url3: "https://cdn.staticaly.com/gh/Pitayafruits/myPicRep@main/PropertyManage/202303061615145.jpg",
    };
  },
  created() {
    this.getHouseNum();
    this.getLiverNum();
    this.getParkingNum();
  },
  mounted() {
    this.getComplaintCount();
    this.getRepairCount();
    this.getHouseStatus();
    this.getLiverBuild();
    this.getParkingStatus();
  },
  methods: {
    //查询车位使用率数据
    async getParkingStatus() {
      let res = await getParkingStatusApi();
      if (res && res.code == 200) {
        this.parkingStatus = res.data.parkingStatus;
        this.parkingCount = res.data.parkingCount;
        this.initParkingStatus();
      }
    },
    //加载车位使用率饼形图
    async initParkingStatus() {
      let mychart = this.$echarts.init(this.$refs.chart5);
      //绘制图表
      mychart.setOption({
        title: {
          text: "小区车位使用率",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/> {b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.parkingStatus,
        },
        series: [
          {
            name: "使用情况",
            type: "pie",
            radius: "50%",
            data: this.parkingCount,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    //查询小区人数数据
    async getLiverBuild() {
      let res = await getLiverBuildApi();
      this.liverBuildList = res.data.liverBuildList;
      this.liverByBuildCount = res.data.liverByBuildCount;
      this.initLiverCount();
    },
    //加载小区人数统计饼形图
    initLiverCount() {
      let mychart = this.$echarts.init(this.$refs.chart4);
      //绘制图表
      mychart.setOption({
        title: {
          text: "小区人数统计",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/> {b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.liverBuildList,
        },
        series: [
          {
            name: "人数统计",
            type: "pie",
            radius: "50%",
            data: this.liverByBuildCount,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    //查询房屋入住率数据
    async getHouseStatus() {
      let res = await getHouseStatusApi();
      if (res && res.code == 200) {
        this.houseStatus = res.data.houseStatus;
        this.houseCount = res.data.houseCount;
        this.initHouseStatus();
      }
    },
    //加载房屋入住率饼形图
    initHouseStatus() {
      let mychart = this.$echarts.init(this.$refs.chart3);
      //绘制图表
      mychart.setOption({
        title: {
          text: "小区房屋入住率",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/> {b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: this.houseStatus,
        },
        series: [
          {
            name: "入住情况",
            type: "pie",
            radius: "50%",
            data: this.houseCount,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    //查询报修柱状图数据
    async getRepairCount() {
      let res = await getRepairCountApi();
      if (res && res.code == 200) {
        this.repairMonths = res.data.repairMonths;
        this.repairCount = res.data.repairCount;
        this.initRepair();
      }
    },
    //加载报修图表
    initRepair() {
      let myChart = this.$echarts.init(this.$refs.chart2);
      //绘制图表
      myChart.setOption({
        title: { text: "报修数量" },
        tooltip: {},
        xAxis: {
          type: "category",
          data: this.repairMonths,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.repairCount,
            type: "bar",
          },
        ],
      });
    },
    //查询投诉折线图数据
    async getComplaintCount() {
      let res = await getComplaintCountApi();
      if (res && res.code == 200) {
        this.complaintMonths = res.data.complaintMonths;
        this.complaintCount = res.data.complaintCount;
        this.initComplaint();
      }
    },
    //加载投诉图表
    initComplaint() {
      let myChart = this.$echarts.init(this.$refs.chart1);
      // 绘制图表
      myChart.setOption({
        title: { text: "投诉数量" },
        tooltip: {},
        xAxis: {
          type: "category",
          data: this.complaintMonths,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "投诉数量",
            type: "line",
            data: this.complaintCount,
          },
        ],
      });
    },
    //查找车位数量
    async getParkingNum() {
      let res = await getParkingNumApi();
      if (res && res.code == 200) {
        this.parkingNum = res.data;
      }
    },
    //查找业主数量
    async getLiverNum() {
      let res = await getLiverNumApi();
      if (res && res.code == 200) {
        this.liverNum = res.data;
      }
    },
    //查找房屋数量
    async getHouseNum() {
      let res = await getHouseNumApi();
      if (res && res.code == 200) {
        this.houseNum = res.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
