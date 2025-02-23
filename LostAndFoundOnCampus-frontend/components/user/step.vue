<template>
	<view class="step">
		<view class="step-box" v-for="(item,index) in options" :key="index">
			<view class="step-card">
				<view class="step-circle"></view>
				<view class="step-line"></view>
			</view>
			<view class="step-content" >
				{{item.title}}
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniSteps',
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			}
		},
		created() {
			this.$api.isLogin();
		}
	}
</script>

<style scoped>
	.step{
		display: flex;
		flex-direction: column;
	}
	.step .step-box{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin:10px 0;
	}
	.step .step-card{
		width: 10px;
		margin-right: 40px;
	}
	.step .step-circle{
		width: 10px;
		height: 10px;
		background: #007AFF;
		border-radius: 50%;
	}
	.step .step-line{
		width: 1.2px;
		height: 50px;
		background: #C8C7CC;
		margin:5px auto;
	}
	.step .step-content{
		background: #EBEBEB;
		width: 100%;
		border-radius: 4px;
		padding: 5px 10px;
		box-sizing: border-box;
		font-size: 14px;
	}
</style>