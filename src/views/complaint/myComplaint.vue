<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的投诉</span>
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
            <el-button
              v-if="hasPerm('complaint:myComplaint:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addComplaint"
              >新增投诉</el-button
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
          <el-table-column
            prop="complaintTitle"
            label="投诉标题"
          ></el-table-column>
          <el-table-column
            prop="complaintText"
            label="投诉内容"
            width="200"
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
          >
          <el-table-column
            prop="complaintReply"
            label="处理回复"
            width="200"
          ></el-table-column
          ><el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('complaint:myComplaint:edit')"
                type="warning"
                size="small"
                @click="editComplaint(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('complaint:myComplaint:delete')"
                type="danger"
                size="small"
                @click="deleteComplaint(scope.row)"
                icon="el-icon-delete"
                >删除</el-button
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
          <el-form-item prop="complaintTitle" label="投诉标题">
            <el-input v-model="addModel.complaintTitle"></el-input>
          </el-form-item>
          <el-form-item prop="complaintText" label="投诉内容">
            <el-input
              type="textarea"
              v-model="addModel.complaintText"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  addComplaintApi,
  editComplaintApi,
  deleteComplaintApi,
  getMyComplaintApi,
} from "@/api/complaint/complaintList";
import { getUserId } from "@/utils/auth";
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
        liverId: "",
        total: 0,
      },
    };
  },
  created() {
    this.getMyComplaint();
  },
  methods: {
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
    //弹框确认
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          this.addModel.liverId = getUserId();
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addComplaintApi(this.addModel);
          } else {
            res = await editComplaintApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getMyComplaint();
            this.$message.success(res.msg);
          }
          this.addDialog.visible = false;
        }
      });
    },
    //弹框关闭
    onClose() {
      this.addDialog.visible = false;
    },
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getMyComplaint();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getMyComplaint();
    },
    //删除按钮
    async deleteComplaint(row) {
      let parm = {
        complaintId: row.complaintId,
      };
      const confirm = await this.$myconfirm("确定要删除吗？");
      if (confirm) {
        try {
          let res = await deleteComplaintApi(parm);
          if (res && res.code == 200) {
            this.getMyComplaint();
            this.$message.success(res.msg);
          }
        } catch (err) {}
      }
    },
    //编辑按钮
    editComplaint(row) {
      if (row.sloveStatus == "1") {
        this.$message.warning("该投诉已处理，无法再次编辑！");
        return;
      }
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑投诉";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //新增投诉
    addComplaint() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "新增投诉";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.complaintTitle = "";
      this.getMyComplaint();
    },
    //查询按钮
    searchComplaint() {
      this.getMyComplaint();
    },
    //我的投诉列表分页查询
    async getMyComplaint() {
      this.parms.liverId = getUserId();
      let res = await getMyComplaintApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
