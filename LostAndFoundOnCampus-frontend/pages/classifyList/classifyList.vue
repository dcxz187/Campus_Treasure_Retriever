<template>
	<view>
		<Search></Search>
		<view class="item" v-if="list">
			<listItem v-for="(item,index) in list"
				:key="index" :userItem="item"></listItem>
		</view>
		<view class="loadingText">{{ loadingText}}</view>
		<view class="item-none" v-if="list.length===0">
			无此类信息
		</view>
	</view>
</template>

<script>
	import { mapState} from 'vuex'
	
	import listItem from '@/components/listItem.vue'
	import Search from '@/components/index/search.vue'
	import Time from '@/common/time.js'
	
	export default {
		data() {
			return {
				type:null,
				page:1,
				limit:8,
				list:[],
				loadingText:''
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey
			})
		},
		components:{
			listItem,
			Search
		},
		methods: {
			getTypeList(){
				uni.showLoading({
					title: '加载中...'
				})
				this.$api.classify({
					sessionKey:this.sessionKey,
					class:this.type,
					page:this.page,
					limit:this.limit
				}).then(res=>{
					this.list=res.goods;
					uni.hideLoading();
				})
			},
			getMore(){
				let that=this;
				this.loadingText='加载更多...'
				that.page++;
				uni.showNavigationBarLoading();
				this.$api.getData({
					sessionKey:that.sessionKey,
					page:that.page,
					class:this.type,
					limit:that.limit,
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
			setTitle(){
				let setTitle=(title)=>{
					uni.setNavigationBarTitle({
					    title: title
					});
				}
				switch (this.type){
					case 'learn':
						setTitle('学习类');
						break;
					case 'elec':
						setTitle('电子类');
						break;
					case 'daily':
						setTitle('生活类');
						break;
					case 'other':
						setTitle('其他类');
						break;
					default:
						break;
				}
			}
		},
		onLoad(e) {
			this.page=1;
			this.type=e.type;
			this.setTitle();
			this.getTypeList();
		},
		onReachBottom(){
			let that=this;
			setTimeout(()=>{
				that.getMore()
			},500)
		},
		onPullDownRefresh(){
			this.page=1;
			this.getTypeList()
		},
		onShow(){
			console.log(this.sessionKey)
			if(!this.sessionKey){
				this.$api.isSession()
			}
		}
	}
</script>

<style scoped>
	.item-none{
		padding-top:40px;
		text-align: center;
		color: #C0C0C0;
	}
	.item{
		padding: 40px 10px 0 10px;
	}
	.loadingText{
		text-align: center;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
		color: #CCCCCC;
	}
</style>
