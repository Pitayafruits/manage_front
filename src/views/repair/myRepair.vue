<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>我的报修</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="报修内容">
            <el-input v-model="parms.repairText"></el-input>
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
            <el-button
              v-if="hasPerm('repair:myRepair:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addRepair"
              >我要报修</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--报修列表 -->
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
            prop="repairPlace"
            label="报修地址"
            width="300"
          ></el-table-column>
          <el-table-column
            prop="repairText"
            label="报修内容"
            width="300"
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
          >
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('repair:myRepair:edit')"
                type="warning"
                size="small"
                @click="editRepair(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('repair:myRepair:delete')"
                type="danger"
                size="small"
                @click="deleteRepair(scope.row)"
                icon="el-icon-delete"
                >删除</el-button
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
          <el-form-item prop="repairPlace" label="报修地址">
            <el-input type="textarea" v-model="addModel.repairPlace"></el-input>
          </el-form-item>
          <el-form-item prop="repairText" label="报修内容">
            <el-input type="textarea" v-model="addModel.repairText"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  addRepairApi,
  getMyRepairApi,
  editRepairApi,
  deleteRepairApi,
} from "@/api/repair/repairList";
import MyDialog from "@/components/custom/MyDialog";
import { getUserId } from "@/utils/auth";
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
        repairPlace: [
          {
            trigger: "change",
            required: true,
            message: "请填写报修地址！",
          },
        ],
        repairText: [
          {
            trigger: "change",
            required: true,
            message: "请填写报修内容！",
          },
        ],
      },
      //弹框属性
      addDialog: {
        title: "",
        height: 200,
        width: 630,
        visible: false,
      },
      //新增或编辑弹框属性
      addModel: {
        editType: "",
        repairId: "",
        liverId: "",
        repairPlace: "",
        repairText: "",
        repairTime: "",
        repairStatus: "",
      },
      //报修列表
      tableList: [],
      //分页请求参数
      parms: {
        currentPage: 1,
        pageSize: 10,
        repairText: "",
        liverId: "",
        total: 0,
      },
    };
  },
  created() {
    this.getMyRepair();
  },
  methods: {
    //当前页改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getMyRepair();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getMyRepair();
    },
    //弹框确认
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          this.addModel.liverId = getUserId();
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addRepairApi(this.addModel);
          } else {
            res = await editRepairApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getMyRepair();
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
    //删除按钮
    async deleteRepair(row) {
      let parm = {
        repairId: row.repairId,
      };
      const confirm = await this.$myconfirm("确定要删除吗？");
      if (confirm) {
        try {
          let res = await deleteRepairApi(parm);
          if (res && res.code == 200) {
            this.getMyRepair();
            this.$message.success(res.msg);
          }
        } catch (err) {}
      }
    },
    //编辑按钮
    editRepair(row) {
      if (row.repairStatus == "1") {
        this.$message.warning("该报修已处理，无法再次编辑！");
        return;
      }
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //新增报修
    addRepair() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "我要报修";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.repairText = "";
      this.getMyRepair();
    },
    //查询按钮
    searchRepair() {
      this.getMyRepair();
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
    //我的报修列表分页查询
    async getMyRepair() {
      this.parms.liverId = getUserId();
      let res = await getMyRepairApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
