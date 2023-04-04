<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>楼宇管理</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form
          :model="buildingParm"
          ref="searchForm"
          :inline="true"
          size="medium"
        >
          <el-form-item label="楼宇名称">
            <el-input v-model="buildingParm.buildingName"></el-input>
          </el-form-item>
          <el-form-item label="楼宇类型">
            <el-select
              v-model="buildingParm.buildingType"
              placeholder="请选择楼宇类型"
              clearable
              filterable
            >
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
            <el-button @click="searchBuilding" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('houseBuilding:building:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addBuilding"
              >添加楼宇</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--楼宇列表 -->
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
            prop="buildingNumber"
            label="楼宇序号"
          ></el-table-column>
          <el-table-column prop="buildingType" label="楼宇类型"
            ><template slot-scope="scope">
              <el-tag
                v-if="scope.row.buildingType == '0'"
                type="success"
                size="small"
                >普通房</el-tag
              >
              <el-tag
                v-if="scope.row.buildingType == '1'"
                type="primary"
                size="small"
                >电梯房</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="buildingName"
            label="楼宇名称"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('houseBuilding:building:edit')"
                type="warning"
                size="small"
                @click="editBuilding(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('houseBuilding:building:delete')"
                type="danger"
                size="small"
                @click="deletBuilding(scope.row)"
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
            :current-page.sync="buildingParm.currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="buildingParm.pageSize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="buildingParm.total"
            background
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <Footer></Footer>
    <!--新增或编辑弹框 -->
    <my-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      :width="dialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <template slot="content">
        <el-form
          :model="addModel"
          ref="addRef"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="normal"
        >
          <el-form-item prop="buildingType" label="楼宇类型">
            <el-select v-model="addModel.buildingType">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="buildingName" label="楼宇名称">
            <el-input v-model="addModel.buildingName"></el-input>
          </el-form-item>
          <el-form-item
            prop="buildingNumber"
            label="楼宇序号"
            :rules="[
              { required: true, message: '楼宇序号不能为空' },
              { type: 'number', message: '楼宇序号必须为数字' },
            ]"
          >
            <el-input v-model.number="addModel.buildingNumber"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getBuildingListApi,
  addBuildingApi,
  editBuildingApi,
  deleteBuildingApi,
} from "@/api/houseBuilding/building";
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
      //新增或编辑弹框表单验证规则
      rules: {
        buildingName: [
          {
            trigger: "change",
            required: true,
            message: "请填写楼宇名称",
          },
        ],
        buildingType: [
          {
            trigger: "change",
            required: true,
            message: "请选择楼宇类型",
          },
        ],
      },
      //新增或编辑弹框表单数据
      addModel: {
        buildingId: "",
        editType: "", //0新增 1编辑
        buildingType: "", //0 普通房 1电梯房
        buildingName: "",
        buildingNumber: "",
      },
      //定义弹框属性
      dialog: {
        title: "",
        height: 200,
        width: 630,
        visible: false,
      },
      //下拉框类型参数
      options: [
        {
          value: "0",
          label: "普通房",
        },
        {
          value: "1",
          label: "电梯房",
        },
      ],
      //存放楼宇列表的数据
      tableList: [],
      //获取楼宇信息列表参数
      buildingParm: {
        buildingName: "",
        buildingType: "",
        pageSize: 5,
        currentPage: 1,
        total: 0,
      },
    };
  },
  created() {
    this.getBuildingList();
  },
  methods: {
    //确认弹框
    onConfirm() {
      //验证表单
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addBuildingApi(this.addModel);
          } else {
            res = await editBuildingApi(this.addModel);
          }
          if (res && res.code == 200) {
            //关闭弹框
            this.dialog.visible = false;
            this.$message.success(res.msg);
            //刷新表格
            this.getBuildingList();
          }
        }
      });
    },
    //关闭弹框
    onClose() {
      //清空表单
      this.dialog.visible = false;
    },
    //页数改变时触发
    currentChange(val) {
      this.buildingParm.currentPage = val;
      this.getBuildingList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.buildingParm.pageSize = val;
      this.getBuildingList();
    },
    //删除楼宇
    async deletBuilding(row) {
      //提示
      const confirm = await this.$myconfirm("确定要删除该数据吗?");
      if (confirm) {
        try {
          let res = await deleteBuildingApi({ buildingId: row.buildingId });
          if (res && res.code == 200) {
            //刷新表格
            this.$message.success(res.msg);
            this.getBuildingList();
          }
        } catch (err) {}
      }
    },
    //编辑楼宇
    editBuilding(row) {
      //清空表单
      this.$resetForm("addRef", this.addModel);
      //设置弹框属性
      this.dialog.editType = "1";
      this.dialog.title = "编辑楼宇";
      this.dialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //重置搜索框
    resetSearch() {
      this.buildingParm.buildingName = "";
      this.buildingParm.buildingType = "";
      this.getBuildingList();
    },
    //添加楼宇信息
    addBuilding() {
      //清空表单
      this.$resetForm("addRef", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0"; //标识新增
      this.dialog.title = "新增楼宇";
      this.dialog.visible = true;
    },
    //查询楼宇信息
    searchBuilding() {
      this.getBuildingList();
    },
    //查询楼宇信息列表
    async getBuildingList() {
      let res = await getBuildingListApi(this.buildingParm);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.buildingParm.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
