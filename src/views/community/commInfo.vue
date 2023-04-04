<template>
  <el-main>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>小区简介</span>
      </div>
      <div align="center">
        <el-form
          ref="form"
          :model="infoForm"
          :rules="rules"
          style="width: 120vh"
        >
          <!--line 1-->
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="小区名称" prop="commName">
                <el-input v-model="infoForm.commName" />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="小区负责人" prop="commMan">
                <el-input v-model="infoForm.commMan" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--line 2-->
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="建成日期" prop="createTime">
                <div class="block">
                  <el-date-picker
                    v-model="infoForm.createTime"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="楼宇数量" prop="buildNum">
                <el-input v-model.number="infoForm.buildNum" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--line 3-->
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="小区地址" prop="commAdr">
                <el-input v-model="infoForm.commAdr" />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="联系电话" prop="phoneNumber">
                <el-input v-model="infoForm.phoneNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--line 4-->
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="建筑面积(亩)" prop="commArea">
                <el-input v-model.number="infoForm.commArea" />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="绿化面积(亩)" prop="greenArea">
                <el-input v-model.number="infoForm.greenArea" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- line 5 -->
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="道路面积(亩)" prop="roadArea">
                <el-input v-model.number="infoForm.roadArea" />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="停车面积(亩)" prop="stopArea">
                <el-input v-model.number="infoForm.stopArea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="小区简介"
            :label-width="120 + ''"
            prop="commInfo"
          >
            <el-input v-model="infoForm.commInfo" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button :plain="true" type="primary" @click="saveCommInfo"
              >保存</el-button
            >
            <el-button
              style="margin-left: 50px"
              type="primary"
              @click="clearCommInfo"
              >清空</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <Footer></Footer>
  </el-main>
</template>

<script>
import { getCommInfoApi, saveCommInfoApi } from "@/api/community/commInfo.js";
import Footer from "@/components/footer/footer";
export default {
  //注册自定义组件
  components: {
    Footer,
  },
  data() {
    return {
      //表单验证
      rules: {
        commName: [
          {
            trigger: "change",
            required: true,
            message: "请填写小区名称",
          },
        ],
        commMan: [
          {
            trigger: "change",
            required: true,
            message: "请填写小区负责人",
          },
        ],
        createTime: [
          {
            trigger: "change",
            required: true,
            message: "请填写建成日期",
          },
        ],
        buildNum: [
          {
            trigger: "change",
            required: true,
            message: "请填写楼宇数量",
          },
          { type: "number", message: "楼宇数量需为数字", trigger: "blur" },
        ],
        commAdr: [
          {
            trigger: "change",
            required: true,
            message: "请填写小区地址",
          },
        ],
        phoneNumber: [
          {
            trigger: "change",
            required: true,
            message: "请填写联系电话",
          },
        ],
        commArea: [
          {
            trigger: "change",
            required: true,
            message: "请填写建筑面积",
          },
          { type: "number", message: "建筑面积需为数字", trigger: "blur" },
        ],
        greenArea: [
          {
            trigger: "change",
            required: true,
            message: "请填写绿化面积",
          },
          { type: "number", message: "绿化面积需为数字", trigger: "blur" },
        ],
        roadArea: [
          {
            trigger: "change",
            required: true,
            message: "请填写道路面积",
          },
          { type: "number", message: "道路面积需为数字", trigger: "blur" },
        ],
        stopArea: [
          {
            trigger: "change",
            required: true,
            message: "请填写停车面积",
          },
          { type: "number", message: "停车面积需为数字", trigger: "blur" },
        ],
        commInfo: [
          {
            trigger: "change",
            required: true,
            message: "请填写小区简介",
          },
        ],
      },
      //小区信息数据
      infoForm: {
        id: "",
        commName: "",
        commMan: "",
        createTime: "",
        buildNum: "",
        commAdr: "",
        phoneNumber: "",
        commArea: "",
        greenArea: "",
        roadArea: "",
        stopArea: "",
        commInfo: "",
      },
      //单元格占比
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
  },
  created() {
    this.getCommInfo();
  },
  methods: {
    //获取小区基本信息
    async getCommInfo() {
      try {
        let res = await getCommInfoApi();
        if (res && res.code == 200) {
          this.infoForm = res.data ? res.data : {};
        }
      } catch (err) {}
    },
    //修改小区基本信息
    saveCommInfo() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            let res = await saveCommInfoApi(this.infoForm);
            if (res && res.code == 200) {
              this.getCommInfo();
              this.$message.success(res.msg);
            }
          } catch (err) {}
        }
      });
    },
    //重置小区基本信息表单
    clearCommInfo() {
      this.infoForm = {};
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  width: 200px;
}
.el-input {
  width: 300px;
}
</style>
