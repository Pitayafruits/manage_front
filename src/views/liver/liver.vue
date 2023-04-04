<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>业主列表</span>
      </div>
      <div class="box">
        <!--搜索框-->
        <el-form :model="parms" ref="searchForm" :inline="true" size="medium">
          <el-form-item label="业主姓名">
            <el-input v-model="parms.liverName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="parms.liverPhone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="searchLiver" icon="el-icon-search"
              >查询</el-button
            >
            <el-button
              @click="resetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
            <el-button
              v-if="hasPerm('liver:liver:add')"
              type="primary"
              icon="el-icon-plus"
              @click="addLiver"
              >添加业主</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!--业主列表-->
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
          <el-table-column prop="liverName" label="姓名"></el-table-column>
          <el-table-column prop="liverPhone" label="电话"></el-table-column>
          <el-table-column prop="liverSex" label="性别">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.liverSex == '0'"
                >男</el-tag
              >
              <el-tag type="danger" v-if="scope.row.liverSex == '1'">女</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="houseNum" label="房屋序号"></el-table-column>
          <el-table-column prop="houseArea" label="房屋面积"></el-table-column>
          <el-table-column prop="unitName" label="单元"></el-table-column>
          <el-table-column prop="buildingName" label="楼宇"></el-table-column>
          <el-table-column prop="parkName" label="车位"></el-table-column>
          <el-table-column prop="liverStatus" label="账户状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.liverStatus == '0'">启用</el-tag>
              <el-tag type="info" v-if="scope.row.liverStatus == '1'"
                >禁用</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <el-button
                v-if="hasPerm('liver:liver:edit')"
                type="warning"
                size="small"
                @click="editLiver(scope.row)"
                icon="el-icon-edit"
                style="margin-left: 1px"
                >编辑业主</el-button
              >
              <el-button
                v-if="hasPerm('liver:liver:delete')"
                type="danger"
                size="small"
                @click="deleteLiver(scope.row)"
                icon="el-icon-delete"
                style="margin-left: 8px"
                >删除</el-button
              >
              <div style="margin-top: 10px">
                <el-button
                  v-if="hasPerm('liver:liver:avgHouse')"
                  type="success"
                  size="small"
                  @click="assignHouse(scope.row)"
                  icon="el-icon-edit"
                  >分配房屋</el-button
                >
                <el-button
                  v-if="hasPerm('liver:liver:returnHouse')"
                  type="danger"
                  size="small"
                  @click="leaveHouse(scope.row)"
                  icon="el-icon-delete"
                  >退房</el-button
                >
              </div>
              <div style="margin-top: 10px">
                <el-button
                  v-if="hasPerm('liver:liver:avgParking')"
                  type="primary"
                  size="small"
                  @click="assignPark(scope.row)"
                  icon="el-icon-edit"
                  style="margin-left: 12px"
                  >分配车位</el-button
                >
                <el-button
                  v-if="hasPerm('liver:liver:returnParking')"
                  type="danger"
                  size="small"
                  @click="leavePark(scope.row)"
                  icon="el-icon-delete"
                  style="margin-left: 10px"
                  >退车位</el-button
                >
              </div>
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
          <el-form-item prop="liverName" label="业主姓名">
            <el-input v-model="addModel.liverName"></el-input>
          </el-form-item>
          <el-form-item prop="liverSex" label="性别">
            <el-radio-group v-model="addModel.liverSex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="liverPhone" label="联系电话">
            <el-input v-model="addModel.liverPhone"></el-input>
          </el-form-item>
          <el-form-item prop="roleId" label="角色">
            <el-select v-model="addModel.roleId" disabled>
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="username" label="登陆账号">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>
          <el-form-item
            v-if="addModel.editType != '1'"
            prop="password"
            label="密码"
          >
            <el-input v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item prop="liverStatus" label="账号状态">
            <el-radio-group v-model="addModel.liverStatus">
              <el-radio :label="'0'">启用</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
    <!--分配房屋弹框-->
    <my-dialog
      :title="assignHouseDialog.title"
      :visible="assignHouseDialog.visible"
      :height="assignHouseDialog.height"
      :width="assignHouseDialog.width"
      @onClose="assignHouseClose"
      @onConfirm="assignHouseConfirm"
    >
      <template slot="content">
        <el-main>
          <!--搜索框-->
          <el-form
            :model="houseParms"
            ref="assignHouseForm"
            :inline="true"
            size="small"
          >
            <el-form-item label="楼宇名称">
              <el-input
                v-model="houseParms.buildingName"
                placeholder="请输入楼宇名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="单元名称">
              <el-input
                v-model="houseParms.unitName"
                placeholder="请输入单元名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="房屋编号">
              <el-input
                v-model="houseParms.houseNum"
                placeholder="请输入房屋编号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchHouse" icon="el-icon-search"
                >搜索</el-button
              >
              <el-button
                @click="resetHouseSearch"
                style="color: #ff7670"
                icon="el-icon-refresh"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <!--房屋表格-->
          <el-table :data="houseList" border stripe empty-text="暂无数据">
            <el-table-column width="50" align="center" label="选择">
              <template slot-scope="scope">
                <el-radio
                  v-model="assignHouseParm.houseId"
                  :label="scope.row.houseId"
                  @change="getCurrentRow(scope.row)"
                  >{{ " " }}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="buildingName"
              label="楼宇名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="unitName"
              label="单元名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="houseNum"
              label="房屋编号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="houseArea"
              label="房屋面积"
            ></el-table-column>
            <el-table-column align="center" prop="houseStatus" label="分配状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.houseStatus == '0'" type="success"
                  >未分配</el-tag
                >
                <el-tag v-if="scope.row.houseStatus == '1'" type="danger"
                  >已分配</el-tag
                >
              </template></el-table-column
            >
          </el-table>
          <!--分页组件-->
          <el-pagination
            @size-change="sizeHouseChange"
            @current-change="currentHouseChange"
            :current-page.sync="houseParms.currentPage"
            :page-sizes="[10, 15, 20]"
            :page-size="houseParms.pageSize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="houseParms.total"
            background
          >
          </el-pagination>
        </el-main>
      </template>
    </my-dialog>
    <!--分配车位弹框-->
    <my-dialog
      :title="parkDialog.title"
      :visible="parkDialog.visible"
      :height="parkDialog.height"
      :width="parkDialog.width"
      @onClose="parkClose"
      @onConfirm="parkConfirm"
    >
      <template slot="content">
        <!--搜索框-->
        <el-form :model="parkParms" :inline="true" size="small">
          <el-form-item label="车位名称">
            <el-input v-model="parkParms.parkName"></el-input>
          </el-form-item>
          <el-form-item label="车位类型">
            <el-select v-model="parkParms.parkType">
              <el-option
                v-for="item in typeOptions"
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
              @click="parkResetSearch"
              style="color: #ff7670"
              icon="el-icon-refresh"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 车位表格-->
        <el-table :data="parkList" empty-text="暂无数据" border stripe>
          <el-table-column width="50" align="center" label="选择">
            <template slot-scope="scope">
              <el-radio
                v-model="assignParkParm.parkId"
                :label="scope.row.parkId"
                @change="getCurrentParkRow(scope.row)"
                >{{ " " }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="parkName"
            label="车位名称"
          ></el-table-column>
          <el-table-column align="center" prop="parkType" label="车位类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.parkType == '0'" type="success"
                >地上车位</el-tag
              >
              <el-tag v-if="scope.row.parkType == '1'" type="danger"
                >地下车位</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column align="center" prop="parkStatus" label="使用状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.parkStatus == '0'">未使用</el-tag>
              <el-tag v-if="scope.row.parkStatus == '1'" type="info"
                >已使用</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          @size-change="sizeParkChange"
          @current-change="currentParkChange"
          :current-page.sync="parkParms.currentPage"
          :page-sizes="[10, 15, 20]"
          :page-size="parkParms.pageSize"
          layout="total,sizes,prev,pager,next,jumper"
          :total="parkParms.total"
          background
        >
        </el-pagination>
      </template>
    </my-dialog>
  </el-main>
</template>

<script>
import {
  addLiverApi,
  getRoleListApi,
  getLiverListApi,
  getLiverById,
  editLiverApi,
  getHouseListApi,
  assignHouseSaveApi,
  getParkingListApi,
  assignParkSaveApi,
  backHouseApi,
  backParkingApi,
  deleteLiverApi,
} from "@/api/liver/liver";
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
      //分配车位参数
      assignParkParm: {
        parkId: "",
        liverId: "",
      },
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
      //车位弹框属性
      parkDialog: {
        title: "",
        height: 400,
        width: 1045,
        visible: false,
      },
      //车位列表
      parkList: [],
      //车位分页查询参数
      parkParms: {
        parkName: "",
        parkStatus: "0",
        parkType: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      //分配房屋提交数据
      assignHouseParm: {
        houseId: "",
        liverId: "",
      },
      //分配房屋弹框属性
      assignHouseDialog: {
        title: "",
        height: 400,
        width: 1045,
        visible: false,
      },
      //房屋列表数据域
      houseList: [],
      //房屋列表参数
      houseParms: {
        buildingName: "",
        unitName: "",
        houseNum: "",
        houseStatus: "0",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      //业主列表数据
      tableList: [],
      //角色列表
      roleList: [
        {
          roleId: 19,
          roleName: "业主",
        },
      ],
      //新增或编辑弹框表单数据
      addModel: {
        liverId: "",
        liverName: "",
        liverPhone: "",
        liverSex: "",
        username: "",
        password: "",
        liverStatus: "",
        roleId: "",
        editType: "",
      },
      //新增或编辑弹框表单验证
      rules: {
        liverName: [
          {
            trigger: "change",
            required: true,
            message: "请填写业主姓名",
          },
        ],
        liverPhone: [
          {
            trigger: "change",
            required: true,
            message: "请填写业主电话",
          },
        ],
        liverSex: [
          {
            trigger: "change",
            required: true,
            message: "请选择业主性别",
          },
        ],
        roleId: [
          {
            trigger: "change",
            required: true,
            message: "请选择角色",
          },
        ],
        username: [
          {
            trigger: "change",
            required: true,
            message: "请填写登录账号",
          },
        ],
        password: [
          {
            trigger: "change",
            required: true,
            message: "请填写登录密码",
          },
        ],
        liverStatus: [
          {
            trigger: "change",
            required: true,
            message: "请选择账号状态",
          },
        ],
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 250,
        width: 630,
        visible: false,
      },
      //分页搜索数据
      parms: {
        liverName: "",
        liverPhone: "",
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    // this.getRoleList();
    this.getLiverList();
  },
  methods: {
    //分配车位页数改变触发
    currentParkChange(val) {
      this.parkParms.currentPage = val;
      this.getAssignParkList();
    },
    //分配车位页容量改变触发
    sizeParkChange(val) {
      this.parkParms.pageSize = val;
      this.getAssignParkList();
    },
    //分配车位事件
    getCurrentParkRow(row) {
      this.assignParkParm.parkId = row.parkId;
    },
    //重置车位按钮
    parkResetSearch() {
      this.parkParms.parkName = "";
      this.parkParms.parkType = "";
      this.getAssignParkList();
    },
    //查找车位按钮
    searchParking() {
      this.getAssignParkList();
    },
    //分配车位弹框确认
    async parkConfirm() {
      //验证是否选择车位
      if (!this.assignParkParm.parkId) {
        this.$message.warning("请选择车位");
        return;
      }
      let res = await assignParkSaveApi(this.assignParkParm);
      if (res && res.code == 200) {
        this.parkDialog.visible = false;
        this.$message.success(res.msg);
        this.getLiverList();
      }
    },
    //分配车位弹框关闭
    parkClose() {
      this.parkDialog.visible = false;
    },
    //分配房屋页码改变事件
    currentHouseChange(val) {
      this.houseParms.currentPage = val;
      this.getAssignHouseList();
    },
    //分配房屋页容量改变事件
    sizeHouseChange(val) {
      this.houseParms.pageSize = val;
      this.getAssignHouseList();
    },
    //分配房屋选择事件
    getCurrentRow(row) {
      this.assignHouseParm.houseId = row.houseId;
    },
    //分配房屋弹框重置按钮
    resetHouseSearch() {
      //清空搜索框
      this.houseParms.buildingName = "";
      this.houseParms.unitName = "";
      this.houseParms.houseNum = "";
      this.getAssignHouseList();
    },
    //分配房屋弹框搜索按钮
    searchHouse() {
      this.getAssignHouseList();
    },
    //分配房屋弹框确认事件
    async assignHouseConfirm() {
      if (!this.assignHouseParm.houseId) {
        this.$message.warning("请选择要分配的房屋");
        return;
      }
      let res = await assignHouseSaveApi(this.assignHouseParm);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.assignHouseDialog.visible = false;
        this.getLiverList();
      }
    },
    //分配房屋弹框关闭事件
    assignHouseClose() {
      this.assignHouseDialog.visible = false;
    },
    //删除按钮
    async deleteLiver(row) {
      //信息提示
      const confirm = await this.$myconfirm("确定要删除吗?");
      if (confirm) {
        try {
          let res = await deleteLiverApi({ liverId: row.liverId });
          if (res && res.code == 200) {
            this.$message.success(res.msg);
            this.getLiverList();
          }
        } catch (err) {}
      }
    },
    //编辑按钮
    async editLiver(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //数据回显
      let res = await getLiverById({ liverId: row.liverId });
      if (res && res.code == 200) {
        this.$objCoppy(res.data, this.addModel);
      }
      //设置弹框属性
      this.addModel.editType = "1";
      this.addDialog.title = "编辑业主";
      this.addDialog.visible = true;
    },
    //退车位按钮
    async leavePark(row) {
      if (!row.liverParkingStatus) {
        this.$message.warning("该业主未使用车位！");
        return;
      }
      let confirm = await this.$myconfirm("确定要退车位吗？");
      if (confirm) {
        try {
          let res = await backParkingApi({
            liverId: row.liverId,
            parkId: row.parkId,
          });
          if (res && res.code == 200) {
            this.getLiverList();
            this.$message.success(res.msg);
          }
        } catch (err) {}
      }
    },
    //退房按钮
    async leaveHouse(row) {
      if (!row.liverHouseStatus) {
        this.$message.warning("该业主未使用房屋！");
        return;
      }
      let confirm = await this.$myconfirm("确定要退房吗？");
      if (confirm) {
        try {
          let res = await backHouseApi({
            liverId: row.liverId,
            houseId: row.houseId,
          });
          if (res && res.code == 200) {
            this.getLiverList();
            this.$message.success(res.msg);
          }
        } catch (err) {}
      }
    },
    //分配车位按钮
    async assignPark(row) {
      //判断当前业主是否已经分配车位
      if (row.parkName) {
        this.$message.warning("当前业主已经有车位分配，不能重复分配!");
        return;
      }
      //清空数据
      this.assignParkParm.parkId = "";
      this.parkParms.parkName = "";
      //赋值业主id
      this.assignParkParm.liverId = row.liverId;
      //获取车位列表
      this.getAssignParkList();
      //弹框属性设置
      this.parkDialog.title = "为【" + row.liverName + "】分配车位";
      this.parkDialog.visible = true;
    },
    //获取车位列表
    async getAssignParkList() {
      //获取车位列表
      let res = await getParkingListApi(this.parkParms);
      if (res && res.code == 200) {
        this.parkList = res.data.records;
        this.parkParms.total = res.data.total;
      }
    },
    //分配房屋按钮
    async assignHouse(row) {
      //判断当前业主是否已经分配房屋
      if (row.houseNum) {
        this.$message.warning("当前业主已经有房屋分配，不能重复分配!");
        return;
      }
      //清空搜索框
      this.houseParms.buildingName = "";
      this.houseParms.unitName = "";
      this.houseParms.houseNum = "";
      //清空表单
      this.assignHouseParm.houseId = "";
      this.assignHouseParm.liverId = "";
      this.getAssignHouseList();
      //弹框属性设置
      this.assignHouseDialog.title = "为【" + row.liverName + "】分配房屋";
      this.assignHouseDialog.visible = true;
      //分配业主
      this.assignHouseParm.liverId = row.liverId;
    },
    //分配房屋列表方法
    async getAssignHouseList() {
      //获取未分配的房屋列表
      let res = await getHouseListApi(this.houseParms);
      if (res && res.code == 200) {
        this.houseList = res.data.records;
        this.houseParms.total = res.data.total;
      }
    },
    //页码改变触发
    currentChange(val) {
      this.parms.currentPage = val;
      this.getLiverList();
    },
    //页容量改变触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.getLiverList();
    },
    //新增时角色列表的回显
    // async getRoleList() {
    //   let res = await getRoleListApi();
    //   if (res && res.code == 200) {
    //     this.roleList = res.data;
    //   }
    // },
    //获取业主列表数据
    async getLiverList() {
      let res = await getLiverListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
    //新增或编辑弹框确认按钮
    onConfirm() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            res = await addLiverApi(this.addModel);
          } else {
            res = await editLiverApi(this.addModel);
          }
          if (res && res.code == 200) {
            this.getLiverList();
            this.addDialog.visible = false;
            this.$message.success(res.msg);
          }
        }
      });
    },
    //新增或编辑弹框关闭事件
    onClose() {
      this.addDialog.visible = false;
    },
    //添加业主按钮
    addLiver() {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置业主角色
      this.addModel.roleId = 19;
      //设置编辑或新增弹框属性
      this.addModel.editType = "0";
      this.addDialog.title = "添加业主";
      this.addDialog.visible = true;
    },
    //重置按钮
    resetSearch() {
      this.parms.liverName = "";
      this.parms.liverPhone = "";
      this.getLiverList();
    },
    //查找业主按钮
    searchLiver() {
      this.getLiverList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
