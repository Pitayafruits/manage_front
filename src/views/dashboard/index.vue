<template>
  <el-main>
    <!--欢迎横幅-->
    <el-row>
      <el-col :span="24"
        ><el-card class="box-card"
          ><span class="box-text">欢迎使用物业管理系统!</span
          ><span class="top-time">{{ timeArry.timeText }}</span></el-card
        ></el-col
      >
    </el-row>
    <!--物业合影-->
    <el-row>
      <el-col :span="24">
        <div>
          <el-image style="width: 100%; height: 100%" :src="url"></el-image>
        </div>
      </el-col>
    </el-row>
    <!--自定义页底-->
    <el-row>
      <el-col :span="24"><Footer></Footer></el-col>
    </el-row>
  </el-main>
</template>

<script>
import { formatDate } from "@/utils/time";
import Footer from "@/components/footer/footer";
export default {
  //注册自定义组件
  components: {
    Footer,
  },
  data() {
    return {
      //图片url
      url: "https://cdn.staticaly.com/gh/Pitayafruits/myPicRep@main/PropertyManage/202303051554729.jpg",
      //实时时间
      timeArry: "",
    };
  },
  created() {
    this.timeArry = formatDate(new Date());
    this.timeStart();
  },
  methods: {
    //实时时间
    timeStart() {
      // 设置定时器
      this.timer = setInterval(() => {
        this.timeArry = formatDate(new Date());
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
//顶部横幅的时间
.top-time {
  font-size: 18px;
  font-family: "黑体";
  float: right;
}
//顶部横幅的文字
.box-text {
  font-size: 18px;
  font-family: "黑体";
  color: #000000;
}
//顶部横幅
.box-card {
  width: 100%;
  background-color: #f2f2f2;
}
</style>
