<template>
  <div>
    <!-- 专门用于列表渲染 -->
    <el-table :data="getMangerList" border style="width: 100%">
      <el-table-column prop="uid" label="管理员编号" width="180"></el-table-column>
      <el-table-column prop="username" label="管理员名称" width="180"></el-table-column>
      <el-table-column prop="rolename" label="所属角色" width="180"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status==1" type="success" plain>启用</el-tag>
            <el-tag v-else type="danger" plain>禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" @click="edit(item.row.uid)">编辑</el-button>
            <el-button type="danger" @click="del(item.row.uid)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
    page-size	每页显示条目个数，支持 .sync 修饰符	number	—	10
    total	总条目数	number	
    page-count	总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性	Number
    current-change	currentPage 改变时会触发
    
    -->
    <el-pagination  :page-size='getMangerSize'  background layout="prev, pager, next" :total="getCountNum" @current-change='changePage'	></el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//引入封装好的删除管理员列表接口
import { deleteManger } from "../../util/axios";
export default {
  data() {
    return {};
  },
  computed: {
    //store模块添加了命名空间，因此要修改名字
    ...mapGetters({
      getMangerList:"manger/getMangerList",
      getMangerSize:'manger/getMangerSize',
      getCountNum:'manger/getCountNum'
    })
  },
  mounted() {
    //组件一家在出发这个获取用户列表的行动
    this.getMangerListAction();
    //触发总条数行动
    this.getCountAction()

  },
  methods: {
    //页面一加载就触发行动，因此要挂载mounted
    ...mapActions({
      getMangerListAction: "manger/getMangerListAction",
      getCountAction:'manger/getCountAction',
      changePageAction:'manger/changePageAction'
    }),
    //切换页码触发的事件
    changePage(n){
   console.log(n,'当前页码数');
   this.changePageAction(n)

   
    },
    //封装编辑事件，传递id给role这个父组件
    edit(uid) {
      this.$emit("edit", uid);
    },
    //封装一个删除事件,最好带有消息提示的询问
    del(uid) {
      this.$confirm("你确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除接口
          deleteManger({ uid }).then(res => {
            console.log(res, "删除管理员"); //必须带id参数
            //如果删除成功那么就提示删除成功
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //删除成功后并且要重新调取列表
              this.getMangerListAction();
              //重新调取总条数
              this.getCountAction()
              //否则删除失败
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style  lang="stylus" scoped>
.el-button {
  margin-bottom: 10px;
}
.el-pagination
  float  right
  margin-top 10px

</style>
