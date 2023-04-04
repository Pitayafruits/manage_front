<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>权限管理</span>
      </div>
      <div>
        <!--新增权限按钮-->
        <div class="box">
          <el-form size="medium">
            <el-form-item>
              <el-button
                v-if="hasPerm('user:menu:add')"
                type="primary"
                icon="el-icon-plus"
                @click="addMenu"
                >新增权限</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!--权限列表-->
        <div>
          <el-table
            :data="tableList"
            row-key="menuId"
            :tree-props="{ children: 'children' }"
            :header-cell-style="{
              background: 'rgba(0,0,0,0.05)',
              'text-align': 'center',
            }"
            default-expand-all
          >
            <el-table-column prop="menuLabel" label="菜单名称" width="180">
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="菜单类型"
              width="100"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type == '0'">目录</el-tag>
                <el-tag type="success" v-if="scope.row.type == '1'"
                  >菜单</el-tag
                >
                <el-tag type="warning" v-if="scope.row.type == '2'"
                  >按钮</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="icon"
              label="菜单图标"
              width="100"
            >
              <template slot-scope="scope">
                <i :class="scope.row.icon"></i>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="routeName" label="路由名称">
            </el-table-column>
            <el-table-column align="center" prop="routePath" label="路由地址">
            </el-table-column>
            <el-table-column align="center" prop="routeUrl" label="组件路径">
            </el-table-column>
            <el-table-column align="center" prop="menuCode" label="权限字段">
            </el-table-column>
            <el-table-column align="center" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  v-if="hasPerm('user:menu:edit')"
                  type="warning"
                  size="small"
                  icon="el-icon-edit"
                  @click="editMenu(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-if="hasPerm('user:menu:delete')"
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="deleteMenu(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <Footer></Footer>
    <!--新增或编辑弹框-->
    <my-dialog
      :title="dialog.title"
      :width="dialog.width"
      :height="dialog.height"
      :visible="dialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <!--新增表单-->
        <el-form
          style="margin-left: 45px"
          :model="addModel"
          ref="addForm"
          :rules="rules"
          :inline="true"
          size="normal"
        >
          <!--菜单类型-->
          <el-row>
            <el-col :span="24">
              <el-form-item prop="type" label="菜单类型">
                <el-radio-group v-model="addModel.type">
                  <el-radio :label="'0'">目录</el-radio>
                  <el-radio :label="'1'">菜单</el-radio>
                  <el-radio :label="'2'">按钮</el-radio>
                </el-radio-group>
              </el-form-item></el-col
            ></el-row
          >
          <el-form-item prop="parentName" label="上级菜单">
            <el-input
              @click.native="useParent"
              v-model="addModel.parentName"
              placeholder="请选择上级菜单"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="menuLabel" label="菜单名称">
            <el-input v-model="addModel.menuLabel" placeholder="请填写菜单名称">
            </el-input>
          </el-form-item>

          <el-form-item label="菜单图标">
            <el-input v-model="addModel.icon" placeholder="请填写菜单图标">
            </el-input>
          </el-form-item>
          <el-form-item
            prop="routeName"
            v-if="addModel.type == '1'"
            label="路由名称"
          >
            <el-input v-model="addModel.routeName" placeholder="请填写路由名称">
            </el-input>
          </el-form-item>

          <el-form-item
            prop="routePath"
            v-if="addModel.type != '2'"
            label="路由地址"
          >
            <el-input v-model="addModel.routePath" placeholder="请填写路由地址">
            </el-input>
          </el-form-item>
          <el-form-item
            prop="routeUrl"
            v-if="addModel.type == '1'"
            label="组件路径"
          >
            <el-input v-model="addModel.routeUrl" placeholder="请填写组件路径">
            </el-input>
          </el-form-item>

          <el-form-item prop="menuCode" label="权限字段">
            <el-input v-model="addModel.menuCode" placeholder="请填写权限字段">
            </el-input>
          </el-form-item>
          <el-form-item label="描述信息">
            <el-input
              v-model="addModel.description"
              placeholder="请填写描述信息"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="orderNum" label="权限序号">
            <el-input
              v-model.number="addModel.orderNum"
              placeholder="请填写权限序号"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </my-dialog>
    <!--选择上级部门弹框-->
    <my-dialog
      :title="parnetDialog.title"
      :width="parnetDialog.width"
      :height="parnetDialog.height"
      :visible="parnetDialog.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parentList"
          node-key="menuId"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="false"
          :highlight-current="true"
          @node-click="nodeClick"
          default-expand-all
          :expand-on-click-node="false"
        >
          <!--如果没有下级显示文档图标，反之则判断是否展开-->
          <div slot-scope="{ node, data }">
            <span v-if="data.children.length == 0">
              <i style="margin-left: 5px" class="el-icon-tickets"></i>
            </span>
            <span v-else @click.stop="openBtn(data)">
              <i
                v-if="data.open"
                style="margin-left: 5px"
                class="el-icon-folder-add"
              ></i>
              <i
                v-else
                style="margin-left: 5px"
                class="el-icon-folder-remove"
              ></i>
            </span>
            <!-- 树节点名称 -->
            <span>{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  getMenuListApi,
  addMenuApi,
  getParentTreeApi,
  editMenuApi,
  deleteMenuApi,
} from "@/api/user/menu";
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
      //上级菜单树属性配置
      defaultProps: {
        children: "children",
        label: "menuLabel",
      },
      //上级部门数据
      parentList: [],
      //上级部门弹框属性
      parnetDialog: {
        title: "选择上级部门",
        width: 300,
        height: 450,
        visible: false,
      },
      //表单验证规则
      rules: {
        type: [
          {
            required: true,
            trigger: "change",
            message: "请选择菜单类型",
          },
        ],
        parentName: [
          {
            required: true,
            trigger: "change",
            message: "请选择上级菜单",
          },
        ],
        menuLabel: [
          {
            required: true,
            trigger: "change",
            message: "请填写菜单名称",
          },
        ],
        routeName: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由名称",
          },
        ],
        routePath: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由地址",
          },
        ],
        routeUrl: [
          {
            required: true,
            trigger: "change",
            message: "请填写组件路径",
          },
        ],
        menuCode: [
          {
            required: true,
            trigger: "change",
            message: "请填写权限字段",
          },
        ],
        orderNum: [
          {
            type: "number",
            message: "权限序号必须为数字值",
            trigger: "blur",
          },
        ],
      },
      //新增或编辑绑定的数据
      addModel: {
        editType: "", //弹框类型 0->新增 1->编辑
        menuId: "",
        parentId: "",
        menuLabel: "",
        menuCode: "",
        routeName: "",
        routePath: "",
        routeUrl: "",
        type: "",
        icon: "",
        orderNum: "",
        description: "",
        parentName: "",
      },
      //新增或编辑弹框属性
      dialog: {
        title: "",
        width: 670,
        height: 390,
        visible: false,
      },
      //表格数据
      tableList: [],
      //上级菜单赋值
      nodeUse: {
        menuId: "",
        menuLabel: "",
      },
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    //删除按钮
    async deleteMenu(row) {
      let confirm = await this.$myconfirm("确定删除吗？");
      if (confirm) {
        let res = await deleteMenuApi({ menuId: row.menuId });
        if (res && res.code == 200) {
          this.getMenuList();
          this.$message.success(res.msg);
        }
      }
    },
    editMenu(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //数据回显
      this.$objCoppy(row, this.addModel);
      //设置弹框类型
      this.addModel.editType = "1";
      this.dialog.title = "编辑菜单";
      this.dialog.visible = true;
    },
    //上级部门节点加号或减号点击事件
    openBtn(data) {
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.menuId].expanded = !data.open;
    },
    //上级树节点点击事件
    nodeClick(node) {
      this.nodeUse.menuId = node.menuId;
      this.nodeUse.menuLabel = node.menuLabel;
    },
    //选择上级部门点击事件
    async useParent() {
      //获取上级部门数据
      let res = await getParentTreeApi();
      if (res && res.code == 200) {
        this.parentList = res.data;
      }
      this.parnetDialog.visible = true;
    },
    //上级部门弹框确认事件
    onParentConfirm() {
      this.addModel.parentId = this.nodeUse.menuId;
      this.addModel.parentName = this.nodeUse.menuLabel;
      this.parnetDialog.visible = false;
    },
    //上级部门弹框关闭事件
    onParentClose() {
      this.parnetDialog.visible = false;
    },
    //弹框确认事件
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addMenuApi(this.addModel);
          } else {
            console.log(this.addModel);
            res = await editMenuApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getMenuList();
            this.dialog.visible = false;
            this.$message.success(res.msg);
          }
        }
      });
    },
    //弹框关闭事件
    onClose() {
      this.dialog.visible = false;
    },
    //新增菜单按钮
    addMenu() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      // 设置弹框属性
      this.dialog.title = "新增权限";
      this.addModel.editType = "0";
      this.dialog.visible = true;
    },
    //获取权限列表
    async getMenuList() {
      let res = await getMenuListApi();
      if (res && res.code == 200) {
        this.tableList = res.data;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }
  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  // 竖线
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
//去掉最上级的before  after 即是去电最上层的连接线
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>
