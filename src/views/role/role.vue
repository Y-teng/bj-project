<template>
  <div>
    <!-- 面包屑 -->
    <el-bread></el-bread>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="toOpen" plain>添加</el-button>
    <!-- 弹框渲染 -->
    <role-add  ref="vDialog" :addInfo="addInfo" @cancle="cancle"></role-add>
    <!-- 数据展示 -->
    <r-list @edit='edit' ></r-list>
  </div>
</template>

<script>
import rList from "./rlist";
import roleAdd from "./roleadd";
export default {
  data() {
    return {
      addInfo: {
        isShow: false, //用于控制子组件弹框的显示隐藏  false是隐藏
        isAdd: true, //是否是添加还是编辑 true是添加
      }
    };
  },
  components: {
    rList,
    roleAdd
  },
  methods: {
    //点击添加按钮出现弹框
    toOpen() {
      //打开弹框
      this.addInfo.isShow = true;
      //告诉弹框你是添加
      this.addInfo.isAdd = true;
    },
    //封装一个改变isShow状态的自定义取消事件
    cancle(e) {
      this.addInfo= e;
    },
    //封装一个编辑事件,前提是查到当前id的数据
    edit(e){
    //打开编辑弹框
    this.addInfo.isShow=true;
    //告诉弹框你是编辑
    this.addInfo.isAdd=false
    //调用查询方法
    this.$refs.vDialog.lookInfo(e)
    }
  }
};
</script>

<style  lang="stylus" scoped>
.el-button {
  margin-bottom: 10px;
}
</style>
