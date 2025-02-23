<template>
	<view class="tabbar">
		<text class="ta"></text>
		<view class="span">
			<span @tap="getTabbar(true)" :class="iscard?'select':''">信息</span>
			<span @tap="getTabbar(false)" :class="!iscard?'select':''">卡证</span>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				iscard:true
			}
		},
		methods:{
			getTabbar(type){
				this.iscard=type
				this.$emit('sendtabbar',{ typetabbar:type})
			}
		}
	}
</script>

<style scoped>
.tabbar{
	margin-top:10px;
	font-size: 16px;
	display: flex;
	justify-content: space-between;
	padding:5px 0;
}
.tabbar .span span{
	margin:0 15px;
	border-radius: 8px;
	border:1px solid #4588aa;
	padding: 4px 8px;
	font-size: 16px;
	color: #4588aa;
}
.tabbar .span span.select{
	background: #4588aa;
	color: #fff;
}
.ta{
	color: #333333;
	padding-left: 10px;
}
</style>
