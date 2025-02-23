<template>
	<view>
		<!-- 用户信息 -->
		<UserHead :userhead="userInfo" ismy="true" @sendStu="getStuNum"></UserHead>
		<view class="mask" v-show="ismask" @tap="isMask"></view>
		<!-- 更新学号 -->
		<view class="bindingStu" v-show="ismask">
			<input type="number" v-model="card_num" placeholder="请填写学号" maxlength="12">
		</view>
		<!-- 相关信息列表 -->
		<view class="userList" :animation="animationData">
			<button class="listItem" @tap="myPublish">
				<span class="iconfont">&#xe618;</span>
				<span>我的发布</span>
			</button>
			<button class="listItem" @tap="myFind">
				<span class="iconfont">&#xe620;</span>
				<span>我的认领</span>
			</button>
			<button class="listItem" @tap="toAbout">
				<span class="iconfont">&#xe62e;</span>
				<span>关于我们</span>
			</button>
			<button class="listItem" @tap="toQun">
				<span class="iconfont">&#xe694;</span>
				<span>信息qq群号</span>
			</button>
			<button class="listItem" open-type="share">
				<span class="iconfont">&#xe8b0;</span>
				<span>分享该小程序</span>
			</button>
			<button class="listItem"
				open-type="contact"
				send-message-title="客服服务"
				@tap="toAdmin">
				<span class="iconfont">&#xe62e;</span>
				<span>联系客服</span>
			</button>
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	import UserHead from '@/components/user/userHead.vue'
	export default {
		data(){
			return{
				ismask:false,
				qqQun:'750503541',
				card_num:'',
				animationData:{},
				limit:8,
				count:null,
				page:1
			}
		},
		computed:{
			...mapState({
				userInfo:state=>state.userInfo,
				sessionKey:state=>state.sessionKey
			})
		},
		components:{
			UserHead
		},
		methods: {
			...mapMutations([
				'getstuNum'
			]),
			toAdmin(){
				console.log('hi');
			},
			getStuNum(data){
				this.ismask=data.isNum;
			},
			toQun(){
				uni.setClipboardData({
					data:this.qqQun
				})
			},
			myFind(){
				uni.navigateTo({
					url:'/pages/myFind/myFind'
				})
			},
			myPublish(){
				if(!this.sessionKey){
					return uni.showToast({
						title:'请先授权',
						icon:'none'
					})
				}
				uni.navigateTo({
					url:'../myPublish/myPublish'
				})
			},
			toAbout(){
				uni.navigateTo({
					url:'../about/about'
				})
			},
			isMask(){
				this.ismask=false;
			},
			getIndexData(){
				this.$api.getData({
					page:this.page,
					limit:this.limit,
					sessionKey:this.sessionKey,
					sort:2
				}).then(res=>{
					if(res.code===401){
						uni.showToast({
							title:'登录已失效,请重新登录',
							icon:'none'
						})
						return uni.reLaunch({
							url:'/pages/login/login'
						})
					}
					this.count=res.count;
					uni.hideNavigationBarLoading()
					uni.hideLoading();
					this.$store.dispatch('getData',{sessionKey:this.sessionKey,count:this.count,limit:this.limit});
				})
			}
		},
		onLoad() {
			this.$api.isLogin();
		},
		onShow() {
			if(!this.sessionKey){
				this.$api.isSession()
			}
			this.getIndexData();
			let animation=uni.createAnimation({
				duration:800,
				timingFunction:'ease-in-out'
			})
			animation.opacity(1).translateY(0).step();
			this.animationData=animation.export();
		},
		onHide() {
			let animation=uni.createAnimation({
				duration:800,
				timingFunction:'ease-in-out'
			})
			animation.opacity(0).translateY(90).step();
			this.animationData=animation.export();
		},
		onShareAppMessage(e) {
			if(e.from==='button'){
				console.log(e.target)
				return{
					title:'西柚失物招领小程序',
					page:'/pages/login/login',
					success:res=>{
						uni.showToast({
							title:'分享成功,感谢您的支持~',
							icon:'none'
						})
					}
				}
			}
		}
	}
</script>

<style>
.mask{
	position: absolute;
	top:0;
	left:0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.4);
	z-index: 99;
}
.bindingStu{//绑定几个学号弹框
	position: fixed;
	width: 300px;
	height: 200px;
	left:50%;
	top:50%;
	margin-left:-150px;
	margin-top:-100px;
	background: #fff;
	border-radius: 10px;
	padding: 10px;
	box-sizing: border-box;
	z-index: 100;
	font-size: 16px;
}
.bindingStu button{
	box-shadow: 0px 0px 4px #4588aa;
	margin:10px 0;
	background: #fff;
}
.bindingStu input{
	margin:30px 0;
	padding: 5px 5px;
	border-bottom: 1px solid #ccc;
	font-size: 18px;
}
.userList{//列表
	opacity: 0;
	transform: translateY(90);
	width: 90%;
	height: 100%;
	margin:20px auto;
	padding:10px;
	border:1px solid #C0C0C0;
	border-radius: 5px;
	box-shadow: 2px 2px 2px #C0C0C0;
	color:#555;
}
.userList .listItem{
	--height:50px;
	border-bottom: 1px solid #ccc;
	height: var(--height);
	line-height: var(--height);
	text-align: left;
	margin-top:10px;
	background: #fff;
}
.userList .listItem span{
	padding:0 5px;
}
.listItem .iconfont{
	font-size: 20px;
	color: #3F536E;
}
</style>
