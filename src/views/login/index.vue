<template>
  <!--container布局-->
  <el-container class="container">
    <!--顶栏-->
    <el-header class="header">
      <el-image
        src="https://cdn.staticaly.com/gh/Pitayafruits/myPicRep@main/PropertyManage/202301201508741.png"
        style="float: left"
      ></el-image>
      <span class="headerFont">物业之家</span>
      <el-button class="myButton" @click="OpenMyGithub">欢迎您的访问</el-button>
    </el-header>
    <!--中间-->
    <el-main>
      <!--第1列 -->
      <el-row>
        <el-col :span="6">
          <!--用户登录-->
          <el-main>
            <el-card class="login-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 24px; font-weight: 400; color: #409eff"
                  >用户登录</span
                >
              </div>
              <div>
                <el-form
                  :model="loginForm"
                  ref="loginForm"
                  :rules="rules"
                  :inline="false"
                  size="normal"
                >
                  <el-form-item prop="username">
                    <el-input
                      prefix-icon="el-icon-user-solid"
                      v-model="loginForm.username"
                      placeholder="请输入您的用户名"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      type="password"
                      prefix-icon="el-icon-lock"
                      v-model="loginForm.password"
                      placeholder="请输入您的密码"
                    ></el-input>
                  </el-form-item>
                  <el-form-item prop="userType">
                    <el-radio-group v-model="loginForm.userType">
                      <el-radio :label="'0'">业主</el-radio>
                      <el-radio :label="'1'">物业</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                    <el-button @click="onReset">忘记密码</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-main>
          <!--小区信息-->
          <el-main>
            <el-card class="login-card" style="height: 443px">
              <div slot="header" class="clearfix">
                <span style="font-size: 24px; font-weight: 400; color: #409eff"
                  >小区信息</span
                >
              </div>
              <div>
                <!--第一层表格-->
                <el-table
                  :data="tableList"
                  style="width: 100%; margin-top: 15px"
                  empty-text="暂无数据"
                  :header-cell-style="{
                    background: 'rgba(0,0,0,0.05)',
                  }"
                >
                  <el-table-column
                    prop="commName"
                    label="小区名称"
                  ></el-table-column>
                </el-table>
                <!--第二层表格-->
                <el-table
                  :data="tableList"
                  style="width: 100%"
                  empty-text="暂无数据"
                  :header-cell-style="{
                    background: 'rgba(0,0,0,0.05)',
                  }"
                >
                  <el-table-column
                    prop="roadArea"
                    label="道路面积"
                  ></el-table-column>
                  <el-table-column
                    prop="greenArea"
                    label="绿化面积"
                  ></el-table-column>
                  <el-table-column
                    prop="commArea"
                    label="建筑面积"
                  ></el-table-column>
                </el-table>
                <!--第三层-->
                <el-table
                  :data="tableList"
                  style="width: 100%"
                  empty-text="暂无数据"
                  :header-cell-style="{
                    background: 'rgba(0,0,0,0.05)',
                  }"
                >
                  <el-table-column
                    prop="buildNum"
                    label="楼宇数量"
                  ></el-table-column>
                  <el-table-column
                    prop="phoneNumber"
                    icon="el-icon-phone-outline"
                    label="联系我们"
                  >
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-main>
        </el-col>
        <!--第2列-->
        <el-col :span="18">
          <!--轮播图-->
          <el-main>
            <el-card class="login-card">
              <div slot="header" class="clearfix">
                <span style="font-size: 24px; font-weight: 400; color: #409eff"
                  >美好家园</span
                >
              </div>
              <div>
                <el-carousel indicator-position="outside">
                  <el-carousel-item v-for="item in imgArray" :key="item.id">
                    <img :src="item.idView" class="rightImg" />
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-card>
          </el-main>
          <!--分页菜单-->
          <el-main>
            <el-card>
              <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="物业公告" name="first">
                    <!--物业公告-->
                    <el-table :data="noticeList" :show-header="false">
                      <el-table-column
                        prop="noticeTitle"
                        label="公告标题"
                        width="200"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="noticeTime"
                        label="公告日期"
                        :formatter="formatTime"
                        width="180"
                      ></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button
                            size="small"
                            @click="watchNotice(scope.row)"
                            icon="el-icon-view"
                            >查看</el-button
                          ></template
                        >
                      </el-table-column>
                    </el-table>
                    <div style="margin-top: 3px">
                      <!--分页组件-->
                      <el-pagination
                        @size-change="noticeSizeChange"
                        @current-change="noticeCurrentChange"
                        :current-page.sync="noticeParms.currentPage"
                        :page-size="noticeParms.pageSize"
                        layout="total, prev, pager, next"
                        :total="noticeParms.total"
                      >
                      </el-pagination>
                    </div>
                  </el-tab-pane>
                  <!--小区设施-->
                  <el-tab-pane label="小区设施" name="second">
                    <el-tabs :tab-position="tabPosition" style="height: 200px">
                      <el-tab-pane
                        :key="item.faName"
                        v-for="item in facList"
                        :label="item.faName"
                      >
                        <el-descriptions
                          class="margin-top"
                          title="设施信息"
                          :size="size"
                          :column="3"
                          border
                        >
                          <el-descriptions-item>
                            <template slot="label">设施名称</template>
                            {{ item.faName }}
                          </el-descriptions-item>
                          <el-descriptions-item>
                            <template slot="label">负责人</template>
                            {{ item.faPerson }}
                          </el-descriptions-item>
                          <el-descriptions-item>
                            <template slot="label">联系电话</template>
                            {{ item.phoneNumber }}
                          </el-descriptions-item>
                          <el-descriptions-item>
                            <template slot="label">简介</template>
                            {{ item.faText }}
                          </el-descriptions-item></el-descriptions
                        ></el-tab-pane
                      >
                    </el-tabs></el-tab-pane
                  >
                  <el-tab-pane label="物业人员" name="third">
                    <!--物业人员卡片-->
                    <el-row>
                      <el-col
                        :span="4"
                        v-for="(item, index) in workerList"
                        :key="index"
                        style="
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                        "
                      >
                        <el-card
                          :body-style="{ padding: '0px', height: '207px' }"
                        >
                          <img
                            src="https://cdn.staticaly.com/gh/Pitayafruits/myPicRep@main/PropertyManage/202302211725193.jpg"
                            class="image"
                          />
                        </el-card>
                        <div
                          style="
                            margin-top: 2px;
                            font-size: 20px;
                            font-weight: 500;
                          "
                        >
                          {{ item.fullName }}
                        </div>
                        <div style="margin-top: 4px">
                          {{ item.phoneNumber }}
                        </div>
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </el-card>
          </el-main>
        </el-col>
      </el-row>
    </el-main>
    <!--底部-->
    <el-footer class="footer" height="40px">
      <div>
        <span class="footerFont">
          <img
            src="https://cdn.staticaly.com/gh/Pitayafruits/myPicRep@main/PropertyManage/202301201745065.png"
          />
          © 2023 物业管理系统 Powered by
          <el-link
            type="primary"
            href="https://www.pitayafruit.club"
            target="_blank"
            >Pitayafruit</el-link
          ></span
        >
      </div>
    </el-footer>
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
        <el-form :model="model" ref="addForm" :inline="false" size="normal">
          <el-form-item label="公告标题">
            {{ model.noticeTitle }}
          </el-form-item>
          <el-form-item label="公告内容">
            {{ model.noticeText }}
          </el-form-item>
        </el-form>
      </template>
    </my-dialog>
    <!--重置密码-->
    <my-dialog
      :title="resetDialog.title"
      :visible="resetDialog.visible"
      :height="resetDialog.height"
      :width="resetDialog.width"
      @onClose="resetOnClose"
      @onConfirm="resetOnConfirm"
    >
      <template slot="content"
        ><el-form :model="form" ref="form" :rules="resetRules" :inline="true"
          ><el-form-item prop="phone"
            ><el-input
              prefix-icon="el-icon-phone"
              placeholder="请输入手机号"
              v-model="form.phone"
              style="width: 400px"
            ></el-input></el-form-item
          ><el-form-item prop="code"
            ><el-row :gutter="20"
              ><el-col :span="16">
                <el-input
                  prefix-icon="el-icon-tickets"
                  placeholder="请输入验证码"
                  v-model="form.code"
                  style="width: 200px"
                ></el-input
              ></el-col>
              <el-col :span="1">
                <el-button :disabled="disabled" @click="sendCode">
                  <span class="Time">{{ btnText }}</span>
                </el-button>
              </el-col></el-row
            ></el-form-item
          ></el-form
        ></template
      ></my-dialog
    >
  </el-container>
</template>

<script>
import { getIndexCommInfoApi } from "@/api/community/commInfo";
import { getAllWorkerApi } from "@/api/user";
import { getIndexNoticeListApi } from "@/api/community/notice";
import { getIndexFacListApi } from "@/api/community/facilities";
import { sendPhoneMsgApi, liverResetPassAPi } from "@/api/liver/liver";
import { Message } from "element-ui";
import MyDialog from "@/components/custom/MyDialog";
export default {
  //注册自定义组件
  components: {
    MyDialog,
  },
  data() {
    //手机号校验
    const validatePhone = (rule, value, callback) => {
      // 判断输入框中是否输入手机号
      if (!value) {
        callback(new Error("手机号不能为空"));
      }
      //正则表达式进行验证手机号，从1开始，第二位是35789中的任意一位，以9数字结尾
      if (!/^1[35789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      }
      callback();
    };
    return {
      //重置密码弹框表单验证
      resetRules: {
        phone: [
          { required: true, trigger: "blur", message: "请输入11位手机号" },
          {
            required: true,
            trigger: "blur",
            min: 11,
            max: 11,
            message: "请输入正确的手机号",
          },
          { required: true, trigger: "blur", validator: validatePhone },
        ],
        code: [
          { required: true, trigger: "blur", message: "请输入4位验证码" },
          {
            required: true,
            trigger: "blur",
            min: 4,
            max: 4,
            message: "验证码错误",
          },
        ],
      },
      //倒计时按钮
      disabled: false,
      time: 0,
      //发送按钮
      btnText: "发送验证码",
      //重置密码表单绑定数据
      form: {
        phone: "",
        code: "",
      },
      //重置密码弹框
      resetDialog: {
        title: "",
        height: 140,
        width: 430,
        visible: false,
      },
      //描述框大小
      size: "",
      //设施标签页位置
      tabPosition: "left",
      //设施列表数据
      facList: [],
      //弹框绑定的数据域
      model: {
        noticeTitle: "",
        noticeText: "",
        noticeTime: "",
      },
      //弹框属性
      dialog: {
        title: "",
        height: 200,
        width: 450,
        visible: false,
      },
      //公告列表分页参数
      noticeParms: {
        currentPage: 1,
        pageSize: 4,
        total: 0,
      },
      //公告列表数据
      noticeList: [],
      //物业工作人员列表
      workerList: [],
      //标签页的切换
      activeName: "first",
      //小区基本信息表格
      tableList: [],
      //轮播图
      imgArray: [
        { id: 0, idView: require("@/assets/carousel/img1.jpg") },
        { id: 1, idView: require("@/assets/carousel/img2.jpg") },
        { id: 2, idView: require("@/assets/carousel/img3.jpg") },
        { id: 3, idView: require("@/assets/carousel/img4.jpg") },
      ],
      //登录表单
      loginForm: {
        username: "",
        password: "",
        userType: "", //0业主 1物业
      },
      //登录表单验证规则
      rules: {
        username: [
          {
            trigger: "change",
            required: true,
            message: "请输入用户名",
          },
        ],
        password: [
          {
            trigger: "change",
            required: true,
            message: "请输入密码",
          },
        ],
        userType: [
          {
            trigger: "change",
            required: true,
            message: "请选择用户类型",
          },
        ],
      },
    };
  },
  mounted() {
    this.getCommInfo();
    this.getAllWorker();
    this.getIndexNoticeList();
    this.getIndexFacList();
  },
  methods: {
    //倒计时方法
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btnText = this.time + "s后重新发送";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 0;
        this.btnText = "获取验证码";
        this.disabled = false;
      }
    },
    //发送短信按钮
    async sendCode() {
      // 校验手机号码
      if (!this.form.phone) {
        //号码校验不通过
        Message({
          message: "请输入手机号",
          type: "warning",
        });
        //正则判断 从1开始，第二位是35789中的任意一位，以9数字结尾
      } else if (!/1[35789]\d{9}/.test(this.form.phone)) {
        // 失去焦点后自动触发校验手机号规则
      } else {
        this.time = 60;
        this.disabled = true;
        //调用倒计时方法
        this.timer();
        //发送短信
        let res = await sendPhoneMsgApi(this.form);
        if (res && res.code == 200) {
          Message.success(res.msg);
        }
      }
    },
    //忘记密码按钮
    onReset() {
      //清空表单
      this.$resetForm("form", this.form);
      this.resetDialog.title = "重置密码";
      this.resetDialog.visible = true;
    },
    //重置密码弹框确认
    async resetOnConfirm() {
      let res = await liverResetPassAPi(this.form);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.resetDialog.visible = false;
      }
    },
    //重置密码弹框关闭
    resetOnClose() {
      this.resetDialog.visible = false;
    },
    //获取设施列表
    async getIndexFacList() {
      let res = await getIndexFacListApi();
      if (res && res.code == 200) {
        this.facList = res.data;
      }
    },
    //弹框确认
    onConfirm() {
      this.dialog.visible = false;
    },
    //弹框关闭
    onClose() {
      this.dialog.visible = false;
    },
    //查看公告
    watchNotice(row) {
      this.dialog.title = "查看公告";
      this.dialog.visible = true;
      //数据回显
      this.$objCoppy(row, this.model);
    },
    //获取公告列表
    async getIndexNoticeList() {
      let res = await getIndexNoticeListApi(this.noticeParms);
      if (res && res.code == 200) {
        this.noticeList = res.data.records;
        this.noticeParms.total = res.data.total;
      }
    },
    //公告列表页码改变触发
    noticeCurrentChange(val) {
      this.noticeParms.currentPage = val;
      this.getIndexNoticeList();
    },
    //公告列表页容量改变触发
    noticeSizeChange(val) {
      this.noticeParms.pageSize = val;
      this.getIndexNoticeList();
    },
    //获取小区工作人员列表
    async getAllWorker() {
      let res = await getAllWorkerApi();
      if (res && res.code == 200) {
        this.workerList = res.data;
      }
    },
    //欢迎访问按钮
    OpenMyGithub() {
      window.open("https://github.com/Pitayafruits", "_blank");
    },
    //获取小区基本信息
    async getCommInfo() {
      let res = await getIndexCommInfoApi();
      if (res && res.code == 200) {
        this.tableList = res.data;
      }
    },
    //标签页页面切换方法
    handleClick(tab, event) {},
    //登录事件
    onSubmit() {
      this.$refs.loginForm.validate((valid) => {
        //验证通过提交表单
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              //路由跳转
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    //表格时间格式化
    formatTime(row, column) {
      let data = row[column.property];
      let dtime = new Date(data);
      const year = dtime.getFullYear();
      let month = dtime.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let day = dtime.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      let hour = dtime.getHours();
      if (hour < 10) {
        hour = "0" + hour;
      }
      let minute = dtime.getMinutes();
      if (minute < 10) {
        minute = "0" + minute;
      }
      let second = dtime.getSeconds();
      if (second < 10) {
        second = "0" + second;
      }
      return year + "-" + month + "-" + day;
    },
  },
};
</script>

<style lang="scss" scoped>
//物业图片
.image {
  width: 100%;
  height: 100%;
  display: block;
}
//页面整体效果
.container {
  background-color: rgba(255, 255, 255, 0.2);
  background-image: url("../../assets/images/background.png");
  background-size: 100% 100%;
}
//轮播图样式
.rightImg {
  width: 1200px;
  height: 500px;
}

//顶栏
.header {
  background-color: #ffffff;
  color: #ffffff;
  line-height: 60px;
}

//顶栏文字标签
.headerFont {
  font-size: 28px;
  font-weight: 400;
  color: #409eff;
}

//顶栏按钮
.myButton {
  float: right;
  background-color: #fff;
  z-index: 1;
  position: relative;
  overflow: hidden;
  color: #409eff;
  border: 3px solid #409eff;
  padding: 10px 20px;
  font-family: Arial;
  font-weight: 800;
  font-size: 1.05em;
  border-radius: 15px;
  transition: transform 0.3s ease, color 0.5s ease;
  margin-top: 15px;
}
.myButton::before {
  content: "";
  inset: 0 0 0 0;
  margin: auto;
  height: 0px;
  width: 0px;
  position: absolute;
  background-color: #409eff;
  z-index: -1;
  border-radius: 50%;
  transition: all 0.7s ease;
}
.myButton:active {
  transform: scale(0.9);
}
.myButton:hover {
  color: #fff;
}
.myButton:hover:before {
  height: 200px;
  width: 200px;
}

//底栏
.footer {
  background-color: #ffffff;
  color: #ffffff;
}

//底栏字体
.footerFont {
  font-size: 15px;
  color: #000000;
  display: block;
  text-align: center;
  line-height: 40px;
  font-family: "Microsoft YaHei";
}
</style>
