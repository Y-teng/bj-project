//引入接口文件
import { getMenuList } from '../../../util/axios'

// 创建一个模块state
const state = {
    menuList: []
}
// 创建一个模块getters
const getters = {
    getMenuList(state) {
        return state.menuList
    }
}
// 创建一个模块mutations
const mutations = {
    //获取菜单列表
    REQ_MENULIST(state,payload){
      state.menuList=payload
    }
}
// 创建一个模块actions
const actions = {
    // 封装一个获取菜单列表的行动
    getMenulistAction({ commit }) {
        //接口名称
        getMenuList()
            .then(res => {
                if (res.data.code === 200) {
                  commit('REQ_MENULIST',res.data.list)
                }
                console.log(res, '菜单列表');



            })
    }
}


// 导出创建好的这些模块
export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true //避免名字重复，用命名空间
}