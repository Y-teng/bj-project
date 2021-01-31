<template>
  <div>
    <!-- 专门用于列表渲染 -->
    <el-table
   
      :data="getGoodsList"
      border
      style="width: 100%"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="商品编号" width="140" ></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="140"></el-table-column>
      <el-table-column prop="price" label="商品价格" width="140"></el-table-column>
      <el-table-column prop="market_price" label="市场价格" width="140"></el-table-column>
      <el-table-column label="图片" width="140" >
        <template slot-scope="item">
          <div v-if="item.row.pid!=0">
            <img
              class="img"
              :src="item.row.img?$imgUrl+item.row.img:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3362606401,1751985198&fm=26&gp=0.jpg'"
              alt
            />
          </div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column label="是否新品" >
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.isnew == 1" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖" >
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.ishot == 1" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="item">
          <div>
            <el-button type="primary" @click="edit(item.row.id)" size="small">编辑</el-button>
            <el-button type="danger" @click="del(item.row.id)" size="small">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 
      background	是否为分页按钮添加背景色	boolean	—	false
page-size	每页显示条目个数，支持 .sync 修饰符	number	—	10
total	总条目数	number	—	—
current-change	currentPage 改变时会触发	当前页
    -->
    <el-pagination
      :page-size="getGoodsSize"
      background
      layout="prev, pager, next"
      :total="getCountNum"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
//引入接口文档
import { deleteGoods } from "../../util/axios";
export default {
  data() {
    return {};
  },
  mounted() {
    //组件一加载触发这个获取用户列表的行动
    this.getGoodsListAction();
    //触发总条数行动
    this.getCountAction();
  },
  computed: {
    //store模块添加了命名空间，所以要修改名字
    ...mapGetters({
      getGoodsList: "goods/getGoodsList",
      getGoodsSize: "goods/getGoodsSize",
      getCountNum: "goods/getCountNum"
    })
  },

  methods: {
    ...mapActions({
      getGoodsListAction: "goods/getGoodsListAction",
      getCountAction: "goods/getCountAction",
      changePageAction: "goods/changePageAction"
    }),
    //切换页码触发的事件
    changePage(n) {
      console.log(n, "当前页码数");
      this.changePageAction(n);
    },
    //封装编辑事件，传递id给role这个父组件
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
          deleteGoods({
            id
          }).then(res => {
            //  console.log(res, "删除接口");
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //当列表删除成功触发行动
              this.getGoodsListAction();
              //重新调取总条数
              this.getCountAction();
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
