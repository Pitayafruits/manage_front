<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>角色管理</span>
      </div>
      <div>
        <!--搜索框-->
        <div class="box">
          <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
            <el-form-item label="角色名称">
              <el-input v-model="parms.roleName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchRole" icon="el-icon-search"
                >查询</el-button
              >
              <el-button
                @click="resetSearch"
                style="color: #ff7670"
                icon="el-icon-refresh"
                >重置</el-button
              >
              <el-button
                v-if="hasPerm('user:role:add')"
                type="primary"
                icon="el-icon-plus"
                @click="addRole"
                >添加角色</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!--角色列表 -->
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
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column
              prop="roleDescription"
              label="角色描述"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="hasPerm('user:role:allocation')"
                  type="success"
                  size="small"
                  @click="assignRoleBtn(scope.row)"
                  icon="el-icon-paperclip"
                  >分配权限</el-button
                >
                <el-button
                  v-if="hasPerm('user:role:edit')"
                  type="warning"
                  size="small"
                  @click="editRole(scope.row)"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  v-if="hasPerm('user:role:delete')"
                  type="danger"
                  size="small"
                  @click="deletRole(scope.row)"
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
          :inline="false"
          size="normal"
        >
          <el-form-item prop="roleName" label="角色名">
            <el-input v-model="addModel.roleName" style="width: 30%"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input
              v-model="addModel.roleDescription"
              type="textarea"
              rows="3"
              placeholder="请输入描述"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
    <!--分配权限弹框-->
    <my-dialog
      :title="assignDialog.title"
      :width="assignDialog.width"
      :height="assignDialog.height"
      :visible="assignDialog.visible"
      @onClose="assignClose"
      @onConfirm="assignConfirm"
    >
      <template slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          node-key="menuId"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="true"
          default-expand-all
          :default-checked-keys="assignTreeChecked"
        ></el-tree>
      </template>
    </my-dialog>
  </el-main>
</template>
<script>
import {
  getRoleListApi,
  addRoleApi,
  editRoleApi,
  deleteRoleApi,
  getAssignTreeApi,
  assignSaveApi,
} from "@/api/user/role";
import { getUserId } from "@/utils/auth";
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
      //树相关的属性配置
      defaultProps: {
        children: "children",
        label: "menuLabel",
      },
      //角色id
      roleId: "",
      //分配权限树数据
      assignTreeData: [],
      //树默认选中节点
      assignTreeChecked: [],
      //分配权限弹框属性
      assignDialog: {
        title: "",
        width: 300,
        height: 500,
        visible: false,
      },
      //表单验证规则
      rules: {
        roleName: [
          {
            required: true,
            trigger: "change",
            message: "请填写角色名",
          },
        ],
      },
      //新增表单绑定数据
      addModel: {
        roleId: "",
        roleName: "",
        roleDescription: "",
        type: "", //0新增 1编辑
      },
      //弹框属性
      dialog: {
        title: "",
        visible: false,
        height: 190,
        width: 590,
      },
      //表格数据
      tableList: [],
      //搜索框参数
      parms: {
        //每页显示的条数
        pageSize: 5,
        //当前页码
        currentPage: 1,
        //角色名称
        roleName: "",
        //总条数
        total: 0,
      },
      isShow: false,
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //分配权限确认
    async assignConfirm() {
      //获取选中节点id
      let ids = this.$refs.assignTree
        .getCheckedKeys()
        .concat(this.$refs.assignTree.getHalfCheckedKeys());
      let parm = {
        roleId: this.roleId,
        list: ids,
      };
      let res = await assignSaveApi(parm);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.assignDialog.visible = false;
      }
    },
    //分配权限取消
    assignClose() {
      this.assignDialog.visible = false;
    },
    //分配按钮
    async assignRoleBtn(row) {
      //清空数据
      this.roleId = "";
      this.assignTreeData = [];
      this.assignTreeChecked = [];
      this.roleId = row.roleId;
      //弹框属性设置
      this.assignDialog.title = "为【" + row.roleName + "】分配权限";
      this.assignDialog.visible = true;
      //获取树数据
      //组装后台需要的参数
      let parm = {
        userId: getUserId() - 0,
        roleId: this.roleId,
      };
      let res = await getAssignTreeApi(parm);
      //判断
      if (res && res.code == 200) {
        //赋值给树
        this.assignTreeData = res.data.listMenu;
        this.assignTreeChecked = res.data.checkList;
        //如果默认选中有数据
        if (this.assignTreeChecked.length > 0) {
          let newArr = [];
          this.assignTreeChecked.forEach((item) => {
            this.checked(item, this.assignTreeData, newArr);
          });
          this.assignTreeChecked = newArr;
        }
      }
    },
    //类似于剪枝的操作
    checked(id, data, newArr) {
      data.forEach((item) => {
        if (item.menuId == id) {
          if (item.children && item.children.length == 0) {
            newArr.push(item.menuId);
          }
        } else {
          if (item.children && item.children.length != 0) {
            this.checked(id, item.children, newArr);
          }
        }
      });
    },
    //弹窗确认
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.type == "0") {
            res = await addRoleApi(this.addModel);
          } else {
            res = await editRoleApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getRoleList();
            this.dialog.visible = false;
            this.$message.success(res.msg);
          }
        }
      });
    },
    //弹窗关闭
    onClose() {
      this.dialog.visible = false;
    },
    //页数改变时触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getRoleList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getRoleList();
    },
    //删除角色
    async deletRole(row) {
      //提示信息
      let confirm = await this.$myconfirm("确定删除该角色吗?");
      if (confirm) {
        try {
          if (row.roleId == 2) {
            this.$message.warning("该角色不能删除！");
            return;
          }
          if (row.roleId == 16) {
            this.$message.warning("该角色不能删除！");
            return;
          }
          if (row.roleId == 19) {
            this.$message.warning("该角色不能删除！");
            return;
          }
          let res = await deleteRoleApi({ roleId: row.roleId });
          if (res && res.code == 200) {
            //删除成功，刷新表格，给出提示
            this.getRoleList();
            this.$message.success(res.msg);
          }
        } catch (err) {}
      }
    },
    //编辑角色
    editRole(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置标识
      this.addModel.type = "1";
      this.dialog.title = "编辑角色";
      //赋值
      this.$objCoppy(row, this.addModel);
      this.dialog.visible = true;
    },
    //重置搜索框
    resetSearch() {
      this.parms.roleName = "";
      this.getRoleList();
    },
    //添加角色
    addRole() {
      //首先清空表单数据
      this.$resetForm("addForm", this.addModel);
      //设置新增或编辑窗口类型
      this.addModel.type = "0";
      this.dialog.title = "新增角色";
      //设置窗口是否可见
      this.dialog.visible = true;
    },
    //条件查询角色
    searchRole() {
      this.getRoleList();
    },
    //获取角色列表
    async getRoleList() {
      let res = await getRoleListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
