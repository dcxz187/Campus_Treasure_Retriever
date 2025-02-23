<template>
	<view>
		<TypeTabbar @sendtabbar="getTabbar"></TypeTabbar>
		<view class="pub_goodList">
			<!-- 普通信息类发布 -->
			<view class="pub_goodInfo" :animation="animationData1">
				<view v-if="goods" class="pub_msgList">
					<GoodInfo v-for="(item,index) in goods" :key="index"
					:goodMsg="item"></GoodInfo>
				</view>
				<view class="pub_loadingText">{{loadingText1}}</view> 
				<view class="pub_itemNone" v-if="goods.length===0">
					您还没有认领任何信息
				</view>
			</view>
			<!-- 卡证信息发布 -->
			<view class="pub_goodCard" :animation="animationData2">
				<view v-if="goods" class="pub_cardList">
					<GoodCard v-for="(item,index) in goods"  :key="index"
					:cardsList="item"></GoodCard>
				</view>
				<view class="pub_loadingText">{{loadingText2}}</view> 
				<view class="pub_itemNone" v-if="goods.length===0">
					您还没有认领任何卡证信息
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	import TypeTabbar from '@/components/user/typetabbar.vue'
	import GoodCard from '@/components/user/goodCard.vue'
	import GoodInfo from '@/components/user/goodInfo.vue'
	export default {
		data() {
			return {
				goods:[],
				loadingText2:'',
				loadingText1:'',
				type:'msg',
				animationData1:{},
				animationData2:{}
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey
			})
		},
		components:{
			TypeTabbar,
			GoodCard,
			GoodInfo
		},
		methods: {
			...mapMutations([
				'getMsgList'
			]),
			getTabbar(data){
				if(data.typetabbar){
					this.getMessage()
				}else{
					this.getCard()
				}
			},
			getData(){
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.findGood({
					sessionKey:this.sessionKey
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
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					this.getMsgList(res.goods)
					this.goods=res.goods
				})
				uni.hideLoading()
			},
			getMyCard(){
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.findCard({
					sessionKey:this.sessionKey
				}).then(res=>{
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					this.getMsgList(res.cards)
					this.goods=res.cards
				})
				uni.hideLoading()
			},
			getCard(){//动画
				this.goods=[];
				this.type='card';
				this.getMyCard();
				let animation1=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:500,
				})
				let animation2=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:500,
				})
				
				animation1.rotateY(-180).step();
				animation2.rotateY(0).step();
				
				this.animationData1=animation1.export();
				this.animationData2=animation2.export();
			},
			getMessage(){//动画
				this.goods=[];
				this.type='msg';
				this.getData();
				let animation1=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:500,
				})
				let animation2=uni.createAnimation({
					timingFunction:'ease-in-out',
					duration:500,
				})
				animation1.rotateY(0).step();
				animation2.rotateY(-180).step();
				
				this.animationData1=animation1.export();
				this.animationData2=animation2.export();
			},
		},
		onLoad() {
			this.getData();
			this.$api.isLogin();
		},
		onShow() {
			if(!this.sessionKey){
				this.$api.isSession()
			}
		},
		onPullDownRefresh() {
			if(this.type==='msg'){
				this.getData();
			}else if(this.type==='card'){
				this.getMyCard();
			}
		}
	}
</script>

<style scoped>
</style>
