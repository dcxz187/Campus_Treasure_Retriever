<template>
	<view>
		<!-- ta的信息分类 -->
		<TypeTabbar @sendtabbar="getTabbar"></TypeTabbar>
		<!-- 关于我的发布 -->
		<view class="pub_goodList">
			<!-- 普通信息类发布 -->
			<view class="pub_goodInfo" :animation="animationData1">
				<view v-if="goods" class="pub_msgList">
					<GoodInfo v-for="(item,index) in goods" :key="index"
					:goodMsg="item"
					:ismy="true"
					:my="true"
					@sendCardId="getCardId"></GoodInfo>
				</view>
				<view class="pub_loadingText">{{loadingText1}}</view> 
				<view class="pub_itemNone" v-if="goods.length===0">
					您还没有发布任何信息
				</view>
			</view>
			<!-- 卡证信息发布 -->
			<view class="pub_goodCard" :animation="animationData2">
				<view v-if="goods" class="pub_cardList">
					<GoodCard v-for="(item,index) in goods"  :key="index"
					:cardsList="item"
					:my="true"
					@sendCardId="getIdCard"></GoodCard>
				</view>
				<view class="pub_loadingText">{{loadingText2}}</view> 
				<view class="pub_itemNone" v-if="goods.length===0">
					您还没有发布任何卡证信息
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
		data(){
			return{
				goods:[],
				count:'',
				page:1,
				limit:8,
				cpage:1,
				type:'msg',
				animationData1:{},
				animationData2:{},
				loadingText1:'',
				loadingText2:''
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey,
				userInfo:state=>state.userInfo,
				goodList:state=>state.goodsList
			})
		},
		components:{
			TypeTabbar,
			GoodCard,
			GoodInfo
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
			getIdCard(data){//删除证件信息
				let that=this;
				uni.showModal({
					title:'是否确定删除',
					content:'删除的数据不再恢复',
					success:(res)=>{
						if(res.confirm){
							this.$api.mycardel({
								id:data.id,
								sessionKey:that.sessionKey,
								page:1,
								limit:that.limit
							}).then(res=>{
								that.goods=res.goods;
								uni.showToast({
									title:res.msg
								})
							})
						}
					}
				})
			},
			getCardId(data){//删除普通信息
				let that=this;
				uni.showModal({
					title:'是否确定删除',
					content:'删除的数据不再恢复',
					success:(res)=>{
						if(res.confirm){
							this.$api.mydele({
								id:data.id,
								sessionKey:that.sessionKey,
								page:1,
								limit:that.limit
							}).then(res=>{
								that.goods=res.goods;
								uni.showToast({
									title:res.msg
								})
							})
						}
					}
				})
			},
			getCard(){//动画
				this.goods=[];
				this.type='card';
				this.cpage=1;
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
				this.page=1;
				this.getAllData();
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
			getAllData(){//获取普通信息数据
				let that=this;
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.mypublish({
					sessionKey:that.sessionKey,
					page:that.page,
					limit:that.limit
				}).then(res=>{
					that.count=res.count
					that.getAllMsgList();
					that.goods=res.goods
				})
				uni.hideLoading();
			},
			getAllMsgList(){
				let that=this;
				this.$api.mypublish({
					sessionKey:that.sessionKey,
					page:1,
					limit:that.count
				}).then(res=>{
					that.getMsgList(res.goods);
					that.getpubUser(res.goods[0].user)
				})
			},
			getMoreData(){//加载更多
				let that=this;
				that.page++;
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.mypublish({
					sessionKey:that.sessionKey,
					page:that.page,
					limit:that.limit
				}).then(res=>{
					if(res.goods.length===0){
						that.page--;
						that.loadingText1='已加载完全部';
					}else{
						that.goods=that.goods.concat(res.goods)
					}
					uni.hideLoading()
				})
			},
			getMyCard(){//获取卡证数据
				let that=this;
				uni.showLoading({
					title:'加载中...'
				})
				this.$api.myCard({
					sessionKey:that.sessionKey,
					page:that.cpage,
					limit:that.limit
				}).then(res=>{
					that.goods=res.cards;
				})
				uni.hideLoading();
			},
			getMoreCard(){
				let that=this;
				uni.showLoading({
					title:'加载中...'
				})
				that.cpage++;
				this.$api.myCard({
					sessionKey:that.sessionKey,
					page:that.cpage,
					limit:that.limit
				}).then(res=>{
					if(res.cards.length==0){
						that.cpage--;
						this.loadingText2='加载完全部'
					}else{
						that.goods=this.goods.concat(res.cards);
					}
					uni.hideLoading();
				})
			}
		},
		onLoad() {
			if(!this.sessionKey){
				this.$api.isSession()
			}
			// this.$api.isLogin();
			this.getAllData();
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
		onShow() {
			console.log(this.sessionKey)
			if(!this.sessionKey){
				this.$api.isSession()
			}
		},
		onPullDownRefresh() {
			if(this.type==='msg'){
				this.page=1;
				this.getAllData();
			}else if(this.type==='card'){
				this.cpage=1;
				this.getMyCard();
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
</style>
