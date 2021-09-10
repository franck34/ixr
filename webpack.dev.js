const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		//contentBase: path.resolve(__dirname, 'dist'),
		https:true,
		compress:false,
		port:44391,
		host:'0.0.0.0',
		hot:true,
		liveReload:true,
		//writeToDisk: true,
		//serveIndex: true,
		static: {
			serveIndex: true
		},
		allowedHosts:[
			'192.168.1.13:44391',
			'localhost:44391',
			'127.0.0.1:44391',
			'txf.innovastorm.com'
		]
	}
});
