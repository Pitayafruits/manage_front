<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>物业人员管理</span>
      </div>
      <div>
        <!--搜索框-->
        <div class="box">
          <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
            <el-form-item label="姓名">
              <el-input v-model="parms.fullName"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="parms.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchWorker" icon="el-icon-search"
                >查询</el-button
              >
              <el-button
                @click="resetSearch"
                style="color: #ff7670"
                icon="el-icon-refresh"
                >重置</el-button
              >
              <el-button
                v-if="hasPerm('user:worker:add')"
                @click="addWorker"
                type="primary"
                icon="el-icon-plus"
                >添加物业人员</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!--物业人员列表 -->
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
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="fullName" label="真实姓名"></el-table-column>
            <el-table-column
              prop="phoneNumber"
              label="联系电话"
            ></el-table-column>
            <el-table-column prop="isStatus" label="是否启用帐号">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isStatus"
                  :active-value="'0'"
                  :inactive-value="'1'"
                  active-text="是"
                  inactive-text="否"
                  @change="changeStatus(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100%">
              <template slot-scope="scope">
                <el-button
                  v-if="hasPerm('user:worker:allocation')"
                  type="success"
                  size="small"
                  @click="assignRole(scope.row)"
                  icon="el-icon-paperclip"
                  >分配角色</el-button
                >
                <el-button
                  v-if="hasPerm('user:worker:edit')"
                  type="warning"
                  size="small"
                  @click="editWorker(scope.row)"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  v-if="hasPerm('user:worker:delete')"
                  type="danger"
                  size="small"
                  @click="deleteWorker(scope.row)"
                  icon="el-icon-delete"
                  >删除</el-button
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
            :page-sizes="[5, 10, 20]"
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
      :title="dialog.title"
      :visible="dialog.visible"
      :height="dialog.height"
      :width="dialog.width"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <!-- 新增表单-->
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          :inline="true"
          size="normal"
        >
          <el-form-item prop="username" label="用户名">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="addModel.fullName"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item prop="phoneNumber" label="联系电话">
            <el-input v-model="addModel.phoneNumber"></el-input>
          </el-form-item>
          <el-form-item prop="isStatus" label="账号状态:">
            <el-radio-group v-model="addModel.isStatus">
              <el-radio :label="'0'">启用</el-radio>
              <el-radio :label="'1'">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
    <!--分配角色弹框-->
    <my-dialog
      :title="roleDialog.title"
      :height="roleDialog.height"
      :width="roleDialog.width"
      :visible="roleDialog.visible"
      @onClose="roleClose"
      @onConfirm="roleConfirm"
    >
      <template slot="content">
        <el-table :height="roleHeight" :data="roleList" border stripe>
          <el-table-column width="50" align="center" label="选择">
            <template slot-scope="scope">
              <el-radio
                v-model="radio"
                :label="scope.row.roleId"
                @change="getCurrentRow(scope.row)"
                >{{ " " }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column
            prop="roleDescription"
            label="角色描述"
          ></el-table-column>
        </el-table>
        <!--角色列表分页组件-->
        <el-pagination
          @size-change="roleSizeChange"
          @current-change="roleCurrentChange"
          :current-page.sync="roleParm.currentPage"
          :page-sizes="[5, 10, 15]"
          :page-size="roleParm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="roleParm.total"
          background
          >>
        </el-pagination>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getWorkerListApi,
  addWorkerApi,
  editWorkerApi,
  deleteWorkerApi,
  getRoleByUserIdApi,
  assignSaveApi,
} from "@/api/user";
import MyDialog from "@/components/custom/MyDialog";
import { getRoleListApi } from "@/api/user/role";
import Footer from "@/components/footer/footer";
export default {
  //注册自定义组件
  components: {
    MyDialog,
    Footer,
  },
  data() {
    return {
      //保存角色参数
      assignParm: {
        roleId: "",
        userId: "",
      },
      //角色单选框绑定
      radio: "",
      //角色表格的高度
      roleHeight: 0,
      //角色列表的数据
      roleList: [],
      //角色列表分页
      roleParm: {
        pageSize: 5,
        currentPage: 1,
        total: 0,
      },
      //分配角色弹框属性
      roleDialog: {
        title: "",
        height: 400,
        width: 800,
        visible: false,
      },
      //表单验证规则
      rules: {
        username: [
          {
            required: true,
            trigger: "change",
            message: "请填写用户名",
          },
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: "请填写密码",
          },
        ],
        phoneNumber: [
          {
            required: true,
            trigger: "change",
            message: "请填写联系电话",
          },
        ],
        isStatus: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否启用该账号",
          },
        ],
      },
      //新增表单绑定数据
      addModel: {
        userId: "",
        type: "", //0新增 1编辑
        username: "",
        fullName: "",
        password: "",
        phoneNumber: "",
        isStatus: "",
      },
      //弹框属性
      dialog: {
        title: "",
        visible: false,
        height: 190,
        width: 590,
      },
      //搜索框数据绑定
      parms: {
        fullName: "",
        phoneNumber: "",
        currentPage: 1,
        pageSize: 5,
        total: 0,
      },
      //表格的数据
      tableList: [],
    };
  },
  created() {
    this.getWorkerList();
  },
  methods: {
    //角色列表按钮触发事件
    getCurrentRow(row) {
      this.assignParm.roleId = row.roleId;
    },
    //角色列表页数改变触发
    roleCurrentChange(val) {
      this.roleParm.currentPage = val;
      this.getRoleList();
    },
    //角色列表页容量改变时触发
    roleSizeChange(val) {
      this.roleParm.pageSize = val;
      this.getRoleList();
    },
    //分配角色弹框确认
    async roleConfirm() {
      let res = await assignSaveApi(this.assignParm);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.roleDialog.visible = false;
      }
    },
    //分配角色弹框关闭
    roleClose() {
      this.roleDialog.visible = false;
    },
    //分配角色
    async assignRole(row) {
      this.radio = "";
      this.assignParm.userId = row.userId;
      //设置弹框属性
      this.roleDialog.title = "为【" + row.fullName + "】分配角色";
      this.roleDialog.visible = true;
      //获取角色列表
      this.getRoleList();
      //分页栏适应高度
      this.$nextTick(() => {
        this.roleHeight = window.innerHeight - 330;
      });
      //获取用户原来的角色
      let roleRes = await getRoleByUserIdApi({ userId: row.userId });
      if (roleRes && roleRes.code == 200) {
        if (roleRes.data) {
          this.radio = roleRes.data.roleId;
          this.assignParm.roleId = roleRes.data.roleId;
        }
      }
    },
    //获取角色列表
    async getRoleList() {
      let res = await getRoleListApi(this.roleParm);
      if (res && res.code == 200) {
        this.roleList = res.data.records;
        this.roleParm.total = res.data.total;
      }
    },
    //重置查询结果
    resetSearch() {
      this.parms.fullName = "";
      this.parms.phoneNumber = "";
      this.getWorkerList();
    },
    //搜索物业人员
    searchWorker() {
      this.getWorkerList();
    },
    //删除物业人员
    async deleteWorker(row) {
      let confirm = await this.$myconfirm("确定删除吗？");
      if (confirm) {
        try {
          let res = await deleteWorkerApi({ userId: row.userId });
          if (res && res.code == 200) {
            this.getWorkerList();
            this.$message.success(res.msg);
          }
        } catch (err) {}
      }
    },
    //编辑物业人员
    editWorker(row) {
      //首先清空表单数据
      this.$resetForm("addForm", this.addModel);
      //设置窗口类型
      this.addModel.type = "1";
      this.dialog.title = "编辑员工";
      //数据回显到表单
      this.$objCoppy(row, this.addModel);
      this.dialog.visible = true;
    },
    //表格当前行账号启用状态
    async changeStatus(row) {
      let parm = {
        userId: row.userId,
        isStatus: row.isStatus,
      };
      let res = await editWorkerApi(parm);
      if (res && res.code == 200) {
        this.getWorkerList();
        this.$message.success(res.msg);
      }
    },
    //对话框确认事件
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          try {
            let res = null;
            if (this.addModel.type == "0") {
              //新增
              res = await addWorkerApi(this.addModel);
              this.$message.success(res.msg);
            } else {
              //编辑
              res = await editWorkerApi(this.addModel);
              this.$message.success(res.msg);
            }
            //请求成功,刷新列表
            if (res && res.code == 200) {
              this.getWorkerList();
              this.dialog.visible = false;
            }
          } catch (err) {}
        }
      });
    },
    //对话框关闭
    onClose() {
      this.dialog.visible = false;
    },
    //新增物业人员
    addWorker() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      this.addModel.type = "0";
      this.dialog.title = "新增物业人员";
      this.dialog.visible = true;
    },
    //获取用户列表
    async getWorkerList() {
      let res = await getWorkerListApi(this.parms);
      if (res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getWorkerList();
    },
    //页数改变时触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getWorkerList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
