<template>
  <div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding: 10px 20px 10px 0;
        background-color: #409eff;
      "
    >
      <div class="right-menu" style="left: 1260px">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img
              :src="avatar + '?imageView2/1/w/80/h/80'"
              class="user-avatar"
            />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="user-dropdown"
            style="position: absolute; top: 59px"
          >
            <el-dropdown-item divided @click.native="resetPassword">
              <span style="display: block">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!--修改密码弹框-->
      <my-dialog
        :title="dialog.title"
        :height="dialog.height"
        :width="dialog.width"
        :visible="dialog.visible"
        @onClose="onClose"
        @onConfirm="onConfirm"
      >
        <template slot="content">
          <el-form
            :model="parms"
            ref="changeForm"
            :rules="rules"
            label-width="80px"
            :inline="false"
            size="samll"
          >
            <el-form-item label="旧密码">
              <el-input
                prop="oldPassword"
                v-model="parms.oldPassword"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input
                prop="newPassword"
                v-model="parms.newPassword"
                show-password
              ></el-input>
            </el-form-item>
          </el-form> </template
      ></my-dialog>
    </div>
    <div class="navbar">
      <hamburger
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb class="breadcrumb-container" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import MyDialog from "@/components/custom/MyDialog";
import { resetPasswordApi } from "@/api/user";
import { getUserId } from "@/utils/auth";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    MyDialog,
  },
  data() {
    return {
      //表单验证规则
      rules: {
        oldPassword: [
          {
            trigger: "change",
            required: true,
            message: "请填写旧密码！",
          },
        ],
        newPassword: [
          {
            trigger: "change",
            required: true,
            message: "请填写新密码！",
          },
        ],
      },
      //弹框内绑定数据
      parms: {
        userId: getUserId(),
        oldPassword: "",
        newPassword: "",
      },
      //弹框参数
      dialog: {
        title: "修改密码",
        height: 150,
        width: 630,
        visible: false,
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    //弹框确认
    onConfirm() {
      this.$refs.changeForm.validate(async (valid) => {
        if (valid) {
          try {
            let res = await resetPasswordApi(this.parms);
            if (res && res.code == 200) {
              this.dialog.visible = false;
              await this.$store.dispatch("user/logout");
              this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            }
          } catch (err) {}
        }
      });
    },
    //弹框关闭
    onClose() {
      this.dialog.visible = false;
    },
    //修改密码
    resetPassword() {
      this.dialog.visible = true;
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      //信息提示
      let confirm = await this.$myconfirm("确定退出吗?");
      if (confirm) {
        await this.$store.dispatch("user/logout");
        this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.right-menu {
  height: 50px;
  width: 50px;
  position: relative;
  left: 1210px;
  .avatar-wrapper {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.user-dropdown {
  position: absolute;
  top: 54px !important;
}
</style>
