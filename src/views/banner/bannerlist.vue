<template>
  <div>
    <!-- 专门用于列表渲染 -->
    <el-table
      :data="bannerList"
      border
      style="width: 100%"
      row-key="id"
      default-expand-all
    >
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="title" label="轮播图标题" width="180"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="item">
          <div >
            <img
              class="img"
              :src="item.row.img?$imgUrl+item.row.img:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3362606401,1751985198&fm=26&gp=0.jpg'"
              alt
            />
          </div>
        
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" @click="edit(item.row.id)" size="small">编辑</el-button>
            <el-button type="danger" @click="del(item.row.id)" size="small">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
//引入接口文档
import { getBannerDelete } from "../../util/axios";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      bannerList: "banner/getBannerList"
    })
  },
  mounted() {
    //当列表渲染触发行动
    this.getBannerList();
  },
  methods: {
    ...mapActions({
      getBannerList: "banner/getBannerListAction"
    }),
    //封装编辑事件
    edit(id) {
      //告诉父组件，我要打开编辑弹框顺便传一个id
      this.$emit("edit", id);
    },
    //封装删除事件
    del(id) {
      this.$confirm("你确定要删除吗？？？？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除接口
          getBannerDelete({
            id
          }).then(res => {
            //  console.log(res, "删除接口");
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //当列表删除成功触发行动
              this.getBannerList();
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

<style lang="" scoped>
.img {
  width: 120px;
  height: 120px;
}
</style>
