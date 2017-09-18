#class1.js
##网页抓取分析服务系列之一（基础分析）


###任务目的
* 体会数据的封装
* 快速学习新工具的的能力
* 熟悉phantomjs的基础用法


###任务描述
* 安装phantomjs2.0，并查看webpage相关的API http://phantomjs.org/api/webpage/。
* 编写一个task.js脚本，参考官网的includeJs方法，实现根据传入的参数（关键字），抓取百度第一页对应该关键字的搜索结果。
* 将结果输出为json string回显。
* 回显的格式为

```javascript
	{
		code: 1, //返回状态码，1为成功，0为失败
		msg: '抓取成功', //返回的信息
		word: '示例关键字', //抓取的关键字
		time: 2000, //任务的时间
		dataList:[	//抓取结果列表
			{
				title: 'xx',  //结果条目的标题
				info: '', //摘要
				link: '', //链接			
				pic: '' //缩略图地址
				}
		]
	}
```	

###任务注意事项
* 多查API，学以致用
* 对于抓取的异常情况及时捕获并处理
* 结果中非自然结果的部分抛弃掉（广告、阿拉丁等），提前人工查看一下搜索结果，大多信息格式一致的都是自然结果，观察自然结果的class和相关结构特征

### 用法:

> phantomjs class1.js tianqi

---

#class2.js

##网页抓取分析服务系列之一（基础分析）


###任务目的
* 学会分析并借鉴其他工具的运行机制
* 学习更多phatomJS的配置


###任务描述
* 观察chrome开发者工具中device toolbar，切换到不同的device，查看浏览器BOM数据有何变化
* 把device toolbar中不同的device名对应的ua和尺寸信息记录下来，保存为配置文件
* 在任务1的基础上，增加一个参数，表示device信息，taskjs中，解析该参数并从配置文件找到对应的ua和尺寸，完成设置后再抓取
* 在结果中也增加一个device字段保存传入的设备名


###任务注意事项
* chrome device toolbar不了解可以百度一下看看使用方法，在console中打印对应BOM信息查看
* 抽取的配置文件选三个就好：iphone5、iphone6、ipad
* API提示：system.args、page.settings['userAgent']、page.viewportSize、page.clipRect

### 用法:

> phantomjs class2.js tianqi iphone5

> phantomjs class2.js tianqi iphone6

> phantomjs class2.js tianqi ipad
