<template>
	<!-- 首页 -->
	<view class="index">
		<!-- 搜索框 -->
		<Search></Search>
		<!-- 轮播图 -->
		<Swiper></Swiper>
		<!-- 分类 -->
		<ClassList></ClassList>
		<NoticeBar></NoticeBar>
		<!-- 排序 -->
		<SortTap @sendSort="getSort"></SortTap>
		<!-- 内容 -->
		<view class="content">
			<ListItem v-for="(item,index) in list" 
			:userItem="item" 
			:key="index"></ListItem>
		</view>
		<view class="loadingText">{{ loadingText}}</view>
		<!-- 回到顶部 -->
		<view class="iconfont totop"
			@tap.stop="toTop" :animation="animationData"
			>&#xe610;</view>
	</view>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	import ListItem from '@/components/listItem.vue'
	import Time from '@/common/time.js'
	import Search from '@/components/index/search.vue'
	import ClassList from '@/components/index/classList.vue'
	import SortTap from '@/components/index/sorttap.vue'
	import Swiper from '@/components/index/swiper.vue'
	import NoticeBar from '@/components/index/noticeBar.vue'
	import checkLogin from '@/common/util.js'
	export default {
		data() {
			return {
				animationData:{},
				isLogin:null,
				page:1,
				limit:8,
				count:'',
				decpage:1,
				time:'',
				tobottom:false,
				loadingText:'',
				refresh:true,
				list:[]
			}
		},
		computed:{
			...mapState({
				userInfo:state=>state.userInfo,
				stuNum:state=>state.stuNum,
				sessionKey:state=>state.sessionKey
			})
		},
		components:{
			ListItem,
			Search,
			ClassList,
			SortTap,
			Swiper,
			NoticeBar
		},
		methods: {
			getSort(data){//判断正倒序排列
				this.refresh=data.sortType
				if(this.refresh){
					this.getDataList()
				}else{
					this.sortDesc();
				}
			},
			toTop(){//回到顶部
				uni.pageScrollTo({
					scrollTop:0,
					duration:300
				})
			},
			getDataList(){//获取第一页数据
				let that=this;
				that.page=1;
				uni.showNavigationBarLoading();
				if(!this.sessionKey) return;
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.getData({
					page:that.page,
					limit:that.limit,
					sessionKey:that.sessionKey,
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
					this.list=res.goods;
					uni.hideNavigationBarLoading()
					uni.hideLoading();
					this.$store.dispatch('getData',{sessionKey:that.sessionKey,count:that.count,limit:that.limit});
				})
			},
			sortDesc(){//倒序
				let that=this;
				that.decpage=1;
				uni.showNavigationBarLoading();
				if(!this.sessionKey) return;
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.getData({
					page:that.decpage,
					limit:that.limit,
					sessionKey:that.sessionKey,
					sort:1
				}).then(res=>{
					this.count=res.count;
					this.list=res.goods;
					uni.hideNavigationBarLoading()
					uni.hideLoading();
					this.$store.dispatch('getData',{sessionKey:that.sessionKey,count:that.count,limit:that.limit});
				})
			},
			addMore(){//加载更多数据
				let that=this;
				this.loadingText='加载更多...'
				that.page++;
				uni.showNavigationBarLoading();
				this.$api.getData({
					sessionKey:that.sessionKey,
					page:that.page,
					limit:that.limit,
					sort:2
				}).then(res=>{
					if(res.goods.length==0){
						that.page--;
						uni.hideNavigationBarLoading();
						that.loadingText='已加载完全部';
					}
					that.list=that.list.concat(res.goods)
					uni.hideNavigationBarLoading();
				})
			},
			descMore(){//倒序加载更多数据
				let that=this;
				this.loadingText='加载更多...'
				that.decpage++;
				uni.showNavigationBarLoading();
				this.$api.getData({
					sessionKey:that.sessionKey,
					page:that.decpage,
					limit:that.limit,
					sort:1
				}).then(res=>{
					if(res.goods.length==0){
						that.decpage--;
						uni.hideNavigationBarLoading();
						that.loadingText='已加载完全部';
					}
					that.list=that.list.concat(res.goods)
					uni.hideNavigationBarLoading();
				})
			},
			moveHandle(){}
		},
		onPageScroll(e){
			let animation=uni.createAnimation({
				timingFunction:'ease-in-out',
				duration:400
			})
			this.animation=animation
			if(e.scrollTop>=300){
				animation.opacity(0.9).scale(1).rotate(0).step();
				this.animationData=animation.export();
			}else{
				animation.scale(0).rotate(180).opacity(0).step();
				this.animationData=animation.export();
			}
		},
		onReachBottom(){
			let that=this;
			if(this.refresh){
				setTimeout(()=>{
					that.addMore()
				},500)
			}else{
				setTimeout(()=>{
					that.descMore()
				},500)
			}
		},
		onPullDownRefresh(){
			this.resnotice=true;
			if(this.refresh){
				this.page=1;
				this.getDataList();
				uni.stopPullDownRefresh();
			}else{
				this.decpage=1;
				this.sortDesc()
				uni.stopPullDownRefresh();
			}
		},
		onShow() {
			// this.$api.isLogin();
			console.log(this.sessionKey)
			if(!this.sessionKey){
				this.$api.isSession()
			}
			this.page=1;
			this.decpage=1;
			this.getDataList();
			// uni.startPullDownRefresh();
		},
		onShareAppMessage() {
			return{
				title:'西柚失物招领小程序',
				success:res=>{
					uni.showToast({
						title:'分享成功,感谢您的支持~',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style>
	page{
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>
<style scoped>
	.index{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.totop{//回到顶部
		width: 50px;
		height: 50px;
		background:#4588aa;
		border-radius: 50%;
		font-size: 26px;
		position: fixed;
		bottom:40px;
		opacity: 0;
		transform: scale(0);
		right:10px;
		line-height: 50px;
		text-align: center;
		color:#FFFFFF;
		z-index: 2222;
	}
	.content{
		padding:5px;
	}
	.loadingText{
		width: 100%;
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
		color: #CCCCCC;
	}
</style>
