phantom.outputEncoding="gbk";
var webpage = require('webpage'), page = webpage.create();
var fs = require('fs');
var system = require('system'),keyword;
var device = 'iphone5';
page.viewportSize = { width: 320, height: 568 };//浏览器视口的大小,即网页加载的初始浏览器窗口大小
page.clipRect = { top: 0, left: 0, width: 320, height: 568 };
page.settings = {
	javascriptEnabled: true,
	loadImages: true,
	webSecurityEnabled: false,
	//要指定谷歌ua,我用火狐无法浏览
	// userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36 LBBROWSER'
	// iphone 5 (320 * 568)
	userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
	// iphone 6 (375 * 667)
	// userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
	// ipad (786 * 1024)
	// userAgent:'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
};

if(system.args[2]){
	device=system.args[2];
	switch (system.args[2])
	  {
	  case 'iphone5':
	  	page.viewportSize = { width: 320, height: 568 };
	  	page.clipRect = { top: 0, left: 0, width: 320, height: 1568 };
	  	page.settings['userAgent']='Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
	    break;
	  case 'iphone6':
	    page.viewportSize = { width: 375, height: 667 };
	  	page.clipRect = { top: 0, left: 0, width: 375, height: 1667 };
	  	page.settings['userAgent']='Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
	    break;
	  case 'ipad':
	    page.viewportSize = { width: 786, height: 1024 };
	  	page.clipRect = { top: 0, left: 0, width: 786, height: 2024 };
	  	// page.settings['userAgent']='Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25'
	  	// page.settings['userAgent']='Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
	  	page.settings['userAgent']='Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10'
	    break;
	  default:
	  	device:'iphone5';
	    break;
	}
}
  
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
					return $("#results>.result").length > 0;
				});
			}, 
			function () {
				//引入外部js库
				page.includeJs("http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function () {
					page.evaluate(function () { //操作页面事件
						console.log("jQuery version:" + jQuery.fn.jquery);


						// console.log('mmydata'+JSON.stringify($('#results>.result').eq(0).html()));


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
							$('#results>.result').each(function(index){
								if($(this).find('.c-abstract p').html()&&$(this).find('.c-title').html()&&$(this).find('.c-blocka')){									
									dataList[index]={}
									dataList[index].title = $(this).find('.c-title').html().replace(/<em>|<\/em>|\s/g, "");
									dataList[index].link = $(this).find('.c-blocka').attr('href');
									dataList[index].pic = $(this).find('.c-img img').attr('src');
									dataList[index].info = $(this).find('.c-abstract p').html().replace(/<em>|<\/em>|\s/g, "");
								}
								// console.log('mmydata'+$(this).find('.c-abstract p').html());
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
				// screan('./snapshot/'+keyword+startTime+'.png');
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

	// console.log(msg)
	var dataList = '';
	var t = Date.now() - page.startTime;
	var data = {
			device:device,//设备信息
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

