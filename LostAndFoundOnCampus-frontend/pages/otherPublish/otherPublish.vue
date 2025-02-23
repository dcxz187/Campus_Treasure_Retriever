<template>
	<view class="otherPub">
		<!-- ta的头像和名称 -->
		<UserHead :userhead="userInfo.user"></UserHead>
		<!-- ta的信息分类 -->
		<TypeTabbar @sendtabbar="getTabbar"></TypeTabbar>
		<!-- 关于ta的发布 -->
		<view class="pub_goodList">
			<!-- 信息类发布 -->
			<view class="pub_goodInfo" :animation="animationData">
				<view class="pub_msgList" v-if="goods">
					<GoodInfo v-for="(item,index) in goods"
					:goodMsg="item"
					:ismy="true"
					:key="index"></GoodInfo>
				</view>
				<view class="pub_loadingText">{{loadingText1}}</view>
				<view class="pub_itemNone" v-if="goods.length===0">
					ta还没有发布任何信息
				</view>
			</view>
			<!-- 卡证信息发布 -->
			<view class="pub_goodCard" :animation="animationData2">
				<view class="pub_cardList" v-if="goods">
					<GoodCard v-for="(item,index) in goods" :key="index"
					:cardsList="item"
					></GoodCard>
				</view>
				<view class="pub_loadingText">{{loadingText2}}</view>
				<view class="pub_itemNone" v-if="goods.length===0">
					ta还没有发布卡证任何信息
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import { mapState,mapMutations} from 'vuex'
	import config from '@/request/config.js'
	import Time from '@/common/time.js'
	import GoodCard from '@/components/user/goodCard.vue'
	import GoodInfo from '@/components/user/goodInfo.vue'
	import UserHead from '@/components/user/userHead.vue'
	import TypeTabbar from '@/components/user/typetabbar.vue'
	export default{
		data(){
			return{
				openid:'',
				image:[],
				limit:8,
				page:1,
				cpage:1,
				type:'msg',
				goods:[],
				count:'',
				iscard:true,
				animationData:{},
				animationData2:{},
				loadingText1:'',
				loadingText2:''
			}
		},
		components:{
			GoodCard,
			GoodInfo,
			UserHead,
			TypeTabbar
		},
		computed:{
			...mapState({
				goodsList:state=>state.goodsList,
				sessionKey:state=>state.sessionKey,
				myMsgList:state=>state.myMsgList
			}),
			userInfo(){
				return this.myMsgList.find(item=>item.openid===this.openid)
			}
		},
		methods:{
			...mapMutations([
				'getMsgList',
				'getpubUser'
			]),
			getTabbar(data){
				if(data.typetabbar){
					this.getMessage()
				}else{
					this.getCard()
				}
			},
			toInfo(id){
				uni.navigateTo({
					url:'../Info/Info?id='+id
				})
			},
			getCard(){//动画
				this.type='card';
				this.cpage=1;
				this.getCardData();
				let animation1=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:600,
				})
				let animation2=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:600,
				})
				
				animation1.rotateY(-180).step();
				animation2.rotateY(0).step();
				
				this.animationData=animation1.export();
				this.animationData2=animation2.export();
			},
			getMessage(){//动画
				this.type='msg';
				this.page=1;
				this.getData();
				let animation1=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:600,
				})
				let animation2=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:600,
				})
				animation1.rotateY(0).step();
				animation2.rotateY(-180).step();
				
				this.animationData=animation1.export();
				this.animationData2=animation2.export();
			},
			getData(){//获取信息数据
				let that=this;
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.hispublish({
					sessionKey:that.sessionKey,
					page:that.page,
					limit:that.limit,
					openid:this.openid
				}).then(res=>{
					this.count=res.count;
					this.getAllMsgList();
					that.goods=res.goods
					uni.hideLoading()
				})
			},
			getAllMsgList(){
				let that=this;
				this.$api.hispublish({
					sessionKey:that.sessionKey,
					page:1,
					limit:that.count,
					openid:that.openid
				}).then(res=>{
					that.getMsgList(res.goods);
					that.getpubUser(res.goods[0].user)
				})
			},
			getCardData(){//获取卡证信息
				let that=this;
				uni.showLoading({
					title:'加载中...'
				})
				
				this.$api.hisCard({
					sessionKey:that.sessionKey,
					page:that.cpage,
					limit:that.limit,
					openid:that.openid
				}).then(res=>{
					that.goods=res.cards;
				})
				uni.hideLoading();
			},
			getMoreData(){//信息数据加载更多
				let that=this;
				that.page++;
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.hispublish({
					sessionKey:that.sessionKey,
					page:that.page,
					limit:that.limit,
					openid:that.openid
				}).then(res=>{
					if(res.goods.length===0){
						that.page--;
						that.loadingText1='已加载完全部';
					}else{
						that.goods=that.goods.concat(res.goods)
					}
					uni.hideLoading();
				})
			
			},
			getMoreCard(){//卡证数据加载更多
				let that=this;
				uni.showLoading({
					title:'加载中...'
				})
				that.cpage++;
				this.$api.hisCard({
					sessionKey:that.sessionKey,
					openid:that.openid,
					page:that.cpage,
					limit:that.limit
				}).then(res=>{
					if(res.cards.length==0){
						that.cpage--;
						that.loadingText2='已加载完全部';
					}else{
						that.goods=this.goods.concat(res.cards);
					}
					uni.hideLoading();
				})
			}
		},
		onReachBottom() {
			if(this.type==='msg'){
				setTimeout(()=>{
					this.getMoreData()
				},500)
			}else if(this.type==='card'){
				setTimeout(()=>{
					this.getMoreCard()
				},500)
			}
		},
		onLoad(e){
			if(e.app==='qq'){
				this.openid=e.openid+"=";
			}else if(e.app==='wx'){
				this.openid=e.openid+"==";			
			}
			this.getData();
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
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>
<style scoped>
	.otherPub{
		width: 100%;
	}
</style>

