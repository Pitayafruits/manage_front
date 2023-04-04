<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>单元管理</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form
          :model="unitParms"
          ref="searchForm"
          :inline="true"
          size="medium"
        >
          <el-form-item label="楼宇名称">
            <el-input v-model="unitParms.buildingName"></el-input>
          </el-form-item>
          <el-form-item label="单元名称">
            <el-input v-model="unitParms.unitName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchUnit" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('houseBuilding:unit:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addUnit"
              >添加单元</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--单元列表-->
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('houseBuilding:unit:edit')"
                type="warning"
                size="small"
                @click="editUnit(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('houseBuilding:unit:delete')"
                type="danger"
                size="small"
                @click="deletUnit(scope.row)"
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
            :current-page.sync="unitParms.currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="unitParms.pageSize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="unitParms.total"
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
          <el-form-item prop="buildingId" label="所属楼宇">
            <el-select v-model="addModel.buildingId">
              <el-option
                v-for="item in buildingTableList"
                :key="item.buildingId"
                :label="item.buildingName"
                :value="item.buildingId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="unitName" label="单元名称">
            <el-input v-model="addModel.unitName"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getUnitListApi,
  addUnitApi,
  unitListApi,
  editUnitApi,
  deleteUnitApi,
} from "@/api/houseBuilding/unit";
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
      //楼宇列表
      buildingTableList: [],
      //表单验证规则
      rules: {
        buildingId: [
          {
            trigger: "change",
            required: true,
            message: "请选择所属楼宇",
          },
        ],
        unitName: [
          {
            trigger: "change",
            required: true,
            message: "请填写单元名称",
          },
        ],
      },
      //新增或编辑数据
      addModel: {
        editType: "", //0新增 1编辑
        unitId: "",
        buildingId: "",
        unitName: "",
        buildingValue: "",
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 200,
        width: 630,
        visible: false,
      },
      //表格高度
      tableHeight: 0,
      //表格数据
      tableList: [],
      //分页参数
      unitParms: {
        buildingName: "",
        unitName: "",
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
    };
  },
  created() {
    this.getUnitList();
    this.getBuildingList();
  },
  methods: {
    //获取楼宇列表
    async getBuildingList() {
      let res = await unitListApi();
      if (res && res.code == 200) {
        this.buildingTableList = res.data;
      }
    },
    //新增或编辑弹框确认
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addUnitApi(this.addModel);
          } else {
            res = await editUnitApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getUnitList();
            this.$message.success(res.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },
    //新增或编辑弹框关闭
    onClose() {
      this.addDialog.visible = false;
    },
    //页数改变触发
    currentChange(val) {
      this.unitParms.currentPage = val;
      this.getUnitList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.unitParms.pageSize = val;
      this.getUnitList();
    },
    //删除单元按钮
    async deletUnit(row) {
      //提示
      const confirm = await this.$myconfirm("确定要删除该数据吗?");
      if (confirm) {
        try {
          let res = await deleteUnitApi({ unitId: row.unitId });
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.getUnitList();
          }
        } catch (err) {}
      }
    },
    //编辑单元按钮
    editUnit(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "1";
      //设置弹框属性
      this.addDialog.title = "编辑单元";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //添加按钮
    addUnit() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      this.addModel.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增单元";
      this.addDialog.visible = true;
    },
    //重置查询
    resetSearch() {
      this.unitParms.buildingName = "";
      this.unitParms.unitName = "";
      this.getUnitList();
    },
    //查询按钮
    searchUnit() {
      this.getUnitList();
    },
    //单元数据查询
    async getUnitList() {
      let res = await getUnitListApi(this.unitParms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.unitParms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
