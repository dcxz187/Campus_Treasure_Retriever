<template>
	<view class="time-sort">
		<text @tap="sortType(false)" :class="!refresh?'sort':''">更早之前</text>
		<text @tap="sortType(true)" :class="refresh?'sort':''">最新发布</text>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				refresh:true
			}
		},
		methods:{
			sortType(type){
				this.refresh=type
				this.$emit('sendSort',{ sortType:type})
			}
		}
	}
</script>

<style scoped>
/* 排序 */
.time-sort{
	font-size: 14px;
}
.time-sort text.sort{
	background: #4588aa;
	color: #fff;
}
.time-sort text{
	margin-bottom: 10px;
	margin-left: 10px;
	line-height: 20px;
	border: 1px solid #4588aa;
	float: right;
	padding: 2px 5px;
	border-radius: 5px;
}
</style>
