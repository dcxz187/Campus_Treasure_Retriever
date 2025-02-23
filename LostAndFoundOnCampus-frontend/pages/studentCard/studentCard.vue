<template>
	<!-- 学生卡 -->
	<view class="studCard">
		<titleHead :title="titleHead" :type="cardType"></titleHead>
		<view v-if="msgType=='lost'">
			<LostCard></LostCard>
		</view>
		<view v-if="msgType=='found'">
			<FoundCard></FoundCard>
		</view>
	</view>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	import titleHead from '@/components/tabarHead.vue'
	import LostCard from '@/components/card/lostCard.vue'
	import FoundCard from '@/components/card/foundCard.vue'
	export default {
		data() {
			return {
				titleHead:{
					name1:'捡到卡',
					name2:'丢失卡'
				},
				access_token:''
			}
		},
		computed:{
			...mapState({
				sessionKey:state=>state.sessionKey,
				msgType:state=>state.msgType
			})
		},
		components:{
			titleHead,
			LostCard,
			FoundCard
		},
		onShow() {
			if(!this.sessionKey){
				this.$api.isSession()
			}
		}
	}
</script>

<style scoped>
</style>
