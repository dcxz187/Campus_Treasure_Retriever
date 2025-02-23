<template>
	<view class="mycard">
		<view v-if="cardsList.cardType==='stuCard'" class="stucard">学生卡</view>
		<view v-if="cardsList.cardType==='idCard'" class="idcard">身份证</view>
		<view>
			姓名:{{ cardsList.cardName}}
			<span class="findready" v-if="cardsList.cardStatus!=='no'">已被学生{{cardsList.cardStatus}}认领</span>
		</view>
		<view>卡号:{{ cardsList.cardNum}}</view>
		<view class="relation">
			<view>
				<span>{{relation[0]}}:&nbsp;</span>
				<span>{{relation[1]}}</span>
			</view>
			<span class="iconfont cut" @tap="cut" v-if="relation[0]=='qq'">&#xe606;复制</span>
			<span class="iconfont cut" @tap="cut" v-if="relation[0]=='tel'">&#xe603;复制</span>
			<span v-show="my" class="carddel" @tap="cardDel(cardsList.id)">删除</span>
		</view>
	</view>
</template>
<script>
	export default{
		props:{
			cardsList:{
				type:Object,
				default:null
			},
			my:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				relation:'',
				status:null
			}
		},
		methods:{
			cut(){
				uni.setClipboardData({
					data:this.relation[1]
				})
			},
			cardDel(id){
				this.$emit('sendCardId',{id:id})
			}
		},
		created() {
			this.$api.isLogin();
			this.relation=this.cardsList.relation.split(':');
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
	.mycard{
		border-radius: 10px;
		margin: 5px 0;
	}
	.findready{
		padding:5px 2px;
		border-radius: 5px;
		border: 1px solid red;
		color:red;
		font-size: 14px;
		margin-left:20px;
	}
</style>

