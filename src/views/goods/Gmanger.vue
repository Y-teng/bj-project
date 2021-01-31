<template>
  <div>
    <el-bread></el-bread>
    <el-button type="primary" @click="toOpen" plain size="small">添加</el-button>
    <!-- 弹框渲染 -->
    <add-info  ref="vAdd" :addInfo="addInfo" @cancel='cancel'></add-info>
    <!-- 列表渲染 -->
    <m-list  @edit='edit'></m-list>
  </div>
</template>

<script>
import mList from "./goodslist"; //引入列表
import addInfo from "./addInfo"; //引入弹框
export default {
  data() {
    return {
      addInfo:{
      isShow:false,//控制弹框显示隐藏
      isAdd:true//用于控制添加或编辑 true是添加
      }

    };
  },
  components: {
    mList,
    addInfo
  },
  methods: {
    //点击添加按钮，出现弹框
    toOpen() {
      //打开弹框
      this.addInfo.isShow = true
      //告诉弹框你是添加
      this.addInfo.isAdd =true
    },
    // 子传父
   cancel(e){
      console.log(e,'子组件修改父组件的数据');
      this.addInfo =e
    },
    //封装一个编辑事件
    edit(e){
      // console.log(this.$refs.vAdd,'子组件的实例');
      //打开编辑弹框
      this.addInfo.isShow =true
      //告诉弹框你是编辑
      this.addInfo.isAdd = false
      this.$refs.vAdd.lookUp(e)
      
    }
  }
};
</script>

<style  lang="stylus" scoped>
.el-button {
  margin-bottom: 10px;
}
</style>
