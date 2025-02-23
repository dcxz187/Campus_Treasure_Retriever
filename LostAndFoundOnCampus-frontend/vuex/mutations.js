import Time from 'common/time.js'
const mutations={
	getSession(state,data){
		state.sessionKey=data.sessionKey
	},
	getstuNum(state,data){
		state.userInfo.stuNum=data.stuNum;
	},
	getonLogin(state,obj){//登录
		let userName=obj.userName;
		let userHead=obj.userHead;
		let user={
			userHead:userHead,
			userName:userName
		}
		state.userInfo=user;
	},
	getMsgType(state,{type}){
		state.msgType=type
	},
	getCardType(state,type){
		state.cardType=type
	},
	getGoodsAll(state,goods){
		state.goodsList=goods;
	},
	getMsgList(state,goods){
		state.myMsgList=goods;
	},
	getpubUser(state,user){
		state.pubUser=user;
	}
}

export default mutations