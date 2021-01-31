<template>
  <div>
    <el-container>
      <el-header>
       <h2>小U大型后台管理系统</h2> 
          <div class="userInfo">
          <span>{{getUserInfo.username ? getUserInfo.username: []}}</span>
          <el-button @click="logout" type='danger' size='mini'>退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <v-nav></v-nav>
        </el-aside>
        <el-main>
          <!-- 二级路由出口 -->
          <router-view></router-view>
          
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vNav from "../components/vNav";
import {mapGetters,mapActions} from 'vuex'
export default {
  data() {
    return {};
  },
  components: {
    vNav
  },
    computed:{
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    ...mapActions(['changeUserInfoAction']),
    logout(){
      // 修改getUserInfo 的仓库状态 然后跳转到登录
      this.changeUserInfoAction(null)
      this.$router.push('/login')
    }
  },
};
</script>

<style  lang="" scoped>
@import url("../assets/css/index.css");
.el-main{
  text-align: unset;
}
.userInfo{
  position: absolute;
  top :0px;
  right :20px
}
</style>
