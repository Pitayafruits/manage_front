<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>投诉列表</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="投诉标题">
            <el-input v-model="parms.complaintTitle"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchComplaint" icon="el-icon-search"
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
          <el-table-column prop="liverName" label="投诉人"></el-table-column>
          <el-table-column prop="liverPhone" label="联系电话"></el-table-column>
          <el-table-column
            prop="complaintTitle"
            label="投诉标题"
          ></el-table-column>
          <el-table-column
            prop="complaintText"
            label="投诉内容"
          ></el-table-column>
          <el-table-column
            prop="complaintTime"
            :formatter="formatTime"
            label="投诉时间"
          ></el-table-column>
          <el-table-column prop="sloveStatus" label="处理状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.sloveStatus == '0'"
                type="info"
                size="small"
                >未处理</el-tag
              >
              <el-tag
                v-if="scope.row.sloveStatus == '1'"
                type="success"
                size="small"
                >已处理</el-tag
              >
            </template></el-table-column
          ><el-table-column label="操作" width="290">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('complaint:complaintList:slove')"
                type="success"
                size="small"
                @click="sloveComplaint(scope.row)"
                icon="el-icon-view"
                >处理投诉</el-button
              >
            </template></el-table-column
          ></el-table
        >
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
    <!--新增或编辑弹框 -->
    <my-dialog
      :title="addDialog.title"
      :visible="addDialog.visible"
      :height="addDialog.height"
      :width="addDialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <template slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="投诉标题">
            <el-input
              v-model="addModel.complaintTitle"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="投诉内容">
            <el-input
              type="textarea"
              v-model="addModel.complaintText"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="处理回复">
            <el-input
              type="textarea"
              v-model="addModel.complaintReply"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getComplaintListApi,
  sloveComplaintApi,
} from "@/api/complaint/complaintList";
import MyDialog from "@/components/custom/MyDialog";
import Footer from "@/components/footer/footer";
export default {
  //注册自定义组件
  components: {
    MyDialog,
    Footer,
  },
  data() {
    return {
      //表单验证规则
      rules: {
        complaintTitle: [
          {
            trigger: "change",
            required: true,
            message: "请填写投诉标题！",
          },
        ],
        complaintText: [
          {
            trigger: "change",
            required: true,
            message: "请填写投诉内容！",
          },
        ],
      },
      //新增或编辑弹框属性
      addModel: {
        editType: "",
        complaintId: "",
        liverId: "",
        complaintTitle: "",
        complaintText: "",
        complaintReply: "",
      },
      //弹框属性
      addDialog: {
        title: "",
        height: 200,
        width: 630,
        visible: false,
      },
      //投诉列表
      tableList: [],
      //分页请求参数
      parms: {
        currentPage: 1,
        pageSize: 10,
        complaintTitle: "",
        total: 0,
      },
    };
  },
  created() {
    this.getComplaintList();
  },
  methods: {
    //处理投诉弹框确认
    async onConfirm() {
      let res = await sloveComplaintApi(this.addModel);
      if (res && res.code == 200) {
        this.getComplaintList();
        this.$message.success(res.msg);
        this.addDialog.visible = false;
      }
    },
    //处理投诉弹框关闭
    onClose() {
      this.addDialog.visible = false;
    },
    //处理按钮
    async sloveComplaint(row) {
      if (row.sloveStatus == "1") {
        this.$message.warning("该投诉已处理，请勿重复操作！");
        return;
      }
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addDialog.title = "处理投诉";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //格式化时间
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
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getComplaintList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getComplaintList();
    },
    //重置按钮
    resetSearch() {
      this.parms.complaintTitle = "";
      this.getComplaintList();
    },
    //查询按钮
    searchComplaint() {
      this.getComplaintList();
    },
    //分页查询
    async getComplaintList() {
      let res = await getComplaintListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
