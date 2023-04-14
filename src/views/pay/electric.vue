<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>电费管理</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="业主姓名">
            <el-input v-model="parms.liverName"></el-input>
          </el-form-item>
          <el-form-item label="房屋编号">
            <el-input v-model="parms.houseNum"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchElectricPay" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('pay:electric:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addElectric"
              >添加电费账单</el-button
            >
          </el-form-item></el-form
        >
      </div>
      <!--电费列表 -->
      <div>
        <el-table
          :data="electricList"
          empty-text="暂无数据"
          :header-cell-style="{
            background: 'rgba(0,0,0,0.05)',
            'text-align': 'center',
          }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column prop="buildingName" label="楼宇"></el-table-column>
          <el-table-column prop="unitName" label="单元"></el-table-column>
          <el-table-column prop="houseNum" label="房屋"></el-table-column>
          <el-table-column prop="liverName" label="业主"></el-table-column>
          <el-table-column prop="liverPhone" label="联系电话"></el-table-column>
          <el-table-column
            prop="electricNum"
            label="用电额度"
          ></el-table-column>
          <el-table-column
            prop="electricMoney"
            label="应缴费金额"
          ></el-table-column>
          <el-table-column prop="electricStatus" label="缴费状态"
            ><template slot-scope="scope">
              <el-tag
                v-if="scope.row.electricStatus == '0'"
                type="info"
                size="small"
                >未缴费</el-tag
              >
              <el-tag
                v-if="scope.row.electricStatus == '1'"
                type="success"
                size="small"
                >已缴费</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="electricDate"
            label="所属月份"
          ></el-table-column>
          <el-table-column label="操作" width="270">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('pay:electric:edit')"
                type="warning"
                size="small"
                @click="editElectric(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('pay:electric:delete')"
                type="danger"
                size="small"
                @click="deleteElectric(scope.row)"
                icon="el-icon-delete"
                >删除</el-button
              >
              <el-button
                v-if="scope.row.electricStatus == 0"
                type="success"
                size="small"
                @click="payElectric(scope.row)"
                icon="el-icon-bank-card"
                >缴费</el-button
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
          :inline="true"
          size="normal"
        >
          <el-form-item prop="buildingId" label="所选楼宇">
            <el-select v-model="addModel.buildingId" @change="selectBuilding">
              <el-option
                v-for="item in buildingList"
                :key="item.buildingId"
                :label="item.buildingName"
                :value="item.buildingId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="unitId" label="所选单元">
            <el-select v-model="addModel.unitId" @change="selectUnit">
              <el-option
                v-for="item in unitList"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="houseId" label="所选房屋">
            <el-select v-model="addModel.houseId">
              <el-option
                v-for="item in houseList"
                :key="item.houseId"
                :label="item.houseNum"
                :value="item.houseId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="electricDate" label="所属年月">
            <el-date-picker
              value-format="yyyy-MM"
              v-model="addModel.electricDate"
              type="month"
              placeholder="选择年月"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="electricMoney" label="缴费金额">
            <el-input v-model="addModel.electricMoney"></el-input>
          </el-form-item>
          <el-form-item
            prop="electricNum"
            label="用电额度"
            style="margin-left: 15px"
          >
            <el-input v-model="addModel.electricNum"></el-input>
          </el-form-item>
          <el-form-item prop="electricStatus" label="缴费状态">
            <el-radio-group v-model="addModel.electricStatus">
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
import { getBuildingApi, getUnitListByIdApi } from "@/api/houseBuilding/house";
import {
  getHouseListByUnitIdApi,
  addElectricApi,
  getElectricListApi,
  editElectricApi,
  deleteElectricApi,
  payElectricApi,
} from "@/api/pay/electric";
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
      //电费列表
      electricList: [],
      //房屋列表
      houseList: [],
      //单元列表
      unitList: [],
      //表单验证规则
      rules: {
        buildingId: [
          {
            trigger: "change",
            required: true,
            message: "请选择楼宇",
          },
        ],
        unitId: [
          {
            trigger: "change",
            required: true,
            message: "请选择单元",
          },
        ],
        houseId: [
          {
            trigger: "change",
            required: true,
            message: "请选择房屋",
          },
        ],
        electricDate: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属年月",
          },
        ],
        electricMoney: [
          {
            trigger: "change",
            required: true,
            message: "请填写缴费金额",
          },
        ],
        electricNum: [
          {
            trigger: "change",
            required: true,
            message: "请填写用电额度",
          },
        ],
        electricStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择缴费状态",
          },
        ],
      },
      //新增或编辑表单绑定数据域
      addModel: {
        editType: "",
        electricId: "",
        liverId: "",
        houseId: "",
        electricDate: "",
        electricMoney: "",
        electricNum: "",
        electricStatus: "",
        buildingId: "",
        unitId: "",
      },
      //楼宇列表
      buildingList: [],
      //弹框属性
      addDialog: {
        title: "",
        height: 260,
        width: 650,
        visible: false,
      },
      //搜索参数
      parms: {
        liverName: "",
        houseNum: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getBuildingList();
    this.getElectricList();
  },
  methods: {
    //缴费按钮
    async payElectric(row) {
      const confirm = await this.$myconfirm("确定缴费吗");
      if (confirm) {
        let parm = {
          electricId: row.electricId,
          electricStatus: "1",
        };
        let res = await payElectricApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          this.getElectricList();
        }
      }
    },
    //页码改变时触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getElectricList();
    },
    //页容量改变时触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getElectricList();
    },
    //删除按钮
    async deleteElectric(row) {
      const confirm = await this.$myconfirm("确定要删除吗？");
      if (confirm) {
        try {
          let res = await deleteElectricApi({ electricId: row.electricId });
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.getElectricList();
          }
        } catch (err) {}
      }
    },
    //编辑按钮
    editElectric(row) {
      if (row.electricStatus == "1") {
        this.$message.warn("该账单已经缴费，不能再编辑");
        return;
      }
      //查询单元列表
      this.getUnitList(row.buildingId);
      //查询房屋列表
      this.getHouseByUnitId(row.unitId);
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑电费账单";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //获取电费列表
    async getElectricList() {
      let res = await getElectricListApi(this.parms);
      if (res && res.code == 200) {
        this.electricList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    //根据单元id获取房屋列表
    async getHouseByUnitId(val) {
      let res = await getHouseListByUnitIdApi({ unitId: val });
      if (res && res.code == 200) {
        this.houseList = res.data;
      }
    },
    //选择单元下拉框事件
    selectUnit(val) {
      this.addModel.houseId = "";
      this.getHouseByUnitId(val);
    },
    //根据楼宇id获取单元列表
    async getUnitList(val) {
      let res = await getUnitListByIdApi({ buildingId: val });
      if (res && res.data) {
        this.unitList = res.data;
      }
    },
    //选择楼宇下拉框事件
    selectBuilding(val) {
      this.addModel.unitId = "";
      this.addModel.houseId = "";
      this.getUnitList(val);
    },
    //获取楼宇
    async getBuildingList() {
      let res = await getBuildingApi();
      this.buildingList = res.data;
    },
    //新增或编辑弹框确认事件
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addElectricApi(this.addModel);
          } else {
            res = await editElectricApi(this.addModel);
          }
          if (res && res.code == 200) {
            //刷新表格
            this.getElectricList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },
    //新增或编辑弹框关闭事件
    onClose() {
      this.addDialog.visible = false;
    },
    //添加按钮
    addElectric() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "添加电费账单";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.liverName = "";
      this.parms.houseNum = "";
      this.getElectricList();
    },
    //查询按钮
    searchElectricPay() {
      this.getElectricList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
