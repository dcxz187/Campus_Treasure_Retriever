<template>
	<view class="login">
		<!-- logo动画 -->
		<view class="logo-move">
			<image src="../../static/move.png" mode="aspectFit"></image>
		</view>
		<!-- 登录效果 -->
		<view class="posre">
			<!-- 卡片1--授权登录 -->
			<view class="posab1" :animation="animationData1">
				<view class="login-box">
					欢迎使用西柚失物招领小程序
				</view>
				<button class="loginbtn" type="default"
					open-type="getUserInfo"
					@getuserinfo="getLogin">
					获取授权
				</button>
			</view>
			<!-- 卡片2--绑定学号 -->
			<view class="posab2" :animation="animationData2">
				<view class="login-text">
					<view class="login-box">
						<view>学号绑定</view>
						<view class="stuNum">
							<input type="number" v-model="card_num" maxlength="12">
						</view>
					</view>
					<button class="loginbtn" type="default"
					@tap="bindStuNum">确认绑定</button>
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				card_num:'',
				animationData1:{},
				animationData2:{},
				animationData3:{},
				studentNum:''
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey
			})
		},
		methods: {
			...mapMutations([
				'getonLogin',
				'getSession',
				'getstuNum'
			]),
			getLogin(e){//授权登录
				if(!e.detail.userInfo){
					return uni.showToast({
						title:'授权失败',
						icon:'none'
					})
				}
				let user=e.detail.userInfo;
				let that=this;
				this.getonLogin({userName:user.nickName,userHead:user.avatarUrl})
				uni.login({
					provider:'weixin',
					success:(res)=>{
						let code=res.code;
						this.$api.onlogin({
							code:code,
							nickName:user.nickName,
							headImg:user.avatarUrl,
							app:'wx'
						}).then(res=>{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
							that.getSession({sessionKey:res.sessionKey})
							if(res.code===-1){// 判断学生是否绑定过学号,若无则绑定,有则直接进入首页
								that.btnMove()
							}else{
								that.getstuNum({stuNum:res.user.stuNum})
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								uni.switchTab({
									url:'../index/index'
								})
							}
						})
					}
				})
			},
			isuser(){//进入页面后判断用户曾经是否授权过（使用过）
				let that=this;
				uni.getSetting({
					success:(res)=>{
						if(res.authSetting['scope.userInfo']===true){
							//曾使用过则直接进入首页，若无则手动授权
							uni.getUserInfo({
								provider:'weixin',
								success:(res)=>{
									let userInfo=res.userInfo
									that.getonLogin({ userName:userInfo.nickName,userHead:userInfo.avatarUrl})
									uni.login({
										provider:'weixin',
										success:(res)=>{
											let code=res.code;
											that.$api.onlogin({
												code:code,
												nickName:userInfo.nickName,
												headImg:userInfo.avatarUrl,
												app:'wx'
											}).then(res=>{
												that.getSession({sessionKey:res.sessionKey})
												uni.showToast({
														title:res.msg,
														icon:'none'
													})
												if(res.code===-1){//未绑定学号
													this.btnMove();
												}else{//绑定学号
													that.getstuNum({stuNum:res.user.stuNum})
													uni.switchTab({
														url:'../index/index'
													})
												}
											})
										}
									})
								}
							})
						}else{
							uni.showToast({
								title:'首次登陆请手动授权',
								icon:'none'
							})
						}
					}
				})
			},
			bindStuNum(){//为学生绑定学号
				let that=this;
				if(that.card_num===''){
					return uni.showToast({
						title:'请填写学号',
						icon:'none'
					})
				}
				if(that.card_num.length!==12){
					return uni.showToast({
						title:'学号长度为12',
						icon:'none'
					})
				}
				that.getstuNum({ stuNum:that.card_num})
				this.$api.bindNum({
					sessionKey:that.sessionKey,
					stuNum:that.card_num,
					userName:that.$store.state.userInfo.userName,
					userHead:that.$store.state.userInfo.userHead
				}).then(res=>{
					uni.showToast({
						title:res.msg
					})
					//学号绑定成功
					uni.switchTab({
						url:'/pages/index/index'
					})
				})
			},
			btnMove(){
				let animation=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:400
				})
				let animation1=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:500,
				})
				let animation2=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:500,
				})
				
				animation1.rotateY(-180).step();
				animation2.rotateY(0).step();
				
				this.animationData1=animation1.export();
				this.animationData2=animation2.export();
			}
		},
		onShow() {
			this.isuser()
		}
	}
</script>

<style>
	page{
		background: linear-gradient(top,#4588aa,#57bbae);
	}
</style>
<style scoped>
	.login{
		padding: 0 30px;
		position: relative;
	}
	.logo-move{
		width: 100px;
		height: 100px;
		margin: 20px auto;
		animation: logomove 5s ease-in-out infinite;
		perspective: 1000px;
		border-radius: 50%;
	}
	@keyframes logomove{
		0%{
			transform: rotateY(0deg);
		}
		50%{
			transform: rotateY(180deg);
		}
		0%{
			transform: rotateY(0deg);
		}
	}
	.logo-move image{
		width: 100%;
		height: 100%;
	}
	.posre{
		perspective: 1000px;
		position: relative;
		color: #fff;
	}
	.posab1,.posab2{
		position: absolute;
		width: 100%;
		top:0;
		left:0;
		transform-style: preserve-3d;
		backface-visibility: hidden;
		z-index: 1;
	}
	.posab2{
		z-index: 2;
		transform: rotateY(-180deg);
	}
	.login .login-box{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		text-align: center;
		line-height: 80px;
		margin-top:50px;
		border-radius: 10px;
		box-shadow: 0px 0px 5px #8ff1ee;
		padding:10px 20px;
	}
	.login .stuNum input{
		border-bottom:1px solid #fff;
		color: #fff;
	}
	.login button{
		margin-top:50px;
		color: #000;
	}
</style>
