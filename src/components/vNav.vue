<template>
  <div>
    <!-- 
                    el-menu 属性 
                    default-active	当前激活菜单的 index
                    background-color 背景色
                     text-color 文本颜色
                     active-text-color 被激活的颜色
                     unique-opened	是否只保持一个子菜单的展开
                     router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
    -->
    <el-menu :default-active="defaultActive" router>
      <el-menu-item index="/home">
        <template slot="title">
          <i class="el-icon-menu"></i>首页
        </template>
      </el-menu-item>
      <el-submenu v-for="item in navList" :index="item.id.toString()"  :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="list in item.children" :key="list.id" :index="list.url">{{list.title}}</el-menu-item>
       
        </el-menu-item-group>
      </el-submenu>
    
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultActive: "/home",
      navList:[]
    };
  },
  mounted() {
    this.defaultActive = this.$route.path;
     if(sessionStorage.getItem('loginInfo'))
     {
       this.navList=JSON.parse(sessionStorage.getItem('loginInfo')).menus
     }
  }
};
</script>

<style  lang="stylus" scoped>
.el-menu
    background none






</style>
