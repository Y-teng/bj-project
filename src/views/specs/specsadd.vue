<template>
  <div>
    <!-- 弹框 
    visible	是否显示 Dialog，支持 .sync 修饰符
    
    -->
    <el-dialog
      center
      :before-close="cancle"
      :title="addInfo.isAdd ? '添加规格' : '编辑规格'"
      :visible.sync="addInfo.isShow"
    >
      <el-form :model="specsForm" center :rules="rules" ref="ruleForm">
        <el-form-item prop="specsname" label="规格名称：" :label-width="formLabelWidth">
          <el-input v-model="specsForm.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          :key="index"
          v-for="(item,index) in attrArr"
          label="规格属性："
          :label-width="formLabelWidth"
        >
          <el-input class="shu" v-model="item.value" autocomplete="off"></el-input>
          <el-button v-if="index===0" type="primary" @click="addAttr">新增规格属性</el-button>
          <el-button v-else @click="delAttr(item)" type="danger">删除</el-button>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="specsForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button v-if="addInfo.isAdd" type="primary" @click="add('ruleForm')">确 定</el-button>
        <el-button v-else type="primary" @click="update('ruleForm')">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入行动 获取规格列表
import { mapActions } from "vuex";
//引入添加规格列表接口
import { specsAdd, editSpecs, SpecsInfo } from "../../util/axios";
export default {
  data() {
    return {
      //动态表单项
      attrArr: [
        {
          value: ""
        }
      ],
      //规格表单
      specsForm: {
        specsname: "", //商品规格名称
        attrs: "", //商品规格属性值
        status: 1 //状态1正常2禁用
      },
      rules: {
        specsname: [
          { required: true, message: "请输入规格名称", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2到 15 个字符", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px"
    };
  },

  methods: {
    //封装一个动态添加表项
    addAttr() {
      //最多只能添加6次
      if (this.attrArr.length <= 5) {
        //给attrArr 动态添加数据
        this.attrArr.push({
          value: ""
        });
      } else {
        this.$message.warning("最多只能添加五条属性");
      }
    },
    //封装弹框删除事件
    delAttr(item) {
      var index = this.attrArr.indexOf(item);
      if (index !== -1) {
        this.attrArr.splice(index, 1);
      }
    },
    ...mapActions({
      getSpecsListAction: "specs/getSpecsListAction",
      getCountAction: "specs/getCountAction"
    }),
    cancle() {
      //封装取消事件 子传父
      this.$emit("cancle", {
        isShow: false,
        isAdd: this.addInfo.isAdd
      }),
        //点击取消调用重置规格列表,但是节点并没有被清空，因此需要key的set方法
        this.reset();
    },
    //封装一个重置事件
    reset() {
      this.specsForm = {
        specsname: "", //商品规格名称
        attrs: "", //商品规格属性值
        status: 1 //状态1正常2禁用
      };
      //重置规则验证
      this.$refs["ruleForm"].resetFields();
      this.attrArr = [
        {
          value: ""
        }
      ];
    },
    //封装一个添加事件
    add(formName) {
      //this.$refs.tree.getCheckedKeys()取值为数组格式[1,2,3]，我们要的是用逗号分开"1,2,3"
      //console.log(this.$refs.tree.getCheckedKeys(), "通过key获取节点（id）");
      //添加方法执行，调取validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          //调取添加接口
          /* 
          attrArr = [{value:'111'},{value:'222'},{value:'333'}]
          先生成新数组，然后转化成字符串
          attrs = '11,222,333'
          */
          this.specsForm.attrs = this.attrArr.map(item => item.value).join(",");
          console.log(this.specsForm, "规格对象");

          specsAdd(this.specsForm).then(res => {
            // console.log(res,'添加成功的响应');
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框并清空（重置）内容
              this.cancle();
              //重新获取列表(相当于调用一次列表（在仓库掉规格的行动）)
              // 发现数据还是没有渲染，因为行动里面稚时打印数据，但并没有赋值
              this.getSpecsListAction();
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
    //封装一个查询一条数据事件
    lookInfo(id) {
      //调取查询接口，引入接口
      SpecsInfo({ id }).then(res => {
        console.log(res, "查询一条数据结果");
        if (res.data.code === 200) {
          this.specsForm = res.data.list[0];
          //将查看到的id赋值给列表
          this.specsForm.id = id;
          //循环数组取出数据，设置到input框
          this.specsForm.attrs.map((item,index)=>{
            console.log(item,'数组中的每一项');
            if(index==0){
             this.attrArr[0].value=item
            }else{
              this.attrArr.push({
                value:item
              })
            }
            
          })
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个修改事件
    update(formName) {
      //修改方法执行，调取validate验证器
      //当前密码如果想修改，重新赋值即可，若为空就是上一步的值
      this.$refs[formName].validate(valid => {
        if (valid) {
             this.specsForm.attrs = this.attrArr.map(item => item.value).join(",");
          //调取封装好的修改规格列表接口
          editSpecs(this.specsForm).then(res => {
            // console.log(res,'修改成功的响应');
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //添加成功后关闭弹框并清空（重置）内容
              this.cancle();
              //重新获取列表(相当于调用一次列表（在仓库调规格的行动）)
              this.getSpecsListAction();
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

<style  lang="" scoped>
.shu {
  width: 75%;
  margin-right: 10px;
}
</style>
