<template>
	<view>
		<tabarHead :title='titleHead'></tabarHead>
		<view class="pubbox bgwhite">
			<!-- 标题and详情and图片 -->
			<view class="pubMessage">
				<!-- 信息标题 -->
				<view class="msg_title">
					<input type="text" placeholder="标题(字数不超过20)" maxlength="20"
						v-model="title"/>
				</view>
				<!-- 图片与详情 -->
				<view class="msg_info">
					<textarea value="" placeholder="详情" maxlength="50"
						v-model="text"/>
					<ul class="msg_pictures">
						<li class="pictures"
							@tap="getPicture">
							<i class="iconfont">&#xe61a;</i>
						</li>
						<li v-for="(item,index) in imageList" :key="index">
							<image :src="item" mode="aspectFill" @tap="getPreview(index)"></image>
							<view class="deleteImg iconfont" @tap="deleteImg(index)">&#xe67e;</view>
						</li>
					</ul>
				</view>
			</view>
			<!-- 东西类别 -->
			<PubClassify @sendClass="getClass"></PubClassify>
			<!-- lost联系方式 -->
			<Relation @sendRelation='getRelation'></Relation>
			<!-- 联系方式 -->
			<view class="cor_input">
				<input v-if="relationType=='place'" type="text"
					placeholder="填写指定地点"  v-model="relation">
				<input v-if="relationType=='qq'" type="number"
					placeholder="填写qq"  v-model="relation">
				<input v-if="relationType=='tel'" type="number"
					placeholder="填写联系电话" maxlength="11" v-model="relation">
			</view>
			<!-- 发布按钮 -->
			<button type="default" class="cor_btn"
				@tap="lostSubmit">发布</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import tabarHead from '@/components/tabarHead.vue'
	import PubClassify from '@/components/publish/pubClassify.vue'
	import Relation from '@/components/publish/relationType.vue'

	export default {
		data() {
			return {
				titleHead:{
					name1:'失物招领',
					name2:'寻物启事'
				},
				relation:'',
				imageList:[],
				text:'',
				title:'',
				relationType:'',
				classfiyType:'learn',
				image:null
			}
		},
		computed:{
			...mapState({
				msgType:state=>state.msgType,
				sessionKey:state=>state.sessionKey
			})
		},
		components:{
			tabarHead,
			PubClassify,
			Relation
		},
		methods:{
			getRelation(data){
				this.relationType=data.relationType;
			},
			getClass(data){
				this.classfiyType=data.classType;
			},
			getPicture(){
				let that=this;
				uni.chooseImage({
					count:1,
					success:(res)=>{
						console.log(res)
						that.imageList=res.tempFilePaths
					}
				})
			},
			getPreview(index){
				let that=this;
				uni.previewImage({
					current:index,
					urls:that.imageList
				})
			},
			deleteImg(index){
				this.imageList.splice(index,1)
			},
			lostSubmit(){//发布
				let that=this;
				if(!that.sessionKey){
					uni.showToast({
						title: '请先完成授权!',
						icon:'none'
					});
					return uni.reLaunch({
						url:'/pages/login/login'
					})
				}
				if(that.title===''){
					return uni.showToast({
						title:'请填写标题',
						icon:'none'
					})
					return false;
				}
				
				if(that.classfiyType===''){
					return uni.showToast({
						title:'请选择类别',
						icon:'none'
					})
					return false;
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
				uni.showLoading({
					title:'信息发送中...'
				})
				if(that.imageList.length==0){
					uni.downloadFile({
						url:'https://swzl.gongsir.club/api/uploadImg/logo.jpg',
						success:res=>{
							this.$api.pubGood(res.tempFilePath,{
								sessionKey:that.sessionKey,
								goodType:that.msgType,
								goodTitle:that.title,
								goodTexts:that.text,
								goodClass:that.classfiyType,
								relation:that.relationType+':'+that.relation
							}).then(res=>{
								uni.hideLoading();
								that.imgList=[]
								that.title='';
								that.text='';
								that.imageList=[];
								that.relation='';
								uni.showToast({
									title: JSON.parse(res).msg
								});
							})
						}
					})
				}else{
					this.$api.pubGood(that.imageList[0],{
						sessionKey:that.sessionKey,
						goodType:that.msgType,
						goodTitle:that.title,
						goodTexts:that.text,
						goodClass:that.classfiyType,
						relation:that.relationType+':'+that.relation
					}).then(res=>{
						that.title='';
						that.text='';
						that.imageList=[];
						that.relation='';
						uni.hideLoading();
						uni.showToast({
							title: JSON.parse(res).msg
						});
					})
				}
			}
		},
		onShow() {
			if(!this.sessionKey){
				this.$api.isSession()
			}
		}
	}
</script>

<style>
	page{
		background-color: #f1f1f1;
	}
</style>
<style scoped>
	.bgwhite{
		background-color: #fff;
	}
</style>
