<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加商品' : '编辑商品'"
      center
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
      @opened="createEditor"
    >
      <el-form :model="goodsForm" :rules="rules" ref="ruleForm">
        <el-form-item label="一级分类：" prop="first_cateid" :label-width="formLabelWidth">
          <el-select v-model="goodsForm.first_cateid" @change="changeCate(false)" placeholder="请选择">
            <el-option
              v-for="item in getCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类：" prop="second_cateid" :label-width="formLabelWidth">
          <el-select v-model="goodsForm.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secondCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="goodsname" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格：" prop="price" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价格：" prop="market_price" :label-width="formLabelWidth">
          <el-input v-model="goodsForm.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <!-- 
            上传视图 
            action	必选参数，上传的地址	string
            on-preview	点击文件列表中已上传的文件时的钩子	function(file)	—	—
            on-remove	文件列表移除文件时的钩子	function(file, fileList)
            
            on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
            list-type	文件列表的类型
            auto-upload	是否在选取文件后立即进行上传 默认是true 
            file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]	array
            limit	最大允许上传个数	number
            on-exceed	文件超出个数限制时的钩子	function(files, fileList)
          -->
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onChange"
            :file-list="fileList"
            :limit="1"
            :on-exceed=" handleExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 预览展示 -->
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品规格：" prop="specsid" :label-width="formLabelWidth">
          <el-select v-model="goodsForm.specsid" @change="changeSpecs" placeholder="请选择">
            <el-option
              v-for="item in getSpecsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性：" prop="specsattr" :label-width="formLabelWidth">
          <el-select multiple v-model="goodsForm.specsattr" placeholder="请选择">
            <el-option v-for="item in specsArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品：" :label-width="formLabelWidth">
          <el-radio v-model="goodsForm.isnew" :label="1">是</el-radio>
          <el-radio v-model="goodsForm.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖：" :label-width="formLabelWidth">
          <el-radio v-model="goodsForm.ishot" :label="1">是</el-radio>
          <el-radio v-model="goodsForm.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="商品描述：" :label-width="formLabelWidth">
          <div id="editor"></div>
        </el-form-item>

        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="goodsForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="addInfo.isAdd" @click="add('ruleForm')" type="primary">确 定</el-button>
        <el-button v-else @click="update('ruleForm')" type="primary">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入富文本编辑器插件
import E from "wangeditor";
//引入接口文档
import { goodsAdd, GoodsInfo, editGoods } from "../../util/axios";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      editor: null, //editor 初始值为空
      formLabelWidth: "120px", //label宽度
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览的弹框默认是false
      imgUrl: "", //文件图片的配置对象
      fileList: [], //文件列表
      secondCate: [], //二级分类数据列表
      specsArr: "", //规格属性数组
      //表单项
      goodsForm: {
        first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        price: 0, //商品价格
        market_price: 0, //市场价格
        img: "", //商品图片（文件）
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: "", //商品规格属性
        isnew: 1, //是否新品  1是新品 2是否
        ishot: 1, //是否热卖推荐 1是热卖 2是否
        status: 1 //状态1正常2禁用
      },

      //表单验证
      rules: {
        //一级分类
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "blur" }
        ],
        //二级分类
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "blur" }
        ],
        //商品名称
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2到 8 个字符", trigger: "blur" }
        ],
        //价格验证
        price: [{ required: true, trigger: "blur", message: "请输入价格" }], //, validator:validatePrice
        //市场价格验证
        market_price: [
          { required: true, trigger: "blur", message: "请输入市场价格" }
        ] //, validator:validatePrice
      }
    };
  },
  computed: {
    ...mapGetters({
      getCateList: "cate/getCateList", //分类列表
      getSpecsList: "specs/getSpecsList" //规格列表
    })
  },
  mounted() {
    //商品管理列表一触发就调用分类列表行动
    this.getCateListAction();
    //商品管理列表一触发就调用规格列表行动
    this.getSpecsListAction();
  },
  methods: {
    //封装一个一级分类切换事件
    changeCate(n) {
      console.log(n, "切换的状态控制");

      // console.log(this.goodsForm.first_cateid, "一级分类id");
      //当v-model变化一级分类id和分类列表一致的时候，是否可以找到它所在的那条数据以及索引
      //findIndex
      // let index =  this.getCateList.findIndex((item)=>{
      //     //当条件匹配返回当前条件匹配的索引
      //     console.log(item,'哈哈哈哈哈');
      //      return this.goodsForm.first_cateid == item.id
      //   })
      let index = this.getCateList.findIndex(
        item => this.goodsForm.first_cateid == item.id
      );
      this.secondCate = this.getCateList[index].children;
      //判断一下才清空，当我切换时候我让他清空，反之，不为空
      if (!n) {
        this.goodsForm.second_cateid = "";
      }

    
    },
    //封装一个规格属性列表切换事件
    changeSpecs() {
      // console.log(this.goodsForm.specsid, "商品规格编号");
      let index = this.getSpecsList.findIndex(
        item => this.goodsForm.specsid == item.id
      );
      this.specsArr = this.getSpecsList[index].attrs;
      // console.log(this.specsArr, "规格属性");
      //当用户切换规格的时候,把双向数据绑定规格属性置空
      this.goodsForm.specsattr = [];
    },
    ...mapActions({
      getCateListAction: "cate/getCateListAction",
      getSpecsListAction: "specs/getSpecsListAction",
      getGoodsListAction: "goods/getGoodsListAction",
      getCountAction: "goods/getCountAction"
    }),

   //打开弹框之后再创建编辑器
    createEditor() {
      console.log(new E("#editor"), "插件的配置项");
      //实例化富文本编辑器
      this.editor = new E("#editor");
      //创建并初始化 把des 初识描述属性赋值
      this.editor.create();
      //初始化之后每次都重新赋空
      this.editor.txt.html(this.goodsForm.description);
      //取值 this.editor.txt.html()
    },
 

 


    //文件上传的限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //当文件改变时，触发的函数方法
    onChange(file) {
      // console.log(file, "文件的属性配置");
      this.imgUrl = file.raw;
    },
    //预览时的删除
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    //放大预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //封装一个取消事件
    //取消去改变父组件的数据
    cancel() {
      //关闭弹框！！！！
      this.$emit("cancel", {
        isShow: false,
        isAdd: this.addInfo.isAdd
      });
      //调用重置事件
      this.reset();
    },
    //封装一个重置事件
    reset() {
      this.goodsForm = {
        first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        price: 0, //商品价格
        market_price: 0, //市场价格
        img: "", //商品图片（文件）
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: "", //商品规格属性
        isnew: 1, //是否新品  1是新品 2是否
        ishot: 1, //是否热卖推荐 1是热卖 2是否
        status: 1 //状态1正常2禁用
      };
      this.fileList = [];
    },
    //封装一个查看一条数据事件
    lookUp(id) {
      //调取查看一条数据接口
      GoodsInfo({
        id
      }).then(res => {
        console.log(res, "查看一条数据");
        if (res.data.code == 200) {
          this.goodsForm = res.data.list;
          this.goodsForm.id = id;
          //当查询数据调取接口，给fileList数组赋值(图片)
          this.fileList = this.goodsForm.img
            ? [{ url: this.$imgUrl + this.goodsForm.img }]
            : [];
          //规格必须从字符串转化为数组
          this.goodsForm.specsattr = res.data.list.specsattr.split(",");
          //获取富文本框内容
          this.editor.txt.html(this.goodsForm.description);
          //重新执行一级分类
          this.changeCate(true);
        
        }
      });
    },

    /* 
    enctype 类型： 
      application/x-www-form-urlencoded	在发送前编码所有字符（默认）
      multipart/form-data	不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。

      如果我们有上传文件，那么我们的编码格式，就必须是formData格式，否则浏览器无法解析
    */
    //封装修改商品事件
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // // 对于有上传文件的数据，我们要用构造函数FormData去转化
          // let file = new FormData();
          // // FormData 数据的添加只能用append ,获取值也只能用get方式获取
          // // 循环添加 对象 转化成了 FormData这种格式
          // for (let i in this.goodsForm) {
          //   file.append(i, this.goodsForm[i]);
          // }
          //针对于图片进行一下判断
          //this.imgUrl 它是图片对象配置。如果你修改的时候，修改了它，那么把它重新传到接口中，如果本次修改你没有修改它，那么就沿用上一次数据库的值
          //this.imgUrl = this.imgUrl ?this.imgUrl : this.cateForm.img
          this.goodsForm.img = this.imgUrl ? this.imgUrl : this.goodsForm.img;

          //规格
          this.goodsForm.specsattr = this.goodsForm.specsattr
            ? this.goodsForm.specsattr.join(",")
            : "";
          //把富文本编辑器的内容直接赋值给 商品描述
          //this.editor.txt.html()  取出富文本编辑器的内容
          this.goodsForm.description = this.editor.txt.html();

          editGoods(this.goodsForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getGoodsListAction();
              //重新调取下总数（当你删除成功或者添加成功分页也要变化，只有总数变化之后，分页才能跟着变化
              this.getCountAction();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //封装添加商品事件
    add(formName) {
      // console.log(this.goodsForm, "表单体");
      this.$refs[formName].validate(valid => {
        if (valid) {
          //图片
          this.goodsForm.img = this.imgUrl;
          //对于有上传文件的数据，我们要用构造函数FormData去转化(两种方式，一种写在视图中，一种写在axios接口添加列表中)

          console.log(this.goodsForm, "提交的表单体");

          //富文本域

          //规格
          // console.log(this.goodsForm.specsattr, "规格属性的多选项");
          this.goodsForm.specsattr = this.goodsForm.specsattr
            ? this.goodsForm.specsattr.join(",")
            : "";
          //把富文本编辑器的内容直接赋值给 商品描述
          //this.editor.txt.html()  取出富文本编辑器的内容
          this.goodsForm.description = this.editor.txt.html();
          goodsAdd(this.goodsForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getGoodsListAction();
              //重新调取下总数（当你删除成功或者添加成功分页也要变化，只有总数变化之后，分页才能跟着变化
              this.getCountAction();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  props: ["addInfo"]
};
</script>

<style lang="" scoped></style>
