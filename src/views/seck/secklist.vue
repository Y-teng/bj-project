<template>
  <div>
    <!-- 专门用于列表渲染 -->
    <el-table :data="seckList" border style="width: 100%">
      <el-table-column prop="title" label="活动名称" width="180"></el-table-column>
      <el-table-column  label="状态">
      <template slot-scope="item">
        <div>
          <el-tag v-if="item.row.status==1" type="success" plain>启用</el-tag>
          <el-tag v-else type="danger" plain>禁用</el-tag>
        </div>
      </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary"  @click='edit(item.row.id)' size='small'>编辑</el-button>
            <el-button @click='del(item.row.id)' type="danger"  size='small' >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
//引入封装好的删除角色列表接口
import { getSeckDelete } from "../../util/axios";
export default {
  data() {
    return {};
  },
  computed: {
    //store模块添加了命名空间，因此要修改名字
    ...mapGetters({
      seckList:'seck/getSeckList'
    })
  },
  mounted() {
    //组件一加载触发行动
    this.getSeckListAction()
  },
  methods: {
    //页面一加载就触发行动，因此要挂载mounted
    ...mapActions({
      getSeckListAction:"seck/getSeckListAction"
    }),
     //封装一个编辑传id事件
    edit(id){
      this.$emit('edit',id)
    },
    //封装一个删除事件
    del(id){
      this.$confirm("你确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          //调取删除接口
          getSeckDelete({id})
          .then(res=>{
            //console.log(res, "删除角色"); //必须带id参数
            //如果删除成功那么就提示删除成功
            if (res.data.code==200){
              this.$message.success(res.data.msg);
            //  删除成功后并且要重新调取列表
              this.getSeckListAction()
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
  },
 
};
</script>

<style  lang="stylus" scoped>
.el-button {
  margin-bottom: 10px;
}
</style>
