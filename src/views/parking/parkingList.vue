<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>车位管理</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="车位名称">
            <el-input v-model="parms.parkName"></el-input>
          </el-form-item>
          <el-form-item label="车位类型">
            <el-select v-model="parms.parkType">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车位状态">
            <el-select v-model="parms.parkStatus">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchParking" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('parking:parkingList:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addParking"
              >添加车位</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--车位列表-->
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
          <el-table-column prop="parkNumber" label="车位序号"></el-table-column>
          <el-table-column prop="parkName" label="车位名称"></el-table-column>
          <el-table-column prop="parkType" label="车位类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.parkType == '0'" type="success"
                >地上车位</el-tag
              >
              <el-tag v-if="scope.row.parkType == '1'" type="danger"
                >地下车位</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="parkStatus" label="使用状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.parkStatus == '0'">未使用</el-tag>
              <el-tag v-if="scope.row.parkStatus == '1'" type="info"
                >已使用</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('parking:parkingList:edit')"
                type="warning"
                size="small"
                @click="editParking(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-button
                v-if="hasPerm('parking:parkingList:delete')"
                type="danger"
                size="small"
                @click="deleteParking(scope.row)"
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
          :inline="true"
          size="normal"
        >
          <el-form-item prop="parkName" label="车位名称">
            <el-input v-model="addModel.parkName"></el-input>
          </el-form-item>
          <el-form-item prop="parkType" label="车位类型">
            <el-select v-model="addModel.parkType">
              <el-option
                v-for="item in addTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="parkStatus" label="使用状态">
            <el-select v-model="addModel.parkStatus">
              <el-option
                v-for="item in addStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="parkNumber" label="车位序号">
            <el-input v-model.number="addModel.parkNumber"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getParkingListApi,
  addParkingApi,
  editParkingApi,
  deleteParkingApi,
} from "@/api/parking/parking";
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
      //新增或编辑表单车位类型下拉框
      addTypeOptions: [
        {
          value: "0",
          label: "地上车位",
        },
        {
          value: "1",
          label: "地下车位",
        },
      ],
      //新增或编辑表单车位使用状态下拉框
      addStatusOptions: [
        {
          value: "0",
          label: "未使用",
        },
        {
          value: "1",
          label: "已使用",
        },
      ],
      //新增或编辑表单验证规则
      rules: {
        parkName: [
          {
            trigger: "change",
            required: true,
            message: "请填写车位名称",
          },
        ],
        parkType: [
          {
            trigger: "change",
            required: true,
            message: "请选择车位类型",
          },
        ],
        parkStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择使用状态",
          },
        ],
        parkNumber: [
          { required: true, message: "车位序号不能为空" },
          { type: "number", message: "车位序号必须为数字值" },
        ],
      },
      //新增或编辑表单数据
      addModel: {
        editType: "", //0新增 1编辑
        parkId: "",
        parkType: "",
        parkName: "",
        parkStatus: "",
        parkNumber: "",
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 200,
        width: 630,
        visible: false,
      },
      //车位使用状态下拉框
      statusOptions: [
        {
          value: "0",
          label: "未使用",
        },
        {
          value: "1",
          label: "已使用",
        },
      ],
      //车位类型下拉框
      typeOptions: [
        {
          value: "0",
          label: "地上车位",
        },
        {
          value: "1",
          label: "地下车位",
        },
      ],
      //表格数据
      tableList: [],
      //分页查询参数
      parms: {
        parkName: "",
        parkStatus: "",
        parkType: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getParkingList();
  },
  methods: {
    //新增或编辑弹框确认
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addParkingApi(this.addModel);
          } else {
            res = await editParkingApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.addDialog.visible = false;
            this.getParkingList();
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
      this.getParkingList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getParkingList();
    },
    //删除车位按钮
    async deleteParking(row) {
      //信息提示
      const confirm = await this.$myconfirm("确定要删除吗?");
      if (confirm) {
        try {
          let res = await deleteParkingApi({ parkId: row.parkId });
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.getParkingList();
          }
        } catch (err) {}
      }
    },
    //编辑车位按钮
    editParking(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addDialog.editType = "1";
      this.addDialog.title = "编辑车位";
      this.addDialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.addModel);
    },
    //添加车位按钮
    addParking() {
      //表单清空
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "新增车位";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.parkName = "";
      this.parms.parkType = "";
      this.parms.parkStatus = "";
      this.getParkingList();
    },
    //查询按钮
    searchParking() {
      this.getParkingList();
    },
    //查询表格数据
    async getParkingList() {
      let res = await getParkingListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
