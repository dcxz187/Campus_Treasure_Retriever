import config from '@/request/config.js'

const http={} 

http.request=(url,method,data)=>{
	return uni.request({
		url:config.baseURL+url,
		method:method,
		header:config.header,
		data:data,
		dataType:'json'
	}).then(res=>{
		if(res[1].statusCode && res[1].statusCode==200){
			return res[1].data
		}else if(res[1].data.code==401){
			uni.showToast({
				title:'登录已失效,请重新登录',
				icon:'none'
			})
			uni.reLaunch({
				url:'/pages/login/login'
			})
		}else{
			throw res[1].data
		}
	}).catch(error=>{
		switch(error.code){
			case 401:
				break;
			default:
				return Promise.reject();
				break;
		}
	})
}

http.upload=(url,file,data)=>{
	return uni.uploadFile({
		url:config.baseURL+url,
		filePath:file,
		name:'file',
		formData:data
	}).then(res=>{
		if(res[1].statusCode&&res[1].statusCode==200){
			return res[1].data;
		}else if(res[1].data.code==401){
			uni.showToast({
				title:'登录已失效,请重新登录',
				icon:'none'
			})
			uni.reLaunch({
				url:'/pages/login/login'
			})
		}
		else{
			throw res[1]
		}
	}).catch(error=>{
		switch(error.code){
			case 401:
				break;
			default:
				uni.showToast({
					title:error.errmsg,
					icon:'none'
				})
				return Promise.reject()
				break;
		}
	})
}

export default http
