<template>
	<view class="content-box"
		@tap="toInfo(userItem.id)">
		<view class="content-img">
			<image mode="aspectFit" :src="'https://swzl.gongsir.club/api/'+userItem.goodImage" alt=""></image>
		</view>
		<view class="content-text">
			<view class="text-top">
				<view class="avatar-img">
					<image :src="userItem.user.userHead" mode="aspectFit"></image>
				</view>
				<view class="avatar-text">
					<view class="avatar-name">{{ userItem.user.userName}}</view>
					<view class="avatar-time">{{ time}}</view>
				</view>
			</view>
			<view class="text-bottom">
				{{userItem.goodTitle}}
			</view>
		</view>
		<view class="content-type type-lost"
			v-if="userItem.goodType==='lost'">
			<text >失物招领</text>
			<text v-if="userItem.goodType==='found'">寻物启事</text>
		</view>
		<view class="content-type type-found"
			v-if="userItem.goodType==='found'">
			<text>寻物启事</text>
		</view>
	</view>	
</template>

<script>
	import Time from '@/common/time.js'
	import util from '@/common/util.js'
	import { mapState} from 'vuex'
	export default {
		props:{
			userItem:{
				type:Object
			}
		},
		data(){
			return{
				status:null
			}
		},
		methods:{
			toInfo(id){
				uni.navigateTo({
					url:'../Info/Info?id='+id+'&status='+this.status
				})
			}
		},
		computed:{
			time(){
				let stamp=Time.getMyUninx(this.userItem.time)
				return Time.getFormatTime(stamp);
			}
		},
		created() {
			this.status=this.userItem.goodStatus;
		}
	}
</script>

<style scoped>
	/* 内容 */
	.content-box{
		width: 100%;
		margin: 10px auto;
		display: flex;
		align-items: center;
		box-shadow: 2px 2px 4px #C0C0C0;
		border:1px solid #ccc;
		border-radius: 10px;
		padding:2px 4px;
		box-sizing: border-box;
		font-size: 16px;
		position: relative;
	}
	.content-title{
		margin:0 10px;
	}
	.content-img{
		flex: 1;
		width: 90px;
		height: 90px;
		border-radius: 5px;
	}
	.content-img image{
		width: 100%;
		height: 100%;
	}
	/* 右边文字 */
	.content-text{
		flex: 3;
		margin:0 5px;
		overflow: hidden;
		height: 100px;
		display: flex;
		justify-content:flex-start;
		flex-direction: column;
	}
	.text-top{
		width: 100%;
		border-bottom:1px dashed #ccc;
		height: 40px;
		line-height: 40px;
	}
	.text-top .avatar-img{
		float: left;
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	.avatar-img image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.avatar-text{
		display: flex;
		justify-content:space-between;
		padding-left:5px;
		flex-wrap: nowrap;
		overflow: hidden;
		font-size: 16px;
	}
	.avatar-text .avatar-name{
		overflow: hidden;
		text-overflow: ellipsis;
		flex-wrap: nowrap;
		display: flex;
		height: 40px;
		padding:0 5px;
		font-size: 14px;
	}
	.avatar-text .avatar-time{
		font-size: 12px;
		color: #828282;
		padding-right:10px;
		display: flex;
		height: 40px;
		padding: 0 5px;
	}
	.text-bottom{
		padding:2px;
		overflow: hidden;
	}
	/* 标签type */
	.content-type{
		position: absolute;
		bottom:0;
		right:0;
		border-top-left-radius: 12px;
		border-bottom-left-radius:12px;
		font-size: 12px;
		color:#fff;
		padding:4px 10px;
	}
	.type-lost{
		background: #DD524D;
	}
	.type-found{
		background: #FF8000;
	}
</style>