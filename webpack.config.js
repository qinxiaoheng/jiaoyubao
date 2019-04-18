var path = require('path');
var webpack = require('webpack');
var fs = require("fs");
var HtmlwebpackPlugin = require('html-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event; //当前正在运行的脚本
var MODULE_PATH = './app/module';
var merge = require('webpack-merge'); //合并
var exec = require('child_process').exec, child; //创建一个shell
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 取出页面文件映射
function getHtmlPluginArr(){
	var data = JSON.parse(fs.readFileSync('app.json', 'utf-8'));
	var pageList = data.pageList;
	var resultObj = {
		"pluginArr": [],
		"entryObj": {
			//将common先打包
		    "common/common": [
		        MODULE_PATH + '/common/common.js'
		    ]
		}
	}
	for(var i=0; i<pageList.length; i++){
		var src = pageList[i].src;
		var title = pageList[i].title;
		var dist = (function() {
		    var s1 = src.split("./app/page/")[1];
		    var s2 = s1.substr(0, s1.lastIndexOf("/"));
	      	return s2;
	    })();
	    resultObj.entryObj[dist] = src;
	    var chunksStr = dist;
	    resultObj.pluginArr.push(
	    	new HtmlwebpackPlugin({
	    	  chunks: [chunksStr ,  "common/common"],//包含页面的js和common
	          title : title,
	          template : 'app/template.ejs', // 源模板文件
	          filename: dist + '.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
	          showErrors: true,
	          hash: true, //打版本戳
	          inject: 'body',
	        })
	    )
	}
	return resultObj;
}
var appJsonObj = getHtmlPluginArr();
var commonConfig = {
	resolve: {
        modules: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['.js', '.web.js', '.json'],
    },
	entry: appJsonObj.entryObj,
	output : {
		path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
	},
	module: {
	    rules: [
		    {
		        test: require.resolve('zepto'),
		        use: ['exports-loader?window.Zepto','script-loader']
		    },
	    	{
	            test: /\.js$/,
	            loaders: ['babel-loader'],
	            exclude: /node_modules/,
	                include: __dirname
	        },
	        { test: /\.html$/, loader: "html?minimize=false" },
	        { test: /\.json$/, loader: "json" },
	        //.less文件解析
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            //.css文件解析
            {test:/\.css$/,loader:'style-loader!css-loader'},
            {test: /\.(scss|sass)$/,loader: 'style-loader!css-loader!sass-loader' },
	        { test: /\.(jpg|gif|png|woff|svg|eot|ttf)$/, loader: 'url-loader' },
	        { test: /\.handlebars/, loader: "handlebars-loader", query: { helperDirs: ['app/page' + "/helper"] } }
	    ]
	},
	plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),   //热更新
    ],
    plugins: appJsonObj.pluginArr,
	mode: 'development',
	externals: {
	    "jquery": "jQuery",
	}
}
var configObj = {};
if(TARGET === 'start') {
	configObj = merge(commonConfig,{
		devServer: {
	        inline: true,
	        progress: true,
	        host: process.env.HOST,
	        port: "9900",
	        publicPath: '/',
    		historyApiFallback: true,
	        // proxy: {
	        //     // 请求到 '/app' 下 的请求都会被代理到 target： http://118.144.248.25:9948 中
	        //     '/app': { 
	        //         target: 'http://118.144.248.25:9948',
	        //         secure: false, // 接受 运行在 https 上的服务
	        //         changeOrigin: true,
	        //     },
	        //     '/openapi/*': {
	        //     	target: 'http://118.144.248.25:9948',
	        //         secure: false, // 接受 运行在 https 上的服务
	        //         changeOrigin: true
	        //     },
	        //     '/smsCode/*': {
	        //     	target: 'http://118.144.248.25:9948',
	        //         secure: false, // 接受 运行在 https 上的服务
	        //         changeOrigin: true
	        //     },
	        //     '/pbstalkuser/*': {
	        //     	target: 'http://118.144.248.25:9948',
	        //         secure: false, // 接受 运行在 https 上的服务
	        //         changeOrigin: true
	        //     }
	        // }
	    },
	})
}else{
	//删除build目录
	child = exec('rm -rf dist', function(err, out) {
	    console.log(out); err && console.log(err);
	});
	configObj = merge(commonConfig, {
	    output: {
	        path: path.resolve(__dirname, 'dist'),
	        filename: "js/[name].js",
	    },
	    plugins: [
	        // new webpack.optimize.UglifyJsPlugin({ minimize: true }) //压缩
	        new UglifyJsPlugin()
	    ]
	});
}

module.exports = configObj