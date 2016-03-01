var path = require('path');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app/scripts/app.jsx');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var webpack = require('webpack');

module.exports = {
    context: __dirname + "/app",
    entry: {
        javascript: './scripts/app.jsx',
        html: './index.html'
    },
    output: {
        publicPath: 'http://localhost:8080/',
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    devtool: '#inline-source-map',
    devServer: {
        contentBase: "./build",
        historyApiFallback: true
    },
    module: {
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
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
	    new webpack.OldWatchingPlugin(),
        new webpack.DefinePlugin({
            'process.Env': {
                'NODE_ENV' : JSON.stringify('development')
            }
        }),
		new webpack.ProvidePlugin({
			_: "lodash"
		})        
    ]
};

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') {
        sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/only-dev-server');
    }
    return sources;
}
