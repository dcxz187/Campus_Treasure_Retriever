<template>
	<view class="classify bgwhite">
		<ul>
			<li @tap="toClassList('learn')">
				<view class="study"></view>
				<view>学习用品</view>
			</li>
			<li @tap="toClassList('daily')">
				<view class="daily"></view>
				<view>生活用品</view>
			</li>
			<li @tap="toClassList('elec')">
				<view class="elect"></view>
				<view>电子用品</view>
			</li>
			<li @tap="toClassList('other')">
				<view class="other"></view>
				<view>其他</view>
			</li>
		</ul>
	</view>
</template>

<script>
	export default {
		methods:{
			toClassList(type){
				uni.navigateTo({
					url:'/pages/classifyList/classifyList?type='+type
				})
			}
		}
	}
</script>

<style scoped>
	.bgwhite{		background-color: #fff;	}
/* 分类 */
	.classify{
		height: 60px;
		width:100%;
		padding-top:50px;
		margin-bottom: 10px;
	}
	.classify ul{
		width:100%;
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items:flex-start;
	}
	.classify ul li{
		display: flex;
		flex-direction: column;
		justify-content:space-between;
		align-items: center;
		margin:0 10px;
		font-size: 14px;
	}
	.classify li view:first-child{
		width: 40px;
		height: 40px;
	}
	.classify li view:last-child{
		padding-top:5px;
	}
	.classify .study{
		background: url(../../static/listicon/learn.png) no-repeat center;
	}
	.classify .elect{
		background: url(../../static/listicon/elect.png) no-repeat center;
	}
	.classify .daily{
		background: url(../../static/listicon/daily.png)  no-repeat center;
	}
	.classify .other{
		background: url(../../static/listicon/other.png) no-repeat center;
	}
</style>
