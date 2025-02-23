<template>
	<view class="bgwhite">
		<view class="card">
			<view class="stucard" 
				:class="cardtype==='stuCard'?'selected':''"
				@tap="sendCardType('stuCard')">学生卡</view>
			<view class="idcard"
				:class="cardtype==='idCard'?'selected':''"
				@tap="sendCardType('idCard')">身份证</view>
		</view>
		<!-- 照片 -->
		<view class="corCard_box" v-if="photo.length===0"
			@tap="postPhone">
			<view>
				<view class="corCard_btn iconfont">&#xe61a;</view>
				<view class="corCard_text">
					<view>点击拍照识别</view>
					<view>智能填入学生卡/身份证信息</view>
				</view>
			</view>
		</view>
		<view v-else class="corPhoto" @tap="getPreview">
			<i @tap="deletePhoto" class="iconfont">&#xe6f0;</i>
			<view class="scanImg" v-show="isScan"></view>
			<image :src="photo[0]" mode="aspectFit"></image>
		</view>
		<form class="corMessage" report-submit @submit="formSubmit">
			<view v-if="cardtype==='stuCard'">
				学号:<input type="number" v-model="myNum">
				姓名:<input type="text" v-model="myName"/>
			</view>
			<view v-if="cardtype==='idCard'">
				身份证号:<input type="idcard" v-model="myNum"/>
				姓名:<input type="text" v-model="myName"/>
			</view>
			<Relation @sendRelation='getRelation'></Relation>
			<view class="cor_input">
				<input v-if="relationType==='place'" type="text"
					placeholder="填写指定地点"  v-model="relation">
				<input v-if="relationType==='qq'" type="number"
					placeholder="填写qq"  v-model="relation">
				<input type="number" v-if="relationType==='tel'" 
					placeholder="填写联系电话"  v-model="relation">
			</view>
			<button class="cor_btn" type="default" form-type="submit">确认</button>
		</form>
	</view>
</template>

<script>
	import { mapMutations,mapState } from 'vuex'
	import Relation from '@/components/publish/relationType.vue' 
	
	export default {
		components:{
			Relation
		},
		data(){
			return{
				photo:[],
				myNum:'',
				myName:'',
				isScan:true,
				relation:'',
				relationType:''
			}
		},
		computed:{
			...mapState({
				cardtype:state=>state.cardType,
				sessionKey:state=>state.sessionKey
			})
		},
		methods: {
			...mapMutations([
				'getCardType'
			]),
			getRelation(data){
				this.relationType=data.relationType;
			},
			sendCardType(type){
				this.getCardType(type)
				this.myName='';
				this.myNum='';
			},
			postPhone(){
				let that=this;
				uni.chooseImage({
					count:1,
					success:(res)=>{
						that.photo=res.tempFilePaths;
						this.$api.pubCor(that.photo[0],{
							sessionKey:that.sessionKey,
							type:that.cardtype	
						}).then(res=>{
							if(that.cardtype==='stuCard'){
								let data=JSON.parse(res).data.ret
								that.myName=data[0].word;
								that.myNum=data[2].word;
							}else if(that.cardtype==='idCard'){
								let data=JSON.parse(res).words_result
								this.myNum=data['公民身份号码'].words;
								this.myName=data['姓名'].words;
							}
							that.isScan=false;
						})
					}
				})
			},
			deletePhoto(){
				this.photo=[];
			},
			getPreview(){
				uni.previewImage({
					current:0,
					urls:this.photo
				})
			},
			formSubmit(e){
				let that=this;
				if(that.myNum===''||that.myName===''){
					return uni.showToast({
						title:'请录入信息!',
						icon:'none'
					})
				}
				if(that.relation===''||that.relationType===''){
					return uni.showToast({
						title:'请填写联系方式',
						icon:'none'
					})
					return false;
				}
				if(that.relationType==='tel'){
					if(!(/^1[3456789]\d{9}/.test(that.relation))){
						uni.showToast({
							title:'手机号有误,请重填!',
							icon:'none'
						})
						return false;
					}
				}
				this.$api.pubCard({
					sessionKey:that.sessionKey,
					cardType:that.cardtype,
					cardNum:that.myNum,
					cardName:that.myName,
					relation:that.relationType+':'+that.relation
				}).then(res=>{
					if(res.code===1){
						uni.showToast({
							title:res.msg
						})
						that.myNum='';
						that.myName='';
						that.relation='';
						that.photo=[];
					}
				})
			}
		},
		created() {
			this.$api.isLogin()
		}
	}
</script>

<style scoped>
	.bgwhite{
		background-color: #fff;
	}
	.card{
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding:10px 50px;
		margin:20px 0;
	}
	.card view{
		width: 100px;
		height: 100%;
		text-align: center;
		line-height: 40px;
		border-radius: 20px;
		border:1px solid #ccc;
	}
	.card .selected{
		border: 1px solid #4588aa;
	}
</style>
