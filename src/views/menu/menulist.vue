<template>
  <div>
    <!-- 专门用于列表渲染 -->
    <el-table :data="menuList" border style="width: 100%" row-key='id'  :tree-props="{children: 'children'}" >
      <el-table-column prop="id" label="菜单编号" width="180"></el-table-column>
      <el-table-column prop="title" label="菜单名称" width="180"></el-table-column>
      <el-table-column prop="pid" label="上级菜单"></el-table-column>
      <el-table-column prop="icon" label="菜单图标" width="180"></el-table-column>
      <el-table-column prop="url" label="菜单地址" width="180"></el-table-column>
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
            <!-- {{item.row}} -->
            <el-button type="primary" @click='edit(item.row.id)' size="small">编辑</el-button>
            <el-button type="danger"  @click="del(item.row.id)" size="small">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

//引入接口文档
import { delMenu } from "../../util/axios";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      menuList: "menu/getMenuList"
    })
  },
  mounted() {
    this.getMenuList();
  },

  methods: {
    ...mapActions({
      getMenuList: "menu/getMenulistAction"
    }),
    //封装编辑事件
    edit(id){
     //告诉父组件我要打开编辑弹框顺便传一个id
     this.$emit('edit',id)
    },
    //封装删除事件
    del(id) {
      this.$confirm("你确定要删除嘛？？？, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除接口
            
          delMenu({
            id
          }).then(res => {
            //  console.log(res, "删除接口");
            if(res.data.code===200){
              this.$message.success(res.data.msg);
              //当列表删除成功触发行动
              this.getMenuList()

            }else{
                this.$message.error(res.data.msg)
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

<style  lang="" scoped>
</style>
