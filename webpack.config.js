const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')
const production = process.env.NODE_ENV === 'production'

module.exports = {
	entry: './src/app.js',
	output: {
		path: __dirname,
		filename: './dist/app.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.wav$/,
				loader: 'file-loader'
			}
		]
	},
	plugins: production ? [
		new BabiliPlugin()
	] : [
		new webpack.HotModuleReplacementPlugin()
	]
}
