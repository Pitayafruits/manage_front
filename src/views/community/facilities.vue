<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设施管理</span>
      </div>
      <div>
        <div class="box">
          <!--搜索框-->
          <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
            <el-form-item label="设施名称">
              <el-input v-model="parms.faName"></el-input>
            </el-form-item>
            <el-form-item label="负责人">
              <el-input v-model="parms.faPerson"></el-input>
            </el-form-item>
            <el-form-item label="负责人联系电话">
              <el-input v-model="parms.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="searchFacilities"
                >搜索</el-button
              >
              <el-button
                @click="resetSearch"
                style="color: #ff7670"
                icon="el-icon-refresh"
                >重置</el-button
              >
              <el-button
                v-if="hasPerm('community:facilities:add')"
                type="primary"
                style="margin-left: 20px"
                icon="el-icon-plus"
                @click="addFacilities"
                >添加设施</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!--基础设施表格-->
        <div style="margin-top: 10px">
          <el-table
            :data="tableList"
            :header-cell-style="{
              background: 'rgba(0,0,0,0.05)',
              'text-align': 'center',
            }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column prop="faName" label="设施名称"></el-table-column>
            <el-table-column
              prop="faPerson"
              label="设施负责人"
            ></el-table-column>
            <el-table-column
              prop="phoneNumber"
              label="负责人电话"
            ></el-table-column>
            <el-table-column prop="faText" label="简介"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="hasPerm('community:facilities:edit')"
                  type="warning"
                  size="small"
                  @click="editFacilities(scope.row)"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  v-if="hasPerm('community:facilities:delete')"
                  type="danger"
                  size="small"
                  @click="deleteFacilities(scope.row)"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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
          label-width="100px"
          :inline="true"
          size="normal"
        >
          <el-form-item prop="faName" label="设施名称">
            <el-input v-model="addModel.faName"></el-input>
          </el-form-item>
          <el-form-item prop="faPerson" label="设施负责人">
            <el-input v-model="addModel.faPerson"></el-input>
          </el-form-item>
          <el-form-item prop="phoneNumber" label="负责人电话">
            <el-input v-model.number="addModel.phoneNumber"></el-input>
          </el-form-item>
          <el-form-item prop="faText" label="简介">
            <el-input
              type="textarea"
              style="width: 520px"
              v-model="addModel.faText"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import Footer from "@/components/footer/footer";
import MyDialog from "@/components/custom/MyDialog";
import {
  addFacilitiesApi,
  getFacilitiesListApi,
  editFacilitiesApi,
  deleteFacilitiesApi,
} from "@/api/community/facilities";
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
        faName: [
          {
            trigger: "change",
            required: true,
            message: "请填写设施名称",
          },
        ],
        faPerson: [
          {
            trigger: "change",
            required: true,
            message: "请填写设施负责人",
          },
        ],
        phoneNumber: [
          {
            trigger: "change",
            required: true,
            message: "负责人电话",
          },
          {
            type: "number",
            message: "负责人电话必须为数字",
            trigger: "blur",
          },
        ],
        faText: [
          {
            trigger: "change",
            required: true,
            message: "简介",
          },
        ],
      },
      //新增或编辑弹框表单数据
      addModel: {
        editType: "",
        faId: "",
        faName: "",
        faPerson: "",
        phoneNumber: "",
        faText: "",
      },
      //设置弹框属性
      addDialog: {
        title: "",
        height: 230,
        width: 670,
        visible: false,
      },
      //搜索框的数据绑定
      parms: {
        faName: "",
        faPerson: "",
        phoneNumber: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      //表格数据
      tableList: [],
    };
  },
  created() {
    this.getFacilitiesList();
  },
  methods: {
    //删除按钮
    async deleteFacilities(row) {
      let confirm = await this.$myconfirm("确定要删除吗？");
      if (confirm) {
        let res = await deleteFacilitiesApi({ faId: row.faId });
        if (res && res.code == 200) {
          this.getFacilitiesList();
          this.$message.success(res.msg);
        }
      }
    },
    //编辑按钮
    editFacilities(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //数据回显
      this.$objCoppy(row, this.addModel);
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑设施";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.faName = "";
      this.parms.faPerson = "";
      this.parms.phoneNumber = "";
      this.getFacilitiesList();
    },
    //搜索按钮
    searchFacilities() {
      this.getFacilitiesList();
    },
    //分页查询
    async getFacilitiesList() {
      let res = await getFacilitiesListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    //弹框确认方法
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addFacilitiesApi(this.addModel);
          } else {
            res = await editFacilitiesApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getFacilitiesList();
            this.$message.success(res.msg);
          }
          this.addDialog.visible = false;
        }
      });
    },
    //弹框关闭方法
    onClose() {
      this.addDialog.visible = false;
    },
    //添加设施按钮
    addFacilities() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "添加设施";
      this.addDialog.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
}
</style>
