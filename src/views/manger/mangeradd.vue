<template>
  <div>
    <!-- 弹框 
    visible	是否显示 Dialog，支持 .sync 修饰符
    
    -->
    <el-dialog
      center
      :title="addInfo.isAdd?'添加管理员':'编辑管理员'"
      :visible.sync="addInfo.isShow"
      :before-close="cancle"
    >
      <el-form :model="mangerForm" center :rules="rules" ref="ruleForm">
        <el-form-item prop="roleid" label="所属角色：" :label-width="formLabelWidth">
          <el-select v-model="mangerForm.roleid" placeholder="请选择">
            <el-option
              v-for="item in getRoleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="管理员名称：" :label-width="formLabelWidth">
          <el-input v-model="mangerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="rolename" label="密码：" :label-width="formLabelWidth">
          <el-input v-model="mangerForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="mangerForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button v-if="addInfo.isAdd" type="primary" @click="add('ruleForm')">确 定</el-button>
        <el-button v-else type="primary" @click="update('ruleForm')">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入行动 获取管理员列表
import { mapGetters, mapActions } from "vuex";
//引入添加管理员列表接口
import { addManger, editManger, MangerInfo } from "../../util/axios";
export default {
  data() {
    return {
      //管理员表单
      mangerForm: {
        roleid: "", //角色编号
        username: "", //管理员名称
        password: "", //密码
        status: 1 //状态1正常2禁用
      },
      rules: {
        username: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ],
        roleid: [
          { required: true, message: "请选择所属角色", trigger: "change" }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  computed: {
    ...mapGetters({
      getRoleList: "role/getRoleList"
    })
  },
  mounted() {
    //管理员列表一触发就调取角色列表
    this.getRoleListAction();
  },
  methods: {
    ...mapActions({
      getRoleListAction: "role/getRoleListAction",
      getMangerListAction: "manger/getMangerListAction",
      getCountAction: "manger/getCountAction"
    }),
    cancle() {
      //封装取消事件 子传父
      this.$emit("cancle", {
        isShow: false,
        isAdd: this.addInfo.isAdd
      }),
        //点击取消调用重置管理员列表,但是节点并没有被清空，因此需要key的set方法
        this.reset();
    },
    //封装一个重置事件
    reset() {
      this.mangerForm = {
        roleid: "", //角色编号
        username: "", //管理员名称
        password: "", //密码
        status: 1 //状态1正常2禁用
      };
      //重置规则验证
        this.$refs['ruleForm'].resetFields();
    },

    //封装一个添加事件
    add(formName) {
      //this.$refs.tree.getCheckedKeys()取值为数组格式[1,2,3]，我们要的是用逗号分开"1,2,3"
      //console.log(this.$refs.tree.getCheckedKeys(), "通过key获取节点（id）");
      //添加方法执行，调取validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.role,'管理员列表');

          addManger(this.mangerForm).then(res => {
            // console.log(res,'添加成功的响应');
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框并清空（重置）内容
              this.cancle();
              //重新获取列表(相当于调用一次列表（在仓库掉管理员的行动）)
              // 发现数据还是没有渲染，因为行动里面时打印数据，但并没有赋值
              this.getMangerListAction();
              //重新调取下总数（当你删除成功或者添加成功分页也要变化，只有总数变化之后，分页才能跟着变化
              this.getCountAction();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //封装一个查询一条数据事件
    lookInfo(uid) {
      //调取查询接口，引入接口
      MangerInfo({ uid }).then(res => {
        console.log(res, "查询一条数据结果");
        if (res.data.code === 200) {
          this.mangerForm = res.data.list;
          //将查看到的id赋值给列表
          this.mangerForm.uid = uid;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个修改事件
    update(formName) {
      //修改方法执行，调取validate验证器
      //当前密码如果想修改，重新赋值即可，若为空就是上一步的值
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.role,'管理员列表');
          //调取封装好的修改管理员列表接口
          editManger(this.mangerForm).then(res => {
            // console.log(res,'修改成功的响应');
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框并清空（重置）内容
              this.cancle();
              //重新获取列表(相当于调用一次列表（在仓库掉管理员的行动）)
              this.getMangerListAction();
              //重新调取下总数（当你删除成功或者添加成功分页也要变化，只有总数变化之后，分页才能跟着变化
              this.getCountAction();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },

  props: ["addInfo"]
};
</script>

<style  lang="" scoped>
</style>
