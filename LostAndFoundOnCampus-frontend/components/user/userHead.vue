<template>
	<view class="user_info">
		<view class="user_content">
			<view class="user_avatar"><img :src="userhead.userHead"></view>
			<view class="user_name">{{ userhead.userName}}</view>
			<view class="user_name" v-if="ismy" @tap="alterNum">
				<span class="iconfont">&#xe62d;</span>
				<span v-if="userhead.stuNum">{{userhead.stuNum}}</span>
				<span v-else>[请绑定学号]</span>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState} from 'vuex'
	export default{
		props:{
			userhead:{
				type:Object
			},
			ismy:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				isNum:false
			}
		},
		methods:{
			alterNum(){
				uni.showModal({
					title:'注意',
					content:'更改学号请联系管理员'
				})
			}
		}
	}
</script>

<style scoped>
.user_info{
	height: 150px;
	width: 100%;
	position: relative;
	background: linear-gradient(top,#4588aa,#57bbae);
}
.user_info .user_content{
	z-index: 55;
	position: absolute;
	top:0;
	left:0;
	height: 150px;
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
.user_avatar{
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border:3px solid #fff;
	box-shadow: 0px 0px 8px #8ff1ee;
}
.user_avatar img{
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.user_content .user_name{
	margin-top:5px;
	font-size: 16px;
	color: #fff;
}
</style>
