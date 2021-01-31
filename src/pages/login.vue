<template>
  <div class="login">
    <!-- 
      show-password	是否显示切换密码图标
     clearable  可清空
     -->
    <el-form :model="loginList" label-width="100px"  :rules='rules' ref="ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input  show-password    clearable v-model="loginList.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input show-password    clearable  v-model="loginList.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button  type="primary" @click='login("ruleForm")' >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {userLogin}  from '../util/axios'
export default {
  data() {
    return {
      loginList: {
        username: "", //用户名
        password: "" //password
      },
      rules:{//规则验证
           username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min:3, max: 10, message: '长度在3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],

      }
    };
  },
  methods:{
    login(formName){
      // console.log(this.$refs.ruleForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
          //正常调取登录接口，但是这个用户信息要等用户管理创建成功之后才有，现在模拟登录Ⅰ
         userLogin(this.loginList)
         .then(res=>{
           if(res.data.code==200){
             this.$message.success(res.data.msg)
             //把登录结果存储到会话存储中
             sessionStorage.setItem('loginInfo',JSON.stringify(res.data.list))
             //跳转到首页
             this.$router.push('/home')
           }else{
           this.$message.error(res.data.msg)
           }
           console.log(res,'登录结果');
           
         })
        
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  }
};
</script>

<style  lang="stylus" scoped>
@import ('../stylus/index.styl');

.login 
  width  100vw
  height 100vh
  overflow hidden

  .el-form 
      width 40%
      margin auto
      margin-top 300px
      background-color white
      text-align  center

  .el-button--primary
      background-color red
      border 1px solid white 
      font-weight bold
      
</style>
