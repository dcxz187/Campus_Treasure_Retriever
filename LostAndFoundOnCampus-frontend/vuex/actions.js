import api from '@/request/api.js'
const actions={
	getData(context,obj){
		let allPage=Math.ceil(obj.count/obj.limit);
		let limit=obj.limit*allPage;
		api.getData({
			sessionKey:obj.sessionKey,
			page:1,
			limit:limit
		}).then(res=>{
			context.commit('getGoodsAll',res.goods)
		})
	}
}

export default actions