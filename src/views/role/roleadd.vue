<template>
  <div>
    <!-- 弹框 
    visible	是否显示 Dialog，支持 .sync 修饰符
    
    -->
    <el-dialog
      center
      :title="addInfo.isAdd?'添加菜单':'编辑菜单'"
      :visible.sync="addInfo.isShow"
      :before-close="cancle"
    >
      <el-form :model="role" center :rules="rules" ref="ruleForm">
        <el-form-item prop="rolename" label="角色名称：" :label-width="formLabelWidth">
          <el-input v-model="role.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限：" :label-width="formLabelWidth">
          <!-- 角色权限的树结构调取的是菜单列表的数据也就是辅助性函数，因此需要在这里调用
          data:数据结构  展示数据
          show-checked  节点是否可被选择
           node-key  每个树节点用来作唯一标识的属性，整棵树应该是唯一的
          default-expand-all  是否默认展开所有节点
          props  配置选项，具体看下表
          check-strictly	在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
          -->
          <el-tree
            :data="getMenuList"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="{
              children:'children',//树形层级
              label:'title'       //展示的内容，title指的是菜单名称
              }"
            ref="tree"
             check-strictly 
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="role.status"
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
//引入行动 获取菜单列表
import { mapGetters, mapActions } from "vuex";
//引入添加角色列表接口
import { addRole, editRole, roleInfo } from "../../util/axios";
export default {
  data() {
    return {
      //角色表单
      role: {
        rolename: "", //角色名称
        menus: "", //角色权限//菜单权限 存放的是菜单编号，用逗号隔开 '[1,2,3]'
        status: 1 //状态1正常2禁用
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  computed: {
    ...mapGetters({
      getMenuList: "menu/getMenuList"
    })
  },
  mounted() {
    //角色列表一触发就调取菜单列表
    this.getMenulistAction();
  },
  methods: {
    ...mapActions({
      getMenulistAction: "menu/getMenulistAction",
      getRoleListAction: "role/getRoleListAction"
    }),
    cancle() {
      //封装取消事件 子传父
      this.$emit("cancle", {
        isShow: false,
        isAdd: this.addInfo.isAdd
      }),
        //点击取消调用重置角色列表,但是节点并没有被清空，因此需要key的set方法
        this.reset();
    },
    //封装一个重置事件
    reset() {
      this.role = {
        rolename: "", //角色名称
        menus: "", //角色权限//菜单权限 存放的是菜单编号，用逗号隔开 '[1,2,3]'
        status: 1 //状态1正常2禁用
      };
      //重置(清空)角色权限树结构
      this.$refs.tree.setCheckedKeys([]);
    },

    //封装一个添加事件
    add(formName) {
      //this.$refs.tree.getCheckedKeys()取值为数组格式[1,2,3]，我们要的是用逗号分开"1,2,3"
      //console.log(this.$refs.tree.getCheckedKeys(), "通过key获取节点（id）");
      //添加方法执行，调取validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          //调取添加列表接口
          this.role.menus = this.$refs.tree.getCheckedKeys().join(",");
          // console.log(this.role,'角色列表');
          //调取封装好的添加角色列表接口
          //菜单权限要求的格式为，存放的是菜单编号，用逗号分隔开
          addRole(this.role).then(res => {
            // console.log(res,'添加成功的响应');
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框并清空（重置）内容
              this.cancle();
              //重新获取列表(相当于调用一次列表（在仓库掉角色的行动）)
              // 发现数据还是没有渲染，因为行动里面稚时打印数据，但并没有赋值
              this.getRoleListAction();
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
    lookInfo(id) {
      //调取查询接口，引入接口
      roleInfo({ id }).then(res => {
        console.log(res, "查询一条数据结果");
        if (res.data.code === 200) {
          this.role = res.data.list;
          //给角色权限赋值，将menus的返回值设置给当前角色权限
          this.$refs.tree.setCheckedKeys(this.role.menus.split(","));
          //将查看到的id赋值给列表
          this.role.id = id;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
     //封装一个修改事件
    update(formName) {
      //this.$refs.tree.getCheckedKeys()取值为数组格式[1,2,3]，我们要的是用逗号分开"1,2,3"
      //console.log(this.$refs.tree.getCheckedKeys(), "通过key获取节点（id）");
      //修改方法执行，调取validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          //调取添加列表接口
          this.role.menus = this.$refs.tree.getCheckedKeys().join(",");
          // console.log(this.role,'角色列表');
          //调取封装好的添加角色列表接口
         editRole(this.role).then(res => {
            // console.log(res,'修改成功的响应');
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框并清空（重置）内容
              this.cancle();
              //重新获取列表(相当于调用一次列表（在仓库掉角色的行动）)
              // 发现数据还是没有渲染，因为行动里面稚时打印数据，但并没有赋值
              this.getRoleListAction();
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
  },
   
  props: ["addInfo"]
};
</script>

<style  lang="" scoped>
</style>
