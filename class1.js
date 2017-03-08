phantom.outputEncoding="gbk";
var webpage = require('webpage'), page = webpage.create();
var fs = require('fs');
var system = require('system'),keyword;
page.settings = {
	javascriptEnabled: true,
	loadImages: true,
	webSecurityEnabled: false,
	userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36 LBBROWSER'
	//要指定谷歌ua,我用火狐无法浏览
};
var lastReceived = new Date().getTime();
var requestCount = 0;
var responseCount = 0;
var requestIds = [];
var startTime = new Date().getTime();

page.onLoadStarted = function () {
	page.startTime = new Date();
};//获取页面开始加载的时间

keyword = system.args[1];
page.open('https://www.baidu.com/s?ie=UTF-8&wd='+keyword, function () {
	if (status === 'fail') {
		console.log('open page fail!');
	} else {
		// waitFor(testFx, onReady, timeOutMillis)
		waitFor(
			function () {
				return page.evaluate(function () {
					//判断页面加载完成的信号,
					return $("#content_left .result").length > 0;
				});
			}, 
			function () {
				//引入外部js库
				page.includeJs("http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function () {
					page.evaluate(function () { //操作页面事件
						console.log("jQuery version:" + jQuery.fn.jquery);

						var dataList = [{
							title: 'xx',  //结果条目的标题
							info: '', //摘要
							link: '', //链接
							pic: '' //缩略图地址
							}];

							dataList[0].title = 'biaoti';
							dataList[0].info = 345;
							dataList[0].link = "http://";
							dataList[0].pic = "http://png";
							$('#content_left .result').each(function(index){
								dataList[index]={}
								dataList[index].title = $(this).find('.t a').html().replace(/<em>|<\/em>|\s/g, "");
								dataList[index].link = $(this).find('.t a').attr('href');
								dataList[index].pic = $(this).find('.c-img').attr('src');
								dataList[index].info = $(this).find('.c-abstract').html().replace(/<em>|<\/em>|\s/g, "");
							})						
						console.log('mmydata'+JSON.stringify(dataList));
					});
					
					var t = Date.now() - page.startTime; //页面加载完成后的当前时间减去页面开始加载的时间，为整个页面加载时间
					// console.log('firstLoadPage time :' + t + 'ms');
					setTimeout(function () {
						page.close();
						phantom.exit();
					}, 1000);
				});
			}
		);
	}


});

function screan(filename) {
	page.render(filename);
}


function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s 默认最大超出时间
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function () {
			if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
				// 网页截图
				// screan('./snapshot/baidu.png');
				// console.log('截图')
				condition = (typeof (testFx) === "string" ? eval(testFx) : testFx()); //< defensive code 防御性编码、
			} else {
				if (!condition) {
					//等待超时
					// console.log("'waitFor()' timeout");
					
					phantom.exit(1);
				} else {
					// 完成时间
					// console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");

					typeof (onReady) === "string" ? eval(onReady) : onReady(); 
					clearInterval(interval); //< Stop this interval
				}
			}
		},500); //< repeat check every 250ms
};



page.onConsoleMessage = function (msg, lineNum, sourceId) {
	var dataList = '';
	var t = Date.now() - page.startTime;
	var data = {
			code: 1, //返回状态码，1为成功，0为失败
			msg: '抓取成功', //返回的信息
			word: keyword, //抓取的关键字
			time: t, //任务的时间
			dataList:''
		}
	if (msg.match(/^[mydata]/)!= null) {
		dataList = msg.replace("mmydata", "")
		data.dataList =JSON.parse(dataList);
		console.log(JSON.stringify(data))
	}

};

