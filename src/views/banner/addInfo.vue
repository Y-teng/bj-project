<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加轮播图' : '编辑轮播图'"
      center
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
    >
      <el-form :model="bannerForm" :rules="rules" ref="ruleForm">
        <el-form-item label="标题：" prop="title" :label-width="formLabelWidth">
          <el-input v-model="bannerForm.title" autocomplete="off"></el-input>
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
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="bannerForm.status"
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
//引入接口文档
import { getBannerAdd, getBannerInfo, getBannerEdit } from "../../util/axios";
import { mapActions, mapGetters } from "vuex";
export default {
   props: ["addInfo"],
  data() {
    return {
      
      //分类添加表单
      bannerForm: {
        title: "", //轮播图名称
        img: "", //图片(文件)
        status: 1 //状态1正常2禁用
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2到 8 个字符", trigger: "blur" }
        ],
  
      },
      formLabelWidth: "120px", //label宽度
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览的弹框默认是false
      imgUrl: "", //文件图片的配置对象
      fileList: [] //文件列表
    };
  },
  computed: {
    ...mapGetters({
      getBannerList: "banner/getBannerList"
    })
  },
    mounted() {
    this.getBannerListAction()
  },

  methods: {

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
      console.log(file, "文件的属性配置");
      this.imgUrl = file.raw;
    },
    //预览时的删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //放大预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    ...mapActions({
      getBannerListAction: "banner/getBannerListAction"
    }),
    //取消去改变父组件的数据
    cancel() {
      //关闭弹框！！！！
      this.$emit("cancel", {
        isShow: false,
        isAdd: this.addInfo.isAdd
      });
      this.reset();
    },
    //封装重置函数
    reset() {
      this.bannerForm = {
       title: "", //轮播图名称
        img: "", //图片(文件)
        status: 1 //状态1正常2禁用
      };
      //清空图片
         this.fileList = [];
       //重置规则验证
        this.$refs['ruleForm'].resetFields();
    },
    //封装一个查看一条数据事件
    lookUp(id) {
      //调取查看一条数据接口
      getBannerInfo({
        id
      }).then(res => {
        if (res.data.code == 200) {
          this.bannerForm = res.data.list;
          this.bannerForm.id = id;
          //当查询数据调取接口，给fileList数组赋值
          this.fileList = this.bannerForm.img
            ? [{ url: this.$imgUrl + this.bannerForm.img }]
            : "";
        }
      });
    },

    /* 
    enctype 类型： 
      application/x-www-form-urlencoded	在发送前编码所有字符（默认）
      multipart/form-data	不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。

      如果我们有上传文件，那么我们的编码格式，就必须是formData格式，否则浏览器无法解析
    */
    //封装修改分类事件
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //针对于图片进行一下判断
          //this.imgUrl 它是图片对象配置。如果你修改的时候，修改了它，那么把它重新传到接口中，如果本次修改你没有修改它，那么就沿用上一次数据库的值
          //this.imgUrl = this.imgUrl ?this.imgUrl : this.bannerForm.img
          this.bannerForm.img = this.imgUrl ? this.imgUrl : this.bannerForm.img;
          // 对于有上传文件的数据，我们要用构造函数FormData去转化
          let file = new FormData();
          // FormData 数据的添加只能用append ,获取值也只能用get方式获取
          // 循环添加 对象 转化成了 FormData这种格式
          for (let i in this.bannerForm) {
            file.append(i, this.bannerForm[i]);
          }
          getBannerEdit(file).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getBannerListAction();
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
    //封装添加分类事件
    add(formName) {
      console.log(this.bannerForm, "表单体");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bannerForm.img = this.imgUrl;
          //对于有上传文件的数据，我们要用构造函数FormData去转化(两种方式，一种写在视图中，一种写在axios接口添加列表中)
          // let file = new FormData();
          // // //FormData 数据的添加只能用append ,获取值也只能用get方式获取
          // // //循环添加 对象 转化成了 FormData这种格式
          // for (let i in this.bannerForm) {
          //   file.append(i, this.bannerForm[i]);
          // }
          // file.append('img',this.imgUrl)
          getBannerAdd(this.bannerForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getBannerListAction();
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
 
};
</script>

<style lang="" scoped></style>
