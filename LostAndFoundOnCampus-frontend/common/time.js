const Time={
	// 获取当前时间戳
	getUninx(){
		let date=new Date();
		return date.getTime();
	},
	// 获取今天0点0分0秒
	getTodayUnix(){
		let date=new Date();
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},
	//获取1月1日0点0分0秒
	getYearUnix(){
		let date=new Date();
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date.getTime();
	},
	//获取标准年月日
	getLastDate(time){
		let date=new Date(time);
		let month=date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1;
		let day=date.getDate()<10?'0'+(date.getDate()):date.getDate();
		return date.getFullYear()+'-'+month+'-'+day;
	},
	//时间格式转换
	getFormatTime(timestamp){
		let now=this.getUninx();//获取当前时间戳
		let today=this.getTodayUnix();
		let year=this.getYearUnix();
		var timer=(now-timestamp)/1000;
		let tip='';
		if(timer<=0){
			tip='刚刚';
		}else if(Math.floor(timer/60)<=0){
			tip='刚刚'
		}else if(timer<3600){
			tip=Math.floor(timer/60)+'分钟前';
		}else if(timer>=3600&&(timestamp-today)>=0){
			tip=Math.floor(timer/3600)+'小时前'
		}else if(timer/86400<=31){
			tip=Math.ceil(timer/86400)+'天前'
		}else{
			tip=this.getLastDate(timestamp)
		}
		return tip;
	},
	getMyUninx(stamp){//将标准格式转换为时间戳
		let time;
		switch(uni.getSystemInfoSync().platform){
			case 'android':
				time=stamp; 
				break;
			case 'ios':
				time=stamp.replace(/-/g,'/');
				break;
			default:
				time=stamp; 
				break;
		}
		return Date.parse(new Date(time))
	}
}

export default Time