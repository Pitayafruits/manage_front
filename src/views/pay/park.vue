<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>停车费管理</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="业主姓名">
            <el-input v-model="parms.liverName"></el-input>
          </el-form-item>
          <el-form-item label="车位名称">
            <el-input v-model="parms.parkName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchParkPay" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('pay:park:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addPark"
              >添加停车费账单</el-button
            >
          </el-form-item></el-form
        >
      </div>
      <!--停车费列表 -->
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
          <el-table-column prop="liverName" label="业主姓名"></el-table-column>
          <el-table-column prop="liverPhone" label="联系电话"></el-table-column>
          <el-table-column prop="parkName" label="车位名称"></el-table-column>
          <el-table-column prop="parkType" label="车位类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.parkType == '0'" size="small"
                >地上</el-tag
              >
              <el-tag
                v-if="scope.row.parkType == '1'"
                type="success"
                size="small"
                >地下</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="parkingDate"
            label="所属月份"
          ></el-table-column>
          <el-table-column
            prop="parkingMoney"
            label="应缴费金额"
          ></el-table-column>
          <el-table-column prop="parkingStatus" label="缴费状态"
            ><template slot-scope="scope">
              <el-tag
                v-if="scope.row.parkingStatus == '0'"
                type="info"
                size="small"
                >未缴费</el-tag
              >
              <el-tag
                v-if="scope.row.parkingStatus == '1'"
                type="success"
                size="small"
                >已缴费</el-tag
              >
            </template></el-table-column
          >
          <el-table-column label="操作" width="270">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('pay:park:edit')"
                type="warning"
                size="small"
                @click="editPark(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('pay:park:delete')"
                type="danger"
                size="small"
                @click="deletePark(scope.row)"
                icon="el-icon-delete"
                >删除</el-button
              >
              <el-button
                v-if="scope.row.parkingStatus == 0"
                type="success"
                size="small"
                @click="payPark(scope.row)"
                icon="el-icon-bank-card"
                >缴费</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
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
          :inline="true"
          size="normal"
        >
          <el-form-item prop="parkId" label="选择车位">
            <el-select v-model="addModel.parkId" clearable filterable>
              <el-option
                v-for="item in parkList"
                :key="item.parkId"
                :label="item.parkName"
                :value="item.parkId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="parkingDate" label="所属年月">
            <el-date-picker
              value-format="yyyy-MM"
              v-model="addModel.parkingDate"
              type="month"
              placeholder="选择年月"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="parkingMoney" label="缴费金额">
            <el-input v-model="addModel.parkingMoney"></el-input>
          </el-form-item>
          <el-form-item prop="parkingStatus" label="缴费状态">
            <el-radio-group v-model="addModel.parkingStatus">
              <el-radio label="0">未缴费</el-radio>
              <el-radio label="1">已缴费</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getParkListApi,
  getListNoPageApi,
  addParkApi,
  editParkApi,
  deleteParkApi,
  payParkApi,
} from "@/api/pay/park";
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
      //新增或编辑表单绑定数据域
      addModel: {
        parkingId: "",
        editType: "",
        parkId: "",
        parkingDate: "",
        parkingMoney: "",
        parkingStatus: "",
      },
      //表单验证规则
      rules: {
        parkId: [
          {
            trigger: "change",
            required: true,
            message: "请选择车位",
          },
        ],
        parkingDate: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属年月",
          },
        ],
        parkingMoney: [
          {
            trigger: "change",
            required: true,
            message: "请选择缴费金额",
          },
        ],
        parkingStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择缴费状态",
          },
        ],
      },
      //弹框属性
      addDialog: {
        title: "",
        height: 260,
        width: 650,
        visible: false,
      },
      //车位列表
      parkList: [],
      //表格数据
      tableList: [],
      //列表查询参数
      parms: {
        liverName: "",
        parkName: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getParkList();
    this.getListNoPage();
  },
  methods: {
    //弹框确认
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          try {
            let res = null;
            if (this.addModel.editType == "0") {
              res = await addParkApi(this.addModel);
            } else {
              res = await editParkApi(this.addModel);
            }
            if (res && res.code == 200) {
              this.getParkList();
              this.$message.success(res.msg);
              this.addDialog.visible = false;
            }
          } catch (err) {}
        }
      });
    },
    //弹框关闭
    onClose() {
      this.addDialog.visible = false;
    },
    //数据回显 车位列表查询
    async getListNoPage() {
      let res = await getListNoPageApi();
      if (res && res.code == 200) {
        this.parkList = res.data;
      }
    },
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getParkList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getParkList();
    },
    //缴费按钮
    async payPark(row) {
      const confirm = await this.$myconfirm("确定要缴费吗？");
      if (confirm) {
        let res = await payParkApi({ parkingId: row.parkingId });
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          this.getParkList();
        }
      }
    },
    //删除按钮
    async deletePark(row) {
      const confirm = await this.$myconfirm("确定要删除吗？");
      if (confirm) {
        try {
          let res = await deleteParkApi({ parkingId: row.parkingId });
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.getParkList();
          }
        } catch (err) {}
      }
    },
    //编辑按钮
    editPark(row) {
      if (row.parkingStatus == "1") {
        this.$message.warn("该账单已经缴费，不能再编辑");
        return;
      }
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑停车费账单";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //添加按钮
    addPark() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "添加停车费账单";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.liverName = "";
      this.parms.houseNum = "";
      this.getParkList();
    },
    //查询按钮
    searchParkPay() {
      this.getParkList();
    },
    //分页查询
    async getParkList() {
      let res = await getParkListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
