<template>
	<view class="info">
		<view v-if="mask===true">
			<view class="mask" @tap="isMask"></view>
			<!-- 图文海报 -->
			<canvas canvas-id="myCanvas"></canvas>
			<!-- 底部弹起分享 -->
			<view class="bottom">
				<view class="savePhone">
					<button type="default" @tap="savePhone">保存图片</button>
				</view>
			</view>
		</view>
		<!-- 发布者信息 -->
		<view class="avatar" @tap="toThePublish(pubUser.userOpenid)" v-if="ismy==='true'">
			<view class="avatar_left">
				<image :src="pubUser.userHead" mode="aspectFit"></image>
			</view>
			<view class="avatar_right">
				<view class="avatar_name">{{pubUser.userName}}</view>
				<view class="avatar_time">{{dataInfo.time}}</view>
			</view>
		</view>
		<view class="avatar" @tap="toThePublish(dataInfo.user.userOpenid)" v-else>
			<view class="avatar_left">
				<image :src="dataInfo.user.userHead" mode="aspectFit"></image>
			</view>
			<view class="avatar_right">
				<view class="avatar_name">{{dataInfo.user.userName}}</view>
				<view class="avatar_time">{{dataInfo.time}}</view>
			</view>
		</view>
		<!-- 信息内容 -->
		<view class="content">
			<view class="title">标题:&nbsp;{{dataInfo.goodTitle}}</view>
			<view class="text">详情:&nbsp;
			 {{dataInfo.goodTexts}}</view>
			<view class="relation">联系:&nbsp;{{relate}}
				<view class="cutbtn" @tap="cuttext" v-if="reltype==='联系QQ'||reltype==='联系电话'">
					<span class="iconfont" v-if="reltype==='联系QQ'">&#xe606;</span>
					<span class="iconfont" v-if="reltype==='联系电话'">&#xe603;</span>
					<span>复制</span>
				</view>
				<!-- 指定地点领取 -->
				
			</view>
		</view>
		<view class="imgList">
			<image :src="image[0]" mode="aspectFit"
				@tap="getPreive(0)"></image>
		</view>
		<!--底部按钮 分享和生成图文海报 -->
		<view class="infoBtn">
			<button type="default" class="share" open-type="share">分享</button>
			<button @tap="setPoster">生成图文海报</button>
			<button type="default" class="warned" v-show="status!=='no'">已被学生{{dataInfo.goodStatus}}认领</button>
			<button type="default" class="warned" v-if="isfind">已认领</button>
			<button type="default" class="warn" @tap="touser" v-if="!isfind&&status==='no'">认领</button>			
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	import util from '@/common/util.js'
	import config from '@/request/config.js'
	export default {
		data() {
			return {
				id:'',
				mask:false,
				base64:null,
				relate:'',
				reltype:'',
				image:[],
				app:'',
				ismy:null,
				canvasHeight:400,
				animationData:{},
				status:null,
				dataInfo:{},
				indexuser:{}
			}
		},
		computed:{
			...mapState({
				goodsList:state=>state.goodsList,
				sessionKey:state=>state.sessionKey,
				myMsgList:state=>state.myMsgList,
				pubUser:state=>state.pubUser,
				userInfo:state=>state.userInfo
			})
		},
		methods: {
			isMask(){
				this.base64=null
				this.mask=false;
				uni.hideLoading();
			},
			getPreive(){
				uni.previewImage({
					current:0,
					urls:this.image
				})
			},
			cuttext(){
				uni.setClipboardData({
					data:this.relate
				})
			},
			setPoster(){
				let that=this;
				this.mask=true;
				let imgHeight,imgWidth,imageUrl
				uni.showLoading({
					title:'图片生成中...'
				})
				uni.downloadFile({
					url:'https://swzl.gongsir.club/api'+this.dataInfo.goodImage,
					header:{
						'content-type':'application/x-www-form-urlencoded'
					},
					success:(res)=>{
						this.base64=res.tempFilePath
						if(res.statusCode===200){
							uni.getImageInfo({
								src:res.tempFilePath,
								success:(res)=>{
									imgHeight=res.height;
									imgWidth=res.width;
									let phoneSize= uni.getSystemInfoSync(),
									phoneWidth=phoneSize.windowWidth,
									phoneHeight=phoneSize.windowHeight,
									text1='发布者:'+this.dataInfo.user.userName,
									text2=this.reltype+':'+this.relate,
									text3='标题:'+this.dataInfo.goodTitle,
									text4='内容:'+this.dataInfo.goodTexts,
									text=[],
									cxt=uni.createCanvasContext('myCanvas')
									text.push(text1);
									text.push(text2);
									text.push(text3);
									text.push(text4);
									util.drawPoster(cxt,this.base64,text,imgHeight,imgWidth)
									cxt.draw(false,()=>{
										let that=this;
										uni.canvasToTempFilePath({
											x:0,
											y:0,
											destWidth:phoneWidth,
											destHeight:phoneHeight,
											canvasId:'myCanvas',
											success:(res)=>{
												that.base64=res.tempFilePath;
												uni.hideLoading()
											}
										})
									});
								}
							})
						}
					}
				})
			},
			savePhone(){
				uni.getSetting({
					success:(res)=>{
						if(!res.authSetting['scope.writePhotosAlbum']){
							uni.authorize({
								scope:'scope.writePhotosAlbum',
								success:(res)=>{
									console.log(res)
								},
								fail:(res)=>{
									uni.showModal({
										title: '温馨提示',
										content: '您已拒绝授权，是否去设置打开？',
										confirmText: "确认",
										cancelText: "取消",
										success:(res)=>{
											if(res.confirm){
												uni.openSetting({
													success() {
														uni.authSetting({
															 "scope.writePhotosAlbum": true
														})
													}
												})
											}
										}
									})
								}
							})
						}else{
							uni.saveImageToPhotosAlbum({
								filePath:this.base64,
								success:(res)=>{
									uni.showToast({
										title:'保存成功'
									})
								}
							})
						}
					}
				})
			},
			toThePublish(openid){//他的发布
				uni.navigateTo({
					url:'../otherPublish/otherPublish?openid='+openid+'&app='+this.app
				})
			},
			touser(){
				if(!this.userInfo.stuNum){
					return uni.showToast({
						title:'认领前请先绑定学号',
						icon:'none'
					})
				}
				uni.showModal({
					title:'西柚助手提示您',
					content:'信息千万条,诚信第一条,请仔细核对是否是您的东西,认领后信息将消除,认领前请保留好联系方式',
					confirmText:'认领',
					cancelText:'我再想想',
					success:res=>{
						if(res.confirm){
							this.$api.goodFun({
								stuNum:this.dataInfo.user.stuNum,
								sessionKey:this.sessionKey,
								gid:this.dataInfo.id
							}).then(res=>{
								if(res.code===401){
									uni.showToast({
										title:'登录已失效,请重新登录',
										icon:'none'
									})
									return uni.reLaunch({
										url:'/pages/login/login'
									})
								}
								this.isfind=true;
								uni.showToast({
									title:res.msg
								})
							})
						}
					}
				})
			},
			isData(){
				let that = this;
				if(that.status == 'no'){
					that.dataInfo=that.goodsList.find(item=>item.id==this.id);
					that.app=that.dataInfo.user.userApp;
					console.log(that.goodsList)
					let str=that.dataInfo.relation.split(":");
					that.relate=str[1];
					that.reltype=str[0];
					console.log(that.dataInfo)
					that.image.push(config.imgUrl+that.dataInfo.goodImage)
				}else{
					that.dataInfo=that.myMsgList.find(item=>item.id==this.id);
					that.app=that.dataInfo.user.userApp;
					let str=that.dataInfo.relation.split(":");
					that.relate=str[1];
					that.reltype=str[0];
					that.image.push(config.imgUrl+that.dataInfo.goodImage)
				}
				// console.log(that.dataInfo);
				// let str=this.dataInfo.relation.split(":");
				// this.relate=str[1];
				// this.reltype=str[0];
				// this.image.push(config.imgUrl+this.dataInfo.goodImage)
			}
		},
		onLoad(e){
			this.id=e.id;
			this.status=e.status;
			this.isData();
			this.ismy=e.ismy;
		},
		onShow() {
			if(!this.sessionKey){
				this.$api.isSession()
			}
		},
		onShareAppMessage(e) {
			this.mask=false;
			if(e.from==='button'){
				console.log(e.target)
			}
			return{
				title:'失物招领信息',
				path:'/pages/Info/Info?id='+this.id
			}
		}
	}
</script>

<style scoped>
canvas{
	width: 300px;
	position: absolute;
	left:50%;
	margin-left: -150px;
	top:10px;
	height: 500px;
	z-index: 9999;
}
.bottom{
	position: fixed;
	bottom:0;
	background: #fff;
	height: 50px;
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	z-index: 999;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	box-shadow: 0px 0px 6px #8ff1ee;
}
.bottom view{
	height: 100%;
	flex:1;
	text-align: center;
	line-height: 40px;
	border-right:1px solid #4588aa;
}
.mask{
	width: 100%;
	height: 100%;
	position: absolute;
	top:0;
	left:0;
	background: rgba(0,0,0,0.5);
	z-index: 999;
}
.info{
	width: 100%;
	height: 100%;
}
.avatar,
.content,
.imgList{
	font-size: 16px;
	width: 100%;
	box-shadow: 2px 2px 5px #ccc;
	margin-bottom:10px;
	padding:5px;
}
.avatar{
	height: 50px;
	align-items: center;
	display: flex;
	justify-content: flex-start;
}
.avatar_left{
	width: 50px;
	height: 50px;
	border-radius: 50%;
}
.avatar_left image{
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.avatar_right{
	font-size: 16px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	padding-left:10px;
}
.avatar_right .avatar_time{
	font-size: 12px;
	color:#828282;
	margin-top:2px;
}
.title,.text,.relation{
	padding:10px 10px;
	border-bottom:1px solid #ccc;
	display: flex;
	flex-wrap: wrap;
	overflow: auto;
}
.relation{
	position: relative;
}
.relation .cutbtn{
	border-radius: 10px;
	font-size: 12px;
	border: 1px solid #4588aa;
	text-align: center;
	line-height: 20px;
	padding:2px 5px;
	width: 50px;
	position: absolute;
	right: 25px;
	top:8px;
}
.cutbtn span{
	margin:0 2px;
}
.infoBtn{
	padding: 0 10px;
}
.infoBtn button{
	background: #fff;
	box-shadow: 0px 0px 5px #ccc;
	margin:10px 0;
	color:#346680;
}
.infoBtn button.warn{
	background: #BF0000;
	color: #fff;
}
.infoBtn button.warned{
	background: #dd524d;
	color:#fff;
}
.infoBtn button.share{
	color:#fff;
	background: #4588aa;
}
</style>