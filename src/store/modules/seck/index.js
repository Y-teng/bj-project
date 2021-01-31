//引入接口模块
import {getSeckList} from '../../../util/axios'
// 创建一个模块state
const state ={
    seckList:[]
}

// 创建一个模块getters
const getters={
    getSeckList(state){
    return state.seckList
    }
}
// 创建一个模块mutations

const mutations={
  REQ_SECKLIST(state,payload){
    state.seckList=payload
  }
}

// 创建一个模块actions

const actions={
//封装一个获取秒杀活动的行动
  getSeckListAction({commit}){
    //调用传输过来的接口
    getSeckList()
    .then(res=>{
        // console.log(res,'秒杀活动');
        if(res.data.code===200){
          //提交一个mutation
          commit('REQ_SECKLIST',res.data.list)
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