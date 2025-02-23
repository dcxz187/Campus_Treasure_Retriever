<template>
	<view class="search">
		<form class="search-form">
			<input type="text" placeholder="输入物品名"
				v-model="value"
				confirm-type='search'
				@focus="showdel"
				@blur="hidedel"
				@confirm="addSearch"/>
			<i class="iconfont icon_delete"
				v-show="del"
				@tap="delkey">&#xe6f0;</i>
		</form>
		<i class="iconfont icon_search"
			@tap="searchKey">&#xe620;</i>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:'',
				del:false
			};
		},
		methods:{
			searchKey(){//关键字查询
			let that=this;
				if(this.value===''){
					uni.showToast({
						title:'输入不能为空',
						icon:'none'
					})
				}else{
					uni.navigateTo({
						url:'../filterItem/filterItem?keyword='+this.value,
					})
					this.value=''
				}
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
	}
</script>