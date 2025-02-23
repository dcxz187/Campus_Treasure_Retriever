// 接口页面
import http from '@/request/http.js'

const apis={}

apis.isLogin=()=>http.checkSession();
apis.isSession=()=>{
	uni.showToast({
		title:'登录已失效,请重新登录',
		icon:'none'
	})
	uni.reLaunch({
		url:'/pages/login/login'
	})
}
// index
apis.onlogin=(params)=>http.request('/user/login','POST',params);
apis.getData=(params)=>http.request('/good/all','GET',params);
apis.bindNum=(params)=>http.request('/user/update','POST',params);
apis.images=(params)=>http.request('/index/images','GET',params);
apis.notices=(params)=>http.request('/index/notices','GET',params);

// publish
apis.pubCard=(params)=>http.request('/card/add','POST',params);
apis.pubGood=(file,params)=>http.upload('/good/add',file,params);
apis.listen=(params)=>http.request('/listen/listen','POST',params);
apis.pubCor=(file,params)=>http.upload('/card/ocr',file,params);

// classify
apis.classify=(params)=>http.request('/good/class','GET',params);
apis.searchfor=(params)=>http.request('/good/search','GET',params);

// user
apis.findCard=(params)=>http.request('/card/hasFound','GET',params);
apis.findGood=(params)=>http.request('/good/hasFound','GET',params);
apis.mypublish=(params)=>http.request('/good/my','GET',params);
apis.hispublish=(params)=>http.request('/good/his','GET',params);
apis.myCard=(params)=>http.request('/card/my','GET',params);
apis.hisCard=(params)=>http.request('/card/his','GET',params);
//delete
apis.mydele=params=>http.request('/good/del','POST',params);
apis.mycardel=params=>http.request('/card/del','POST',params);
//good
apis.goodFun=(params)=>http.request('/good/found','POST',params);
apis.cardFun=(params)=>http.request('/card/found','POST',params);
//card data
apis.cardData=(params)=>http.request('/card/find','POST',params);

export default apis