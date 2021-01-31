// 引入接口
import { getMemberList} from '../../../util/axios'
//创建一个模块state
const state = {
    memberList: [],
}

//创建一个模块getters
const getters = {
     //封装了一个state中菜单列表
    getMemberList(state) {
        return state.memberList
    },
}
//创建个模块mutations
const mutations = {
    REQ_MEMBERLIST(state,payload){
        state.memberList=payload
    },
}
//创建一个模块actions
const actions = {
      getMemberListAction({commit}){
        getMemberList()
        .then(res=>{
            if(res.data.code===200){
                //提交一个mutation以及携带参数，参数就是返回的数据
                commit("REQ_MEMBERLIST",res.data.list)
            }
        })
        .catch(err=>{
            console.log(err,'错误响应')
        })
    },
}
export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true,
}