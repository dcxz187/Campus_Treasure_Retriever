const drawPoster=function(cxt,imgUrl,text,height,width){
	//渐变背景色
	let grd=cxt.createLinearGradient(0,0,150,250);
	grd.addColorStop(0,'#fffcf9');
	grd.addColorStop(1,'#fffcf9');
	cxt.fillStyle=grd;
	cxt.fillRect(0,0,300,520);
	//添加文字
	cxt.setFontSize(14);
	cxt.setFillStyle('#000');
	let topH=textWrap(cxt,text);
	// 图片
	let heightRect=(500-topH)/height;
	let widthRect=300/width;
	let rect;
	if(heightRect<widthRect){
		rect=heightRect;
	}else{
		rect=widthRect;
	}
	cxt.drawImage(imgUrl,(300-width*rect)/2,topH,width*rect,height*rect);
}

const textWrap=function(cxt,content){
	let text=[],
		initX=20,
		initY=20,
		textareaWidth=Math.ceil(300/16),
		len=content.length;
	for(let i=0;i<len;i++){
		let h=isWrap(cxt,textareaWidth,content[i],initX,initY);
		initY+=h;
	}
	return initY;
}

const isWrap=function(cxt,width,text,initX,initY){
	let str=[];
	if(text.length>width){
		while(text.length>0){
			str.push(text.substr(0,width));
			text=text.substr(width,text.length);
		}
	}else{
		str.push(text);
	}
	Text(cxt,str,initX,initY);
	return str.length*25;
}

const Text=function(cxt,str,initX,initY){
	for(let i=0;i<str.length;i++){
		cxt.fillText(str[i],initX,initY)
		initY+=20;
	}
}

const getDataList=function(data,ipage,refresh){
	console.log(data)
	console.log(ipage)
	let msg={}
	if(data.length===0){
		uni.hideNavigationBarLoading();
		msg.loadingText='已加载完全部';
		msg.page=ipage--;
		return msg;
	}else{
		if(refresh){
			uni.hideNavigationBarLoading();
			return data;
		}else{
			uni.hideNavigationBarLoading();
			return data;
		}
		
	}
}

export default {
	drawPoster,
	getDataList
}