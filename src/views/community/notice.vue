<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>小区公告管理</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="发布人姓名">
            <el-input v-model="parms.fullName"></el-input>
          </el-form-item>
          <el-form-item label="公告标题">
            <el-input v-model="parms.noticeTitle"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchNotice" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('community:notice:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addNotice"
              >添加公告</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--公告列表 -->
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
            prop="noticeTitle"
            label="公告标题"
          ></el-table-column>
          <el-table-column prop="fullName" label="发布人"></el-table-column>
          <el-table-column prop="noticeText" label="公告内容"></el-table-column>
          <el-table-column
            prop="noticeTime"
            label="公告时间"
            :formatter="formatTime"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('community:notice:edit')"
                type="warning"
                size="small"
                @click="editNotice(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('community:notice:delete')"
                type="danger"
                size="small"
                @click="deleteNotice(scope.row)"
                icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
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
          <el-form-item prop="noticeTitle" label="公告标题">
            <el-input v-model="addModel.noticeTitle"></el-input>
          </el-form-item>
          <el-form-item prop="noticeText" label="公告内容">
            <el-input type="textarea" v-model="addModel.noticeText"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getNoticeListApi,
  addNoticeApi,
  editNoticeApi,
  deleteNoticeApi,
} from "@/api/community/notice";
import Footer from "@/components/footer/footer";
import MyDialog from "@/components/custom/MyDialog";
import { getUserId } from "@/utils/auth";
export default {
  //注册组件
  components: {
    MyDialog,
    Footer,
  },
  data() {
    return {
      //新增或编辑弹框表单数据
      addModel: {
        editType: "",
        noticeId: "",
        userId: "",
        noticeTitle: "",
        noticeText: "",
        fullName: "",
      },
      //表单验证规则
      rules: {
        noticeTitle: [
          {
            trigger: "change",
            required: true,
            message: "请填写公告标题",
          },
        ],
        noticeText: [
          {
            trigger: "change",
            required: true,
            message: "请填写公告内容",
          },
        ],
      },
      //设置弹框属性
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
        fullName: "",
        noticeTitle: "",
        total: 0,
      },
    };
  },
  created() {
    this.getNoticeList();
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
          let res = null;
          this.addModel.userId = getUserId();
          if (this.addModel.editType == "0") {
            res = await addNoticeApi(this.addModel);
          } else {
            res = await editNoticeApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getNoticeList();
            this.$message.success(res.msg);
          }
          this.addDialog.visible = false;
        }
      });
    },
    //弹框取消
    onClose() {
      this.addDialog.visible = false;
    },
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getNoticeList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getNoticeList();
    },
    //删除按钮
    async deleteNotice(row) {
      let confirm = await this.$myconfirm("确定要删除吗？");
      if (confirm) {
        let res = await deleteNoticeApi({ noticeId: row.noticeId });
        if (res && res.code == 200) {
          this.getNoticeList();
          this.$message.success(res.msg);
        }
      }
    },
    //编辑按钮
    editNotice(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //数据回显
      this.$objCoppy(row, this.addModel);
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑公告";
      this.addDialog.visible = true;
    },
    //添加公告按钮
    addNotice() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "发布公告";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.fullName = "";
      this.parms.noticeTitle = "";
      this.getNoticeList();
    },
    //查询按钮
    searchNotice() {
      this.getNoticeList();
    },
    //分页查询
    async getNoticeList() {
      this.parms.userId = getUserId();
      let res = await getNoticeListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
