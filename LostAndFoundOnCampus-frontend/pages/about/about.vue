<template>
	<view class="about">
		<view class="aboout-image">
			<image src="../../static/move.png" mode="aspectFit"></image>
		</view>
		<view class="aboout-title about-bg">
			此小程序用于西柚学生发布失物和寻物信息,若在您的使用中出现问题，欢迎联系我们,群号:
			<span class="copy" @tap="copy">QQ</span>
		</view>
		<text class="aboutt-update">
			更新日志
		</text>
		<view class="example-body about-bg">
			<Steps  :options="list" direction="column"></Steps>
		</view>
	</view>
</template>

<script>
	import Steps from '@/components/user/step.vue'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				relation:'1056903508',
				list:[{
					title: '测试修复一部分问题'
				}, {
					title: '11月中旬,完成大部分功能'
				}, {
					title: '2019年11月初,开始准备'
				}]
			}
		},
		components:{
			Steps
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey
			})
		},
		methods: {
			copy(){
				uni.setClipboardData({
					data:this.relation
				})
			}
		},
		onLoad() {
			this.$api.isLogin();
		},
		onShow() {
			console.log(this.sessionKey)
			if(!this.sessionKey){
				this.$api.isSession()
			}
		}
	}
</script>

<style>
	page{
		background: #E7E7E7;
	}
</style>
<style scoped>
	.about{
		padding: 5px 10px;
		box-sizing: border-box;
	}
	.about button{
		margin: 5px 0;
	}
	.about .about-bg{
		background: #fff;
		color: #333;
		border-radius: 5px;
	}
	.aboout-image{
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}
	.aboout-image image{
		width: 100px;
		height: 100px;
		margin: auto;
	}
	.about .aboout-title{
		font-size: 14px;
		text-indent: 2em;
		line-height: 30px;
		white-space: 5px;
	}
	.example-body {
		flex-direction: column;
		padding: 30rpx;
	}
	.copy{
		border:1px solid #2C405A;
		padding: 2px 5px;
		border-radius: 5px;
		margin-left:10px;
	}
</style>
