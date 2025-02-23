<template>
	<view>
		<!-- 查询关键字物品 -->
		<view class="search">
			<form class="search-form">
				<input type="text" placeholder="输入物品名" v-model="value" confirm-type='search' @focus="showdel" @blur="hidedel"
					@confirm="addSearch"/>
				<i class="iconfont icon_delete"
					v-show="del"
					@tap="delkey">&#xe6f0;</i>
			</form>
			<i class="iconfont icon_search"
				@tap="searchKey">&#xe620;</i>
		</view>
		<view class="item" v-if="list.length">
			<listItem v-for="(item,index) in list"
				:key="index" :userItem="item"></listItem>
		</view>
		<view class="item-none" v-else>
			无此类消息
		</view>
	</view>
</template>
<script>
	import Search from '@/components/index/search.vue'
	import listItem from '@/components/listItem.vue'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				list:[],
				page:1,
				limit:8,
				value:'',
				del:false
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey
			})
		},
		components:{
			Search,
			listItem
		},
		methods: {
			searchKey(){//关键字查询
				uni.showLoading({
					title:'查询中...'
				})
				if(this.value===''){
					return uni.showToast({
						title:'输入不能为空',
						icon:'none'
					})
				}
				this.$api.searchfor({
					keyword:this.value,
					page:this.page,
					limit:this.limit,
					sessionKey:this.sessionKey
				}).then(res=>{
					this.list=res.goods;
					uni.hideLoading()
				})
			},
			delkey(){
				this.value=''
			},
			showdel(e){
				this.del=true
			},
			hidedel(){
				this.del=false
			},
			addSearch(e){
				this.searchKey()
			}
		},
		onLoad(e){
			this.value=e.keyword;
			this.searchKey();
			this.$api.isLogin();					
		},
		onShow(e) {
			if(!this.sessionKey){
				this.$api.isSession()
			}
		}
	}
</script>
<style scoped>
	.item,
	.item-none{
		margin-top:80px;
	}
	.item-none{
		text-align: center;
		font-size: 16px;
		color:#828282;
	}
	/* 排序 */
	.time-sort{
		font-size: 14px;
	}
	.time-sort text{
		margin:10px 10px 5px 0;
		line-height: 20px;
		border: 1px solid #5BA08C;
		float: right;
		padding: 2px 5px;
		border-radius: 5px;
	}
</style>
