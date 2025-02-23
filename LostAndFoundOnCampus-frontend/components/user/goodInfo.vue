<template>
	<view class="mypublish" @tap.stop="toInfo({id:goodMsg.id,status:goodMsg.goodStatus})">
		<view class="myleft">
			<image :src="'https://swzl.gongsir.club/api'+goodMsg.goodImage" mode="aspectFill"></image>
			<view class="findtip" v-if="goodMsg.goodStatus!=='no'">已被认领</view>
		</view>
		<view class="myright">
			<view class="mytitle">{{ goodMsg.goodTitle}}</view>
			<!-- <view class="findtext">已被学生{{goodMsg.goodStatus}}认领</view> -->
			<view class="mybtn">
				<view class="mytexts">{{ goodMsg.goodTexts}}</view>
				<view class="delete" v-show="my" @tap.stop="remove(goodMsg.id)">删除</view>
			</view>
			<view class="goodType type-lost" v-if="goodMsg.goodType==='lost'">
				失物招领
			</view>
			<view class="goodType type-found" v-if="goodMsg.goodType==='found'">
				寻物启事
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState} from 'vuex'
	export default{
		props:{
			goodMsg:{
				type:Object,
				default:null
			},
			ismy:{
				type:Boolean,
				default:false
			},
			my:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				time:'',
				limit:8,
				status:null
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey,
				userInfo:state=>state.userInfo,
				findList:state=>state.findList,
			})
		},
		methods:{
			toInfo(data){
				uni.navigateTo({
					url:'../Info/Info?id='+data.id+'&status='+data.status+'&ismy='+this.ismy
				})
			},
			remove(id){
				this.$emit('sendCardId',{id:id})
			}
		},
		created() {
			this.$api.isLogin();
			// console.log(this.goodMsg.user)
		}
	}
</script>

<style>
	page{
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>
<style scoped>
.mypublish{
	font-size: 16px;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-left:5px;
	border:1px solid #ccc;
	box-shadow: 2px 2px 4px #C0C0C0;
	margin:10px auto;
	border-radius: 10px;
	box-sizing: border-box;
	padding:2px 4px;
	position: relative;
}
.myleft{
	width: 90px;
	height: 90px;
	border-radius: 5px;
	position: relative;
}
.myleft image{
	width: 100%;
	height: 100%;
}
.myleft .findtip{
	position: absolute;
	top:0;
	left:0;
	width: 80px;
	height: 80px;
	border: 1px solid red;
	border-radius: 50%;
	text-align: center;
	line-height: 80px;
	color: red;
	transform: rotate(45deg);
}
.myright{
	width: 70%;
	margin-left:10px;
	height: 100%;
	overflow: hidden;
	font-size: 16px;
}
.myright .mytitle{
	line-height: 40px;
	height: 40px;
	overflow: hidden;
	font-size: 14px;
	padding:0 5px;
	flex-wrap: nowrap;
	border-bottom:1px dashed #ccc;
	display: flex;
	justify-content: space-between;
}
.myright .mybtn{
	z-index: 22;
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 14px;
	color: #333333;
}
.myright .mytext{
	overflow: hidden;
	display: flex;
	flex-wrap: wrap;
	width: 150px;
	height: 30px;
	overflow: hidden;
	padding:10px 5px;
}
.mybtn .delete{
	margin:0 10px;
	border:1px solid #4588aa;
	border-radius: 5px;
	padding: 2px 8px;
}
.myright .mytime{
	font-size: 12px;
	color:#ccc;
}
.myright .goodType{
	position: absolute;
	top:0;
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
.nonemsg{
	margin-top:80px;
	color: #C0C0C0;
	text-align: center;
}
</style>
