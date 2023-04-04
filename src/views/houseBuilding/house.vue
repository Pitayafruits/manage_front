<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>房屋管理</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="small">
          <el-form-item label="楼宇名称">
            <el-input
              v-model="parms.buildingName"
              placeholder="请输入楼宇名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="单元名称">
            <el-input
              v-model="parms.unitName"
              placeholder="请输入单元名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="房屋编号">
            <el-input
              v-model="parms.houseNum"
              placeholder="请输入房屋编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="使用状态">
            <el-select v-model="parms.houseStatus">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchHouse" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('houseBuilding:house:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addHouse"
              >添加房屋</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--房屋列表-->
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
            prop="buildingName"
            label="楼宇名称"
          ></el-table-column>
          <el-table-column prop="unitName" label="单元名称"></el-table-column>
          <el-table-column prop="houseNum" label="房屋编号"></el-table-column>
          <el-table-column prop="houseArea" label="房屋面积"></el-table-column>
          <el-table-column prop="houseStatus" label="使用状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.houseStatus == '0'" type="success"
                >未使用</el-tag
              >
              <el-tag v-if="scope.row.houseStatus == '1'" type="danger"
                >已使用</el-tag
              >
            </template></el-table-column
          >
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('houseBuilding:house:edit')"
                type="warning"
                size="small"
                @click="editHouse(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('houseBuilding:house:delete')"
                type="danger"
                size="small"
                @click="deleteHouse(scope.row)"
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
            :page-sizes="[10, 20, 30]"
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
          <el-form-item prop="buildingValue" label="所属楼宇">
            <el-select
              v-model="addModel.buildingValue"
              @change="selectBuilding"
            >
              <el-option
                v-for="item in buildingList"
                :key="item.buildingId"
                :label="item.buildingName"
                :value="item.buildingId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="unitId" label="所属单元">
            <el-select v-model="addModel.unitId">
              <el-option
                v-for="item in unitList"
                :key="item.unitId"
                :label="item.unitName"
                :value="item.unitId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="houseNum" label="房屋编号">
            <el-input v-model="addModel.houseNum"></el-input>
          </el-form-item>
          <el-form-item
            prop="houseArea"
            label="房屋面积"
            style="margin-left: 15px"
          >
            <el-input
              v-model="addModel.houseArea"
              placeholder="单位：平方米"
            ></el-input>
          </el-form-item>
          <el-form-item prop="houseStatus" label="使用状态">
            <el-radio-group v-model="addModel.houseStatus">
              <el-radio :label="'0'">未使用</el-radio>
              <el-radio :label="'1'">已使用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getHouseListApi,
  getBuildingApi,
  addHouseApi,
  getUnitListByIdApi,
  editHouseApi,
  deleteHouseApi,
} from "@/api/houseBuilding/house";
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
      //单元列表
      unitList: [],
      //楼宇列表
      buildingList: [],
      //新增或编辑弹框表单验证规则
      rules: {
        buildingValue: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属楼宇",
          },
        ],
        unitId: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属单元",
          },
        ],
        houseNum: [
          {
            trigger: "change",
            required: true,
            message: "请填写房屋编号",
          },
        ],
        houseArea: [
          {
            trigger: "change",
            required: true,
            message: "请填写房屋面积",
          },
        ],
        houseStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择使用状态",
          },
        ],
      },
      //新增或编辑弹框表单数据
      addModel: {
        editType: "",
        houseId: "",
        unitId: "",
        houseNum: "",
        houseArea: "",
        houseStatus: "",
        buildingValue: "",
      },
      //新增或编辑弹框
      addDialog: {
        title: "",
        height: 200,
        width: 650,
        visible: false,
      },
      //搜索框房屋使用状态
      options: [
        {
          value: "0",
          label: "未使用",
        },
        {
          value: "1",
          label: "已使用",
        },
      ],
      //房屋表格数据
      tableList: [],
      //房屋列表搜索框参数
      parms: {
        buildingName: "",
        unitName: "",
        houseNum: "",
        houseStatus: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getHouseList();
    this.getBuildingList();
  },
  methods: {
    //单元列表
    async getUnitListById(buildingId) {
      let res = await getUnitListByIdApi({ buildingId: buildingId });
      if (res && res.code == 200) {
        //赋值给单元列表
        this.unitList = res.data;
      }
    },
    //新增或编辑弹框所属楼宇下拉框触发事件
    selectBuilding(val) {
      //表单清空
      this.addModel.unitId = "";
      //根据楼宇id查询对应单元
      this.getUnitListById(val);
    },
    //查询所属楼宇
    async getBuildingList() {
      let res = await getBuildingApi();
      if (res && res.code == 200) {
        this.buildingList = res.data;
      }
    },
    //新增或编辑弹框确认
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addHouseApi(this.addModel);
          } else {
            res = await editHouseApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getHouseList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },
    //关闭新增或编辑弹框
    onClose() {
      this.addDialog.visible = false;
    },
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getHouseList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getHouseList();
    },
    //删除按钮
    async deleteHouse(row) {
      //提示信息
      const confirm = await this.$myconfirm("确定删除该数据吗?");
      if (confirm) {
        try {
          let res = await deleteHouseApi({ houseId: row.houseId });
          if (res && res.code == 200) {
            this.getHouseList();
            this.$message.success(res.msg);
          }
        } catch (err) {}
      }
    },
    //编辑按钮
    editHouse(row) {
      //根据楼宇id查询单元列表
      this.getUnitListById(row.buildingId);
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑房屋";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
      this.addModel.buildingValue = row.buildingName;
    },
    //添加房屋按钮
    addHouse() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "新增房屋";
      this.addDialog.visible = true;
    },
    //重置搜索按钮
    resetSearch() {
      this.parms.buildingName = "";
      this.parms.unitName = "";
      this.parms.houseNum = "";
      this.parms.houseStatus = "";
      this.parms.currentPage = 1;
      this.getHouseList();
    },
    //搜索房屋按钮
    searchHouse() {
      this.getHouseList();
    },
    //获取房屋列表
    async getHouseList() {
      let res = await getHouseListApi(this.parms);
      if (res && res.code == 200) {
        //赋值
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
