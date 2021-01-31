import http from './axios'


//后台管理接口集合



/* ===========菜单列表============== */
//封装一个菜单列表接口
export function getMenuList() {
   return http.get('/api/menulist?istree=true')
}

//封装添加菜单列表接口data={pid:1.....}

export function addMenu(data) {
   return http.post('/api/menuadd', data)
}

//封装一个删除菜单列表接口

export function delMenu(data) {
   return http.post('/api/menudelete', data)
}

//封装菜单列表获取一条数据接口
export function menuInfo(params) {
   return http.get('/api/menuinfo', { params })

}

//封装一个编辑菜单列表接口
export function editMenu(data) {
   return http.post('/api/menuedit', data)
}





/* ===========角色列表============== */

//封装角色列表接口
export function getRoleList() {
   return http.get('/api/rolelist')
}

//封装添加角色接口 
export function addRole(data) {
   return http.post('/api/roleadd', data)
}

//封装角色列表删除接口
export function deleteRole(data) {
   return http.post('/api/roledelete', data)
}

//封装角色列表获取一条数据接口
export function roleInfo(params) {
   return http.get('/api/roleinfo', {
      params
   })
}

//封装角色列表编辑接口
export function editRole(data) {
   return http.post('/api/roleedit', data)
}




/* ===========管理员列表============== */

//封装管理员列表接口,必须要传递分页参数
export function getMangerList(params) {
   return http.get('api/userlist', {
      params
   })
}



//封装添加管理员接口 
export function addManger(data) {
   return http.post('/api/useradd', data)
}

//封装管理员列表删除接口
export function deleteManger(data) {
   return http.post('/api/userdelete', data)
}

//封装管理员列表获取一条数据接口
export function MangerInfo(params) {
   return http.get('/api/userinfo', {
      params
   })
}

//封装管理员列表编辑接口
export function editManger(data) {
   return http.post('/api/useredit', data)
}


//封装管理员列表总条数接口
export function getMangerCount() {
   return http.get('/api/usercount')
}


//封装用户登录接口

export function userLogin(data) {
   return http.post('/api/userlogin', data)
}


/* ===========商城商城分类列表============== */
//封装商城分类添加接口
export function getCateAdd(data) {
   let file = new FormData();
   //FormData 数据的添加只能用append ,获取值也只能用get方式获取
   //循环添加 对象 转化成了 FormData这种格式
   for (let i in data) {
      file.append(i, data[i]);
   }
   return http.post('/api/cateadd', file)
}
//封装商城分类列表接口
export function getCateList() {
   return http.get('/api/catelist', {
      params:{
         istree:true
      }
   })
}
//封装商城分类获取（一条）接口
export function getCateInfo(params) {
   return http.get('/api/cateinfo', {
      params
   })
}
//封装商城分类修改接口
export function getCateEdit(data) {
   return http.post('/api/cateedit', data)
}
//封装商城分类删除接口
export function getCateDelete(data) {
   return http.post('/api/catedelete', data)
}






/* ===========商品规格列表============== */
//封装添加商品规格接口 
export function specsAdd(data) {
   return http.post('/api/specsadd', data)
}

//封装商品规格列表总条数接口（用于计算分页）
export function getSpecsCount() {
   return http.get('/api/specscount')
}

//封装商品规格列表接口,必须要传递分页参数
export function getSpecsList(params) {
   return http.get('/api/specslist', {
      params
   })
}



//封装商品规格列表获取一条数据接口
export function SpecsInfo(params) {
   return http.get('/api/specsinfo', {
      params
   })
}


//封装商品规格列表编辑接口
export function editSpecs(data) {
   return http.post('/api/specsedit', data)
}


//封装商品规格列表删除接口
export function deleteSpecs(data) {
   return http.post('/api/specsdelete', data)
}



/* ===========商品管理列表============== */
//封装添加商品管理接口 
export function goodsAdd(data) {
   let file = new FormData();
   //FormData 数据的添加只能用append ,获取值也只能用get方式获取
   //循环添加 对象 转化成了 FormData这种格式
   for (let i in data) {
      file.append(i, data[i]);
   }
   return http.post('/api/goodsadd', file)
}

//封装商品管理列表总条数接口（用于计算分页）
export function getGoodsCount() {
   return http.get('/api/goodscount')
}

//封装商品管理列表接口,必须要传递分页参数
export function getGoodsList(params) {
   return http.get('/api/goodslist', {
      params
   })
}



//封装商品管理列表获取一条数据接口
export function GoodsInfo(params) {
   return http.get('/api/goodsinfo', {
      params
   })
}


//封装商品管理列表编辑接口
export function editGoods(data) {
   let file = new FormData();
   //FormData 数据的添加只能用append ,获取值也只能用get方式获取
   //循环添加 对象 转化成了 FormData这种格式
   for (let i in data) {
      file.append(i, data[i]);
   }
   return http.post('/api/goodsedit', file)
}


//封装商品管理列表删除接口
export function deleteGoods(data) {
   return http.post('/api/goodsdelete', data)
}

/* ===========会员管理列表============== */


 //封装会员管理列表接口
 export function getMemberList(){
   return http.get('/api/memberlist')
}
//封装会员管理获取（一条）接口
export function getMemberInfo(params){
   return http.get('/api/memberinfo',{
       params
   })
}
//封装会员管理修改接口
export function getMemberEdit(data){
   return http.post('/api/memberedit',data)
}




/* ===========轮播图管理列表============== */
//封装轮播图添加接口
export function getBannerAdd(data) {
   let file = new FormData();
   //FormData 数据的添加只能用append ,获取值也只能用get方式获取
   //循环添加 对象 转化成了 FormData这种格式
   for (let i in data) {
      file.append(i, data[i]);
   }
   return http.post('/api/banneradd', file)
}
//封装轮播图管理列表接口
export function getBannerList(params) {
   return http.get('/api/bannerlist', {
      params
   })
}
//封装轮播图管理获取（一条）接口
export function getBannerInfo(params) {
   return http.get('/api/bannerinfo', {
      params
   })
}
//封装轮播图管理修改接口
export function getBannerEdit(data) {
   return http.post('/api/banneredit', data)
}
//封装轮播图管理删除接口
export function getBannerDelete(data) {
   return http.post('/api/bannerdelete', data)
}



/* ===========秒杀活动列表============== */

//封装秒杀活动添加接口
export function getSeckAdd(data) {
   return http.post('/api/seckadd', data)
}
//封装秒杀活动列表接口
export function getSeckList( params) {
   return http.get('/api/secklist', {
      params
   })
}
//封装秒杀活动获取（一条）接口
export function getSeckInfo(params) {
   return http.get('/api/seckinfo', {
      params
   })
}
//封装秒杀活动修改接口
export function getSeckEdit(data) {
   return http.post('/api/seckedit', data)
}
//封装秒杀活动删除接口
export function getSeckDelete(data) {
   return http.post('/api/seckdelete', data)
}

