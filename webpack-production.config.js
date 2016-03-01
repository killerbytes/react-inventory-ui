var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');


var config = {
  entry: [path.join(__dirname, './app/scripts/app.jsx')],
  resolve: {
    //When require, do not have to add these extensions to file's name
    extensions: ["", ".js", ".jsx"]
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Render source-map file for final build
  devtool: 'cheap-module-source-map',//'source-map',
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: 'bundle.js'  //Name of output file
  },
  plugins: [
	new webpack.ProvidePlugin({
		_: "lodash"
	}),
    //Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Transfer Files
    // new TransferWebpackPlugin([
    // 	{from: 'fonts', to: 'fonts'}
    // ], path.resolve(__dirname,"app"))
  ],
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, "src/app")],
        exclude: [nodeModulesPath]
      },
    ],
        loaders: [
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            },{
    	        test: /\.json$/, 
    	        loader: 'json'	
            },{
                test: /\.scss$/,
                //include: /app/,
                loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
            },{ 
            	test: /\.png$/,
            	loader: "url-loader?limit=100000&minetype=image/png" 
            },{ 
            	test: /\.jpg$/,
            	loader: "url-loader?limit=100000&minetype=image/jpg" 
            },{
				test: /\.css$/,
				loader: 'style!css?sourceMap'
			}, {
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=100000&mimetype=application/font-woff"
			}, {
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=100000&mimetype=application/font-woff"
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=100000&mimetype=application/octet-stream"
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "file"
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=100000&mimetype=image/svg+xml"
			},{
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel?stage=0'],
                exclude: /(node_modules|bower_components)/
            }

        ]

  },
  //Eslint config
  eslint: {
    configFile: '.eslintrc' //Rules for eslint
  },
};

module.exports = config;
