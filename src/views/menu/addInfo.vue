<template>
  <div>
    <!-- 弹框内容 
        visible   是否显示 Dialog，支持 .sync 修饰符	boolean
        center	是否对头部和底部采用居中布局	boolean
        
    -->
    <el-dialog :title="addInfo.isAdd?'添加菜单':'编辑菜单'" center :visible.sync="addInfo.isShow">
      <el-form :model="menu" :rules="rules" ref="ruleForm">
        <el-form-item label="菜单名称：" prop="title" :label-width="formLabelWidth">
          <el-input v-model="menu.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="pid" :label-width="formLabelWidth">
          <el-select v-model="menu.pid" placeholder="请选择">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in menuList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型： " :label-width="formLabelWidth">
          <el-radio v-model="menu.type" :label="1">目录</el-radio>
          <el-radio v-model="menu.type" :label="2">菜单</el-radio>
        </el-form-item>
        <el-form-item v-if="menu.type==1" label="菜单图标：" :label-width="formLabelWidth">
          <!--循环菜单图标供用户选择 -->
          <el-select v-model="menu.icon" placeholder="请选择">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option v-for="item in iconList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else label="菜单地址：" :label-width="formLabelWidth">
          <!--循环菜单路由地址供用户选择 -->
          <el-select v-model="menu.url" placeholder="请选择">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in indexRoutes "
              :key="item.path"
              :label="item.name"
              :value="item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="menu.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button v-if="addInfo.isAdd" @click="add('ruleForm')" type="primary">确 定</el-button>
        <el-button v-else @click="edit('ruleForm')" type="primary">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入接口文档
import { addMenu,menuInfo,editMenu } from "../../util/axios";
//引入二级路由配置项给菜单地址用
import { indexRoutes } from "../../router";

// console.log(indexRoutes);

import {mapActions,mapGetters}  from 'vuex'



export default {
  data() {
    return {
      // 添加菜单列表
      menu: {
        pid: 0, //上级分类编号
        title: "", //标题
        icon: "", //图标
        type: 1, //类型1目录2菜单
        url: "", //菜单地址
        status: 1 //状态1正常2禁用
      },
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        pid: [{ required: true, message: "请选择上级菜单", trigger: "change" }]
      },
      formLabelWidth: "120px", //label宽度
      options: [
        {
          //假数据模拟菜单列表
          value: "1",
          label: "系统管理"
        },
        {
          value: "2",
          label: "商城管理"
        }
      ],
      //图标列表
      iconList: [
        "el-icon-s-tools",
        "el-icon-setting",
        "el-icon-s-goods",
        "el-icon-goods"
      ],
      //菜单地址（路由配置项）
      indexRoutes: indexRoutes
    };
  },

  props: ["addInfo"],
  computed:{
...mapGetters({
  'menuList':'menu/getMenuList'
})
  },
  methods: {
    ...mapActions({
      'getMenuList':'menu/getMenulistAction'
    }),
    //取消事件，改变父组件数据，因此是子传父
    cancle() {
      //关闭弹框
      this.$emit("cancle",{
        isShow:false,
        isAdd:this.addInfo.isAdd
      });
      this.reset();
    },
    //清空上一次数据的重置方法
    reset() {
      this.menu = {
        pid: 0, //上级分类编号
        title: "", //标题
        icon: "", //图标
        type: 1, //类型1目录2菜单
        url: "", //菜单地址
        status: 1 //状态1正常2禁用
      };
    },
    //封装一个查看一条数据事件
    lookup(id){
    // console.log(id,'每条数据id');
    //调取查看一条数据接口
    menuInfo({id})
    .then(res=>{
      console.log(res);
      if(res.data.code==200){
        this.menu=res.data.list;
        this.menu.id=id
      }
      
    })
    
    },
    //封装菜单事件，那么需要调取菜单接口==util文件夹去封装
    add(formName) {
      // 打印台验证了添加的数据可以得到，那么就需要连接数据库==调数据库接口文档
      console.log(this.menu, "表单体");
      //验证器，验证成功调取接口
      this.$refs[formName].validate(valid => {
        if (valid) {
          //写出响应方法后，还要传入数据this.menu与接口文档里面的data相照应
          addMenu(this.menu).then(res => {
            // console.log(res, "添加成功");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框以及重置数据
              this.cancle();
              //但是再次打开添加会保留上一次数据，因此需要清空（重置事件）
              //    this.reset()
              //但是点击取消数据还在，因此需要在给取消事件一个重置事件,当给取消事件添加重置事件后那么直接调用取消事件即可
              //重新调取接口列表,需要重新调用去methods里
              this.getMenuList()

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
     //封装添加菜单事件，那么需要调取菜单接口==util文件夹去封装
    edit(formName) {
      // 打印台验证了添加的数据可以得到，那么就需要连接数据库==调数据库接口文档
      console.log(this.menu, "表单体");
      //验证器，验证成功调取接口
      this.$refs[formName].validate(valid => {
        if (valid) {
          //写出响应方法后，还要传入数据this.menu与接口文档里面的data相照应
          editMenu(this.menu).then(res => {
            // console.log(res, "添加成功");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框以及重置数据
              this.cancle();
              //但是再次打开添加会保留上一次数据，因此需要清空（重置事件）
              //  this.reset()
              //但是点击取消数据还在，因此需要在给取消事件一个重置事件,当给取消事件添加重置事件后那么直接调用取消事件即可
              //重新调取接口列表,需要重新调用去methods里
              this.getMenuList()

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
  }
};
</script>

<style  lang="" scoped>
</style>
