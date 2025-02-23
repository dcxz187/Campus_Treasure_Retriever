<template>
	<view class="cardInfo">
		<view class="card_content">
			<view class="title">姓名:&nbsp;{{ msg.cardName}}</view>
			<view class="text">卡号:&nbsp;{{ msg.cardNum}}</view>
			<view class="relation">
				联系:&nbsp;{{reltype[1]}}
				<span class="iconfont cutbtn" @tap="cuttext" v-if="reltype[0]==='qq'">&#xe606;复制</span>
				<span class="iconfont cutbtn" @tap="cuttext" v-if="reltype[0]==='tel'">&#xe603;复制</span>
			</view>
		</view>
		<!-- 认领按钮 -->
		<view class="infoBtn">
			<button type="default" class="warn" @tap="touser" v-if="isfund">认领</button>
			<button type="default" class="redwran" v-else>已认领</button>
			<button type="default" @tap="toback">返回</button>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey,
				userInfo:state=>state.userInfo
			})
		},
		data() {
			return {
				id:'',
				msg:{},
				reltype:[],
				isfund:true
			}
		},
		methods: {
			toback(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			touser(){
				if(!this.userInfo.stuNum){
					return uni.showToast({
						title:'认领前请先绑定学号',
						icon:'none'
					})
				}
				uni.showModal({
					title:'西柚助手提示您',
					content:'信息千万条,诚信第一条,请仔细核对是否是您的东西,认领后信息将消除,认领前请保留好联系方式',
					confirmText:'认领',
					cancelText:'我再想想',
					success:res=>{
						if(res.confirm){
							this.$api.cardFun({
								sessionKey:this.sessionKey,
								cid:this.id,
								stuNum:this.userInfo.stuNum
							}).then(res=>{
								console.log(res)
								uni.showToast({
									title:res.msg
								})
								this.isfund=false;
							})
						}
					}
				})
			},
			cuttext(){
				uni.setClipboardData({
					data:this.reltype[1]
				})
			},
			getMsg(){
				let that=this;
				this.$api.cardData({
					sessionKey:that.sessionKey,
					id:that.id
				}).then(res=>{
					that.msg=res.card
					this.reltype=res.card.relation.split(':');
				})
			}
		},
		onLoad(e) {
			this.id=e.id;
			this.getMsg();
		},
		onShow() {
			console.log(this.sessionKey)
			if(!this.sessionKey){
				this.$api.isSession()
			}
		}
	}
</script>

<style scoped>
	.cardInfo{
		padding:0 10px;
	}
	.cardInfo .card_content view{
		margin:30px 0;
	}
	.infoBtn button{
		background: #fff;
		box-shadow: 0px 0px 5px #ccc;
		margin:40px 0;
		color:#346680;
	}
	.infoBtn button.warn{
		background: #BF0000;
		color: #fff;
	}
	.infoBtn button.redwran{
		background: #dd524d;
		color: #fff;
	}
	.relation{
		margin-left:20px;
		position: relative;
	}
	.relation .cutbtn{
		border-radius: 5px;
		font-size: 14px;
		border: 1px solid #4588aa;
		text-align: center;
		line-height: 20px;
		padding:4px 8px;
		width: 50px;
		position: absolute;
		right: 5px;
		top:2px;
	}
</style>
