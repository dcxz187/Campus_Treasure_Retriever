<h1 align="center"> 西柚失物招领小程序 | 小程序源码 </h1>


### 项目介绍 :book:
👉基于微信小程序的校园失物招领平台. 含平台主体微信小程序和web后台数据管理平台.
* 失物招领信息一览/关键字检索
* 信息发布(支持图片上传)
* OCR证件识别(免输入)
* 证件消息订阅(监听自己遗失的证件信息,及时收到小程序通知)

### 项目技术栈 :star:
* 小程序: Vue/Uni-app/微信小程序
* 后端: Java/SpringBoot/MySQL/Redis/百度云/微信小程序API 

#### 项目地址 :link:

项目采用前后端分离开发模式，小程序使用vue开发，后端数据API采用Java、Spring-Boot开发.

小程序端code地址：https://github.com/gongsir0630/LostAndFound.git

后端code地址：https://github.com/gongsir0630/LostAndFoundOnCampus.git

#### 体验地址

QQ小程序：搜索【西柚失寻】QQ小程序v1.0版本

微信小程序：暂未上线，可联系我们申请体验！

演示视频：[在线演示视频](https://cdn.gongsir.club/video/LostAndFoundVideo.mp4)

#### 使用说明

##### 0. 部署对应的后台API服务:[戳这里👈](https://github.com/gongsir0630/LostAndFoundOnCampus.git)

##### 1. clone本仓库到本地
```sh
git clone https://github.com/gongsir0630/LostAndFound.git
```
##### 2. 使用HbuilderX打开项目,修改一些配置
* 修改`manifest.json`中的**AppID**
* 修改`request/config.js`中的**base_url**

##### 3. 点击HbuilderX菜单栏的`运行->微信开发者工具`

##### 4. 调试编译(本地调试请选择关闭https域名校验)

##### 5. 上传代码,生成体验版

##### 6. 配置https域名，详见：微信公众平台

#### 开发日志

1、2019.10-2019.11 v1开发

2、2019.11 QQ小程序【西柚失寻】上线

3、2020.3 消息通知由 模板消息推送----->> 订阅消息

4、2020.3 增加web可视化管理

5、... ...

#### 联系我们

开发者主页：https://gongsir.club

