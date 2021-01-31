//引入接口文件
import {getBannerList} from '../../../util/axios'
//创建一个 模块 state
const state = {
    bannerList:[]
}
//创建一个 模块 getters
const getters ={
    getBannerList(state){
        return state.bannerList
    }
}
//创建一个 模块 mutations
const mutations ={
    //获取轮播图管理
    REQ_BANNERLIST(state,padload){
        state.bannerList= padload
    }
}
//创建一个 模块 action
const actions = {
    //封装一个获取轮播图管理的行动
    getBannerListAction({commit}){
        getBannerList()
        .then(res=>{
            console.log(res,'轮播图管理');
            if(res.data.code===200){
                //提交一个mutations
                commit('REQ_BANNERLIST',res.data.list)
            }
        })
    }
}

//导出创建好的这些属性
export default {
    state,
    getters,
    mutations,
    actions,
    namespaced:true
}
