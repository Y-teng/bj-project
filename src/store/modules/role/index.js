//引入接口模块
import {getRoleList} from '../../../util/axios'
// 创建一个模块state
const state ={
    roleList:[]
}

// 创建一个模块getters
const getters={
    getRoleList(state){
    return state.roleList
    }
}
// 创建一个模块mutations

const mutations={
  REQ_ROLELIST(state,payload){
    state.roleList=payload
  }
}

// 创建一个模块actions

const actions={
//封装一个获取角色列表的行动
  getRoleListAction({commit}){
    //调用传输过来的接口
    getRoleList()
    .then(res=>{
        // console.log(res,'角色列表');
        if(res.data.code===200){
          //提交一个mutation
          commit('REQ_ROLELIST',res.data.list)
        }
        
    })
 
  }
}


//导出模块

export default {
    state,
    mutations,
    getters,
    actions,
    namespaced:true //避免名字重复，用命名空间
}