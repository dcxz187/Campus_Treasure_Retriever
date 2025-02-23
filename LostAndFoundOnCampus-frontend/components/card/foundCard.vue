<template>
	<view class="listening">
		<text class="listen">选择监听的证件号类型</text>
		<view class="card">
			<view class="stucard" 
				:class="cardtype==='stuCard'?'selected':''"
				@tap="sendCardType('stuCard')">学生卡</view>
			<view class="idcard"
				:class="cardtype==='idCard'?'selected':''"
				@tap="sendCardType('idCard')">身份证</view>
		</view>
		<view class="subcard">			
			<view class="stuCard_text">
				<text>证件号:</text>
				<input type="idcard" resize="true" name="input" placeholder="输入你需要监听的证件号"
					v-model="listen_num"/>
			</view>
			<view class="subBtn" @tap="subMsg">
				<i class="iconfont">&#xe622;</i>
				<span>订阅消息</span>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState} from 'vuex'
	export default {
		data() {
			return {
				listen_num:'',
				animationData:{}
			};
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey,
				cardtype:state=>state.cardType,
				userInfo:state=>state.userInfo
			})
		},
		methods:{
			subMsg(e){
				let that =this;
				if(!this.sessionKey) return uni.showToast({
					title:'请先完成授权!',
					icon:'none'
				})
				if(this.listen_num=='') return uni.showToast({
					title:'证件号不能为空',
					icon:'none'
				})
				uni.requestSubscribeMessage({
					tmplIds: ['BqATFm8I0baZtW6ETtTdePDbmCewBnVGoVDy9deOYkY'],
					success(res){
						that.$api.listen({
							sessionKey:that.sessionKey,
							lisType:that.cardtype,
							lisNum:that.listen_num
						}).then(res=>{
							console.log(res)
							if(res.code=='1024'){
								uni.showToast({
									title:'信息提交成功,正在为您监听中...',
									icon:'none'
								})
							}else{
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								let id=res.cards[0].id
								uni.navigateTo({
									url:'/pages/foundCard/foundCard?id='+id
								})
							}
							this.listen_num='';
						})
					},
					fail(err){
						console.log(err)
					}
				})
			},
			move(){
				let animation=uni.createAnimation({
					duration:500,
					timingFunction:'ease-in-out'
				})
				animation.scale(1).step();
				this.animationData=animation.export();
			},
			sendCardType(type){
				this.$store.commit('getCardType',type)
			}
		},
		onShow(){
			this.move();
		},
		created() {
			this.$api.isLogin();
		}
	}
</script>
<style>
	page{
		background: #F1F1F1;
	}
</style>
<style scoped>
	.listening{
		margin-top:15px;
		background-color: #fff;
		padding:20px;
	}
	.listen{
		padding-left:5px;
	}
	.stuCard_box{
		width: 300px;
		height: 150px;
		margin:10px auto;
		border:1px dashed #ccc;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: #2C405A;
		text-indent: 2em;
		position: relative;
	}	
	.stuCard_text{
		padding: 10px;
	}
	.stuCard_text input{
		border-bottom: 1px solid #ccc;
		width: 100%;
		height: 40px;
		padding-left:5px;
		font-size: 16px;
	}
	button{
		background: #4588aa;
	}
	.card{
		height: 40px;
		display: flex;
		justify-content: space-between;
		padding:0 50px;
		margin:20px 0;
	}
	.card view{
		width: 100px;
		height: 100%;
		text-align: center;
		line-height: 40px;
		border-radius: 20px;
		border:1px solid #ccc;
	}
	.card .selected{
		border: 1px solid #4588aa;
	}
	.subcard{
		background: #fff;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
	}
	.subcard>view{
		box-sizing: border-box;
		padding: 10px 20px;
		width: 100%;
		margin: 5px 0;
	}
	.subcard .subBtn{
		box-sizing: border-box;
		background: #4a94b8;
		width: 150px;
		border-radius: 25px;
		padding: 10px 15px;
		display: flex;
		justify-content: center;
	}
	.subcard text{
		color: #5ba095;
	}
</style>
