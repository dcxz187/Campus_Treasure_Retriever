<template>
	<view class="swiper">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in image" :key="index">
				<view class="swiper-item" @tap="getImage(index)">
					<image :src="'https://swzl.gongsir.club/api'+item.imgLink" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	export default{
		data(){
			return{
				image:[]
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey
			})
		},
		methods:{
			getImage(index){
				uni.previewImage({
					current:index,
					urls:this.image
				})
			},
			getBanners(){
				let that=this;
				this.$api.images({
					sessionKey:that.sessionKey
				}).then(res=>{
					that.image=res.images;
				})
			}
		},
		created(){
			this.getBanners();
		}
	}
</script>
<style scoped>
/* 轮播图 */
	.swiper{
		width: 100%;
		height: 100%;
		padding-top:40px;
	}
	.swiper-item{
		width: 100%;
		height: 100%;
	}
	.swiper image{
		height: 100%;
		width: 100%;
	}
</style>
