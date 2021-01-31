import Vue from 'vue'

import Vuex from 'vuex'


Vue.use(Vuex);

//引入menu模块
import menu from './modules/menu'
//引入role模块
import role from './modules/role'
//引入manger模块
import manger from './modules/manger'
//引入cate模块
import cate from './modules/classify'
//引入 specs模块
import specs from './modules/specs'
//引入 goods 模块
import goods from './modules/goods'
//引入seck模块
import seck from './modules/seck'
//引入banner模块
import banner from './modules/banner'
//引入member模块
import member from './modules/member'

export default new Vuex.Store({
    state: {
        loginInfo: sessionStorage.getItem('loginInfo') ? JSON.parse(sessionStorage.getItem('loginInfo')) : null  //个人信息
    },
    getters: {
        getUserInfo(state) {
            return state.loginInfo
        }
    },
    mutations: {
        CHANGE_USER(state, payload) {
            state.loginInfo = payload
            if (payload) {
                //设置本地存储
                sessionStorage.setItem('loginInfo', JSON.stringify(payload))
            } else {
                sessionStorage.removeItem('loginInfo')
            }
        }
    },
     //actionsstate
     actions: {
        changeUserInfoAction(contxt, payload) {
            contxt.commit('CHANGE_USER', payload)
        }
    },

    modules:{
        menu,
        role,
        manger,
        cate,
        specs,
        goods,
        seck,
        banner,
        member

    }
})