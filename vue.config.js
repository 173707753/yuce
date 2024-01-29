const defaultDocumentTitle = '新能源发电功率人工智能预测' //默认html页面 title 值

// vue.config.js
module.exports = {
	lintOnSave: false,
	chainWebpack: (config) => {
		config.plugin('html').tap((args) => {
			args[0].title = defaultDocumentTitle
			return args
		})
	},
	// 去掉console.log
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
		}
	},
	publicPath: './',
	assetsDir: 'static',
	productionSourceMap: false,
	devServer: {
		proxy: {
			'/api': {
				target: 'http://10.13.64.54:8000/',
				// pathRewrite: {
				// 	'^/api': 'api'
				// }

			}
		}
	}
}