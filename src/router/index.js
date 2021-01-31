import Vue from 'vue'
import Router from 'vue-router'
//调用仓库
import Store from '../store'
console.log(Store,'StoreStoreStoreStore');
//封装一个函数 用来判断是否有权限进来

//Store.getters.getUserInfo.menus_url 登录之后有权限的数组集合
function hasUrl(url){
  return Store.getters.getUserInfo.menus_url.some(item=>item==url)
}
Vue.use(Router)

// 设定二级路由配置项，给菜单地址用
export const indexRoutes = [
  {
    path: '/menu',
    component: () => import('@/views/menu/menu'),
    name: '菜单管理',
    beforeEnter: (to, from, next) => {
      hasUrl('/menu') ? next() :next('/home')
    }
  },
  {
    path: '/role',
    component: () => import('@/views/role/role'),
    name: '角色管理',
    beforeEnter: (to, from, next) => {
      hasUrl('/role') ? next() :next('/home')
    }
  },
  {
    path: '/manger',
    component: () => import('@/views/manger/manger'),
    name: '管理员管理',
    beforeEnter: (to, from, next) => {
      hasUrl('/manger') ? next() :next('/home')
    }
  },
  {
    path: '/Gclassify',
    component: () => import('@/views/classify/Gclassify'),
    name: '商品分类',
    beforeEnter: (to, from, next) => {
      hasUrl('/Gclassify') ? next() :next('/home')
    }
  },
  {
    path: '/Gnorms',
    component: () => import('@/views/specs/specs'),
    name: '商品规格',
    beforeEnter: (to, from, next) => {
      hasUrl('/Gnorms') ? next() :next('/home')
    }
  
  },
  {
    path: '/Gmanger',
    component: () => import('@/views/goods/Gmanger'),
    name: '商品管理',
    beforeEnter: (to, from, next) => {
      hasUrl('/Gmanger') ? next() :next('/home')
    }

  },
  {
    path: '/member',
    component: () => import('@/views/member/member'),
    name: '会员管理',
    beforeEnter: (to, from, next) => {
      hasUrl('/member') ? next() :next('/home')
    }
  },
  {
    path: '/banner',
    component: () => import('@/views/banner/banner'),
    name: '轮播图管理',
    beforeEnter: (to, from, next) => {
      hasUrl('/banner') ? next() :next('/home')
    }
  },
 
  {
    path: '/seck',
    component: () => import('@/views/seck/seck'),
    name: '秒杀活动',
    beforeEnter: (to, from, next) => {
      hasUrl('/seck') ? next() :next('/home')
    }
  },
]




const router = new Router({
  routes: [
    // 一级路由
    {
      path: '/login',
      component: () => import('../pages/login')
    },
    {
      path: '/index',
      component: () => import('../pages/index'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/home')
        },
        // 将导出去的二级路由再用辅助线性函数展开
        ...indexRoutes,

        // 二级路由重定向
        {
          path: '',
          redirect: '/home'
        }

      ]
    },
    // 一级路由重定向
    {
      path: "*",
      redirect: '/login'
    }

  ]
})

//全局导航守卫之登录拦截
router.beforeEach((to,from,next)=>{
  //如果你去的是登录就 next
  if(to.path=='/login'){
    next()  
    return
  }
  //如果你有登录状态就next
  if(Store.getters.getUserInfo){
    next()
    return
  }
  //都没有就强制跳转回登录页
  next('/login')
})

export default router
